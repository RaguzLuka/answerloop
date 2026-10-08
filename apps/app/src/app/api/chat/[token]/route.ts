import { NextResponse } from "next/server";
import { replyToChat } from "@/lib/chat";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/* Public: one customer message in, Halo's reply out. The token in the URL is
   the only key — it's 72 random bits, sent only to the caller's phone. */
export async function POST(req: Request, ctx: RouteContext<"/api/chat/[token]">) {
  const { token } = await ctx.params;
  if (!/^[A-Za-z0-9_-]{8,40}$/.test(token)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const ip = await clientIp();
  const ok = (await rateLimit(`chat:ip:${ip}`, 60, 10 * 60)) && (await rateLimit(`chat:token:${token}`, 12, 60));
  if (!ok) return NextResponse.json({ error: "slow_down" }, { status: 429 });

  const body = (await req.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text : "";
  const reply = await replyToChat(token, text);
  if ("error" in reply) {
    return NextResponse.json(reply, { status: reply.error === "not_found" ? 404 : 400 });
  }
  return NextResponse.json(reply, { headers: { "Cache-Control": "no-store" } });
}
