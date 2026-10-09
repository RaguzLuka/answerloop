# RingLoop for business (app.ringloop.net)

The app businesses download, sign into and set up themselves, or ask us to
come over and set it up with them. It's a separate Next.js project from the
marketing site (`/`), so the two deploy independently.

**What's in it**

| Area | Route | What it does |
| --- | --- | --- |
| Welcome / get the app | `/`, `/install` | What RingLoop is, install instructions per platform |
| Sign up / in | `/signup`, `/login`, `/forgot`, `/reset/[token]` | Email + password, 30-day sessions, rate-limited |
| Setup wizard | `/setup` | 1 business → 2 hours & capacity → 3 services → 4 text-back message → 5 go live (forward calls yourself, or request a visit) |
| Home | `/dashboard` | Status, missed calls (and what happened to each), today's bookings, booking link |
| Bookings | `/bookings` | Upcoming/past, add by hand (optional confirmation text), done / no-show / cancel |
| Help | `/help` | Request an on-site visit, see visit status, FAQ |
| Settings | `/settings` | Everything from setup, confirmation/reminder texts and their language, test text, notifications, account |
| Public booking page | `/b/[slug]` | Customers pick a service, day and free time, in Croatian or English |
| Admin | `/admin` | Team only (`ADMIN_EMAILS`): number pool, signups, numbers, visits |
| Chat with Halo | `/c/[token]` | Pro plan: the caller's private chat; Halo finds free times and books them |
| Chat transcript | `/chats/[id]` | The owner reads a caller's conversation with Halo |
| Twilio webhook | `/api/twilio/voice` | Missed call forwarded to a RingLoop number → decline (busy) → text the caller |
| Reminder job | `/api/cron/reminders` | Daily (vercel.json): texts everyone booked for tomorrow |

It installs as an app (PWA): web manifest, icons, offline screen, an
"Install" button where the browser supports it (instructions on iPhone), and
push notifications for new bookings and missed calls.

## How a missed call becomes a booking

1. The business forwards unanswered calls (`**004*<RingLoop number>#`) to its RingLoop number.
2. Twilio calls `/api/twilio/voice` (signature checked; forged requests get 403).
3. The app declines the call ("busy", no airtime cost) and texts the caller the
   business's message with a link: once per caller per 12 h, never to landlines
   or hidden numbers, at most `SMS_DAILY_LIMIT` texts a day.
4. The link goes to one of three places (Settings → Booking & texts):
   - **Chat with Halo** (Pro plan, AI on): a private chat for that caller. Halo
     (OpenAI, tools `free_times` + `book`) only offers times the real calendar
     returns and books after the customer confirms. Its first message says it's
     an AI (EU AI Act). Limits: 30 messages per chat, chats expire after 7 days,
     `AI_DAILY_LIMIT` per business. Conversations are stored for the owner but
     never logged.
   - **The RingLoop booking page** `/b/[slug]`.
   - **The shop's own booking page**, e.g. their Buker profile.
5. The customer gets a confirmation text. The owner gets a push notification
   and an email, and a reminder text goes out the day before.

## Self-service: owners set everything up alone

Someone finds ringloop.net, signs up and goes through the wizard on their own:
business → hours → services → text-back → **Connect** (WhatsApp + calendar,
optional) → go live (a RingLoop number from the pool + call-forwarding code).
New sign-ups get a **30-day free trial of Pro**. "We'll come over and help"
is offered on every step (visit requests land in `/admin`).

- **Connect WhatsApp** opens Meta's Embedded Signup window: the owner logs in with
  Facebook and picks their WhatsApp Business number (their existing app number, or
  a new one). The app swaps the code for a token (stored encrypted), subscribes the
  webhook, registers new numbers, and submits the message templates. Needs
  `NEXT_PUBLIC_META_APP_ID`, `NEXT_PUBLIC_META_CONFIG_ID` and Meta approving
  RingLoop as a **Tech Provider** (app review for `whatsapp_business_management`
  and `whatsapp_business_messaging`). Until then the button says "we'll connect it
  with you", and the team uses `/admin` → WhatsApp numbers.
- **Connect Google Calendar** (both ways): bookings appear in the owner's
  calendar; their own timed events block those times. Needs a Google Cloud OAuth
  client (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, redirect URI
  `https://app.ringloop.net/api/google/callback`, scope `calendar.events`). Until
  Google verifies the app, up to 100 test users can connect (they see an
  "unverified app" notice).
- **Calendar subscription link** (any calendar app, one way) works with no setup:
  Settings → WhatsApp & calendar.

## WhatsApp setup (Pro: "the barbershop messages you on WhatsApp")

Missed call → the caller gets a WhatsApp **from the shop's own number, under the
shop's own name** → they chat with Halo there and get booked. If they don't
have WhatsApp, the SMS with the same conversation as a web chat goes out instead.

**Once, for RingLoop** (your obrt):
1. At business.facebook.com create RingLoop's business portfolio and complete
   **business verification** with the obrt's documents.
2. At developers.facebook.com create an app (type Business) and add the
   **WhatsApp** product.
3. Webhook (WhatsApp → Configuration): callback URL
   `https://app.ringloop.net/api/whatsapp`, verify token = `WHATSAPP_VERIFY_TOKEN`,
   subscribe to **messages** and **smb_message_echoes**.
