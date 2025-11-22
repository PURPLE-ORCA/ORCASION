import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new Council session (or return existing one)
export const createSession = mutation({
  args: { decisionId: v.id("decisions") },
  handler: async (ctx, args) => {
    // Check if a session already exists
    const existingSession = await ctx.db
      .query("council_sessions")
      .withIndex("by_token") // We can't query by decisionId directly without an index, but we can scan or add an index.
      // Ideally, we should add an index on decisionId, but for now, let's query by token if we had it, or just scan.
      // Actually, let's just query all and filter since we don't have a by_decisionId index on council_sessions yet.
      // Wait, I should add an index on decisionId to council_sessions in schema.ts for efficiency?
      // For now, let's just use filter.
      .filter((q) => q.eq(q.field("decisionId"), args.decisionId))
      .first();

    if (existingSession) {
      return existingSession.publicToken;
    }

    // Generate a simple random token
    const publicToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    await ctx.db.insert("council_sessions", {
      decisionId: args.decisionId,
      publicToken,
      status: "active",
    });

    return publicToken;
  },
});

// Get public decision data by token
export const getSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("council_sessions")
      .withIndex("by_token", (q) => q.eq("publicToken", args.token))
      .first();

    if (!session || session.status !== "active") {
      return null;
    }

    const decision = await ctx.db.get(session.decisionId);
    if (!decision) return null;

    const context = await ctx.db
      .query("decision_context")
      .withIndex("by_decisionId", (q) => q.eq("decisionId", session.decisionId))
      .first();

    if (!context) return null;

    // Return only safe, public data
    return {
      sessionId: session._id,
      title: decision.title,
      options: context.options,
      reasoning: context.reasoning, // The user's initial context/dilemma
    };
  },
});

// Submit a vote
export const submitVote = mutation({
  args: {
    sessionId: v.id("council_sessions"),
    voterName: v.string(),
    optionName: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("council_votes", {
      sessionId: args.sessionId,
      voterName: args.voterName,
      optionName: args.optionName,
      comment: args.comment,
      timestamp: Date.now(),
    });
  },
});

// Get votes for a decision (for the user's report)
export const getVotes = query({
  args: { decisionId: v.id("decisions") },
  handler: async (ctx, args) => {
    // First find the session
    const session = await ctx.db
      .query("council_sessions")
      .filter((q) => q.eq(q.field("decisionId"), args.decisionId))
      .first();

    if (!session) return [];

    const votes = await ctx.db
      .query("council_votes")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", session._id))
      .collect();

    return votes;
  },
});
