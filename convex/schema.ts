import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  decisions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    status: v.union(
      v.literal("in-progress"),
      v.literal("completed"),
      v.literal("gathering-context")
    ),
    finalChoice: v.optional(v.string()),
    confidenceScore: v.optional(v.float64()),
  }).index("by_userId", ["userId"]),

  decision_messages: defineTable({
    decisionId: v.id("decisions"),
    sender: v.union(v.literal("user"), v.literal("ai")),
    content: v.string(),
    suggestions: v.optional(v.array(v.string())),
    storageId: v.optional(v.id("_storage")), // Deprecated: use attachments
    format: v.optional(v.string()), // Deprecated: use attachments
    attachments: v.optional(
      v.array(
        v.object({
          storageId: v.id("_storage"),
          mimeType: v.string(),
          name: v.optional(v.string()),
        })
      )
    ),
  }).index("by_decisionId", ["decisionId"]),

  decision_context: defineTable({
    decisionId: v.id("decisions"),
    criteria: v.array(
      v.object({
        name: v.string(),
        weight: v.float64(),
      })
    ),
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
    primaryRisk: v.optional(v.string()),
    hiddenOpportunity: v.optional(v.string()),
    actionPlan: v.optional(v.array(v.string())),
    modelUsed: v.optional(
      v.union(v.literal("gemini-2.0-flash"), v.literal("gemini-2.5-flash"))
    ),
    simulation: v.optional(v.string()),
    devilsAdvocate: v.optional(v.string()),
    commitmentContract: v.optional(v.string()),
    isSigned: v.optional(v.boolean()),
    redditScout: v.optional(
      v.object({
        consensus: v.string(),
        topComment: v.string(),
        url: v.string(),
      })
    ),
  }).index("by_decisionId", ["decisionId"]),

  council_sessions: defineTable({
    decisionId: v.id("decisions"),
    publicToken: v.string(),
    status: v.string(), // "active", "closed"
  }).index("by_token", ["publicToken"]),

  council_votes: defineTable({
    sessionId: v.id("council_sessions"),
    voterName: v.string(),
    optionName: v.string(),
    comment: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_sessionId", ["sessionId"]),
});
