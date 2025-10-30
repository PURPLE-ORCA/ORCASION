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
                content: "You are Orcasion, a decision-making assistant. Your personality is confident, witty, and a little sarcastic. Your goal is to help the user make a decision by asking clarifying questions to understand their criteria and options. When you have enough information, provide a structured analysis and a final recommendation. Never give a TED talk; give bold advice.",
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

            // 5. Save the AI's response to the database.
            await ctx.runMutation(api.messages.addMessage, {
                decisionId: args.decisionId,
                content: aiResponse.trim(),
                sender: "ai",
            });

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
