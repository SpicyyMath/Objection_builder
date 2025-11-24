import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import type { FormData, ObjectionResult, ConversationTurn } from '../types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            responseText: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            riskReasoning: { type: Type.STRING },
            fallacies: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { name: { type: Type.STRING }, explanation: { type: Type.STRING }, suggestion: { type: Type.STRING } },
                    required: ['name', 'explanation', 'suggestion'],
                },
            },
            citations: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, source: { type: Type.STRING }, url: { type: Type.STRING }, snippet: { type: Type.STRING } },
                    required: ['title', 'source', 'url', 'snippet'],
                },
            },
        },
        required: ['responseText', 'riskLevel', 'riskReasoning', 'fallacies', 'citations'],
    },
};

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/generate', async (req: Request, res: Response) => {
    try {
        const { formData, conversationHistory, geminiPrompt } = req.body as {
            formData: FormData;
            conversationHistory: ConversationTurn[];
            geminiPrompt: any;
        };

        // 1. 严格校验输入数据
        if (!formData || !formData.mainArgument) {
            console.error("❌ Missing formData or mainArgument in request body");
            return res.status(400).json({ error: 'Missing required fields: mainArgument is empty.' });
        }
        if (!geminiPrompt) {
            console.error("❌ Missing geminiPrompt in request body");
            return res.status(400).json({ error: 'Missing prompt template.' });
        }

        // 2. 打印接收到的关键数据（调试用）
        console.log(`📝 Received Request: Argument="${formData.mainArgument.substring(0, 50)}...", Style=${formData.objectionStyle}`);

        const t = geminiPrompt;

        const historyPrompt = conversationHistory.length > 0
            ? t.history.continue.split('{history}').join(
                conversationHistory.map((turn: ConversationTurn) => 
                    `${turn.role === 'You' ? t.history.you : t.history.them}: ${turn.text}`
                ).join('\n\n')
            )
            : t.history.start;

        // 3. 构建 Prompt
        let prompt = t.mainPrompt;
        prompt = prompt.split('{historyPrompt}').join(historyPrompt || '');
        prompt = prompt.split('{mainArgument}').join(formData.mainArgument || ''); // 关键点
        prompt = prompt.split('{context}').join(formData.context || 'No additional context provided.');
        prompt = prompt.split('{targetAudience}').join(formData.targetAudience || '');
        prompt = prompt.split('{objectionStyle}').join(formData.objectionStyle || '');
        prompt = prompt.split('{emotionalStyle}').join(formData.emotionalStyle || '');
        prompt = prompt.split('{toneIntensity}').join((formData.toneIntensity || 3).toString());

        // 4. 再次打印最终 Prompt 的片段，确认替换成功
        if (prompt.includes('{mainArgument}')) {
            console.error("⚠️ WARNING: Placeholder {mainArgument} was NOT replaced!");
        } else {
            console.log("✅ Prompt constructed successfully.");
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7, // 稍微降低温度，让模型更听话
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("The AI returned an empty response.");
        }

        const parsedResults: ObjectionResult[] = JSON.parse(text.trim());
        res.json(parsedResults);

    } catch (error) {
        console.error("🔥 Error in /api/generate:", error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : "The AI failed to generate a valid response." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});