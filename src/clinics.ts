export interface Clinic {
  name: string;
  treatments: string;
  /** Staff the caller may ask for by name — helps the AI recognize them when spoken. */
  staff?: string;
  /** Working hours — the AI only confirms appointments inside these. */
  hours?: string;
  /** Typical duration per treatment — lets the AI plan the schedule and tell patients how long they'll stay. */
  durations?: string;
  address?: string;
}

// Add a new entry here for each clinic you onboard.
// The key is their Twilio phone number in E.164 format (e.g. +14788003855).
const clinics: Record<string, Clinic> = {
  // Croatian toll-free number (primary) — Fizio Medianus, Zagreb (physiotherapy)
  "+385800410023": {
    name: "Fizio Medianus",
    treatments:
      "fizioterapeutska procjena, ultrazvučna dijagnostika, fizikalna terapija (laser, tecar, zamar, udarni val, elektromagnetska terapija, normatec), kiropraktika, dekompresija kralježnice, manualne tehnike (dry needling, kupice, miofascijalno opuštanje, Emmett tehnika, limfna drenaža, kineziotaping), terapijske vježbe (DNS, PNF, Schroth metoda), pedijatrijske vježbe (Vojta, Bobath), klasična, medicinska i sportska masaža, terapija u kući pacijenta",
    staff:
      "Željko Kercel (voditelj, postoperativna i neurološka rehabilitacija), Iva Šimunić (medicinska masaža, kupice), Anja Mihaljević (kupice, osteopatske tehnike), Katja Baček (PNF, DNS), Ivana Relja (Schroth terapeutkinja, posturalni problemi), Josipa Batina (dry needling, Mulligan tehnika)",
    hours: "ponedjeljak–petak 8:00–20:00 (vikendom zatvoreno)",
    // TODO: fill in once the owner confirms per-treatment durations, e.g.:
    // durations: "fizioterapeutska procjena 60 min, fizikalna terapija 45 min, masaža 30 min, udarni val 20 min",
    address: "Avenija Dubrava 108, Zagreb",
  },

  // US number — public demo line (matches the browser demo persona)
  "+14788003855": {
    name: "Klinika Adria",
    treatments: "dental checkup, cleaning, teeth whitening, implants",
  },
};

export function getClinic(toNumber: string): Clinic {
  return (
    clinics[toNumber] ?? {
      name: "the clinic",
      treatments: "general consultation",
    }
  );
}
