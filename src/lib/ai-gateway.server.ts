export async function callLovableChat(opts: {
  model?: string;
  system?: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: unknown;
  }>;
  temperature?: number;
  response_format?: { type: "json_object" };
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const messages = opts.system
    ? [
        { role: "system", content: opts.system },
        ...opts.messages,
      ]
    : opts.messages;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages,
        temperature: opts.temperature ?? 0.7,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();

  return data.choices[0].message.content;
}