import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/dal";
import { linkGoogle } from "@/lib/google-calendar";

/* Google sends the owner back here after they allow calendar access. */
export async function GET(req: Request) {
  const { business } = await requireBusiness({ allowSetup: true });
  const url = new URL(req.url);
  const jar = await cookies();
  const expected = jar.get("rl_g_state")?.value ?? "";
  const back = jar.get("rl_g_back")?.value ?? "/settings?s=connections";
  jar.delete("rl_g_state");
  jar.delete("rl_g_back");

  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code");
  const same = state.length === expected.length && expected.length > 0 && timingSafeEqual(Buffer.from(state), Buffer.from(expected));
  if (!same || !code) redirect(`${back}${back.includes("?") ? "&" : "?"}google=failed`);

  try {
    await linkGoogle(business.id, code);
  } catch (err) {
    console.error("[google] linking failed:", err instanceof Error ? err.message : err);
    redirect(`${back}${back.includes("?") ? "&" : "?"}google=failed`);
  }
  redirect(`${back}${back.includes("?") ? "&" : "?"}google=connected`);
}
