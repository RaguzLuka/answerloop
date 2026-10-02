import clinicData from "./clinics.json";

export interface Clinic {
  name: string;
  treatments: string;
  /** Staff the caller may ask for by name — helps the AI recognize them when spoken. */
  staff?: string;
  /** Working hours — the AI only confirms appointments inside these. */
  hours?: string;
  /** Typical duration per treatment — lets the AI plan the schedule and tell patients how long they'll stay. */
  durations?: string;
  /** SMS sender name for booking notifications — max 11 chars (alphanumeric sender ID limit). Falls back to "RingLoop". */
  smsSender?: string;
  address?: string;
}

// The clinic data lives in clinics.json so the Railway voice server
// (voice-server.js, plain Node) reads the same config and looks the clinic up
// itself, instead of trusting values passed through the call's media stream.
// Add a new entry there for each clinic you onboard. The key is their Twilio
// phone number in E.164 format (e.g. +14788003855).
//
// +385800410023 — Croatian toll-free number (primary) — Fizio Medianus, Zagreb (physiotherapy):
// - TODO: add "durations" once the owner confirms per-treatment durations, e.g.
//   "fizioterapeutska procjena 60 min, fizikalna terapija 45 min, masaža 30 min, udarni val 20 min"
// - smsSender is "Medianus" because "FizioMedianus" exceeds the 11-char sender limit
const clinics: Record<string, Clinic> = clinicData;

export function getClinic(toNumber: string): Clinic {
  return (
    clinics[toNumber] ?? {
      name: "the clinic",
      treatments: "general consultation",
    }
  );
}
