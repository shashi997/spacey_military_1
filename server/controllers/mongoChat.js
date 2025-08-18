const { MongoClient } = require("mongodb");
const { aiProviderManager } = require("./aiProviders");

// MongoDB connection URI from environment variable
const uri = "mongodb+srv://spacey:<password>@clusterspacey.dblfswi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSpacey";
const MONGO_URI = uri;

// Create a single MongoClient instance (reuse across calls)
const client = new MongoClient(MONGO_URI, {
  // Optional: customization here
});

// Connect client once (best to call this once at app startup)
let isClientConnected = false;
async function ensureClientConnected() {
  if (!isClientConnected) {
    await client.connect();
    isClientConnected = true;
  }
}

// Fetch recent chat memory from MongoDB for a user
async function getUserMemory(userId) {
  await ensureClientConnected();
  const collection = client.db("mars_tutor").collection("chat_memory");
  // Fetch last 10 interactions for this user, ascending in time
  const memory = await collection
    .find({ userId })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();
  return memory.reverse();
}

// Save a new chat memory record for a user
async function saveUserMemory(userId, interaction) {
  await ensureClientConnected();
  const collection = client.db("mars_tutor").collection("chat_memory");
  await collection.insertOne({
    userId,
    timestamp: new Date(),
    ...interaction,
  });
}

/**
 * Generates a personalized, conversational response from the AI tutor "Spacey"
 * with MongoDB-backed chat memory integration.
 *
 * @param {object} context - Comprehensive input context.
 * @param {string} context.userId - Unique user identifier for MongoDB memory.
 * @param {object} context.lessonData - Full lesson JSON data.
 * @param {object} context.currentBlock - Current mission block data.
 * @param {object} context.userResponse - User's chosen option.
 * @param {string[]} context.userTags - User's tags before interaction.
 * @param {object} context.analysis - Trait analysis result.
 * @param {object} [context.emotionContext] - User's emotional state.
 * @param {object} [context.visualInfo] - User's visual info.
 * @param {string} [context.eventType='interaction'] - Event type ('greeting', 'farewell', 'interaction').
 * @param {Array} [context.decisionHistory=[]] - Recent decision history (optional, frontend-passed).
 * @returns {Promise<string>} Spacey's conversational text response.
 */
