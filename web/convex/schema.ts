import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  analyses: defineTable({
    exercise: v.string(), description: v.optional(v.string()),
    overallScore: v.number(), formNotes: v.array(v.object({ area: v.string(), score: v.number(), feedback: v.string(), correction: v.string() })),
    injuryRisks: v.array(v.string()), tips: v.array(v.string()), createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
