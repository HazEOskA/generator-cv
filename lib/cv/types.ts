export type PrintingExperience = "nie" | "tak" | "produkcja";
export type DrivingLicense = "brak" | "kat-b" | "inne";
export type CvTemplateId = "production" | "classic" | "compact";
export type TranslationLanguage = "en" | "nl" | "de";

export type CandidateFormData = {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  currentLocation: string;
  availability: string;
  education: string;
  experience: string;
  printingExp: PrintingExperience;
  languages: string;
  drivingLicense: DrivingLicense;
  cvConsent: boolean;
};

export type CandidateWorkspace = CandidateFormData & {
  id: string;
  submittedAt: string;
  source: string;
  cvPhotoName?: string;
};

export type CvContent = {
  headline: string;
  summary: string;
  experience: string;
  education: string;
  skills: string[];
  languages: string;
  availability: string;
  consent: string;
};

export type CandidateScore = {
  total: number;
  label: string;
  strengths: string[];
  risks: string[];
  recruiterNotes: string[];
};

export type CandidateWorkspacePayload = {
  candidate: CandidateWorkspace;
  markdown: string;
  cvContent: CvContent;
  score: CandidateScore;
};
