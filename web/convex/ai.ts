import { action } from "./_generated/server";
import { v } from "convex/values";
export const analyzeForm = action({
    args: { exercise: v.string(), description: v.optional(v.string()), imageBase64: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const userContent: any[] = [{
            type: "text", text: `Analyze the form for: ${args.exercise}${args.description ? `. Details: ${args.description}` : ''}. Output JSON:
{"overallScore":<1-10>,"formNotes":[{"area":"<body part/movement>","score":<1-10>,"feedback":"<what's happening>","correction":"<how to fix>"}],"injuryRisks":[""],"tips":[""]}` }];
        if (args.imageBase64) userContent.push({ type: "image_url", image_url: { url: args.imageBase64 } });
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    { role: "system", content: "You are FormCoach, a certified personal trainer and biomechanics expert. Analyze exercise form with detailed feedback on each body area. Be specific about corrections. Output valid JSON only." },
                    { role: "user", content: userContent },
                ], temperature: 0.4, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
