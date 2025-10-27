import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
  args: {
    decisionId: v.id("decisions"),
    content: v.string(),
    sender: v.union(v.literal("user"), v.literal("ai")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Cannot add message for unauthenticated user.");
    }

    const messageId = await ctx.db.insert("decision_messages", {
      decisionId: args.decisionId,
      content: args.content,
      sender: args.sender,
    });

    return messageId;
  },
});

export const listMessages = query({
  args: {
    decisionId: v.id("decisions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return [];
    }

    return await ctx.db
      .query("decision_messages")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .collect();
  },
});
