/* Words on the public booking page, in the business's customer language
   (the same setting as its confirmation and reminder texts). */

export type Lang = "hr" | "en";

const TYPE_LABEL: Record<string, Record<Lang, string>> = {
  salon: { hr: "Frizerski salon", en: "Hair salon" },
  barber: { hr: "Brijačnica", en: "Barbershop" },
  nails: { hr: "Studio za nokte", en: "Nail studio" },
  beauty: { hr: "Kozmetički salon", en: "Beauty & spa" },
  restaurant: { hr: "Restoran", en: "Restaurant" },
  clinic: { hr: "Ordinacija", en: "Clinic" },
  other: { hr: "", en: "" },
};

export function bookingCopy(lang: Lang, typeId: string, business: string) {
  const restaurant = typeId === "restaurant";
  const hr = lang === "hr";
  return {
    locale: hr ? "hr-HR" : "en-GB",
    typeLabel: TYPE_LABEL[typeId]?.[lang] ?? "",
    title: hr ? `Rezervirajte: ${business}` : `Book at ${business}`,
    step1: hr ? (restaurant ? "1. Odaberite stol" : "1. Odaberite uslugu") : restaurant ? "1. Choose a table" : "1. Choose a service",
    step2: hr ? "2. Odaberite dan i vrijeme" : "2. Pick a day and time",
    step3: hr ? "3. Vaši podaci" : "3. Your details",
    closed: hr ? "Zatvoreno" : "Closed",
    parts: hr ? ["Jutro", "Poslijepodne", "Večer"] : ["Morning", "Afternoon", "Evening"],
    loading: hr ? "Učitavam termine" : "Loading times",
    noTimes: (day: string) => (hr ? `Nema slobodnih termina (${day}). Pokušajte drugi dan.` : `No free times on ${day}. Try another day.`),
    at: hr ? "u" : "at",
    name: hr ? "Ime i prezime" : "Your name",
    phone: hr ? "Broj mobitela" : "Mobile number",
    phoneHint: hr ? `Da vas ${business} može kontaktirati oko termina.` : `So ${business} can reach you about this booking.`,
    notes: hr ? "Napomena" : "Anything we should know?",
    optional: hr ? "(nije obavezno)" : "(optional)",
    consent: hr
      ? `Slažem se da ${business} pohrani moje ime i broj radi ove rezervacije i podsjetnika (SMS ili WhatsApp)`
      : `${business} may store my name and number for this booking and its reminder (SMS or WhatsApp)`,
    privacy: hr ? "privatnost" : "privacy",
    confirm: hr ? (restaurant ? "Potvrdi rezervaciju" : "Potvrdi termin") : restaurant ? "Confirm reservation" : "Confirm appointment",
    booking: hr ? "Rezerviram…" : "Booking…",
    done: hr ? "Rezervirano!" : "You're booked!",
    doneAt: (service: string) => (hr ? `${service}, ${business}` : `${service} at ${business}`),
    change: hr ? `Ne možete doći? Nazovite ${business} za promjenu ili otkazivanje.` : `Can't make it? Please call ${business} to change or cancel.`,
    unavailable: hr ? "Online rezervacije trenutno nisu dostupne." : "Online booking isn't available right now.",
    call: hr ? "Nazovite" : "Call",
    footer: hr ? "Rezervacije: RingLoop" : "Bookings by RingLoop",
    errors: {
      name: hr ? "Upišite svoje ime" : "Please enter your name",
      phone: hr ? "Upišite broj mobitela, npr. 091 234 5678" : "Enter a mobile number like 091 234 5678",
      consent: hr ? "Potvrdite kako biste nastavili" : "Please confirm to continue",
      tooMany: hr ? "Previše rezervacija s ovog uređaja. Molimo nazovite." : "Too many bookings from this device. Please call the business instead.",
      closed: hr ? "Online rezervacije trenutno nisu dostupne. Molimo nazovite." : "Online booking isn't available right now. Please call the business.",
      service: hr ? "Ta usluga više nije dostupna." : "That service isn't available any more.",
      taken: hr ? "Netko je upravo zauzeo taj termin. Odaberite drugi." : "Someone just took that time. Please pick another.",
    },
  };
}
