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
                temperature: 0.7, 
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("The AI returned an empty response.");
        }

        const parsedResults: ObjectionResult[] = JSON.parse(text.trim());
        res.json(parsedResults);

    } catch (error: any) {
        console.error("🔥 Error in /api/generate:", error);

        // 获取请求中的语言设置 (默认为英文)
        const lang = req.body.language === 'zh' ? 'zh' : 'en';

        // 默认状态码和通用错误信息 (兜底)
        let statusCode = 500;
        let errorMessage = lang === 'zh' 
            ? "AI 服务暂时繁忙或遇到未知错误，请稍后重试。" 
            : "The AI service is busy or encountered an error. Please try again later.";

        if (error.message) {
            // 1. API Key 配置错误
            if (error.message.includes('API key')) {
                statusCode = 401;
                errorMessage = lang === 'zh'
                    ? "服务器配置异常（API 密钥无效），请联系管理员。"
                    : "Server configuration error (Invalid API Key). Please contact support.";
            } 
            // 2. 地区限制 (Region Blocked)
            else if (error.message.includes('location') || error.message.includes('region')) {
                statusCode = 403;
                errorMessage = lang === 'zh'
                    ? "抱歉，AI 服务当前在您所在的地区不可用。"
                    : "Sorry, the AI service is not available in your current region.";
            } 
            // 3. 配额超限/流量过大 (429 Quota Exceeded)
            else if (error.message.includes('429') || error.message.includes('Quota')) {
                statusCode = 429;
                errorMessage = lang === 'zh' 
                    ? "当前使用人数过多，服务器繁忙，请稍后再试。" 
                    : "High traffic volume. Please try again later.";
            }
            // 4. 内容安全拦截 (Safety Filters)
            else if (error.message.includes('safety') || error.message.includes('blocked')) {
                statusCode = 400;
                errorMessage = lang === 'zh'
                    ? "输入的内容可能包含敏感信息，被 AI 安全系统拦截，请调整措辞。"
                    : "The input triggered AI safety filters. Please adjust your wording.";
            }
            // 5. AI 返回空内容
            else if (error.message.includes('empty response')) {
                statusCode = 500;
                errorMessage = lang === 'zh'
                    ? "AI 思考后没有返回有效结果，请尝试修改输入。"
                    : "The AI returned an empty response. Please try modifying your input.";
            } else {
                errorMessage = error.message; // 开发环境暴露具体错误
            }
        }
        // ==========================

        res.status(statusCode).json({ 
            error: errorMessage 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});