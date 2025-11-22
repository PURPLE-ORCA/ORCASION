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
    attachments: v.optional(
      v.array(
        v.object({
          storageId: v.id("_storage"),
          mimeType: v.string(),
          name: v.optional(v.string()),
        })
      )
    ),
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
      attachments: args.attachments,
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
      messages.map(async (msg) => {
        const imageUrl = msg.storageId
          ? await ctx.storage.getUrl(msg.storageId)
          : undefined;

        const attachments = msg.attachments
          ? await Promise.all(
              msg.attachments.map(async (att) => ({
                ...att,
                url: await ctx.storage.getUrl(att.storageId),
              }))
            )
          : undefined;

        return {
          ...msg,
          imageUrl,
          attachments,
        };
      })
    );
  },
});
