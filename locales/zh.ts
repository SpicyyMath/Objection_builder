import { TargetAudience, ObjectionStyle, EmotionalStyle } from "../types";

export default {
    toggleLanguage: "切换到英文",
    appDescription: "为棘手的对话生成深思熟虑且有效的反驳论点。提供背景信息，选择您的受众和风格，让 AI 帮助您有理有据地建立您的论点。",
    generatedResponses: "生成的回复",
    generationFailed: "生成失败",
    unknownError: "发生未知错误。请检查控制台。",
    historyTitle: "对话历史",
    
    form: {
        titleStart: "构建你的异议",
        titleReply: "撰写你的下一条回复",
        newConversation: "开始新对话",
        statementLabelStart: "对方说了什么？(对方的原话)",
        statementLabelReply: "对方最新回复了什么？",
        statementPlaceholderStart: "例如：“你们是我带过的最差的一届”",
        statementPlaceholderReply: "例如：“那不在预算之内，而且我们没有时间。”",
        errorStatement: "请输入对方的观点。",
        errorResponse: "请输入对方的回应。",
        contextLabel: "当时的情况/背景信息 (可选)",
        contextPlaceholder: "例如：这是一个关键的项目发布，但团队已经感到筋疲力尽。我想反驳但不想撕破脸。",
        audienceLabel: "目标受众",
        audienceTooltip: "您在对谁说这句话？这会影响正式程度和语气。",
        frameworkLabel: "沟通框架",
        frameworkTooltip: "应使用哪种沟通模型作为指导？",
        emotionLabel: "情感风格",
        emotionTooltip: "回应背后的核心情感是什么？",
        intensityLabel: "语气强度 (1=温和, 5=强硬):",
        generateButton: "生成异议",
        generatingButton: "生成中...",
    },
    results: {
        copy: "复制文本",
        reply: "回复此条",
        riskTitle: "人际风险",
        fallacyTitle: "原论点中潜在的逻辑谬误",
    },
    loader: {
        phase1: "🔍 正在分析逻辑谬误...",
        phase2: "🧠 正在访问思维数据库...",
        phase3: "✍️ 正在润色反击措辞...",
        phase4: "✨ 正在预测精神伤害...",
        ready: "准备就绪！",
    },
    spinner: {
        title: "正在生成回复...",
        subtitle: "AI 正在精心设计完美的论点。请稍候。",
    },

    audienceOptions: {
        [TargetAudience.ELDER]: { label: '长辈' },
        [TargetAudience.TEACHER]: { label: '老师' },
        [TargetAudience.LEADER]: { label: '上级' },
        [TargetAudience.COLLEAGUE]: { label: '同事' },
        [TargetAudience.CLASSMATE]: { label: '同学' },
        [TargetAudience.CHILD]: { label: '孩子' },
        [TargetAudience.PARTNER]: { label: '伴侣' },
        [TargetAudience.STRANGER]: { label: '陌生人' },
        [TargetAudience.BITTER_ENEMY]: { label: '仇人' },
    },
    objectionStyleOptions: {
        [ObjectionStyle.FALLACY_HINT]: { label: '谬误暗示：指出逻辑漏洞' },
        [ObjectionStyle.NVC]: { label: '非暴力沟通：先谈感受，再说需求' },
        [ObjectionStyle.DESC]: { label: 'DESC 模型：描述问题，提议后果' },
    },
    emotionalStyleOptions: {
        [EmotionalStyle.RATIONAL]: { label: '冷静客观' },
        [EmotionalStyle.ASSERTIVE]: { label: '自信而直接' },
        [EmotionalStyle.SARCASTIC]: { label: '讽刺且机智' },
    },
    gemini: {
        mainPrompt: `
你是一位沟通、谈判和心理学专家。你的任务是根据用户的请求，生成1个理由充分的异议或反驳论点。输出语言必须是简体中文。

任务背景：
{historyPrompt}

用户请求：
- 待处理的陈述: "{mainArgument}"
- 补充背景: "{context}"

期望的回应风格：
- 目标受众: {targetAudience}
- 沟通框架: {objectionStyle}
- 情感风格: {emotionalStyle}
- 语气强度 (1=温和, 5=强硬): {toneIntensity}

对于生成的回应中，你都必须以有效的 JSON 格式提供以下内容：
1.  **responseText**: 完整、可直接使用的反驳论点文本。
2.  **riskLevel**: 评估使用此回应的人际风险（'Low', 'Medium', 'High'）。
3.  **riskReasoning**: 简要解释分配该风险等级的原因。
4.  **fallacies**: 一个数组，包含在*原始*陈述中识别出的潜在逻辑谬误。如果未发现，则返回空数组。

最终输出必须是一个包含1个对象的 JSON 数组，并遵循指定的模式。不要在 JSON 结构之外包含任何解释性文字。
        `,
        history: {
            start: "这是对话的开始。",
            continue: "这是一个持续的对话。到目前为止的历史记录如下（你是“You”）：\n\n{history}",
            you: "你",
            them: "对方",
        },
        error: "AI 未能生成有效回应。这可能是由于请求时间过长或内部错误。请尝试调整您的策略或减少输入的信息。",
    },
    footer: {
        copyright: `© 2025 Objection Builder. 由 SpicyyMath 构建。`,
        disclaimer: "免责声明：对于因使用本工具而导致的友谊破裂、丢掉工作或自尊心受损，我们概不负责。请理性吵架。"
    }
}
