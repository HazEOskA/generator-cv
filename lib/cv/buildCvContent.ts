import type { CandidateWorkspace, CvContent } from "./types";

const printingLabels: Record<CandidateWorkspace["printingExp"], string> = {
  tak: "bezposrednie doswiadczenie w drukarni",
  produkcja: "doswiadczenie na produkcji lub magazynie",
  nie: "gotowosc do przyuczenia i szybka nauka",
};

const drivingLabels: Record<CandidateWorkspace["drivingLicense"], string> = {
  "kat-b": "prawo jazdy kat. B",
  inne: "inne uprawnienia do prowadzenia pojazdow",
  brak: "brak prawa jazdy",
};

export function buildCvContent(candidate: CandidateWorkspace): CvContent {
  const skills = [
    printingLabels[candidate.printingExp],
    drivingLabels[candidate.drivingLicense],
    "dyspozycyjnosc: " + candidate.availability,
  ];

  return {
    headline: "Kandydat na stanowisko produkcyjne",
    summary:
      `${candidate.fullName} mieszka obecnie w lokalizacji ${candidate.currentLocation}. ` +
      `Profil wskazuje na ${printingLabels[candidate.printingExp]} oraz gotowosc do pracy: ${candidate.availability}.`,
    experience: candidate.experience,
    education: candidate.education,
    skills,
    languages: candidate.languages,
    availability: candidate.availability,
    consent:
      "Wyrazam zgode na przetwarzanie moich danych osobowych dla potrzeb niezbednych do realizacji procesu rekrutacji zgodnie z RODO.",
  };
}
