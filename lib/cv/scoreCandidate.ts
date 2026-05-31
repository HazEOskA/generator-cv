import type { CandidateScore, CandidateWorkspace } from "./types";

export function scoreCandidate(candidate: CandidateWorkspace): CandidateScore {
  const strengths: string[] = [];
  const risks: string[] = [];
  const recruiterNotes: string[] = [];
  let total = 45;

  if (candidate.printingExp === "tak") {
    total += 25;
    strengths.push("Bezposrednie doswiadczenie w drukarni.");
  } else if (candidate.printingExp === "produkcja") {
    total += 16;
    strengths.push("Doswiadczenie produkcyjne lub magazynowe.");
  } else {
    total += 6;
    risks.push("Brak bezposredniego doswiadczenia w drukarni.");
  }

  if (candidate.drivingLicense === "kat-b") {
    total += 10;
    strengths.push("Prawo jazdy kat. B zwieksza mobilnosc.");
  } else {
    risks.push("Brak potwierdzonej mobilnosci autem.");
  }

  if (/od zaraz|natychmiast|asap/i.test(candidate.availability)) {
    total += 10;
    strengths.push("Kandydat deklaruje szybka dostepnosc.");
  }

  if (candidate.languages.trim().length > 12) {
    total += 5;
    strengths.push("Podane informacje jezykowe sa wystarczajace do wstepnej rozmowy.");
  } else {
    risks.push("Warto doprecyzowac poziom jezykow.");
  }

  if (candidate.experience.trim().length < 80) {
    risks.push("Opis doswiadczenia jest krotki i wymaga dopytania.");
  } else {
    total += 5;
  }

  recruiterNotes.push("Zweryfikowac dostepnosc telefonicznie.");
  recruiterNotes.push("Dopytac o zmianowosc, transport i oczekiwana stawke.");

  const boundedTotal = Math.max(0, Math.min(100, total));

  return {
    total: boundedTotal,
    label:
      boundedTotal >= 80
        ? "Wysoki potencjal"
        : boundedTotal >= 60
          ? "Dobry kandydat do rozmowy"
          : "Wymaga weryfikacji",
    strengths,
    risks,
    recruiterNotes,
  };
}
