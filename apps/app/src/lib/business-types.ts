import type { WeekHours } from "@/lib/db/schema";

/* Business types offered in setup, with sensible starting presets so a new
   business only has to tweak — not type everything from scratch. */

export type BusinessTypeId = "salon" | "barber" | "nails" | "beauty" | "restaurant" | "clinic" | "other";

/** `hr` is used for new businesses, whose customer texts default to Croatian */
type ServicePreset = { name: string; hr: string; durationMin: number; price?: number };

export type BusinessType = {
  id: BusinessTypeId;
  label: string;
  icon: string;
  services: ServicePreset[];
  hours: WeekHours;
  capacity: number;
  /** Words that change per industry */
  words: {
    booking: string; //   appointment / reservation
    bookings: string;
    customer: string; //  client / guest / patient
    service: string; //   service / table
    services: string;
    capacity: string; //  "stylists working at the same time"
  };
};

const d = (from: string, to: string) => ({ open: true, from, to });
const closed = { open: false, from: "09:00", to: "17:00" };

const SHOP_HOURS: WeekHours = [d("09:00", "20:00"), d("09:00", "20:00"), d("09:00", "20:00"), d("09:00", "20:00"), d("09:00", "20:00"), d("08:00", "14:00"), closed];
const OFFICE_HOURS: WeekHours = [d("08:00", "16:00"), d("08:00", "16:00"), d("08:00", "16:00"), d("08:00", "16:00"), d("08:00", "16:00"), closed, closed];

const APPOINTMENT_WORDS = {
  booking: "appointment", bookings: "appointments", customer: "client",
  service: "service", services: "services",
};

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: "salon", label: "Hair salon", icon: "scissors",
    services: [
      { name: "Women's cut & blow-dry", hr: "Žensko šišanje i feniranje", durationMin: 60, price: 35 },
      { name: "Men's cut", hr: "Muško šišanje", durationMin: 30, price: 18 },
      { name: "Colour (roots)", hr: "Bojanje izrasta", durationMin: 90, price: 55 },
      { name: "Blow-dry", hr: "Feniranje", durationMin: 30, price: 20 },
    ],
    hours: SHOP_HOURS, capacity: 2,
    words: { ...APPOINTMENT_WORDS, capacity: "stylists working at the same time" },
  },
  {
    id: "barber", label: "Barbershop", icon: "barber",
    services: [
      { name: "Haircut", hr: "Šišanje", durationMin: 30, price: 15 },
      { name: "Skin fade", hr: "Skin fade", durationMin: 45, price: 20 },
      { name: "Beard trim", hr: "Uređivanje brade", durationMin: 20, price: 10 },
      { name: "Cut & beard", hr: "Šišanje i brada", durationMin: 45, price: 25 },
    ],
    hours: SHOP_HOURS, capacity: 2,
    words: { ...APPOINTMENT_WORDS, customer: "customer", capacity: "barbers working at the same time" },
  },
  {
    id: "nails", label: "Nail studio", icon: "nails",
    services: [
      { name: "Gel manicure", hr: "Gel manikura", durationMin: 60, price: 30 },
      { name: "Gel pedicure", hr: "Gel pedikura", durationMin: 75, price: 35 },
      { name: "Gel refill", hr: "Korekcija gela", durationMin: 60, price: 28 },
    ],
    hours: SHOP_HOURS, capacity: 1,
    words: { ...APPOINTMENT_WORDS, capacity: "nail techs working at the same time" },
  },
  {
    id: "beauty", label: "Beauty & spa", icon: "sparkle",
    services: [
      { name: "Facial", hr: "Tretman lica", durationMin: 60, price: 45 },
      { name: "Massage (60 min)", hr: "Masaža (60 min)", durationMin: 60, price: 50 },
      { name: "Brows & lashes", hr: "Obrve i trepavice", durationMin: 30, price: 20 },
    ],
    hours: SHOP_HOURS, capacity: 1,
    words: { ...APPOINTMENT_WORDS, capacity: "therapists working at the same time" },
  },
  {
    id: "restaurant", label: "Restaurant", icon: "utensils",
    services: [
      { name: "Table for 2", hr: "Stol za 2", durationMin: 90 },
      { name: "Table for 3–4", hr: "Stol za 3–4", durationMin: 105 },
      { name: "Table for 5–8", hr: "Stol za 5–8", durationMin: 120 },
    ],
    hours: Array.from({ length: 7 }, () => d("12:00", "23:00")), capacity: 8,
    words: {
      booking: "reservation", bookings: "reservations", customer: "guest",
      service: "table type", services: "table types", capacity: "tables you can seat at once",
    },
  },
  {
    id: "clinic", label: "Clinic or practice", icon: "clinic",
    services: [
      { name: "First consultation", hr: "Prvi pregled", durationMin: 45 },
      { name: "Check-up", hr: "Kontrolni pregled", durationMin: 30 },
      { name: "Treatment", hr: "Terapija", durationMin: 60 },
    ],
    hours: OFFICE_HOURS, capacity: 1,
    words: { ...APPOINTMENT_WORDS, customer: "patient", capacity: "practitioners working at the same time" },
  },
  {
    id: "other", label: "Other business", icon: "store",
    services: [{ name: "Appointment", hr: "Termin", durationMin: 30 }],
    hours: OFFICE_HOURS, capacity: 1,
    words: { ...APPOINTMENT_WORDS, customer: "customer", capacity: "people serving customers at the same time" },
  },
];

export function businessType(id: string): BusinessType {
  return BUSINESS_TYPES.find((t) => t.id === id) ?? BUSINESS_TYPES[BUSINESS_TYPES.length - 1];
}

export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ── Text-back message ─────────────────────────────────────── */

export type MessageLang = "hr" | "en";

/* Worded so the Croatian needs no č, ć, š, ž or đ: one such letter cuts an SMS
   from 160 to 70 characters and doubles or triples what each text costs. */
export function defaultTextback(lang: MessageLang, typeId: string) {
  const restaurant = typeId === "restaurant";
  return lang === "hr"
    ? `Pozdrav, ovdje {business}! Nismo se stigli javiti na poziv. ${restaurant ? "Stol rezervirajte" : "Termin dogovorite"} ovdje: {link}`
    : `Hi, this is {business}! Sorry we missed your call. ${restaurant ? "Reserve a table" : "Book a time"} here: {link}`;
}

/** Alphanumeric SMS sender IDs: max 11 characters, letters/digits/spaces. */
export function suggestSender(name: string) {
  const ascii = name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  return ascii.replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, " ").trim().slice(0, 11).trim();
}

export function fillTemplate(message: string, businessName: string, link: string) {
  return message.replaceAll("{business}", businessName || "your business").replaceAll("{link}", link);
}

/* GSM-7 is the 160-char SMS alphabet. One character outside it (č, ć, š, ž, đ,
   emoji, en-dash…) switches the whole message to UCS-2: 70 chars per SMS. */
const GSM7 =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM7_EXT = "^{}\\[~]|€";

export function smsSegments(text: string) {
  const chars = [...text];
  const unicode = chars.some((c) => !GSM7.includes(c) && !GSM7_EXT.includes(c));
  const length = unicode ? chars.length : chars.reduce((n, c) => n + (GSM7_EXT.includes(c) ? 2 : 1), 0);
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const segments = length <= single ? 1 : Math.ceil(length / multi);
  const offending = unicode ? [...new Set(chars.filter((c) => !GSM7.includes(c) && !GSM7_EXT.includes(c)))] : [];
  return { length, segments, unicode, perSegment: segments === 1 ? single : multi, offending };
}
