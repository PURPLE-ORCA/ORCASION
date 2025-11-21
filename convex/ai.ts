import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import {
  GoogleGenerativeAI,
  SchemaType,
  type Tool,
} from "@google/generative-ai";
import * as cheerio from "cheerio";

const MODEL_NAME = "gemini-2.0-flash";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "fetch_web_content",
        description:
          "Fetches and extracts the main text content from a given URL. Use this to read product pages, articles, or other web content provided by the user.",
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
    messages: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
        storageId: v.optional(v.id("_storage")),
        format: v.optional(v.string()),
        attachments: v.optional(
          v.array(
            v.object({
              storageId: v.id("_storage"),
              mimeType: v.string(),
              name: v.optional(v.string()),
            })
          )
        ),
      })
    ),
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
            "reasoning": "A concise explanation of why this option is recommended.",
            "primaryRisk": "The single biggest downside or risk of this choice.",
            "hiddenOpportunity": "A less obvious benefit or second-order positive consequence."
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

    const history = await Promise.all(
      messages.map(
        async ({ role, content, storageId, format, attachments }) => {
          const parts: any[] = [{ text: content }];

          // Handle legacy single attachment
          if (storageId && format) {
            const url = await ctx.storage.getUrl(storageId);
            if (url) {
              const response = await fetch(url);
              const buffer = await response.arrayBuffer();
              let binary = "";
              const bytes = new Uint8Array(buffer);
              const len = bytes.byteLength;
              for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              parts.push({
                inlineData: {
                  data: base64,
                  mimeType: format,
                },
              });
            }
          }

          // Handle new multiple attachments
          if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
              const url = await ctx.storage.getUrl(attachment.storageId);
              if (url) {
                const response = await fetch(url);
                const buffer = await response.arrayBuffer();
                let binary = "";
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                  binary += String.fromCharCode(bytes[i]);
                }
                const base64 = btoa(binary);
                parts.push({
                  inlineData: {
                    data: base64,
                    mimeType: attachment.mimeType,
                  },
                });
              }
            }
          }

          return {
            role: role === "ai" ? "model" : "user",
            parts: parts,
          };
        }
      )
    );

    const chat = model.startChat({
      history: history,
    });

    const lastMessage = messages[messages.length - 1];

    try {
      let result = await chat.sendMessage(lastMessage.content);
      let response = result.response;

      // Handle tool calls
      const functionCalls = response.functionCalls
        ? response.functionCalls() || []
        : [];
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
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              },
            });
            const html = await fetchResponse.text();
            const $ = cheerio.load(html);

            // Remove scripts, styles, and other non-content elements
            $("script, style, nav, footer, header, aside").remove();

            // Extract text and clean it up
            toolResultText = $("body")
              .text()
              .replace(/\s+/g, " ")
              .trim()
              .substring(0, 20000); // Limit to 20k chars
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

      const text = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        // Try parsing the whole text first
        const parsedResponse = JSON.parse(text);
        return parsedResponse;
      } catch (jsonError) {
        console.log("JSON parse failed, trying to extract JSON from text");
        // If that fails, try to find the JSON object within the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const jsonText = jsonMatch[0];
            const parsedResponse = JSON.parse(jsonText);

            // Get the text before the JSON
            const preText = text.substring(0, jsonMatch.index).trim();

            if (preText) {
              // If there's text before the JSON, prepend it to the question or reasoning
              if (parsedResponse.question) {
                parsedResponse.question = `${preText}\n\n${parsedResponse.question}`;
              } else if (
                parsedResponse.decision &&
                parsedResponse.decision.reasoning
              ) {
                parsedResponse.decision.reasoning = `${preText}\n\n${parsedResponse.decision.reasoning}`;
              }
            }

            return parsedResponse;
          } catch (extractError) {
            console.error("Failed to parse extracted JSON:", extractError);
            return text;
          }
        }
        return text;
      }
    } catch (error: any) {
      console.error("Error in getAiResponse action:", error);
      if (error.message.includes("429") || error.message.includes("quota")) {
        return { error: "RATE_LIMIT_EXCEEDED" };
      }
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  },
});

