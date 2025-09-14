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
        statementLabelStart: "待处理的陈述",
        statementLabelReply: "对方的最新回应",
        statementPlaceholderStart: "例如：“我们应该周末加班来赶上最后期限。”",
        statementPlaceholderReply: "例如：“那不在预算之内，而且我们没有时间。”",
        errorStatement: "请输入待处理的陈述。",
        errorResponse: "请输入对方的回应。",
        contextLabel: "补充背景（可选）",
        contextPlaceholder: "例如：“这是一个关键的项目发布，但团队已经感到筋疲力尽。”",
        audienceLabel: "目标受众",
        audienceTooltip: "您在对谁说这句话？这会影响正式程度和语气。",
        frameworkLabel: "沟通框架",
        frameworkTooltip: "应使用哪种沟通模型作为指导？",
        emotionLabel: "情感风格",
        emotionTooltip: "回应背后的核心情感是什么？",
        intensityLabel: "语气强度:",
        generateButton: "生成异议",
        generatingButton: "生成中...",
    },
    results: {
        copy: "复制文本",
        reply: "回复此条",
        riskTitle: "人际风险",
        fallacyTitle: "原论点中潜在的逻辑谬误",
        evidenceTitle: "支撑证据",
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
    },
    objectionStyleOptions: {
        [ObjectionStyle.EVIDENCE_BASED]: { label: '基于证据' },
        [ObjectionStyle.NVC]: { label: '非暴力沟通' },
        [ObjectionStyle.DESC]: { label: 'DESC 模型' },
        [ObjectionStyle.SBI]: { label: 'SBI 反馈' },
        [ObjectionStyle.FALLACY_HINT]: { label: '谬误暗示' },
    },
    emotionalStyleOptions: {
        [EmotionalStyle.RATIONAL]: { label: '理性的' },
        [EmotionalStyle.SKEPTICAL]: { label: '怀疑的' },
        [EmotionalStyle.ASSERTIVE]: { label: '自信的' },
        [EmotionalStyle.FRUSTRATED]: { label: '沮丧的' },
        [EmotionalStyle.SARCASTIC]: { label: '讽刺的' },
    },
    gemini: {
        mainPrompt: `
你是一位沟通、谈判和心理学专家。你的任务是根据用户的请求，生成三个不同的、理由充分的异议或反驳论点。输出语言必须是简体中文。

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

对于生成的三个回应中的每一个，你都必须以有效的 JSON 格式提供以下内容：
1.  **responseText**: 完整、可直接使用的反驳论点文本。
2.  **riskLevel**: 评估使用此回应的人际风险（'Low', 'Medium', 'High'）。
3.  **riskReasoning**: 简要解释分配该风险等级的原因。
4.  **fallacies**: 一个数组，包含在*原始*陈述中识别出的潜在逻辑谬误。如果未发现，则返回空数组。
5.  **citations**: 一个数组，包含可验证的引文以支持回应中提出的主张。如果不需要，则返回空数组。

最终输出必须是一个包含三个对象的 JSON 数组，并遵循指定的模式。不要在 JSON 结构之外包含任何解释性文字。
        `,
        history: {
            start: "这是对话的开始。",
            continue: "这是一个持续的对话。到目前为止的历史记录如下（你是“You”）：\n\n{history}",
            you: "你",
            them: "对方",
        },
        error: "AI 未能生成有效回应。这可能是由于内容安全策略违规或内部错误。请尝试调整您的提示。",
    }
}
