import type { CvContent, TranslationLanguage } from "./types";

const labels: Record<TranslationLanguage, string> = {
  en: "English mock translation",
  nl: "Nederlandse mockvertaling",
  de: "Deutsche Mock-Ubersetzung",
};

export function translateCvMock(content: CvContent, language: TranslationLanguage): CvContent {
  const prefix = `[${labels[language]}]`;

  return {
    ...content,
    headline: `${prefix} ${content.headline}`,
    summary: `${prefix} ${content.summary}`,
    experience: `${prefix} ${content.experience}`,
    education: `${prefix} ${content.education}`,
    skills: content.skills.map((skill) => `${prefix} ${skill}`),
    languages: `${prefix} ${content.languages}`,
    availability: `${prefix} ${content.availability}`,
    consent: `${prefix} ${content.consent}`,
  };
}
