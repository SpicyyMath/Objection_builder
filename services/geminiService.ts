// File: services/geminiService.ts

import type { FormData, ObjectionResult, ConversationTurn } from '../types';
import { translations } from '../locales';

// 根据环境选择后端 URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generateObjection = async (formData: FormData, conversationHistory: ConversationTurn[], language: 'en' | 'zh'): Promise<ObjectionResult[]> => {
    
    const t = translations[language];

    try {
        // 调用新的 Express 后端，而不是 Netlify Function
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
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch from the server.');
        }

        const parsedResults: ObjectionResult[] = await response.json();
        return parsedResults;

    } catch (error) {
        console.error("Error calling backend API:", error);
        throw new Error(t.gemini.error);
    }
};