4. Create a System User with a permanent token (`whatsapp_business_messaging`,
   `whatsapp_business_management`) → `WHATSAPP_TOKEN`.
5. Vercel: `WHATSAPP_APP_SECRET` (app → Settings → Basic), `WHATSAPP_VERIFY_TOKEN`,
   `WHATSAPP_TOKEN`, `APP_ENCRYPTION_KEY` (`openssl rand -base64 32`), plus
   `AI_ENABLED=true` and `OPENAI_API_KEY`.

**For each shop** (during the setup visit):
1. The shop needs a WhatsApp number showing its name:
   - **Best: its existing WhatsApp Business app number** ("coexistence") — the
     number customers already call. The owner keeps using the app; Halo only
     answers conversations that started with a missed call, never the owner's
     other chats, and steps back as soon as the owner writes from the app.
   - Or a new number used only for RingLoop (then Halo also answers people who
     write to it first).
2. The shop's own Meta business portfolio owns that number, with the display
   name = the shop's name, and shares the WhatsApp account with RingLoop's
   business (Business settings → Partners). For coexistence, connect the number
   through Meta's onboarding flow (Embedded Signup). Meta charges the opening
   template to the WhatsApp account's payment method, so the shop adds a card there.
3. In `/admin` → WhatsApp numbers: paste the **Phone number ID** and **WhatsApp
   Business Account ID**, tick "also the shop's own WhatsApp Business app" if so,
   add an access token if the account isn't reachable with `WHATSAPP_TOKEN`
   (stored encrypted), then **Submit message templates**. Meta usually approves
   them within minutes to hours.
4. Set the shop to Pro. Settings → Booking & texts → "Message callers on WhatsApp
   first" is on by default.

The opening template (category Utility, `{{1}}` = shop name), submitted by the button:
- `missed_call_hr`: Pozdrav, ovdje {{1}}. Oprostite što se nismo stigli javiti na Vaš poziv. Ovdje Vam piše Halo, naš asistent s umjetnom inteligencijom. Za koju uslugu želite termin i kada biste mogli doći?
- `missed_call_en`: Hello, this is {{1}}. Sorry we couldn't take your call. This is Halo, our AI assistant. What would you like to book, and when could you come in?

Notes: replies within the customer's 24-hour window are free; the opening
template is charged by Meta. WhatsApp's rules expect people to agree before a
business messages them first — one polite message answering their own call is
the lowest-risk form, but many blocks or reports lower the number's limits.
Next step for scale: an in-app "Connect WhatsApp" button (Embedded Signup), which
needs RingLoop approved as a Meta Tech Provider.

## Plans

`plan` is set per business in `/admin`: **Start** (text-back + booking link,
confirmations, reminders) or **Pro** (adds the chat with Halo). The chat also
needs `AI_ENABLED=true` and `OPENAI_API_KEY` on the server. Without them, Pro
shops fall back to their booking link, so it's safe to launch with AI off.

## Run it locally

```bash
cd apps/app
npm install
npm run dev        # migrates the local SQLite DB, then serves http://localhost:3100
```

Locally the database is a SQLite file in `.data/`, and texts and emails are printed
to the terminal instead of being sent. Put `ADMIN_EMAILS=you@example.com` in
`.env.local` to open `/admin`.

After changing `src/lib/db/schema.ts`: `npm run db:generate` (writes a new SQL
migration to `drizzle/`), then restart `npm run dev`.

## Deploy (one-time setup)

1. **Database:** create a Turso database in an EU region (e.g. Frankfurt) and an auth token.
2. **Vercel:** new project from the same GitHub repo, **Root Directory = `apps/app`**.
   Vercel runs `npm run vercel-build`, which applies migrations and then builds.
3. **Environment variables** (Production), see `.env.example`:
   `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `NEXT_PUBLIC_APP_URL=https://app.ringloop.net`,
   `ADMIN_EMAILS`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `CRON_SECRET`,
   `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (`npx web-push generate-vapid-keys`),
   `RESEND_API_KEY`, `RESEND_FROM` (a verified ringloop.net sender), `TEAM_INBOX`.
4. **Domain:** add `app.ringloop.net` to the project.
5. **Numbers:** buy voice-capable numbers in Twilio and paste them into the number
   pool in `/admin`. The app points each one's voice webhook at `/api/twilio/voice`
   when it's handed out. Don't reuse the website's +385 800 number: it still runs the voice AI.
6. Link to the app from the marketing site ("Sign in" / "Get started").

## Check on a real phone before the first customer

- **Caller ID through forwarding:** forward a test SIM's missed calls (HT, A1 and
  Telemach), call it from another phone, and check the text arrives. If carriers
  replace the caller's number with the business's own, the call shows as "Hidden
  number" and nobody gets texted.
- **Alphanumeric sender:** check the text shows the business name (e.g. "Corner Cut").
- **Push on iPhone:** works only after "Add to Home Screen" (iOS 16.4+).

## Not built yet

Billing (plans are switched by hand in `/admin`), staff logins, a Croatian
interface for the owner app (the booking page, chat and texts are already
Croatian), real two-way SMS or WhatsApp (Twilio has no two-way SMS in Croatia;
the chat brain is built so it can move to WhatsApp or Infobip SMS later), and
booking into Buker's calendar (needs an API or partnership with them).
