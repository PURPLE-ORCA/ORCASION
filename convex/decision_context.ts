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

import { GoogleGenerativeAI } from "@google/generative-ai";

const ACTION_PLAN_MODEL_NAME = "gemini-2.5-flash";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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

    const systemPrompt = conciergePrompt
      .replace("{finalChoice}", decisionContext.finalChoice)
      .replace("{reasoning}", decisionContext.reasoning);

    const model = genAI.getGenerativeModel({
      model: ACTION_PLAN_MODEL_NAME,
      systemInstruction: systemPrompt,
    });

    try {
      const result = await model.generateContent("Generate the action plan now.");
      const text = result.response.text().replace("```json", "").replace("```", "").trim();
      const parsedResponse = JSON.parse(text);
      
      if (!parsedResponse || typeof parsedResponse !== "object" || !("actionPlan" in parsedResponse)) {
        throw new Error("Invalid AI response for action plan generation.");
      }

      const { actionPlan } = parsedResponse as { actionPlan: string[] };

      await ctx.runMutation(api.decision_context.updateActionPlan, {
        decisionId: args.decisionId,
        actionPlan,
      });

      return actionPlan;
    } catch (error: any) {
      console.error("Error generating action plan:", error);
      throw new Error(`Failed to generate action plan: ${error.message}`);
    }
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
    modelUsed: v.optional(
      v.union(
        v.literal("gemini-2.0-flash"),
        v.literal("gemini-2.5-flash")
      )
    ),
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
