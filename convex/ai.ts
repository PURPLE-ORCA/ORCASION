import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getAiResponse = action({
    args: {
        decisionId: v.id("decisions"),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        // Here you would make a call to your AI model
        // For now, we'll just simulate a response
        const aiResponse = `This is a simulated AI response to: "${args.message}"`;

        await ctx.runMutation(api.messages.addMessage, {
            decisionId: args.decisionId,
            content: aiResponse,
            sender: "ai",
        });
    },
});