export const summarizeDecisionTitle = action({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    const firstUserMessage = (
      await ctx.runQuery(api.messages.listMessages, {
        decisionId: args.decisionId,
      })
    )?.find((m) => m.sender === "user");

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

    const messages = await ctx.runQuery(api.messages.listMessages, {
      decisionId,
    });

    const systemPrompt = `You are Orcasion, a decision-making assistant. The user has updated their criteria. Recalculate the recommendation based on these new criteria and the previous conversation.

Here are the updated criteria:
${JSON.stringify(criteria, null, 2)}

Based on the updated criteria and the previous conversation, output a JSON object with the following structure:
{
  "decision": {
    "finalChoice": "Recommended Option Name",
    "confidenceScore": 0.95,
    "reasoning": "A concise explanation of why this option is recommended.",
    "primaryRisk": "The single biggest downside or risk of this choice.",
    "hiddenOpportunity": "A less obvious benefit or second-order positive consequence."
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
      const result = await chat.sendMessage(
        "Recalculate based on the new criteria."
      );
      const text = result.response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const parsedResponse = JSON.parse(text);

      if (
        parsedResponse.decision &&
        parsedResponse.criteria &&
        parsedResponse.options
      ) {
        await ctx.runMutation(api.decision_context.updateDecisionContext, {
          decisionId,
          criteria: parsedResponse.criteria,
          options: parsedResponse.options,
          finalChoice: parsedResponse.decision.finalChoice,
          confidenceScore: parsedResponse.decision.confidenceScore,
          reasoning: parsedResponse.decision.reasoning,
          primaryRisk: parsedResponse.decision.primaryRisk,
          hiddenOpportunity: parsedResponse.decision.hiddenOpportunity,
        });
        await ctx.runMutation(api.messages.addMessage, {
          decisionId,
          content:
            "Decision re-evaluated: " +
            parsedResponse.decision.reasoning.trim(),
          sender: "ai",
        });
      } else {
        throw new Error("AI did not return a structured decision.");
      }
    } catch (error) {
      console.error("Error during recalculation:", error);
      await ctx.runMutation(api.messages.addMessage, {
        decisionId,
        content:
          "Sorry, I ran into a problem while recalculating the decision.",
        sender: "ai",
      });
    }
  },
});

export const generateSimulation = action({
  args: {
    decisionId: v.id("decisions"),
    decisionContext: v.object({
      finalChoice: v.string(),
      reasoning: v.string(),
      options: v.array(
        v.object({
          name: v.string(),
          pros: v.array(v.string()),
          cons: v.array(v.string()),
          score: v.float64(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { decisionContext } = args;
    const { finalChoice, reasoning, options } = decisionContext;

    // Find the selected option details
    const selectedOption = options.find((o) => o.name === finalChoice);
    const pros = selectedOption ? selectedOption.pros.join(", ") : "";
    const cons = selectedOption ? selectedOption.cons.join(", ") : "";

    const systemPrompt = `You are a futuristic simulator. Your job is to transport the user 6 months into the future.
    
    The user has just made a decision: "${finalChoice}".
    Reasoning: ${reasoning}
    Pros: ${pros}
    Cons: ${cons}

    Write a vivid, second-person narrative ("You wake up...") describing a specific day in their life 6 months from now.
    
    Guidelines:
    1.  **Be Visceral:** Focus on sensory details—what they see, feel, and hear.
    2.  **Be Balanced:** Show both the benefits (the "Pros" coming true) and the subtle costs or annoyances (the "Cons" manifesting).
    3.  **No Fluff:** Do not summarize the decision. Start directly with the scene.
    4.  **Length:** Keep it under 300 words.
    5.  **Tone:** Immersive, slightly cinematic, but grounded in reality.

    Output ONLY the markdown text of the narrative.`;

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
    });

    try {
      const result = await model.generateContent(
        `Simulate the future for the choice: ${finalChoice}`
      );
      const simulationText = result.response.text().trim();

      if (simulationText) {
        await ctx.runMutation(api.decisions.saveSimulation, {
          decisionId: args.decisionId,
          simulation: simulationText,
        });
        return simulationText;
      }
    } catch (error) {
      console.error("Error generating simulation:", error);
      throw new Error("Failed to generate simulation");
    }
  },
});

export const generateDevilsAdvocate = action({
  args: {
    decisionId: v.id("decisions"),
    decisionContext: v.object({
      finalChoice: v.string(),
      reasoning: v.string(),
      options: v.array(
        v.object({
          name: v.string(),
          pros: v.array(v.string()),
          cons: v.array(v.string()),
          score: v.float64(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const { decisionContext } = args;
    const { finalChoice, reasoning, options } = decisionContext;

    const selectedOption = options.find((o) => o.name === finalChoice);
    const pros = selectedOption ? selectedOption.pros.join(", ") : "";
    const cons = selectedOption ? selectedOption.cons.join(", ") : "";

    const systemPrompt = `You are The Skeptic, a professional Devil's Advocate. Your job is to challenge the user's decision to ensure they aren't falling for confirmation bias.

    The user has decided: "${finalChoice}".
    Their Reasoning: ${reasoning}
    Pros: ${pros}
    Cons: ${cons}

    Write a concise, punchy counter-argument (max 150 words).
    - Don't be rude, but be sharp and critical.
    - Point out what they might be missing.
    - Highlight why the "Cons" might be worse than they think.
    - Ask a hard question at the end.

    Output ONLY the markdown text of the argument.`;

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
    });

    try {
      const result = await model.generateContent(
        `Challenge my decision to choose: ${finalChoice}`
      );
      const devilsAdvocateText = result.response.text().trim();

      if (devilsAdvocateText) {
        await ctx.runMutation(api.decisions.saveDevilsAdvocate, {
          decisionId: args.decisionId,
          devilsAdvocate: devilsAdvocateText,
        });
        return devilsAdvocateText;
      }
    } catch (error) {
      console.error("Error generating devil's advocate:", error);
      throw new Error("Failed to generate devil's advocate argument");
    }
  },
});

export const generateCommitmentContract = action({
  args: {
    decisionId: v.id("decisions"),
    decisionContext: v.object({
      finalChoice: v.string(),
      reasoning: v.string(),
      userName: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const model = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    ).getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const systemPrompt = `You are a lawyer who writes humorous but binding commitment contracts.
    The user has made a decision and needs to "seal the deal" with themselves.
    
    User Name: ${args.decisionContext.userName}
    Decision: ${args.decisionContext.finalChoice}
    Reasoning: ${args.decisionContext.reasoning}

    Write a contract in Markdown format with the following sections:
    1.  **Title:** "The Solemn Accord of [User Name]"
    2.  **Whereas Clauses:** 2-3 humorous "Whereas" clauses setting the context of the decision.
    3.  **The Commitment:** A clear statement of what the user is committing to do.
    4.  **The Terms:** 3-4 bullet points of specific behaviors or actions they promise to take to support this decision.
    5.  **The Penalty:** A humorous but slightly stinging penalty if they break this contract (e.g., "Must listen to polka for 2 hours", "Must admit they were wrong to a smug friend").
    6.  **Signature Line:** A place for them to sign (just text like "Signed: ____________________").

    Tone: Official, legalistic, but funny and slightly dramatic.
    Output ONLY the markdown text of the contract.`;

    const result = await model.generateContent(systemPrompt);
    const contractText = result.response.text().trim();

    if (contractText) {
      await ctx.runMutation(api.decisions.saveCommitmentContract, {
        decisionId: args.decisionId,
        commitmentContract: contractText,
      });
      return contractText;
    }
  },
});
