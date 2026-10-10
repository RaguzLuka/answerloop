import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, textbackLinks } from "@/lib/db";
import Forward from "./Forward";

export const metadata = { robots: { index: false, follow: false } };

export default async function TrackedLink({ params }: PageProps<"/r/[token]">) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(token)) notFound();
  const [link] = await db.select().from(textbackLinks).where(eq(textbackLinks.token, token)).limit(1);
  if (!link) notFound();
  return <Forward token={token} target={link.target} />;
}
