/* Wall-clock helpers for a business's own time zone (default Europe/Zagreb).
   Everything is stored as UTC epoch ms; these convert at the edges. */

const partsFmt = new Map<string, Intl.DateTimeFormat>();

function fmt(tz: string) {
  let f = partsFmt.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short",
    });
    partsFmt.set(tz, f);
  }
  return f;
}

const WD: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/** Local date/time parts of an instant in `tz`. weekday: 0 = Monday. */
export function zonedParts(ms: number, tz: string) {
  const p = Object.fromEntries(fmt(tz).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return {
    date: `${p.year}-${p.month}-${p.day}`,
    time: `${p.hour}:${p.minute}`,
    weekday: WD[p.weekday],
    y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second,
  };
}

function offsetMs(ms: number, tz: string) {
  const p = zonedParts(ms, tz);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(ms / 1000) * 1000;
}

/** "2026-10-07" + "14:30" in `tz` → UTC epoch ms (DST-safe). */
export function zonedToUtc(date: string, time: string, tz: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, min);
  let utc = guess - offsetMs(guess, tz);
  const check = offsetMs(utc, tz);
  if (guess - check !== utc) utc = guess - check;
  return utc;
}

/** Calendar date `n` days after `date` (both "YYYY-MM-DD"). */
export function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** 0 = Monday … 6 = Sunday, for a "YYYY-MM-DD" calendar date. */
export function weekdayOf(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

export function formatDateTime(ms: number, tz: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...opts }).format(new Date(ms));
}

export const formatTime = (ms: number, tz: string) =>
  formatDateTime(ms, tz, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export const formatDay = (ms: number, tz: string) =>
  formatDateTime(ms, tz, { weekday: "long", day: "numeric", month: "long" });

export function formatDateLabel(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}
