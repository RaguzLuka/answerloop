/**
 * Phone numbers never go into logs in full: "+385911234471" → "+385 91 ••• 4471".
 * Keeps country code + network prefix and the last 4 digits so a log line can
 * still be matched to a customer who reads out their number.
 * (voice-server.js has a copy — it's a standalone Node script.)
 */
export function maskPhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length < 8) return "•••";
  const head = digits.slice(0, -7);
  return `+${[head.slice(0, 3), head.slice(3)].filter(Boolean).join(" ")} ••• ${digits.slice(-4)}`;
}
