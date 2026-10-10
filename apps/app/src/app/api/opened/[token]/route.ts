import { and, eq, isNull } from "drizzle-orm";
import { db, chats, textbackLinks } from "@/lib/db";

export async function POST(_: Request, ctx: RouteContext<"/api/opened/[token]">) {
  const { token } = await ctx.params;
  if (!/^[A-Za-z0-9_-]{6,40}$/.test(token)) return new Response(null, { status: 204 });
  const now = Date.now();
  await db.update(chats).set({ openedAt: now }).where(and(eq(chats.token, token), isNull(chats.openedAt)));
  await db.update(textbackLinks).set({ openedAt: now }).where(and(eq(textbackLinks.token, token), isNull(textbackLinks.openedAt)));
  return new Response(null, { status: 204 });
}
