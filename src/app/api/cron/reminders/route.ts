import { getBookingsDue24hReminder, markReminderSent } from "@/bookings";
import { sendWhatsApp } from "@/whatsapp";

// Called by Vercel Cron every hour (configured in vercel.json).
// Sends a WhatsApp reminder to patients with appointments in ~24 hours.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const due = await getBookingsDue24hReminder();
  console.log(`[CRON] Checking reminders — ${due.length} due`);

  const results = await Promise.allSettled(
    due.map(async (booking) => {
      const message =
        `Hi ${booking.name}! 👋 This is a reminder from ${booking.clinicName}.\n\n` +
        `Your appointment is tomorrow:\n` +
        `📋 Treatment: ${booking.treatment}\n` +
        `👨‍⚕️ Doctor: ${booking.doctor}\n` +
        `🕐 Time: ${booking.time}\n\n` +
        `Need to reschedule? Just reply here or call us back. See you tomorrow!`;

      await sendWhatsApp(booking.phone, message);
      await markReminderSent(booking.id);
      console.log(`[CRON] Reminder sent to ${booking.name} (${booking.phone})`);
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return Response.json({ sent, failed, total: due.length });
}
