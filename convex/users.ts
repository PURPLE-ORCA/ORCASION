import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this user.
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // If we've seen this user before, return their ID.
      return user._id;
    }

    // If it's a new user, create a new record and return its ID.
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name!,
    });
    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called ensureUser without authentication present");
    }

    // Check if we've already stored this user.
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user === null) {
      // If it's a new user, create a new record.
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        name: identity.name!,
      });
      user = await ctx.db.get(userId);
    }

    // Check if the user has any decisions.
    const decisions = await ctx.db
      .query("decisions")
      .filter((q) => q.eq(q.field("userId"), user!._id))
      .collect();

    if (decisions.length === 0) {
      // If the user has no decisions, create one.
      await ctx.db.insert("decisions", {
        userId: user!._id,
        title: "Untitled Decision",
        status: "in-progress",
      });
    }

    return user;
  },
});

