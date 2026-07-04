import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callLovableChat } from "./ai-gateway.server";

/* ---------- Disease detection from an uploaded crop image ---------- */

export const analyzeCropImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const d = input as { imageUrl?: string; imageBase64?: string; crop?: string };
    if (!d.imageUrl && !d.imageBase64) throw new Error("An image is required");
    return d;
  })
  .handler(async ({ data, context }) => {
    const url = data.imageUrl ?? `data:image/jpeg;base64,${data.imageBase64}`;
    const system = `You are KrishiAI, an expert agricultural plant pathologist for Indian farmers.
Analyze the crop leaf/plant image and reply with STRICT JSON matching this schema:
{
  "disease": string,                 // short name of disease or "Healthy"
  "crop": string,                    // detected crop
  "confidence": number,              // 0-100
  "health_score": number,            // 0-100 (100 = perfect health)
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "symptoms": string,                // 2-3 sentences describing visible symptoms
  "treatment": string,               // step-by-step treatment plan
  "medicine": string,                // chemical medicines with dosage
  "organic": string,                 // organic / home remedies
  "recovery": string                 // expected recovery timeline
}
No prose outside JSON. If plant appears healthy, still fill every field (medicine="Not required" etc.).`;

    const content = await callLovableChat({
      model: "google/gemini-3-flash-preview",
      system,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this crop image${data.crop ? ` (crop hint: ${data.crop})` : ""}.`,
            },
            { type: "image_url", image_url: { url } },
          ],
        },
      ],
    });

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    // Persist the report
    const { data: inserted, error } = await context.supabase
      .from("disease_reports")
      .insert({
        user_id: context.userId,
        image_url: data.imageUrl ?? null,
        disease: String(parsed.disease ?? "Unknown"),
        confidence: Math.round(Number(parsed.confidence ?? 0)),
        health_score: Math.round(Number(parsed.health_score ?? 0)),
        severity: String(parsed.severity ?? "Mild"),
        symptoms: String(parsed.symptoms ?? ""),
        treatment: String(parsed.treatment ?? ""),
        medicine: String(parsed.medicine ?? ""),
        organic: String(parsed.organic ?? ""),
        recovery: String(parsed.recovery ?? ""),
        crop: String(parsed.crop ?? data.crop ?? ""),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

/* ---------- AI Farmer Chat ---------- */

export const sendChatMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const d = input as { message?: string; language?: string };
    if (!d.message?.trim()) throw new Error("Message required");
    return { message: d.message.trim().slice(0, 2000), language: d.language ?? "English" };
  })
  .handler(async ({ data, context }) => {
    // Load recent history for context
    const { data: history } = await context.supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(20);

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("name, village, state, crop, farm_size")
      .eq("id", context.userId)
      .single();

    const system = `You are KrishiAI, a warm, practical AI farming advisor for Indian farmers.
${profile ? `Farmer profile: ${JSON.stringify(profile)}.` : ""}
Reply in ${data.language}. Be concise, use bullet points and simple language.
Cover: cause, immediate action, medicine/organic solutions, and prevention.
If asked about weather, price, or scheme, give general guidance and suggest checking the app modules.`;

    // Insert user message
    await context.supabase.from("chat_messages").insert({
      user_id: context.userId,
      role: "user",
      content: data.message,
    });

    const messages = [
      ...(history ?? []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: data.message },
    ];

    const reply = await callLovableChat({ system, messages });

    await context.supabase.from("chat_messages").insert({
      user_id: context.userId,
      role: "assistant",
      content: reply,
    });

    return { reply };
  });

export const getChatHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const clearChatHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.from("chat_messages").delete().eq("user_id", context.userId);
    return { ok: true };
  });

/* ---------- Yield prediction ---------- */

export const predictYield = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => input as Record<string, string | number>)
  .handler(async ({ data }) => {
    const system = `You are an agricultural yield prediction model. Reply STRICTLY as JSON:
{
  "expected_yield_tons": number,     // total expected yield in tons
  "yield_per_acre": number,          // tons/acre
  "confidence": number,              // 0-100
  "profit_estimate_inr": number,     // estimated net profit in INR
  "risk_factors": string[],          // top 3 risks
  "recommendations": string[],       // top 3 actionable tips
  "trend": [{"month": string, "growth": number}]  // 6 monthly growth % values 0-100
}`;
    const content = await callLovableChat({
      system,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: `Predict yield for: ${JSON.stringify(data)}` }],
    });
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      return m ? JSON.parse(m[0]) : {};
    }
  });

/* ---------- Fertilizer planner ---------- */

export const planFertilizer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => input as Record<string, string | number>)
  .handler(async ({ data }) => {
    const system = `You are an agronomy expert. Reply STRICTLY as JSON:
{
  "npk_ratio": string,              // e.g. "20-20-0"
  "primary_fertilizer": string,
  "quantity_kg_per_acre": number,
  "schedule": [{"week": string, "action": string, "quantity": string}],
  "organic_alternative": string,
  "cost_estimate_inr": number,
  "tips": string[]
}`;
    const content = await callLovableChat({
      system,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: `Create a fertilizer plan for: ${JSON.stringify(data)}` }],
    });
    try {
      return JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      return m ? JSON.parse(m[0]) : {};
    }
  });

/* ---------- Weather tip (AI recommendation from mock weather data) ---------- */

export const weatherTip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => input as { location?: string; crop?: string })
  .handler(async ({ data }) => {
    const content = await callLovableChat({
      system:
        "You are KrishiAI. Give ONE short (max 25 words) farming tip for today based on the input. Plain text only.",
      messages: [
        {
          role: "user",
          content: `Location: ${data.location ?? "India"}. Crop: ${data.crop ?? "general"}. Weather: 28°C, 68% humidity, rain likely tomorrow.`,
        },
      ],
    });
    return { tip: content.trim() };
  });
