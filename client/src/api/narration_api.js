// src/api/narration_api.js
import axios from 'axios';

// Get the API base URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create an Axios instance with a base URL
const narrationApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/chat`, // Adjusted base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends narration chat messages to the backend for AI analysis and personalized learning.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} lessonId - The ID of the lesson.
 * @param {string} blockId - The ID of the narration block.
 * @param {Array} messages - An array of chat messages to send to the backend.
 * @param {object} block - The entire block object.
 * @returns {Promise<object>} The AI's response from the backend.
 */
export const sendNarrationChatMessages = async (userId, lessonId, blockId, messages, block) => { // Changed blockContent to block
  try {
    console.log("🔗 API Base URL:", API_BASE_URL);
    console.log("📡 Full API URL:", `${API_BASE_URL}/api/chat/narration/chatMessages`);
    console.log("📤 Sending to backend:", { userId, lessonId, blockId, messages, block });

    // The payload sent to your backend API.
    const payload = {
      userId: userId,
      lessonId: lessonId,
      blockId: blockId,
      messages: messages,
      blockContent: block.content, // Extract blockContent from the block object
      learningGoal: block.learning_goal, // Extract learning_goal
      llmInstruction: block.llm_instruction, // Extract llm_instruction
      nextBlock: block.next_block, // Extract next_block
    };

    // Make the POST request to the '/chatMessages' endpoint
    const response = await narrationApiClient.post('/narration/chatMessages', payload); // Adjusted post URL

    // log the response for debugging
    console.log("📥 Response from backend:", response.data);

    // Return the AI response data
    return response.data; // Return the entire response object
  } catch (error) {
    console.error('Error sending narration chat messages:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    // Re-throw a more specific error or return a default error message.
    throw new Error('Failed to get a response from the AI. Please try again.');
  }
};
