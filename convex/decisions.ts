import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    const context = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", args.decisionId))
      .unique();
    if (context) {
      await ctx.db.delete(context._id);
    }

    // Delete the decision
    await ctx.db.delete(args.decisionId);

    return { success: true };
  },
});