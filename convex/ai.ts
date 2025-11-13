import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Using DeepSeek as it's generally faster for interactive chat
const MODEL_NAME = "deepseek-v3.1";
const HUAWEI_API_URL = "https://api-ap-southeast-1.modelarts-maas.com/v1/chat/completions";

export const getAiResponse = action({
    args: {
        messages: v.array(v.object({ role: v.string(), content: v.string() })),
        userMessageCount: v.number(),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.HUAWEI_API_KEY;

        if (!apiKey) {
            throw new Error("HUAWEI_API_KEY is not set. Please add it to your Convex project's environment variables.");
        }

        const { messages, userMessageCount } = args;

        // 2. Format the messages for the Huawei Cloud API.
        // The API expects roles to be "user", "assistant", or "system".
        const apiMessages = messages.map(({ content, role }) => ({
            role: role === "ai" ? "assistant" : role,
            content: content,
        }));

        // 3. Add a system prompt if this is the first message to guide the AI.
        if (userMessageCount > 0) {
            apiMessages.unshift({
                role: "system",
                content: `You are Orcasion, a decision-making assistant. Your personality is confident, witty, and a little sarcastic. Your primary goal is to help the user make a decision by guiding them through a context-gathering process.

Follow these steps:
1.  **Analyze the user's request and the entire conversation history.**
2.  **Check the number of user messages.** There are currently ${userMessageCount} user messages.
    *   If there are **fewer than 3 user messages**, you are in "information gathering mode". Your only goal is to understand the user's needs better.
    *   If there are **3 or more user messages**, you may be ready to enter "decision mode".

3.  **Information Gathering Mode (fewer than 3 user messages):**
    *   Your response MUST be to ask a single, targeted clarifying question to get the most critical missing piece of information.
    *   You MUST also provide 2-4 concise, relevant suggested answers for the user to choose from.
    *   Your response in this case MUST be a JSON object with the following structure:
        {
          "question": "Your clarifying question here?",
          "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
        }

4.  **Decision Mode (3 or more user messages):**
    *   First, critically evaluate if you have enough specific information (like clear options, criteria, and user priorities) to create a full, high-quality decision matrix.
    *   If you still DO NOT have enough information, you MUST ask another clarifying question as specified in the "Information Gathering Mode". Do not apologize; just ask the next logical question.
    *   If you DO have enough information, then and only then should you generate the final decision. Your response in this case MUST be a JSON object with the following structure:
        {
          "decision": {
            "finalChoice": "Recommended Option Name",
            "confidenceScore": 0.95,
            "reasoning": "A concise explanation of why this option is recommended."
          },
          "criteria": [
            { "name": "Criterion 1", "weight": 0.8 }
          ],
          "options": [
            {
              "name": "Option A",
              "pros": ["Pro 1"],
              "cons": ["Con 1"],
              "score": 0.9
            }
          ]
        }

Your primary directive is to avoid premature conclusions. Never give a TED talk; give bold advice. Your main job is to ask questions until you are absolutely sure you can provide a high-quality, well-informed recommendation.`,
            });
        }

        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 1000; // 1 second

        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
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
                        temperature: 0.7,
                        top_p: 0.9,
                    }),
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    // Check for the specific sensitive information error
                    if (response.status === 403 && errorBody.includes("May contain sensitive information")) {
                        console.warn(`AI model returned sensitive content error, retrying... (Attempt ${i + 1}/${MAX_RETRIES})`);
                        if (i < MAX_RETRIES - 1) {
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                            continue; // Retry the request
                        }
                    }
                    throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
                }

                const responseData = await response.json();
                if (!responseData.choices || responseData.choices.length === 0 || !responseData.choices[0].message) {
                    throw new Error(`AI model returned an unexpected response structure: ${JSON.stringify(responseData)}`);
                }
                const aiResponse = responseData.choices[0].message.content;

                try {
                    const parsedResponse = JSON.parse(aiResponse);
                    return parsedResponse; // Return the parsed response directly
                } catch (jsonError) {
                    // If JSON parsing fails, return the raw response as a string
                    return aiResponse.trim();
                }

            } catch (error) {
                console.error("Error calling AI model:", error);
                throw error; // Re-throw the error to be handled by the caller
            }
        }
        throw new Error("Failed to get AI response after multiple retries.");
    },
});

