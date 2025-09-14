// File: netlify/functions/generate.ts

import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from '@google/genai';
import type { FormData, ObjectionResult, ConversationTurn } from '../../types';

// 这里的 API_KEY 是从 Netlify 的安全环境变量中读取的，不会暴露给前端
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// 将 geminiService.ts 中的 schema 复制过来
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

// 这是函数的主体
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { formData, conversationHistory, language, translations } = JSON.parse(event.body || '{}');
    
    // 从前端接收翻译文本，这样我们就不需要在后端也维护一份
    const t = translations.gemini;

    const historyPrompt = conversationHistory.length > 0
    ? t.history.continue
        .replace('{history}', conversationHistory.map((turn: ConversationTurn) => `${turn.role === 'You' ? t.history.you : t.history.them}: ${turn.text}`).join('\n\n'))
    : t.history.start;
    
    const prompt = t.mainPrompt
      .replace('{historyPrompt}', historyPrompt)
      .replace('{mainArgument}', formData.mainArgument)
      .replace('{context}', formData.context)
      .replace('{targetAudience}', formData.targetAudience)
      .replace('{objectionStyle}', formData.objectionStyle)
      .replace('{emotionalStyle}', formData.emotionalStyle)
      .replace('{toneIntensity}', formData.toneIntensity.toString());

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.8,
        },
    });
    
    const text = response.text;
    if (!text) {
        console.error("Gemini API response did not contain text.", { response });
        throw new Error("The AI returned an empty response.");
    }

    const jsonText = text.trim();
    // 注意：这里我们直接将 Gemini 返回的 JSON 字符串作为响应体
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: jsonText,
    };

  } catch (error) {
    console.error("Error in Netlify function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "The AI failed to generate a valid response." }),
    };
  }
};
