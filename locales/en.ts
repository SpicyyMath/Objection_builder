import { TargetAudience, ObjectionStyle, EmotionalStyle } from "../types";

export default {
    toggleLanguage: "Switch to Chinese",
    appDescription: "Generate thoughtful and effective counterarguments for difficult conversations. Provide the context, select your audience and style, and let AI help you build your case respectfully.",
    generatedResponses: "Generated Responses",
    generationFailed: "Generation Failed",
    unknownError: "An unknown error occurred. Please check the console.",
    historyTitle: "Conversation History",
    
    form: {
        titleStart: "Build Your Objection",
        titleReply: "Craft Your Next Response",
        newConversation: "Start New Conversation",
        statementLabelStart: "What did they say? (Their exact words)",
        statementLabelReply: "What was their latest reply?",
        statementPlaceholderStart: "e.g., 'We should work on weekends to meet the deadline.'",
        statementPlaceholderReply: "e.g., 'That's not in the budget and we don't have time.'",
        errorStatement: "Please provide the statement to address.",
        errorResponse: "Please provide their response.",
        contextLabel: "The Situation / Background Context (Optional)",
        contextPlaceholder: "e.g., 'This is for a critical project launch, but the team is already feeling burnt out. I want to push back without burning bridges.'",
        audienceLabel: "Target Audience",
        audienceTooltip: "Who are you saying this to? This affects formality and tone.",
        frameworkLabel: "Communication Framework",
        frameworkTooltip: "What communication model should be used as a guideline?",
        emotionLabel: "Emotional Style",
        emotionTooltip: "What is the core emotion behind the response?",
        intensityLabel: "Tone Intensity (1=Gentle, 5=Forceful):",
        generateButton: "Generate Objections",
        generatingButton: "Generating...",
    },
    results: {
        copy: "Copy text",
        reply: "Reply to this",
        riskTitle: "Interpersonal Risk",
        fallacyTitle: "Potential Logical Fallacy in Original Argument",
        evidenceTitle: "Supporting Evidence",
    },
    loader: {
        phase1: "🔍 Analyzing logical fallacies...",
        phase2: "🧠 Accessing sarcasm database...",
        phase3: "✍️ Polishing the comeback...",
        phase4: "✨ Predicting emotional damage...",
        ready: "Ready!",
    },
    spinner: {
        title: "Generating Responses...",
        subtitle: "The AI is crafting the perfect arguments. Please wait a moment.",
    },

    audienceOptions: {
        [TargetAudience.ELDER]: { label: 'Elder' },
        [TargetAudience.TEACHER]: { label: 'Teacher' },
        [TargetAudience.LEADER]: { label: 'Leader' },
        [TargetAudience.COLLEAGUE]: { label: 'Colleague' },
        [TargetAudience.CLASSMATE]: { label: 'Classmate' },
        [TargetAudience.CHILD]: { label: 'Child' },
        [TargetAudience.PARTNER]: { label: 'Partner' },
        [TargetAudience.STRANGER]: { label: 'Stranger' },
        [TargetAudience.BITTER_ENEMY]: { label: 'Bitter_Enemy' },
    },
    objectionStyleOptions: {
        [ObjectionStyle.FALLACY_HINT]: { label: 'Hint at a Fallacy: Point Out Flawed Logic' },
        [ObjectionStyle.NVC]: { label: 'Nonviolent Communication: Share Feelings, State Needs' },
        [ObjectionStyle.DESC]: { label: 'DESC Model: Describe, Explain, Suggest' },
    },
    emotionalStyleOptions: {
        [EmotionalStyle.RATIONAL]: { label: 'Calm and Logical' },
        [EmotionalStyle.ASSERTIVE]: { label: 'Confident and Direct' },
        [EmotionalStyle.SARCASTIC]: { label: 'Ironic and Witty' },
    },
    gemini: {
        mainPrompt: `
You are an expert in communication, negotiation, and psychology. Your task is to generate one, well-reasoned objections or counterarguments based on the user's request.

TASK CONTEXT:
{historyPrompt}

USER'S REQUEST:
- Statement to Address: "{mainArgument}"
- Additional Context: "{context}"

DESIRED RESPONSE STYLE:
- Target Audience: {targetAudience}
- Communication Framework: {objectionStyle}
- Emotional Style: {emotionalStyle}
- Tone Intensity (1=Gentle, 5=Forceful): {toneIntensity}

For generated response, you MUST provide the following in valid JSON format:
1.  **responseText**: The complete, ready-to-use text of the counterargument.
2.  **riskLevel**: Assess the interpersonal risk ('Low', 'Medium', 'High') of using this response.
3.  **riskReasoning**: Briefly explain the reasoning behind the assigned risk level.
4.  **fallacies**: An array of potential logical fallacies in the *original* statement. If none, return an empty array.
5.  **citations**: An array of verifiable citations if the response is evidence-based. If none, return an empty array.

The final output MUST be a JSON array of one object adhering to the specified schema. Do not include any explanatory text outside of the JSON structure.
        `,
        history: {
            start: "This is the start of the conversation.",
            continue: "This is a continuing conversation. Here is the history so far (You are 'You'):\n\n{history}",
            you: "You",
            them: "Them",
        },
        error: "The AI failed to generate a valid response. This may be due to an excessively long request duration or an internal error. Please try adjusting your strategy or reducing the amount of information entered.",
    },
    footer: {
        copyright: `© 2025 Objection Builder. Built by Ziyi Wang.`,
        disclaimer: "Disclaimer: We are not responsible for broken friendships, fired jobs, or bruises on your ego resulting from using this tool. Argue responsibly."
    }
}
