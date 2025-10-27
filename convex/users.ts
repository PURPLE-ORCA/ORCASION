import { mutation } from "./_generated/server";

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
      .withIndex("by_clerk_id", (q) =>
        q.eq("clerkId", identity.subject)
      )
      .unique();

    if (user !== null) {
      // If we've seen this user before, do nothing.
      return;
    }

    // If it's a new user, create a new record.
    await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name!,
    });
  },
});
