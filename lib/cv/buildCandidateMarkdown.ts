import type { CandidateWorkspace, CvContent } from "./types";

export function buildCandidateMarkdown(
  candidate: CandidateWorkspace,
  cvContent: CvContent
): string {
  return [
    `# ${candidate.fullName}`,
    "",
    "## Kontakt",
    `- Telefon: ${candidate.phone}`,
    `- E-mail: ${candidate.email}`,
    `- Lokalizacja: ${candidate.currentLocation}`,
    `- Data urodzenia: ${candidate.birthDate}`,
    "",
    "## Rekrutacja",
    `- Dostepnosc: ${candidate.availability}`,
    `- Doswiadczenie drukarnia/produkcja: ${candidate.printingExp}`,
    `- Prawo jazdy: ${candidate.drivingLicense}`,
    `- Zrodlo: ${candidate.source}`,
    `- Data zgloszenia: ${candidate.submittedAt}`,
    candidate.cvPhotoName ? `- Zdjecie CV: ${candidate.cvPhotoName}` : "- Zdjecie CV: nie dodano",
    "",
    "## Profil CV",
    cvContent.summary,
    "",
    "## Doswiadczenie",
    cvContent.experience,
    "",
    "## Wyksztalcenie",
    cvContent.education,
    "",
    "## Umiejetnosci",
    ...cvContent.skills.map((skill) => `- ${skill}`),
    "",
    "## Jezyki",
    cvContent.languages,
  ].join("\n");
}