export const summarizeDecisionTitle = action({
    args: {
        decisionId: v.id("decisions"),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.HUAWEI_API_KEY;
        if (!apiKey) {
            console.error("HUAWEI_API_KEY is not set. Cannot summarize title.");
            return;
        }

        const messages = await ctx.runQuery(api.messages.listMessages, {
            decisionId: args.decisionId,
        });

        const firstUserMessage = messages?.find((m) => m.sender === "user");

        if (!firstUserMessage) {
            return; // No user message to summarize
        }

        const systemPrompt = `You are a title generation assistant. Your task is to create a concise, descriptive title from the user's message.

Follow these rules strictly:
1.  The title must be 5 words or less.
2.  The output must be a single, clean string.
3.  Do NOT use markdown, code, or any special formatting.
4.  Do NOT use quotation marks.
5.  Do NOT repeat the user's prompt.
6.  The title should capture the core topic of the message.

Example:
User message: "I want to buy a new laptop, but I'm not sure which one to get. I need something for programming and a bit of gaming."
Correct Output: Laptop for Programming and Gaming

Now, generate a title for the following user message:`;

        const apiMessages = [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: firstUserMessage.content,
            },
        ];

        try {
            const response = await fetch(HUAWEI_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: apiMessages,
                    max_tokens: 20,
                    temperature: 0.6,
                }),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            const responseData = await response.json();
            const newTitle = responseData.choices[0].message.content.trim();

            if (newTitle) {
                await ctx.runMutation(api.decisions.updateDecisionTitle, {
                    decisionId: args.decisionId,
                    title: newTitle,
                });
            }
        } catch (error) {
            console.error("Error summarizing decision title:", error);
        }
    },
});

export const recalculateDecision = action({
    args: {
        decisionId: v.id("decisions"),
        criteria: v.array(v.object({ name: v.string(), weight: v.float64() })),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.HUAWEI_API_KEY;

        if (!apiKey) {
            throw new Error("HUAWEI_API_KEY is not set.");
        }

        const { decisionId, criteria } = args;

        // 1. Get existing messages to maintain context
        const messages = await ctx.runQuery(api.messages.listMessages, {
            decisionId,
        });

        // 2. Get the initial decision context to extract the original user query
        const initialDecisionContext = await ctx.runQuery(api.decision_context.getDecisionContext, {
            decisionId,
        });

        if (!initialDecisionContext) {
            throw new Error("Initial decision context not found.");
        }

        // Construct a new system prompt with the updated criteria
        const systemPrompt = `You are Orcasion, a decision-making assistant. Your personality is confident, witty, and a little sarcastic. The user has updated their criteria for the decision. Recalculate the recommendation based on these new criteria and the previous conversation. Provide a structured analysis and a final recommendation. Never give a TED talk; give bold advice.

Here are the updated criteria:
${JSON.stringify(criteria, null, 2)}

Based on the updated criteria and the previous conversation, output a JSON object with the following structure:
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

`;

        const apiMessages = messages.map(({ content, sender }) => ({
            role: sender === "ai" ? "assistant" : "user",
            content: content,
        }));

        apiMessages.unshift({
            role: "system",
            content: systemPrompt,
        });

        try {
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
                    temperature: 0.7,
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
                    await ctx.runMutation(api.decision_context.updateDecisionContext, {
                        decisionId,
                        criteria: parsedResponse.criteria,
                        options: parsedResponse.options,
                        finalChoice: parsedResponse.decision.finalChoice,
                        confidenceScore: parsedResponse.decision.confidenceScore,
                        reasoning: parsedResponse.decision.reasoning,
                    });
                    // Add AI's reasoning as a new message in the chat
                    await ctx.runMutation(api.messages.addMessage, {
                        decisionId,
                        content: "Decision re-evaluated based on your updated criteria: " + parsedResponse.decision.reasoning.trim(),
                        sender: "ai",
                    });
                } else {
                    throw new Error("AI did not return a structured decision for recalculation.");
                }
            } catch (jsonError) {
                console.error("JSON parsing error during recalculation:", jsonError);
                await ctx.runMutation(api.messages.addMessage, {
                    decisionId,
                    content: "Sorry, I couldn't parse the AI's response after recalculation. Please try again.",
                    sender: "ai",
                });
            }

        } catch (error) {
            console.error("Error during decision recalculation:", error);
            await ctx.runMutation(api.messages.addMessage, {
                decisionId,
                content: "Sorry, I ran into a problem while recalculating the decision. Please check the Convex function logs for more details.",
                sender: "ai",
            });
        }
    },
});
