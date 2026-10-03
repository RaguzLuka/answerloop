/**
 * The fictional businesses behind the live SMS demo at /demo.
 * Shared by the browser component and /api/demo-chat so the opening
 * text the visitor sees is exactly what the AI believes it sent.
 * Every opening says it's an AI assistant: EU AI Act Art. 50 requires the
 * first message to disclose it (the real text-back must do the same).
 * (The AI's business facts live server-side in the API route.)
 */

export type DemoBusinessId = "salon" | "barber" | "nails" | "restaurant" | "dental";

export type DemoBusiness = {
  id: DemoBusinessId;
  /** Picker label, e.g. "Hair salon" */
  label: string;
  icon: string;
  name: string;
  initials: string;
  opening: string;
  /** Labels for the booking card in the "what you see" panel */
  fields: { service: string; name: string; staff: string };
  bookedTitle: string;
  bookedSub: string;
  suggestions: string[];
};

export const DEMO_BUSINESSES: DemoBusiness[] = [
  {
    id: "salon",
    label: "Hair salon",
    icon: "scissors",
    name: "Studio Mila",
    initials: "SM",
    opening:
      "Hi, it's Studio Mila's AI assistant ✂️ Sorry we missed your call — we're with a client right now. I can book you in by text: what would you like?",
    fields: { service: "Service", name: "Client", staff: "Stylist" },
    bookedTitle: "Appointment booked",
    bookedSub: "You're notified · reminder scheduled for the day before",
    suggestions: ["Cut & blow-dry this week?", "How long does colour take?", "Trebam šišanje u petak", "Am I texting a real person?"],
  },
  {
    id: "barber",
    label: "Barbershop",
    icon: "barberPole",
    name: "Corner Cut Barbers",
    initials: "CC",
    opening:
      "Hey, it's Corner Cut Barbers' AI assistant 💈 Sorry we missed you — we're mid-cut. I can book you in by text: what are you after?",
    fields: { service: "Service", name: "Customer", staff: "Barber" },
    bookedTitle: "Appointment booked",
    bookedSub: "You're notified · reminder scheduled for the day before",
    suggestions: ["Skin fade on Saturday?", "Cut & beard tomorrow after 6?", "Imate li termin danas?", "Am I texting a real person?"],
  },
  {
    id: "nails",
    label: "Nail studio",
    icon: "nailPolish",
    name: "Luna Nail Studio",
    initials: "LN",
    opening:
      "Hi, it's Luna Nail Studio's AI assistant 💅 Sorry we missed your call — we're with a client. I can book you in by text: what would you like?",
    fields: { service: "Service", name: "Client", staff: "Technician" },
    bookedTitle: "Appointment booked",
    bookedSub: "You're notified · reminder scheduled for the day before",
    suggestions: ["Gel manicure on Friday?", "Pedicure + gel nails together?", "Trebam manikuru sutra", "Am I texting a real person?"],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: "utensils",
    name: "Bistro Lanterna",
    initials: "BL",
    opening:
      "Hi, it's Bistro Lanterna's AI assistant 🍝 Sorry we missed your call — the kitchen is busy! I can reserve a table for you by text: when would you like to come?",
    fields: { service: "Reservation", name: "Guest", staff: "Seating" },
    bookedTitle: "Table reserved",
    bookedSub: "You're notified · confirmation sent to the guest",
    suggestions: ["Table for 4 tonight at 8?", "Do you have a terrace?", "Stol za dvoje u subotu?", "Am I texting a real person?"],
  },
  {
    id: "dental",
    label: "Dental clinic",
    icon: "tooth",
    name: "Adria Dental",
    initials: "AD",
    opening:
      "Hi, it's Adria Dental's AI assistant 👋 Sorry we missed your call — the team is with patients right now. I can book you in by text: what can we help you with?",
    fields: { service: "Treatment", name: "Patient", staff: "Dentist" },
    bookedTitle: "Appointment booked",
    bookedSub: "You're notified · reminder scheduled for the day before",
    suggestions: ["I need a cleaning this week", "Anything tomorrow after 5?", "Trebam pregled, može sutra?", "Am I texting a real person?"],
  },
];

export const DEFAULT_DEMO_BUSINESS: DemoBusinessId = "salon";

export function getDemoBusiness(id: unknown): DemoBusiness {
  return DEMO_BUSINESSES.find((b) => b.id === id) ?? DEMO_BUSINESSES[0];
}

/** Hard caps that keep the public demo cheap and on-topic */
export const DEMO_MAX_TURNS = 14; // customer messages per conversation
export const DEMO_MAX_CHARS = 400; // per message

export type DemoStatus = "chatting" | "booked" | "handoff";

export type DemoBooking = {
  service: string | null;
  name: string | null;
  time: string | null;
  staff: string | null;
};

export type DemoReply = {
  reply: string;
  status: DemoStatus;
  booking: DemoBooking;
  /** true once the conversation hit DEMO_MAX_TURNS */
  limit?: boolean;
};

export const EMPTY_BOOKING: DemoBooking = { service: null, name: null, time: null, staff: null };
