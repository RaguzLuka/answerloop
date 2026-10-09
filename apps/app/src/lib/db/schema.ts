import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core";

/* All timestamps are stored as epoch milliseconds (UTC). */

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => integer("created_at", { mode: "number" }).notNull().$defaultFn(() => Date.now());

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(), // always lower-cased
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
});

/** Session id = SHA-256 of the cookie token, so a DB leak can't be replayed. */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at", { mode: "number" }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const passwordResets = sqliteTable("password_resets", {
  id: text("id").primaryKey(), // SHA-256 of the emailed token
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "number" }).notNull(),
  usedAt: integer("used_at", { mode: "number" }),
  createdAt: createdAt(),
});

export type DayHours = { open: boolean; from: string; to: string };
/** Index 0 = Monday … 6 = Sunday */
export type WeekHours = DayHours[];

export type BusinessStatus =
  | "setup" //          still in the setup wizard
  | "number_pending" // setup done, waiting for RingLoop to assign a number
  | "forwarding" //     number assigned, owner still has to forward missed calls
  | "live" //           forwarding confirmed — missed calls get texted back
  | "paused";

export const businesses = sqliteTable("businesses", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  city: text("city").notNull().default(""),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""), // the number customers call today
  timezone: text("timezone").notNull().default("Europe/Zagreb"),
  hours: text("hours", { mode: "json" }).$type<WeekHours>().notNull(),
  /** How many customers can be served at the same time (chairs, staff, tables) */
  capacity: integer("capacity").notNull().default(1),
  senderName: text("sender_name").notNull().default(""),
  textbackMessage: text("textback_message").notNull().default(""),
  /** Language of confirmations and reminders sent to customers */
  smsLanguage: text("sms_language").$type<"hr" | "en">().notNull().default("hr"),
  confirmationsEnabled: integer("confirmations_enabled", { mode: "boolean" }).notNull().default(true),
  remindersEnabled: integer("reminders_enabled", { mode: "boolean" }).notNull().default(true),
  /** Plan, set by the RingLoop team in /admin. "pro" includes chatting with Halo (AI). */
  plan: text("plan").$type<"start" | "pro">().notNull().default("start"),
  /** Owner's switch (Pro only): text-back link opens a chat with Halo instead of the booking page */
  chatEnabled: integer("chat_enabled", { mode: "boolean" }).notNull().default(true),
  /** Owner's own booking page (e.g. their Buker profile) to send callers to instead of ours */
  customBookingUrl: text("custom_booking_url"),
  /** Pro: reach missed callers on WhatsApp first (SMS if they don't have it) */
  whatsappEnabled: integer("whatsapp_enabled", { mode: "boolean" }).notNull().default(true),
  /* The shop's own WhatsApp Business number (Cloud API), so messages show the shop's name.
     Connected by the RingLoop team (admin) or, later, by Embedded Signup. */
  waPhoneNumberId: text("wa_phone_number_id").unique(),
  waBusinessAccountId: text("wa_business_account_id"),
  waDisplayPhone: text("wa_display_phone"),
  /** Access token for the shop's WhatsApp account, encrypted (lib/secret-box). Empty = the team's token. */
  waTokenEnc: text("wa_token_enc"),
  /** The number is also the shop's WhatsApp Business app ("coexistence"): Halo only
   *  answers missed-call conversations and steps back when the owner writes. */
  waOwnApp: integer("wa_own_app", { mode: "boolean" }).notNull().default(false),
  waTemplatesAt: integer("wa_templates_at", { mode: "number" }),
  /** Two-step verification PIN set when a new number was registered (encrypted) */
  waPinEnc: text("wa_pin_enc"),
  /** Monthly message allowance override (null = the plan's allowance, lib/plans.ts) */
  messageLimit: integer("message_limit"),
  /** At the allowance: false = stop sending until next month, true = keep going, extra billed */
  allowExtraMessages: integer("allow_extra_messages", { mode: "boolean" }).notNull().default(false),
  /** Which usage heads-up was last sent, e.g. "2026-10:80" — one per level per month */
  usageAlert: text("usage_alert"),
  /** Free trial of Pro for self-service sign-ups */
  trialEndsAt: integer("trial_ends_at", { mode: "number" }),
  /** Secret for the calendar subscription feed (/api/cal/<token>) */
  calendarToken: text("calendar_token").unique(),
  /** Google Calendar link: encrypted { refreshToken, calendarId } */
  googleCalEnc: text("google_cal_enc"),
  googleCalEmail: text("google_cal_email"),
  bookingEnabled: integer("booking_enabled", { mode: "boolean" }).notNull().default(true),
  slotIntervalMin: integer("slot_interval_min").notNull().default(15),
  leadTimeMin: integer("lead_time_min").notNull().default(60),
  horizonDays: integer("horizon_days").notNull().default(30),
  ringloopNumber: text("ringloop_number"),
  status: text("status").$type<BusinessStatus>().notNull().default("setup"),
  setupStep: integer("setup_step").notNull().default(1),
  forwardingConfirmedAt: integer("forwarding_confirmed_at", { mode: "number" }),
  createdAt: createdAt(),
  updatedAt: integer("updated_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
});

