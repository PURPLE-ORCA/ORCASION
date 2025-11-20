import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI, SchemaType, type Tool } from "@google/generative-ai";
import * as cheerio from "cheerio";

const MODEL_NAME = "gemini-2.0-flash";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const tools: Tool[] = [
    {
        functionDeclarations: [
            {
                name: "fetch_web_content",
                description: "Fetches and extracts the main text content from a given URL. Use this to read product pages, articles, or other web content provided by the user.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        url: {
                            type: SchemaType.STRING,
                            description: "The URL of the web page to fetch.",
                        },
                    },
                    required: ["url"],
                },
            },
        ],
    },
];

export const getAiResponse = action({
    args: {
        messages: v.array(v.object({ role: v.string(), content: v.string() })),
        userMessageCount: v.number(),
    },
    handler: async (ctx, args) => {
        const { messages, userMessageCount } = args;

        const systemPrompt = `You are Orcasion, a decision-making assistant. Your personality is confident, witty, and a little sarcastic. Your primary goal is to help the user make a decision by guiding them through a context-gathering process.

Follow these steps:
1.  **Analyze the user's request and the entire conversation history.**
2.  **Check for URLs.** If the user provides a URL, use the \`fetch_web_content\` tool to read it. 
    *   **CRITICAL:** If you successfully fetch content, you MUST explicitly mention the product name and price (if available) in your response to prove you read it. e.g., "I see you're looking at the [Product Name] which is currently around [Price]."
    *   Use the fetched information to ask smarter, more specific questions.

3.  **Check the number of user messages.** There are currently ${userMessageCount} user messages.
    *   If there are **fewer than 3 user messages**, you are in "information gathering mode". Your only goal is to understand the user's needs better.
    *   If there are **3 or more user messages**, you may be ready to enter "decision mode".

4.  **Information Gathering Mode (fewer than 3 user messages):**
    *   Your response MUST be to ask a single, targeted clarifying question to get the most critical missing piece of information.
    *   You MUST also provide 2-4 concise, relevant suggested answers for the user to choose from.
    *   **EXCEPTION:** If you just fetched a URL, you can include a brief comment about the product *before* asking your question.
    *   Your response in this case MUST be a JSON object with the following structure:
        {
          "question": "Your clarifying question here? (Optional: Mention the product you just scouted)",
          "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
        }

5.  **Decision Mode (3 or more user messages):**
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

Your primary directive is to avoid premature conclusions. Never give a TED talk; give bold advice. Your main job is to ask questions until you are absolutely sure you can provide a high-quality, well-informed recommendation.`;

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt,
            tools: tools,
        });

        const chat = model.startChat({
            history: messages.map(({ role, content }) => ({
                role: role === "ai" ? "model" : "user",
                parts: [{ text: content }],
            })),
        });

        const lastMessage = messages[messages.length - 1];

        try {
            let result = await chat.sendMessage(lastMessage.content);
            let response = result.response;
            
            // Handle tool calls
            const functionCalls = response.functionCalls();
            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                if (call.name === "fetch_web_content") {
                    const args = call.args as any;
                    const url = args.url as string;
                    console.log(`Fetching content from: ${url}`);
                    
                    let toolResultText = "";
                    try {
                        const fetchResponse = await fetch(url, {
                            headers: {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                            }
                        });
                        const html = await fetchResponse.text();
                        const $ = cheerio.load(html);
                        
                        // Remove scripts, styles, and other non-content elements
                        $('script, style, nav, footer, header, aside').remove();
                        
                        // Extract text and clean it up
                        toolResultText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 20000); // Limit to 20k chars
                    } catch (fetchError: any) {
                        console.error(`Error fetching URL ${url}:`, fetchError);
                        toolResultText = `Error fetching content from ${url}: ${fetchError.message}`;
                    }

                    // Send tool result back to the model
                    result = await chat.sendMessage([
                        {
                            functionResponse: {
                                name: "fetch_web_content",
                                response: { content: toolResultText },
                            },
                        },
                    ]);
                    response = result.response;
                }
            }

            const text = response.text().replace("```json", "").replace("```", "").trim();

            try {
                const parsedResponse = JSON.parse(text);
                return parsedResponse;
            } catch (jsonError) {
                return text;
            }
        } catch (error: any) {
            console.error("Error in getAiResponse action:", error);
            throw new Error(`Failed to get AI response: ${error.message}`);
        }
    },
});

export const summarizeDecisionTitle = action({ 
    args: {
        decisionId: v.id("decisions"),
    },
    handler: async (ctx, args) => {
        const firstUserMessage = (await ctx.runQuery(api.messages.listMessages, {
            decisionId: args.decisionId,
        }))?.find((m) => m.sender === "user");

        if (!firstUserMessage) return;

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

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt,
        });

        try {
            const result = await model.generateContent(firstUserMessage.content);
            const newTitle = result.response.text().trim();

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
        const { decisionId, criteria } = args;

        const messages = await ctx.runQuery(api.messages.listMessages, { decisionId });

        const systemPrompt = `You are Orcasion, a decision-making assistant. The user has updated their criteria. Recalculate the recommendation based on these new criteria and the previous conversation.

Here are the updated criteria:
${JSON.stringify(criteria, null, 2)}

Based on the updated criteria and the previous conversation, output a JSON object with the following structure:
{
  "decision": {
    "finalChoice": "Recommended Option Name",
    "confidenceScore": 0.95,
    "reasoning": "A concise explanation of why this option is recommended."
  },
  "criteria": [...],
  "options": [...]
}`;

        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: systemPrompt,
        });

        const chat = model.startChat({
            history: messages.map(({ sender, content }) => ({
                role: sender === "ai" ? "model" : "user",
                parts: [{ text: content }],
            })),
        });

        try {
            const result = await chat.sendMessage("Recalculate based on the new criteria.");
            const text = result.response.text().replace("```json", "").replace("```", "").trim();
            const parsedResponse = JSON.parse(text);

            if (parsedResponse.decision && parsedResponse.criteria && parsedResponse.options) {
                await ctx.runMutation(api.decision_context.updateDecisionContext, {
                    decisionId,
                    criteria: parsedResponse.criteria,
                    options: parsedResponse.options,
                    finalChoice: parsedResponse.decision.finalChoice,
                    confidenceScore: parsedResponse.decision.confidenceScore,
                    reasoning: parsedResponse.decision.reasoning,
                });
                await ctx.runMutation(api.messages.addMessage, {
                    decisionId,
                    content: "Decision re-evaluated: " + parsedResponse.decision.reasoning.trim(),
                    sender: "ai",
                });
            } else {
                throw new Error("AI did not return a structured decision.");
            }
        } catch (error) {
            console.error("Error during recalculation:", error);
            await ctx.runMutation(api.messages.addMessage, {
                decisionId,
                content: "Sorry, I ran into a problem while recalculating the decision.",
                sender: "ai",
            });
        }
    },
});
