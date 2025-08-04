// server/controllers/messageAnalyzerController.js
const { aiProviderManager } = require('./aiProviders');

const analyzeUserMessages = async (messages, blockContent, learningGoal, llmInstruction) => {
    try {
        const analysisPrompt = `
You are an expert learning analyst. Your task is to analyze a student's messages AND the AI tutor's responses within a learning context to determine the student's level of understanding of the material.

**Learning Context:**
*   Block Content: ${blockContent}
*   Learning Goal: ${learningGoal}
*   LLM Instruction: ${llmInstruction}

**Conversation History (Student & AI Tutor):**
${messages.map(message => `${message.sender}: ${message.text}`).join('\n')}

**Analysis Tasks:**

1.  Identify the key concepts discussed in the block content.
2.  Analyze BOTH the student's messages AND the AI tutor's responses to determine if the student demonstrates an understanding of these key concepts.  Consider how the AI's responses may have guided the student's understanding.
3.  Assess the student's overall level of understanding (e.g., "Excellent," "Good," "Fair," "Poor").
4.  Provide a brief summary of the student's strengths and weaknesses.
5.  Suggest topics/areas where Spacey (the AI tutor) should focus on to improve the student's understanding.

**Output:** Provide a concise summary of the student's understanding, including the level of understanding, strengths, weaknesses, and suggested areas of focus.
`;

        const analysisResponse = await aiProviderManager.generateResponse(analysisPrompt);
        console.log("messageAnalyerController.js : analysisResponse ", analysisResponse)
        return analysisResponse;
    } catch (error) {
        console.error('Error analyzing user messages:', error);
        return "Unable to analyze user messages at this time.";
    }
};

module.exports = {
    analyzeUserMessages,
};
