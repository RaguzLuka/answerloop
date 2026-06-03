export interface Clinic {
  name: string;
  treatments: string;
}

// Add a new entry here for each clinic you onboard.
// The key is their Twilio phone number in E.164 format (e.g. +14788003855).
const clinics: Record<string, Clinic> = {
  // Your test number — update the number to match your actual Twilio number
  "+14788003855": {
    name: "Lumi Clinic",
    treatments: "Botox, fillers, skin consultation",
  },

  // Example — add your next client like this:
  // "+385911234567": {
  //   name: "Dental Studio Zagreb",
  //   treatments: "dental cleaning, checkup, teeth whitening",
  // },
};

export function getClinic(toNumber: string): Clinic {
  return (
    clinics[toNumber] ?? {
      name: "the clinic",
      treatments: "general consultation",
    }
  );
}
