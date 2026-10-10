import "server-only";

/* OpenAI chat completions over plain HTTPS (same provider and model family as
   the website). Everything is OFF unless AI_ENABLED is exactly "true" — the
   same kill switch as ringloop.net, so nobody can spend tokens by accident.
   OPENAI_BASE_URL lets local development point at a mock server. */

export const aiEnabled = () => process.env.AI_ENABLED === "true" && !!process.env.OPENAI_API_KEY;

export type AiMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

export type ToolCall = { id: string; type: "function"; function: { name: string; arguments: string } };

export type ToolSpec = {
  type: "function";
  function: { name: string; description: string; parameters: Record<string, unknown> };
};

export async function chatCompletion(messages: AiMessage[], tools: ToolSpec[]) {
  if (!aiEnabled()) throw new Error("AI is switched off");
  const base = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages,
      tools,
      temperature: 0.3,
      max_tokens: 300,
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = (await res.json()) as {
    choices: { message: { content: string | null; tool_calls?: ToolCall[] } }[];
  };
  return data.choices[0].message;
}
