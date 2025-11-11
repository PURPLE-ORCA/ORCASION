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

export const startDecision = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called startDecision without authentication present");
    }

    // Find user or create a new one
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        name: identity.name!,
      });
      user = (await ctx.db.get(userId))!;
    }

    // Create a new decision for the user
    const decisionId = await ctx.db.insert("decisions", {
      userId: user._id,
      title: "Untitled Decision",
      status: "in-progress",
    });

    return decisionId;
  },
});