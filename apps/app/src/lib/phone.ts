/** Normalises what people type ("091 234 5678", "00385 91…") to +E.164.
 *  Numbers starting with a single 0 are taken as Croatian. Returns null if invalid. */
export function normalizePhone(raw: string, countryCode = "385"): string | null {
  let s = raw.replace(/[\s\-().\/]/g, "");
  if (!s) return null;
  if (s.startsWith("00")) s = "+" + s.slice(2);
  else if (s.startsWith("0")) s = `+${countryCode}${s.slice(1)}`;
  else if (!s.startsWith("+")) return null;
  return /^\+[1-9]\d{7,14}$/.test(s) ? s : null;
}

/** "+385912345678" → "+385 91 234 5678", "+38515550199" → "+385 1 555 0199".
 *  Croatian prefixes: Zagreb is 1, everything else (other cities, mobiles) is two digits. */
export function formatPhone(e164: string) {
  const m = /^\+385(\d{8,10})$/.exec(e164);
  if (!m) return e164;
  const digits = m[1];
  const cut = digits.startsWith("1") ? 1 : 2;
  const prefix = digits.slice(0, cut);
  const rest = digits.slice(cut);
  return `+385 ${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
}
