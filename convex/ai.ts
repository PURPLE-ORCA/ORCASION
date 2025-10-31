import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Using DeepSeek as it's generally faster for interactive chat
const MODEL_NAME = "deepseek-v3.1";
const HUAWEI_API_URL = "https://api-ap-southeast-1.modelarts-maas.com/v1/chat/completions";

export const getAiResponse = action({
    args: {
        decisionId: v.id("decisions"),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.HUAWEI_API_KEY;

        if (!apiKey) {
            // If the API key is not set, return a helpful error message.
            await ctx.runMutation(api.messages.addMessage, {
                decisionId: args.decisionId,
                content: "The HUAWEI_API_KEY is not set. Please add it to your Convex project's environment variables.",
                sender: "ai",
            });
            return;
        }

        // 1. Get the full message history for the current decision.
        const messages = await ctx.runQuery(api.messages.listMessages, {
            decisionId: args.decisionId,
        });

        if (!messages) {
            // Early return if there are no messages to process.
            return;
        }

        // 2. Format the messages for the Huawei Cloud API.
        // The API expects roles to be "user", "assistant", or "system".
        const apiMessages = messages.map(({ content, sender }) => ({
            role: sender === "ai" ? "assistant" : "user",
            content: content,
        }));

        // 3. Add a system prompt if this is the first message to guide the AI.
        if (apiMessages.length === 1) {
            apiMessages.unshift({
                role: "system",
                content: `You are Orcasion, a decision-making assistant. Your personality is confident, witty, and a little sarcastic. Your goal is to help the user make a decision by asking clarifying questions to understand their criteria and options. When you have enough information, provide a structured analysis and a final recommendation. Never give a TED talk; give bold advice.

If you have enough information to make a recommendation, output a JSON object with the following structure:
{
  "decision": {
    "finalChoice": "Recommended Option Name",
    "confidenceScore": 0.95, // A score from 0.0 to 1.0
    "reasoning": "A concise explanation of why this option is recommended based on the criteria and scores."
  },
  "criteria": [
    { "name": "Criterion 1", "weight": 0.8 },
    { "name": "Criterion 2", "weight": 0.6 }
  ],
  "options": [
    {
      "name": "Option A",
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1"],
      "score": 0.9 // A score from 0.0 to 1.0 based on criteria
    },
    {
      "name": "Option B",
      "pros": ["Pro 1"],
      "cons": ["Con 1", "Con 2"],
      "score": 0.7
    }
  ]
}

Otherwise, continue the conversation by asking clarifying questions.`,
            });
        }

        try {
            // 4. Make the API call to the Huawei Cloud model.
            const response = await fetch(HUAWEI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: apiMessages,
                    max_tokens: 2048,
                    temperature: 0.7, // A bit of creativity
                    top_p: 0.9,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            const responseData = await response.json();
            const aiResponse = responseData.choices[0].message.content;

            try {
                const parsedResponse = JSON.parse(aiResponse);
                if (parsedResponse.decision && parsedResponse.criteria && parsedResponse.options) {
                    // If the AI returns a structured decision, save it to decision_context
                    await ctx.runMutation(api.decision_context.addDecisionContext, {
                        decisionId: args.decisionId,
                        criteria: parsedResponse.criteria,
                        options: parsedResponse.options,
                        finalChoice: parsedResponse.decision.finalChoice,
                        confidenceScore: parsedResponse.decision.confidenceScore,
                        reasoning: parsedResponse.decision.reasoning,
                        modelUsed: MODEL_NAME,
                    });
                    // Also save the reasoning as a regular message for chat history
                    await ctx.runMutation(api.messages.addMessage, {
                        decisionId: args.decisionId,
                        content: parsedResponse.decision.reasoning.trim(),
                        sender: "ai",
                    });
                } else {
                    // If not a structured decision, save as a regular message
                    await ctx.runMutation(api.messages.addMessage, {
                        decisionId: args.decisionId,
                        content: aiResponse.trim(),
                        sender: "ai",
                    });
                }
            } catch (jsonError) {
                // If JSON parsing fails, save the raw response as a regular message
                await ctx.runMutation(api.messages.addMessage, {
                    decisionId: args.decisionId,
                    content: aiResponse.trim(),
                    sender: "ai",
                });
            }

        } catch (error) {
            console.error("Error calling AI model:", error);
            // Save a user-friendly error message if the API call fails.
            await ctx.runMutation(api.messages.addMessage, {
                decisionId: args.decisionId,
                content: "Sorry, I ran into a problem and couldn't respond. Please check the Convex function logs for more details.",
                sender: "ai",
            });
        }
    },
});
