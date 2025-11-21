import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

export const sendChatMessage = action({
  args: {
    decisionId: v.id("decisions"),
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
  },
  handler: async (ctx, args) => {
    // 1. Add the user's message to the database
    await ctx.runMutation(api.messages.addMessage, {
      decisionId: args.decisionId,
      content: args.content,
      sender: "user",
      storageId: args.storageId,
      format: args.format,
      attachments: args.attachments,
    });

    // 2. Get the full message history
    const messages = await ctx.runQuery(api.messages.listMessages, {
      decisionId: args.decisionId,
    });

    const userMessageCount = messages.filter((m) => m.sender === "user").length;

    // 3. Trigger title summarization on the first user message
    if (userMessageCount === 1) {
      await ctx.runAction(api.ai.summarizeDecisionTitle, {
        decisionId: args.decisionId,
      });
    }

    // 4. Get the AI's response
    const aiResponse = await ctx.runAction(api.ai.getAiResponse, {
      messages: messages.map((msg) => ({
        role: msg.sender,
        content: msg.content,
        storageId: msg.storageId,
        format: msg.format,
        attachments: msg.attachments
          ? msg.attachments.map(({ storageId, mimeType, name }) => ({
              storageId,
              mimeType,
              name,
            }))
          : undefined,
      })),
      userMessageCount,
    });

    // 5. Process and save the AI's response
    if (typeof aiResponse === "object" && aiResponse !== null) {
      if ("error" in aiResponse && aiResponse.error === "RATE_LIMIT_EXCEEDED") {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      if ("question" in aiResponse && "suggestions" in aiResponse) {
        await ctx.runMutation(api.messages.addMessage, {
          decisionId: args.decisionId,
          content: (aiResponse as { question: string }).question,
          sender: "ai",
          suggestions: (aiResponse as { suggestions: string[] }).suggestions,
        });
      } else if (
        "decision" in aiResponse &&
        "criteria" in aiResponse &&
        "options" in aiResponse
      ) {
        const decisionResponse = aiResponse as any; // Cast to access properties
        await ctx.runMutation(api.decision_context.updateDecisionContext, {
          decisionId: args.decisionId,
          criteria: decisionResponse.criteria,
          options: decisionResponse.options,
          finalChoice: decisionResponse.decision.finalChoice,
          confidenceScore: decisionResponse.decision.confidenceScore,
          reasoning: decisionResponse.decision.reasoning,
          primaryRisk: decisionResponse.decision.primaryRisk,
          hiddenOpportunity: decisionResponse.decision.hiddenOpportunity,
          modelUsed: "gemini-2.0-flash",
        });
        await ctx.runMutation(api.messages.addMessage, {
          decisionId: args.decisionId,
          content: decisionResponse.decision.reasoning.trim(),
          sender: "ai",
        });
        await ctx.runMutation(api.decisions.updateDecisionStatus, {
          decisionId: args.decisionId,
          status: "completed",
        });
      } else {
        await ctx.runMutation(api.messages.addMessage, {
          decisionId: args.decisionId,
          content: `[DEBUG] Unrecognized object response: ${JSON.stringify(
            aiResponse
          )}`,
          sender: "ai",
        });
      }
    } else if (typeof aiResponse === "string") {
      await ctx.runMutation(api.messages.addMessage, {
        decisionId: args.decisionId,
        content: aiResponse,
        sender: "ai",
      });
    }
  },
});

export const createDecision = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called createDecision without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
      throw new Error("User not found");
    }

    const decisionId = await ctx.db.insert("decisions", {
      userId: user._id,
      title: args.title,
      status: "in-progress",
    });

    return decisionId;
  },
});

export const getDecision = query({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.decisionId);
  },
});

export const getDecisions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
      return [];
    }

    return await ctx.db
      .query("decisions")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();
  },
});

export const updateDecisionTitle = mutation({
  args: {
    decisionId: v.id("decisions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.decisionId, { title: args.title });
  },
});

export const updateDecisionStatus = mutation({
  args: {
    decisionId: v.id("decisions"),
    status: v.union(v.literal("in-progress"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.decisionId, { status: args.status });
  },
});

export const deleteDecision = mutation({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const decision = await ctx.db.get(args.decisionId);
    if (!decision) {
      throw new Error("Decision not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || decision.userId !== user._id) {
      throw new Error("You are not authorized to delete this decision");
    }

    // Delete associated messages
    const messages = await ctx.db
      .query("decision_messages")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete associated context
    const contexts = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .collect();
    for (const context of contexts) {
      await ctx.db.delete(context._id);
    }

    // Delete the decision
    await ctx.db.delete(args.decisionId);

    return { success: true };
  },
});

export const saveSimulation = mutation({
  args: {
    decisionId: v.id("decisions"),
    simulation: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const decisionContext = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .unique();

    if (decisionContext) {
      await ctx.db.patch(decisionContext._id, { simulation: args.simulation });
    }
  },
});
