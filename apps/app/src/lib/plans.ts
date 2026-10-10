/* RingLoop's one plan. Change the price and allowance here.
   The shop pays for missed calls answered: each missed call whose caller gets a
   message counts once, and everything after it is included (Halo's chat, the
   booking, the reminder, an SMS when WhatsApp doesn't arrive). Calls nobody was
   messaged about (repeats, landlines, hidden numbers) don't count. */

export const PLAN = {
  name: "RingLoop",
  priceEur: 39,
  /** Missed calls answered per calendar month */
  missedCalls: 100,
};

/** Price of each missed call over the allowance, when the shop chose to keep going. */
export const EXTRA_CALL_CENTS = 30;

/** Owner gets a heads-up at these shares of the allowance. */
export const ALERT_AT = [0.8, 1] as const;

/** €39, €0.30 */
export const euros = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
