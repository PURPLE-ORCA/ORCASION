import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
  args: {
    decisionId: v.id("decisions"),
    content: v.string(),
    sender: v.union(v.literal("user"), v.literal("ai")),
    suggestions: v.optional(v.array(v.string())),
    storageId: v.optional(v.id("_storage")),
    format: v.optional(v.string()),
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
      suggestions: args.suggestions,
      storageId: args.storageId,
      format: args.format,
    });

    return messageId;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
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

    const messages = await ctx.db
      .query("decision_messages")
      .filter((q) => q.eq(q.field("decisionId"), args.decisionId))
      .collect();

    return await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        imageUrl: msg.storageId
          ? await ctx.storage.getUrl(msg.storageId)
          : undefined,
      }))
    );
  },
});
