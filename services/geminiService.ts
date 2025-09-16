// File: services/geminiService.ts

import type { FormData, ObjectionResult, ConversationTurn } from '../types';
import { translations } from '../locales';

export const generateObjection = async (formData: FormData, conversationHistory: ConversationTurn[], language: 'en' | 'zh'): Promise<ObjectionResult[]> => {
    
    const t = translations[language];

    try {
        // 调用我们的后端函数，而不是直接调用 Gemini
        // Netlify 会自动将这个路径映射到 netlify/functions/generate.ts
        const response = await fetch('/.netlify/functions/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 将所有需要的数据都发送给后端函数
            body: JSON.stringify({ 
                formData, 
                conversationHistory, 
                language,
                //translations: t // 将翻译文本也传过去
                geminiPrompt: t.gemini // 只发送 gemini prompt 相关文本
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch from the server.');
        }

        // 后端函数直接返回了 Gemini 的结果，我们在这里解析它
        const parsedResults: ObjectionResult[] = await response.json();
        return parsedResults;

    } catch (error) {
        console.error("Error calling backend function:", error);
        throw new Error(t.gemini.error);
    }
};