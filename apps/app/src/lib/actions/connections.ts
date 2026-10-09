"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db, businesses } from "@/lib/db";
import { requireBusiness } from "@/lib/dal";
import { unlinkGoogle } from "@/lib/google-calendar";
import { seal } from "@/lib/secret-box";
import { waCreateTemplates } from "@/lib/whatsapp";
import { normalizePhone } from "@/lib/phone";

/* Things the owner connects themselves: WhatsApp (Meta Embedded Signup),
   Google Calendar, and the calendar subscription link. */

const dryRun = () => process.env.WHATSAPP_DRY_RUN === "true" && process.env.NODE_ENV !== "production";
const graph = (path: string) => `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0"}/${path}`;

export type SignupResult = { ok: true; message: string } | { ok: false; error: string };

/** Finishes Meta's "Connect WhatsApp" window: swaps the one-time code for the shop's
 *  token, subscribes our webhook, registers a new number, and submits the templates. */
export async function completeWhatsAppSignup(input: {
  code: string;
  wabaId: string;
  phoneNumberId: string;
  coexistence: boolean;
}): Promise<SignupResult> {
  const { business } = await requireBusiness({ allowSetup: true });
  const wabaId = String(input.wabaId ?? "");
  const phoneNumberId = String(input.phoneNumberId ?? "");
  if (!/^\d{6,20}$/.test(wabaId) || !/^\d{6,20}$/.test(phoneNumberId) || !input.code) {
    return { ok: false, error: "WhatsApp didn't send back the details. Please try again." };
  }
  const [taken] = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(and(eq(businesses.waPhoneNumberId, phoneNumberId), ne(businesses.id, business.id)))
    .limit(1);
  if (taken) return { ok: false, error: "This WhatsApp number is already connected to another business." };

  let token = "dry-token";
  let display: string | null = business.phone || null;
  let pin: string | null = null;

  if (!dryRun()) {
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    const secret = process.env.WHATSAPP_APP_SECRET;
    if (!appId || !secret) return { ok: false, error: "WhatsApp connection isn't available yet." };
    const auth = { Authorization: "" };
    try {
      const res = await fetch(`${graph("oauth/access_token")}?${new URLSearchParams({ client_id: appId, client_secret: secret, code: input.code })}`);
      const data = (await res.json()) as { access_token?: string; error?: { message?: string } };
      if (!res.ok || !data.access_token) return { ok: false, error: `Meta refused the connection (${data.error?.message ?? res.status}).` };
      token = data.access_token;
      auth.Authorization = `Bearer ${token}`;

      // Send this account's messages to our webhook
      await fetch(graph(`${wabaId}/subscribed_apps`), { method: "POST", headers: auth });

      // A new number has to be registered for the Cloud API (the shop's existing app number doesn't)
      if (!input.coexistence) {
        pin = String(100000 + (randomBytes(4).readUInt32BE() % 900000));
        const reg = await fetch(graph(`${phoneNumberId}/register`), {
          method: "POST",
          headers: { ...auth, "Content-Type": "application/json" },
          body: JSON.stringify({ messaging_product: "whatsapp", pin }),
        });
        if (!reg.ok) console.error("[whatsapp] register failed:", reg.status);
      }

      const info = await fetch(`${graph(phoneNumberId)}?fields=display_phone_number,verified_name`, { headers: auth });
      const num = (await info.json()) as { display_phone_number?: string };
      display = normalizePhone(num.display_phone_number ?? "") ?? display;
    } catch (err) {
      console.error("[whatsapp] signup failed:", err instanceof Error ? err.message : err);
      return { ok: false, error: "Couldn't reach WhatsApp. Please try again." };
    }
  }

  await db
    .update(businesses)
    .set({
      waPhoneNumberId: phoneNumberId,
      waBusinessAccountId: wabaId,
      waDisplayPhone: display,
      waOwnApp: input.coexistence,
      waTokenEnc: seal(token),
      waPinEnc: pin ? seal(pin) : null,
      whatsappEnabled: true,
      updatedAt: Date.now(),
    })
    .where(eq(businesses.id, business.id));
  await waCreateTemplates(wabaId, token, business.name);
  await db.update(businesses).set({ waTemplatesAt: Date.now() }).where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
  return { ok: true, message: "WhatsApp is connected. Meta checks the opening message, usually within an hour." };
}

export async function disconnectWhatsApp() {
  const { business } = await requireBusiness({ allowSetup: true });
  await db
    .update(businesses)
    .set({ waPhoneNumberId: null, waBusinessAccountId: null, waDisplayPhone: null, waTokenEnc: null, waPinEnc: null, waTemplatesAt: null })
    .where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
}

export async function disconnectGoogle() {
  const { business } = await requireBusiness({ allowSetup: true });
  await unlinkGoogle(business.id);
  revalidatePath("/", "layout");
}

/** New calendar subscription link (the old one stops working). */
export async function renewCalendarLink() {
  const { business } = await requireBusiness({ allowSetup: true });
  await db.update(businesses).set({ calendarToken: randomBytes(18).toString("base64url") }).where(eq(businesses.id, business.id));
  revalidatePath("/", "layout");
}

/** Setup wizard: move on from the optional "Connect" step. */
export async function continueFromConnect() {
  const { business } = await requireBusiness({ allowSetup: true });
  if (business.setupStep < 6) await db.update(businesses).set({ setupStep: 6 }).where(eq(businesses.id, business.id));
  redirect("/setup?step=6");
}