export const memberships = sqliteTable(
  "memberships",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    role: text("role").$type<"owner" | "staff">().notNull().default("owner"),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.businessId] })],
);

export const services = sqliteTable(
  "services",
  {
    id: id(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    durationMin: integer("duration_min").notNull(),
    priceCents: integer("price_cents"),
    position: integer("position").notNull().default(0),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
  },
  (t) => [index("services_business_idx").on(t.businessId)],
);

export type BookingStatus = "confirmed" | "cancelled" | "completed" | "no_show";
export type BookingSource = "link" | "manual" | "sms" | "chat";

export const bookings = sqliteTable(
  "bookings",
  {
    id: id(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    serviceId: text("service_id").references(() => services.id, { onDelete: "set null" }),
    serviceName: text("service_name").notNull(), // snapshot — survives service edits
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    notes: text("notes").notNull().default(""),
    startsAt: integer("starts_at", { mode: "number" }).notNull(),
    endsAt: integer("ends_at", { mode: "number" }).notNull(),
    status: text("status").$type<BookingStatus>().notNull().default("confirmed"),
    source: text("source").$type<BookingSource>().notNull(),
    /** Set when the booking came from a missed call's text-back (chat or link) */
    callId: text("call_id"),
    /** The event this booking created in the owner's Google Calendar */
    googleEventId: text("google_event_id"),
    confirmationSentAt: integer("confirmation_sent_at", { mode: "number" }),
    reminderSentAt: integer("reminder_sent_at", { mode: "number" }),
    createdAt: createdAt(),
  },
  (t) => [index("bookings_business_time_idx").on(t.businessId, t.startsAt)],
);

export type VisitStatus = "requested" | "scheduled" | "done" | "cancelled";

/** "Come over and set it up for me" requests */
export const visitRequests = sqliteTable(
  "visit_requests",
  {
    id: id(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    requestedBy: text("requested_by").references(() => users.id, { onDelete: "set null" }),
    contactName: text("contact_name").notNull(),
    contactPhone: text("contact_phone").notNull(),
    address: text("address").notNull(),
    preferredTimes: text("preferred_times").notNull(),
    help: text("help", { mode: "json" }).$type<string[]>().notNull(),
    notes: text("notes").notNull().default(""),
    status: text("status").$type<VisitStatus>().notNull().default("requested"),
    scheduledFor: text("scheduled_for"),
    createdAt: createdAt(),
  },
  (t) => [index("visits_business_idx").on(t.businessId)],
);

export type CallOutcome =
  | "texted" //         text-back sent
  | "repeat" //         same caller was texted recently — not texted again
  | "no_caller_id" //   hidden number, or the carrier sent the business's own number
  | "landline" //       caller can't receive SMS
  | "paused" //         business paused RingLoop
  | "limit" //          daily SMS cap reached
  | "failed"; //        Twilio refused the SMS

/** Missed calls forwarded to a RingLoop number */
export const calls = sqliteTable(
  "calls",
  {
    id: id(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    callSid: text("call_sid").notNull().unique(),
    callerPhone: text("caller_phone"),
    outcome: text("outcome").$type<CallOutcome>().notNull(),
    channel: text("channel").$type<"sms" | "whatsapp">().notNull().default("sms"),
    error: text("error"),
    createdAt: createdAt(),
  },
  (t) => [index("calls_business_time_idx").on(t.businessId, t.createdAt)],
);

export type ChatStatus = "open" | "booked" | "closed";

/** A caller's conversation with Halo, opened from the text-back link */
export const chats = sqliteTable(
  "chats",
  {
    id: id(),
    token: text("token").notNull().unique(), // the secret in the chat link
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    callId: text("call_id").references(() => calls.id, { onDelete: "set null" }),
    customerPhone: text("customer_phone").notNull(),
    customerName: text("customer_name"),
    status: text("status").$type<ChatStatus>().notNull().default("open"),
    bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
    isTest: integer("is_test", { mode: "boolean" }).notNull().default(false),
    userMessages: integer("user_messages").notNull().default(0),
    openedAt: integer("opened_at", { mode: "number" }),
    channel: text("channel").$type<"web" | "whatsapp">().notNull().default("web"),
    /** The owner answered personally — Halo stays quiet in this conversation */
    ownerTookOverAt: integer("owner_took_over_at", { mode: "number" }),
    /** WhatsApp didn't reach them, so the SMS with the web link went out instead */
    smsFallbackAt: integer("sms_fallback_at", { mode: "number" }),
    expiresAt: integer("expires_at", { mode: "number" }).notNull(),
    lastMessageAt: integer("last_message_at", { mode: "number" }).notNull().$defaultFn(() => Date.now()),
    createdAt: createdAt(),
  },
  (t) => [index("chats_business_idx").on(t.businessId, t.createdAt), index("chats_call_idx").on(t.callId)],
);

/** Text-back links for shops without the chat: /r/<token> notes the tap,
 *  then forwards to the booking page (or the shop's own page, e.g. Buker). */
export const textbackLinks = sqliteTable(
  "textback_links",
  {
    token: text("token").primaryKey(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    callId: text("call_id").references(() => calls.id, { onDelete: "set null" }),
    target: text("target").notNull(),
    isTest: integer("is_test", { mode: "boolean" }).notNull().default(false),
    openedAt: integer("opened_at", { mode: "number" }),
    createdAt: createdAt(),
  },
  (t) => [index("textback_links_business_idx").on(t.businessId, t.createdAt)],
);

export const chatMessages = sqliteTable(
  "chat_messages",
  {
    id: id(),
    chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
    role: text("role").$type<"assistant" | "user" | "owner">().notNull(),
    content: text("content").notNull(),
    /** WhatsApp message id: de-duplicates incoming webhooks, matches delivery receipts */
    waId: text("wa_id").unique(),
    createdAt: createdAt(),
  },
  (t) => [index("chat_messages_chat_idx").on(t.chatId, t.createdAt)],
);

export type SmsKind = "textback" | "confirmation" | "reminder" | "test";
export type MessageChannel = "sms" | "whatsapp";

/** Every SMS we send (no message bodies — just enough for limits and support) */
export const smsLog = sqliteTable(
  "sms_log",
  {
    id: id(),
    businessId: text("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
    kind: text("kind").$type<SmsKind>().notNull(),
    /** sms_log holds every message RingLoop pays for, SMS and WhatsApp templates */
    channel: text("channel").$type<MessageChannel>().notNull().default("sms"),
    /** Over the month's allowance (billed as extra) */
    extra: integer("extra", { mode: "boolean" }).notNull().default(false),
    toPhone: text("to_phone").notNull(),
    /** What it was about (the booking id for reminders/confirmations) */
    ref: text("ref"),
    sid: text("sid"),
    error: text("error"),
    createdAt: createdAt(),
  },
  (t) => [index("sms_business_time_idx").on(t.businessId, t.createdAt)],
);

/** RingLoop's own Twilio numbers, handed out to businesses as they finish setup */
export const phoneNumbers = sqliteTable("phone_numbers", {
  number: text("number").primaryKey(), // +E.164
  businessId: text("business_id").references(() => businesses.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

/** Web-push subscriptions (one per installed device) */
export const pushSubscriptions = sqliteTable(
  "push_subscriptions",
  {
    endpoint: text("endpoint").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("push_user_idx").on(t.userId)],
);

/** Fixed-window counters for login/sign-up/booking abuse protection */
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetAt: integer("reset_at", { mode: "number" }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type VisitRequest = typeof visitRequests.$inferSelect;
export type Call = typeof calls.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
