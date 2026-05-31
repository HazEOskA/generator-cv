"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Clipboard, FileText, Printer, Send } from "lucide-react";
import { buildCandidateMarkdown } from "@/lib/cv/buildCandidateMarkdown";
import { buildCvContent } from "@/lib/cv/buildCvContent";
import { scoreCandidate } from "@/lib/cv/scoreCandidate";
import type {
  CandidateFormData,
  CandidateWorkspace,
  CvContent,
  CvTemplateId,
} from "@/lib/cv/types";
import { CandidateScoreCard } from "@/components/cv/CandidateScoreCard";
import { CVEditor } from "@/components/cv/CVEditor";
import { CVPreview } from "@/components/cv/CVPreview";
import { TemplateSelector } from "@/components/cv/TemplateSelector";
import { TranslationPanel } from "@/components/cv/TranslationPanel";

const formspreeEndpoint = "https://formspree.io/f/xjgzdoag";

const initialFormData: CandidateFormData = {
  fullName: "",
  phone: "",
  email: "",
  birthDate: "",
  currentLocation: "",
  availability: "",
  education: "",
  experience: "",
  printingExp: "nie",
  languages: "",
  drivingLicense: "brak",
  cvConsent: false,
};

export default function CandidateForm() {
  const [formData, setFormData] = useState<CandidateFormData>(initialFormData);
  const [cvPhoto, setCvPhoto] = useState<File | null>(null);
  const [submittedCandidate, setSubmittedCandidate] = useState<CandidateWorkspace | null>(null);
  const [currentView, setCurrentView] = useState<"form" | "workspace">("form");
  const [cvContent, setCvContent] = useState<CvContent | null>(null);
  const [template, setTemplate] = useState<CvTemplateId>("production");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; error: string | null }>({
    success: false,
    error: null,
  });
  const [loading, setLoading] = useState(false);

  const score = useMemo(
    () => (submittedCandidate ? scoreCandidate(submittedCandidate) : null),
    [submittedCandidate]
  );

  const markdown = useMemo(
    () =>
      submittedCandidate && cvContent
        ? buildCandidateMarkdown(submittedCandidate, cvContent)
        : "",
    [submittedCandidate, cvContent]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData({
        ...formData,
        [target.name]: target.checked,
      });
      return;
    }

    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setCvPhoto(null);
      return;
    }

    const maxSizeMb = 5;
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      setCvPhoto(null);
      setStatus({
        success: false,
        error: `Zdjęcie jest za duże. Maksymalny rozmiar pliku to ${maxSizeMb} MB.`,
      });
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setCvPhoto(null);
      setStatus({
        success: false,
        error: "Możesz dodać tylko plik graficzny, np. JPG, PNG lub WEBP.",
      });
      e.target.value = "";
      return;
    }

    setStatus({ success: false, error: null });
    setCvPhoto(file);
  };

  const createWorkspace = (candidateSnapshot: CandidateWorkspace) => {
    const content = buildCvContent(candidateSnapshot);

    setSubmittedCandidate(candidateSnapshot);
    setCvContent(content);
    setCurrentView("workspace");

    const existing = JSON.parse(localStorage.getItem("workpeopleCandidates") || "[]") as CandidateWorkspace[];
    localStorage.setItem("workpeopleCandidates", JSON.stringify([candidateSnapshot, ...existing]));

    const dashboardCandidate = {
      id: Date.now(),
      fullName: candidateSnapshot.fullName,
      phone: candidateSnapshot.phone,
      birthDate: candidateSnapshot.birthDate,
      education: candidateSnapshot.education,
      experience: candidateSnapshot.experience,
      printingExp: candidateSnapshot.printingExp,
      date: new Date(candidateSnapshot.submittedAt).toLocaleDateString("pl-PL"),
    };
    const dashboardExisting = JSON.parse(localStorage.getItem("candidates") || "[]");
    localStorage.setItem("candidates", JSON.stringify([dashboardCandidate, ...dashboardExisting]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cvConsent) {
      setStatus({
        success: false,
        error: "Musisz wyrazić zgodę na przetwarzanie danych w celu prowadzenia rekrutacji.",
      });
      return;
    }

    setLoading(true);
    setStatus({ success: false, error: null });

    try {
      const submittedAt = new Date().toISOString();
      const candidateSnapshot: CandidateWorkspace = {
        ...formData,
        id: crypto.randomUUID(),
        submittedAt,
        source: "Formularz Rekrutacyjny - Praca w Drukarni",
        cvPhotoName: cvPhoto?.name ?? "",
      };
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      payload.append("submittedAt", submittedAt);
      payload.append("source", "Formularz Rekrutacyjny - Praca w Drukarni");

      if (cvPhoto) {
        payload.append("cvPhoto", cvPhoto);
      }

      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: payload,
      });

      if (response.ok) {
        createWorkspace(candidateSnapshot);
        setStatus({ success: true, error: null });
      } else {
        const data = await response.json();
        setStatus({
          success: false,
          error: data.error || "Wystąpił błąd podczas wysyłania formularza.",
        });
      }
    } catch {
      setStatus({
        success: false,
        error: "Błąd połączenia z serwerem. Spróbuj ponownie za chwilę.",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (currentView === "workspace" && submittedCandidate && cvContent && score) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 print:bg-white">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur print:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                WorkPeople CV Copilot MVP
              </p>
              <h1 className="text-xl font-semibold text-white">
                Workspace CV: {submittedCandidate.fullName}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedCandidate(null);
                  setCvContent(null);
                  setCurrentView("form");
                  setFormData(initialFormData);
                  setCvPhoto(null);
                  setStatus({ success: false, error: null });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-slate-500"
              >
                <ArrowLeft size={16} /> Wróć do formularza
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                <Printer size={16} /> Drukuj / zapisz PDF
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[0.9fr_1.1fr] print:block print:p-0">
          <div className="space-y-5 print:hidden">
            <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <h2 className="text-lg font-semibold text-white">Dane kandydata</h2>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Telefon</dt>
                  <dd className="font-medium text-slate-100">{submittedCandidate.phone}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">E-mail</dt>
                  <dd className="font-medium text-slate-100">{submittedCandidate.email}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Lokalizacja</dt>
                  <dd className="font-medium text-slate-100">{submittedCandidate.currentLocation}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Dostępność</dt>
                  <dd className="font-medium text-slate-100">{submittedCandidate.availability}</dd>
                </div>
              </dl>
            </section>

            <CandidateScoreCard score={score} />
            <TemplateSelector value={template} onChange={setTemplate} />
            <CVEditor content={cvContent} onChange={setCvContent} />
            <TranslationPanel content={cvContent} />

            <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">Markdown dla AI</h2>
                <button
                  type="button"
                  onClick={copyMarkdown}
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
                >
                  <Clipboard size={16} /> {copied ? "Skopiowano" : "Kopiuj"}
                </button>
              </div>
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-300">
                {markdown}
              </pre>
            </section>
          </div>

          <div className="print:block">
            <CVPreview candidate={submittedCandidate} content={cvContent} template={template} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:py-10">
      <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-slate-950/40 md:p-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Rekrutacja / Intake CV
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Formularz Rekrutacyjny - Praca w Drukarni
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Dane zostaną wysłane przez obecny Formspree, a po udanym wysłaniu powstanie lokalny workspace CV.
          </p>
        </header>

        {status.error && (
          <div className="mt-5 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput label="Imię i nazwisko" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="np. Grzegorz Pawłowski" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput label="Numer telefonu" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="np. +48 790 267 752" />
            <FormInput label="Adres e-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="np. kandydat@email.com" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput label="Data urodzenia" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required />
            <FormInput label="Miejscowość / kraj pobytu" name="currentLocation" value={formData.currentLocation} onChange={handleChange} required placeholder="np. Rotterdam, Holandia" />
          </div>

          <FormInput label="Dostępność od kiedy" name="availability" value={formData.availability} onChange={handleChange} required placeholder="np. od zaraz, od 15 czerwca" />
          <FormInput label="Wykształcenie" name="education" value={formData.education} onChange={handleChange} required placeholder="np. zawodowe, średnie, techniczne" />

          <label className="block text-sm font-medium text-slate-300">
            Doświadczenie zawodowe
            <textarea
              required
              rows={5}
              name="experience"
              placeholder="Podaj firmę, stanowisko, okres pracy i główne obowiązki."
              className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
              value={formData.experience}
              onChange={handleChange}
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Czy masz doświadczenie w pracy w drukarni / na produkcji?
            <select
              name="printingExp"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
              value={formData.printingExp}
              onChange={handleChange}
            >
              <option value="nie">Nie, ale szybko się uczę</option>
              <option value="tak">Tak, pracowałem już w drukarni</option>
              <option value="produkcja">Pracowałem na innej produkcji / magazynie</option>
            </select>
          </label>

          <FormInput label="Języki" name="languages" value={formData.languages} onChange={handleChange} required placeholder="np. polski ojczysty, angielski podstawowy" />

          <label className="block text-sm font-medium text-slate-300">
            Prawo jazdy
            <select
              name="drivingLicense"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
              value={formData.drivingLicense}
              onChange={handleChange}
            >
              <option value="brak">Brak</option>
              <option value="kat-b">Kat. B</option>
              <option value="inne">Inne</option>
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Zdjęcie do CV (opcjonalnie)
            <input
              type="file"
              name="cvPhoto"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white file:mr-4 file:rounded-md file:border-0 file:bg-cyan-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-cyan-500"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Zdjęcie nie jest wymagane. Maksymalny rozmiar: 5 MB.
            </span>
            {cvPhoto && <span className="mt-1 block text-xs text-emerald-300">Wybrane zdjęcie: {cvPhoto.name}</span>}
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
            <input
              required
              type="checkbox"
              name="cvConsent"
              checked={formData.cvConsent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 accent-cyan-500"
            />
            <span>Wyrażam zgodę na przetwarzanie moich danych osobowych w celu prowadzenia rekrutacji.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-300"
          >
            {loading ? <FileText size={18} /> : <Send size={18} />}
            {loading ? "Wysyłanie..." : "Wyślij dane i utwórz workspace CV"}
          </button>
        </form>
      </section>
    </main>
  );
}

type FormInputProps = {
  label: string;
  name: keyof CandidateFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: FormInputProps) {
  return (
    <label className="block text-sm font-medium text-slate-300">
      {label}
      <input
        required={required}
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
