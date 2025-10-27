import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createDecision = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Cannot create decision for unauthenticated user.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
        throw new Error("User not found.");
    }

    const decisionId = await ctx.db.insert("decisions", {
      userId: user._id,
      title: args.title,
      status: "in-progress",
    });

    return decisionId;
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
