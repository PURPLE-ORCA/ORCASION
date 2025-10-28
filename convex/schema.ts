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
    status: v.union(v.literal("in-progress"), v.literal("completed")),
    finalChoice: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  decision_messages: defineTable({
    decisionId: v.id("decisions"),
    sender: v.union(v.literal("user"), v.literal("ai")),
    content: v.string(),
  }).index("by_decisionId", ["decisionId"]),

  decision_context: defineTable({
    decisionId: v.id("decisions"),
    criteria: v.array(
      v.object({
        name: v.string(),
        weight: v.number(),
      })
    ),
    options: v.array(
      v.object({
        name: v.string(),
        pros: v.array(v.string()),
        cons: v.array(v.string()),
        score: v.number(),
      })
    ),
    modelUsed: v.optional(v.union(v.literal("deepseek-v3.1"), v.literal("qwen3"))),
  }),
});
