import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { conciergePrompt } from "../src/lib/prompts/concierge";

export const getDecisionContext = query({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    const decisionContext = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .first();

    return decisionContext;
  },
});

export const generateActionPlan = action({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    const decisionContext = await ctx.runQuery(api.decision_context.getDecisionContext, {
      decisionId: args.decisionId,
    });

    if (!decisionContext || !decisionContext.finalChoice || !decisionContext.reasoning) {
      throw new Error("Decision context, final choice, or reasoning not found.");
    }

    const prompt = conciergePrompt
      .replace("{finalChoice}", decisionContext.finalChoice)
      .replace("{reasoning}", decisionContext.reasoning);

    const aiResponse = await ctx.runAction(api.ai.getAiResponse, {
      messages: [{ role: "user", content: prompt }],
      userMessageCount: 1, // This is a single-turn interaction for the action plan
    });

    if (!aiResponse || typeof aiResponse !== "object" || !("actionPlan" in aiResponse)) {
      throw new Error("Invalid AI response for action plan generation.");
    }

    const { actionPlan } = aiResponse as { actionPlan: string[] };

    await ctx.runMutation(api.decision_context.updateActionPlan, {
      decisionId: args.decisionId,
      actionPlan,
    });

    return actionPlan;
  },
});

export const updateActionPlan = mutation({
  args: {
    decisionId: v.id("decisions"),
    actionPlan: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const decisionContext = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .first();

    if (!decisionContext) {
      throw new Error("Decision context not found.");
    }

    await ctx.db.patch(decisionContext._id, {
      actionPlan: args.actionPlan,
    });
  },
});

export const updateDecisionContext = mutation({
  args: {
    decisionId: v.id("decisions"),
    criteria: v.array(v.object({ name: v.string(), weight: v.float64() })),
    options: v.array(
      v.object({
        name: v.string(),
        pros: v.array(v.string()),
        cons: v.array(v.string()),
        score: v.float64(),
      })
    ),
    reasoning: v.string(),
    finalChoice: v.string(),
    confidenceScore: v.float64(),
    modelUsed: v.optional(v.literal("gemini-2.5-pro")),
  },
  handler: async (ctx, args) => {
    const decisionContext = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .first();

    if (!decisionContext) {
      await ctx.db.insert("decision_context", {
        decisionId: args.decisionId,
        criteria: args.criteria,
        options: args.options,
        reasoning: args.reasoning,
        finalChoice: args.finalChoice,
        confidenceScore: args.confidenceScore,
        modelUsed: args.modelUsed,
      });
    } else {
      await ctx.db.patch(decisionContext._id, {
        criteria: args.criteria,
        options: args.options,
        reasoning: args.reasoning,
        finalChoice: args.finalChoice,
        confidenceScore: args.confidenceScore,
        modelUsed: args.modelUsed,
      });
    }
  },
});
