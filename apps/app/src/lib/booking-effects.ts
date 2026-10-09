import "server-only";
import type { Booking, Business } from "@/lib/db";
import { ownerOf } from "@/lib/dal";
import { appUrl, esc, sendEmail } from "@/lib/email";
import { formatDay, formatTime } from "@/lib/time";
import { formatPhone } from "@/lib/phone";
import { notifyBusiness } from "@/lib/push";
import { sendConfirmation } from "@/lib/sms";
import { syncBookingById } from "@/lib/google-calendar";

/** Everything that happens after a customer books themselves (booking page or chat):
 *  confirmation text (booking page only), push + email to the owner. Never throws. */
export async function afterCustomerBooking(biz: Business, booking: Booking, via: "link" | "chat") {
  await syncBookingById(booking.id);
  const day = formatDay(booking.startsAt, biz.timezone);
  const time = formatTime(booking.startsAt, biz.timezone);
  const how = via === "chat" ? " (chat with Halo)" : "";

  // The chat already showed the confirmation, so chat bookings skip that SMS (the reminder still goes)
  if (via !== "chat") await sendConfirmation(biz, booking).catch((err) => console.error("[sms] confirmation:", err));
  await notifyBusiness(biz.id, {
    title: via === "chat" ? "New booking by chat" : "New booking",
    body: `${booking.customerName}: ${booking.serviceName}, ${day} at ${time}`,
    url: "/bookings",
  }).catch((err) => console.error("[push] booking:", err));

  const owner = await ownerOf(biz.id);
  if (owner) {
    await sendEmail({
      to: owner.email,
      subject: `New booking${how}: ${booking.customerName} — ${day} ${time}`,
      html: `<p><strong>${esc(booking.customerName)}</strong> booked <strong>${esc(booking.serviceName)}</strong> for ${esc(day)} at ${esc(time)}${esc(how)}.</p>
        <p>Phone: ${esc(formatPhone(booking.customerPhone))}${booking.notes ? `<br>Note: ${esc(booking.notes)}` : ""}</p>
        <p><a href="${appUrl()}/bookings">Open your bookings</a></p>`,
    }).catch((err) => console.error("[email] booking:", err));
  }
}
