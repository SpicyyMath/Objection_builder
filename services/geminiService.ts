// File: services/geminiService.ts

import type { FormData, ObjectionResult, ConversationTurn } from '../types';
import { translations } from '../locales';

// 根据环境选择后端 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generateObjection = async (formData: FormData, conversationHistory: ConversationTurn[], language: 'en' | 'zh'): Promise<ObjectionResult[]> => {
    
    const t = translations[language];

    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                formData, 
                conversationHistory, 
                language, 
                geminiPrompt: t.gemini
            }),
        });

        if (!response.ok) {
            // 尝试解析后端返回的 JSON 错误信息
            const errorData = await response.json().catch(() => ({}));
            // 优先使用后端返回的 error 字段
            throw new Error(errorData.error || `Server Error: ${response.status} ${response.statusText}`);
        }

        const parsedResults: ObjectionResult[] = await response.json();
        return parsedResults;

    } catch (error) {
        console.error("Error calling backend API:", error);
        throw error;
    }
};