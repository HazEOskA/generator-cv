export type Candidate = {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  birthDate: string;
  currentLocation?: string;
  availability?: string;
  education: string;
  experience: string;
  printingExp: string;
  languages?: string;
  drivingLicense?: string;
  photoDataUrl?: string | null;
  date: string;
};

export const printingExpLabel = (value: string): string => {
  if (value === "tak") return "Bezpośrednie doświadczenie w drukarni";
  if (value === "produkcja") return "Doświadczenie na produkcji / magazynie";
  return "Brak bezpośredniego doświadczenia (deklaruje szybką naukę)";
};

export const drivingLicenseLabel = (value?: string): string => {
  if (value === "kat-b") return "Kat. B";
  if (value === "inne") return "Inne";
  return "Brak";
};
