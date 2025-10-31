import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addDecisionContext = mutation({
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
    finalChoice: v.string(),
    confidenceScore: v.float64(),
    reasoning: v.string(),
    modelUsed: v.union(v.literal("deepseek-v3.1"), v.literal("qwen3")),
  },
  handler: async (ctx, args) => {
    const { decisionId, criteria, options, finalChoice, confidenceScore, reasoning, modelUsed } = args;

    await ctx.db.insert("decision_context", {
      decisionId,
      criteria,
      options,
      finalChoice,
      confidenceScore,
      reasoning,
      modelUsed,
    });

    // Update the decision status to 'completed' and set the final choice and confidence score
    await ctx.db.patch(decisionId, {
      status: "completed",
      finalChoice,
      confidenceScore,
    });
  },
});

export const getDecisionContext = query({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("decision_context")
      .filter((q) => q.eq(q.field("decisionId"), args.decisionId))
      .first();
  },
});
