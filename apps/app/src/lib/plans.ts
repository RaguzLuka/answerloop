/* RingLoop plans. Change prices and allowances here.
   A "message" is anything that costs RingLoop money: the first WhatsApp after a
   missed call, reminders, confirmations and every SMS. Halo's replies inside a
   WhatsApp conversation are free (Meta doesn't charge for them) and unlimited. */

export type PlanId = "start" | "pro";

export const PLANS: Record<PlanId, { name: string; priceEur: number; messages: number; blurb: string }> = {
  start: {
    name: "Start",
    priceEur: 29,
    messages: 100,
    blurb: "Missed callers get a message with your booking link, plus reminders.",
  },
  pro: {
    name: "Pro",
    priceEur: 49,
    messages: 200,
    blurb: "Everything in Start, plus Halo chatting with callers on WhatsApp and booking them in.",
  },
};

/** Price of each message over the allowance, when the shop chose to keep going. */
export const EXTRA_MESSAGE_CENTS = 20;

/** Owner gets a heads-up at these shares of the allowance. */
export const ALERT_AT = [0.8, 1] as const;

export const euros = (cents: number) =>
  new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(cents / 100);
