export interface Booking {
  id: string;
  name: string;
  treatment: string;
  doctor: string;
  time: string;
  phone: string;
  clinicName: string;
  clinicNumber: string;
  createdAt: string;
  reminderSent: boolean;
}

// In-memory store — persists for the lifetime of the serverless instance.
// Replace with Supabase/Vercel KV when you onboard your first client.
const bookings: Booking[] = [];

export async function saveBooking(data: Omit<Booking, "id" | "createdAt" | "reminderSent">) {
  const booking: Booking = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    reminderSent: false,
  };
  bookings.push(booking);
  console.log(`[BOOKINGS] Saved: ${JSON.stringify(booking)}`);
  return booking;
}

export async function getBookingsDue24hReminder(): Promise<Booking[]> {
  const now = Date.now();
  return bookings.filter((b) => {
    if (b.reminderSent) return false;
    const appointmentTime = new Date(b.time).getTime();
    const diff = appointmentTime - now;
    // Between 23h and 25h away
    return diff >= 23 * 60 * 60 * 1000 && diff <= 25 * 60 * 60 * 1000;
  });
}

export async function markReminderSent(id: string) {
  const booking = bookings.find((b) => b.id === id);
  if (booking) booking.reminderSent = true;
}
