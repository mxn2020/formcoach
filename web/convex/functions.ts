import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveAnalysis = mutation({
  args: { exercise: v.string(), description: v.optional(v.string()), overallScore: v.number(), formNotes: v.array(v.object({ area: v.string(), score: v.number(), feedback: v.string(), correction: v.string() })), injuryRisks: v.array(v.string()), tips: v.array(v.string()) },
  handler: async (ctx, args) => await ctx.db.insert("analyses", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("analyses").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