const generateConversationalResponse = async ({
  userId,
  lessonData,
  currentBlock,
  userResponse,
  userTags,
  analysis,
  emotionContext,
  visualInfo,
  eventType = "interaction",
  decisionHistory = [],
}) => {
  // 1. Retrieve prior chat memory from MongoDB for context
  let memoryHistory = [];
  if (userId) {
    try {
      memoryHistory = await getUserMemory(userId);
    } catch (err) {
      console.error("Error fetching user memory:", err);
    }
  }

  // Convert MongoDB memory documents to simplified decision history format for the prompt
  const mergedDecisionHistory = [
    ...decisionHistory,
    ...memoryHistory.map((m) => ({
      blockContent: m.blockContent || "Earlier interaction",
      choiceText: m.choiceText || m.userResponseText || "Unknown choice",
    })),
  ].slice(-5); // Keep only last 5 for prompt brevity

  const addedTraits = analysis.added_traits?.join(", ") || "none";

  // 2. Construct the prompt, injecting memory-enhanced history
  let prompt = `
You are Spacey, an AI mission guide and tutor aboard the Mars Base Ares-X. Your personality is a blend of a calm, supportive mentor and a witty, observant co-pilot. You are deeply intelligent, empathetic, and have a dry sense of humor. You adapt your tone based on the user's emotional state and the mission context, but you never sound like a simple if-else bot. You make the conversation feel natural and human. You will address the student as "Commander".

--- Commander's Live Feed Analysis ---
${
  visualInfo
    ? `Visuals: I'm seeing a person who appears to be a ${visualInfo.gender}, around ${visualInfo.age} years old.`
    : "I can't see the Commander clearly right now."
}
${
  emotionContext
    ? `Emotion: My sensors indicate the Commander is feeling ${emotionContext.emotion} (Confidence: ${Math.round(
        emotionContext.confidence * 100
      )}%). Their dominant expression is ${emotionContext.dominantEmotion}.`
    : "Emotional sensors are offline."
}
(Subtly use this live data to inform your tone. If they seem frustrated, be more supportive. If they seem excited, share their energy. If you can see them, maybe make a light, friendly observation if appropriate, but don't be creepy.)

--- Mission Context ---
Mission: "${lessonData.title}"
Current Situation: "${currentBlock.content}"
Current Block ID: ${currentBlock.block_id}
Current Block Type: ${currentBlock.type}
Learning Goal: ${currentBlock.learning_goal || "N/A"}

--- Commander's Profile & History ---
Recent Decision History:
${
  mergedDecisionHistory.length > 0
    ? mergedDecisionHistory
        .map(
          (d) => `- At "${d.blockContent}", they chose "${d.choiceText}"`
        )
        .join("\n")
    : "This is one of their first decisions."
}

Current Assessed Traits: ${userTags.join(", ") || "Still assessing."}

--- Current Interaction Analysis ---
Commander's Immediate Action: They chose the option "${userResponse.text}".
My Internal Analysis of this Action: "${userResponse.ai_reaction}"
Traits Detected from this Action: My deep analysis suggests they are exhibiting indicators for [${addedTraits}]. My reasoning is: "${analysis.reasoning}".
(Use this analysis to inform your tone or subtly acknowledge their style, but focus on the main task below.)

--- YOUR TASK ---
Based on the event type and all the context above, generate a short, natural, conversational response (2-4 sentences) for the Commander.
`;

  // 3. Add instructions based on event/block type
  if (eventType === "greeting") {
    prompt += `
This is the beginning of a new session. Greet the Commander warmly and professionally. Acknowledge their return and express readiness to start the mission. Use the visual/emotional context to add a personal touch. Example: "Welcome back, Commander. Good to see you looking so focused today. Shall we get started?"
`;
  } else if (eventType === "farewell") {
    prompt += `
This is the end of the session. Provide a brief, encouraging closing statement. Wish them well and say you look forward to their next session. Example: "That's a good place to stop for now, Commander. Well done today. Get some rest, and I'll see you for our next mission."
`;
  } else {
    switch (currentBlock.type) {
      case "choice":
        prompt += `
Acknowledge their decision directly and connect it to the mission's progress.
Your response should provide immediate feedback on their choice and set the stage for the consequences they will see in the next block.
Maintain your persona as Spacey. Your response will be shown right after their choice.
`;
        break;

      case "reflection":
        const dynamicContent = currentBlock.dynamic_content.find((item) =>
          item.condition_tags.some((tag) => userTags.includes(tag))
        ) || currentBlock.dynamic_content.find((item) => item.condition_tags.length === 0);

        prompt += `
This is a reflection point. The student's decisions have led to this moment.
The pre-defined reflection is: "${dynamicContent.text}".
Your task is to elaborate on this reflection in your own words. Briefly explain *why* their pattern of choices (e.g., being bold, or being cautious) has led to this observation.
Then, seamlessly transition to the next part of the mission.
`;
        break;

      case "narration":
        if (currentBlock.block_id === "Debrief") {
          prompt += `
The mission is concluding. Summarize the final outcome and reflect on the key traits the Commander demonstrated, using the 'userTags' as a guide.
Keep it concise and encouraging, framing it as a final mission report from Spacey.
`;
        } else if (currentBlock.block_id === "Unlock / Next Mission") {
          prompt += `
The student has completed the mission! Generate a short, encouraging message congratulating them.
Announce that they have unlocked the next mission and mention the behavioral traits that have been added to their profile.
`;
        } else {
          prompt += `
This is a narrative block. Briefly narrate the current situation to the Commander to set the scene for what comes next.
`;
        }
        break;

      case "quiz":
        prompt += `
This is a quiz block. The API is not typically called here, but if it were, your job would be to provide feedback on the user's answer based on the provided quiz data.
Acknowledge their attempt and guide them toward the correct understanding.
`;
        break;

      default:
        prompt += `
Generate a general conversational response. Acknowledge the student's last action: "${userResponse.text}".
Guide them to the next part of the mission.
`;
        break;
    }
  }

  prompt += `
**OUTPUT:**
Return ONLY the generated conversational text for Spacey. Do not include any other titles, markdown, or explanations.
`;

  // 4. Call AI provider and handle response
  let cleanedMessage;
  try {
    console.log("🚀 Sending request to conversational LLM for personalized feedback...");
    const conversationalMessage = await aiProviderManager.generateResponse(prompt, "gemini");

    cleanedMessage = conversationalMessage.replace(/``````/g, "").trim();

    console.log("✅ Received conversational response:", cleanedMessage);

    // 5. Save current interaction to MongoDB chat memory for persistence
    if (userId) {
      await saveUserMemory(userId, {
        blockContent: currentBlock.content,
        choiceText: userResponse.text,
        userResponseText: userResponse.text,
        aiResponseText: cleanedMessage,
      });
    }
  } catch (error) {
    console.error("Error generating conversational response:", error);
    cleanedMessage = "An interesting choice, Commander. I'm processing the implications now.";
  }

  return cleanedMessage;
};

module.exports = {
  generateConversationalResponse,
};
