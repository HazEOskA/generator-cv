"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Download,
  User,
  Briefcase,
  FileText,
  CheckCircle2,
  MapPin,
  Printer,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CVData = {
  fullName: string;
  phone: string;
  email: string;
  birthDate: string;
  currentLocation: string;
  availability: string;
  education: string;
  experience: string;
  printingExp: string;
  languages: string;
  drivingLicense: string;
  aiSummary: string;
};

const EMPTY: CVData = {
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
  aiSummary: "",
};

// ─── Completeness score ────────────────────────────────────────────────────────

type ScoreField = { key: keyof CVData; label: string; weight: number };

const SCORE_FIELDS: ScoreField[] = [
  { key: "fullName", label: "Imię i nazwisko", weight: 15 },
  { key: "phone", label: "Telefon", weight: 10 },
  { key: "email", label: "E-mail", weight: 10 },
  { key: "birthDate", label: "Data urodzenia", weight: 5 },
  { key: "currentLocation", label: "Lokalizacja", weight: 10 },
  { key: "availability", label: "Dostępność", weight: 10 },
  { key: "education", label: "Wykształcenie", weight: 10 },
  { key: "experience", label: "Doświadczenie", weight: 20 },
  { key: "languages", label: "Języki", weight: 10 },
];

const MAX_FIELD_SCORE = SCORE_FIELDS.reduce((s, f) => s + f.weight, 0);
const PHOTO_BONUS = 10;

function computeScore(data: CVData, hasPhoto: boolean): number {
  const fieldScore = SCORE_FIELDS.reduce((acc, f) => {
    const v = data[f.key] as string;
    return acc + (v.trim() ? f.weight : 0);
  }, 0);
  return Math.min(
    100,
    Math.round(((fieldScore + (hasPhoto ? PHOTO_BONUS : 0)) / (MAX_FIELD_SCORE + PHOTO_BONUS)) * 100)
  );
}

function scoreColor(n: number) {
  return n >= 80 ? "text-emerald-400" : n >= 50 ? "text-yellow-400" : "text-red-400";
}
function scoreBarColor(n: number) {
  return n >= 80 ? "bg-emerald-500" : n >= 50 ? "bg-yellow-500" : "bg-red-500";
}

// ─── Shared input styles ───────────────────────────────────────────────────────

const INPUT =
  "w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm";
const LABEL = "block text-sm font-medium text-slate-300 mb-1.5";
const FIELD = "space-y-1";

// ─── Wizard step configs ───────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Dane osobowe", Icon: User },
  { id: 2, label: "Doświadczenie", Icon: Briefcase },
  { id: 3, label: "Finalizacja", Icon: FileText },
];

// ─── CV Builder ────────────────────────────────────────────────────────────────

export default function CVBuilder() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CVData>(EMPTY);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileId] = useState(() => Date.now());

  const score = computeScore(data, !!photoUrl);
  const missing = SCORE_FIELDS.filter((f) => !(data[f.key] as string).trim());

  function set(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPhotoUrl(null);
      setPhotoName(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Plik jest za duży. Maks. 5 MB.");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("Dozwolone tylko pliki graficzne (JPG, PNG, WEBP).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    setPhotoName(file.name);
    setSaved(false);
  }

  async function handleAI() {
    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const parts = [
      data.fullName ? `${data.fullName} to` : "Kandydat to",
      data.experience?.trim()
        ? `doświadczony specjalista z bogatą historią zawodową.`
        : "ambitna osoba otwarta na nowe wyzwania zawodowe.",
      data.education ? `Posiada wykształcenie ${data.education.toLowerCase()}.` : "",
      data.languages ? `Języki obce: ${data.languages}.` : "",
      data.printingExp === "tak"
        ? "Ma bezpośrednie doświadczenie w pracy w drukarni."
        : data.printingExp === "produkcja"
        ? "Pracował wcześniej na produkcji lub w magazynie."
        : "",
      data.availability ? `Dostępny od: ${data.availability}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    setData((prev) => ({ ...prev, aiSummary: parts }));
    setAiLoading(false);
    setSaved(false);
  }

  function handleSave() {
    const list: object[] = JSON.parse(
      localStorage.getItem("cv-builder-candidates") || "[]"
    );
    const record = {
      id: profileId,
      ...data,
      photoUrl: photoUrl ?? null,
      hasPhoto: !!photoUrl,
      score,
      date: new Date().toLocaleDateString("pl-PL"),
    };
    const idx = list.findIndex((c: unknown) => (c as { id: number }).id === profileId);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.push(record);
    }
    localStorage.setItem("cv-builder-candidates", JSON.stringify(list));
    setSaved(true);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const printingLabel =
    data.printingExp === "tak"
      ? "✓ Bezpośrednie doświadczenie w drukarni"
      : data.printingExp === "produkcja"
      ? "✓ Doświadczenie na produkcji / magazynie"
      : "Brak bezpośredniego doświadczenia";

  return (
    <>
      {/* ── Screen view ── */}
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:hidden">
        {/* Nav */}
        <nav className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-bold text-blue-400 text-sm">CV Builder</span>
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              ← Formularz
            </Link>
            <Link
              href="/recruiter"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Widok rekrutera →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${scoreBarColor(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={`text-sm font-bold ${scoreColor(score)}`}>
                {score}%
              </span>
            </div>
            <Link
              href="/recruiter"
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              <Users size={13} /> Rekruterzy
            </Link>
          </div>
        </nav>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* ── Wizard column ── */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-6 flex-1 flex flex-col max-w-xl mx-auto w-full">
              {/* Step indicator */}
              <div className="flex items-center gap-1 mb-8">
                {STEPS.map(({ id, label, Icon }, i) => {
                  const isActive = id === step;
                  const isDone = id < step;
                  return (
                    <div key={id} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => isDone && setStep(id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isDone
                            ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-default"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={13} /> : <Icon size={13} />}
                        {label}
                      </button>
                      {i < STEPS.length - 1 && (
                        <ChevronRight size={14} className="text-slate-700 mx-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5 flex-1">
                  <div>
                    <h2 className="text-xl font-bold">Dane osobowe</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Podstawowe dane kontaktowe kandydata.
                    </p>
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>Imię i nazwisko</label>
                    <input
                      name="fullName"
                      value={data.fullName}
                      onChange={set}
                      placeholder="np. Anna Kowalska"
                      className={INPUT}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={FIELD}>
                      <label className={LABEL}>Telefon</label>
                      <input
                        name="phone"
                        value={data.phone}
                        onChange={set}
                        placeholder="+48 000 000 000"
                        className={INPUT}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>E-mail</label>
                      <input
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={set}
                        placeholder="email@example.com"
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={FIELD}>
                      <label className={LABEL}>Data urodzenia</label>
                      <input
                        name="birthDate"
                        type="date"
                        value={data.birthDate}
                        onChange={set}
                        className={INPUT}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>Miejscowość / kraj</label>
                      <input
                        name="currentLocation"
                        value={data.currentLocation}
                        onChange={set}
                        placeholder="np. Rotterdam, NL"
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>
                      Zdjęcie CV{" "}
                      <span className="text-slate-500 font-normal">(opcjonalnie, +10 pkt.)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm
                        file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5
                        file:text-xs file:font-medium file:text-white hover:file:bg-blue-700
                        focus:outline-none focus:border-blue-500"
                    />
                    {photoError && (
                      <p className="text-xs text-red-400 mt-1">{photoError}</p>
                    )}
                    {photoName && !photoError && (
                      <p className="text-xs text-emerald-400 mt-1">✓ {photoName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-5 flex-1">
                  <div>
                    <h2 className="text-xl font-bold">Profil zawodowy</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Doświadczenie, umiejętności i dostępność.
                    </p>
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>Dostępność od kiedy</label>
                    <input
                      name="availability"
                      value={data.availability}
                      onChange={set}
                      placeholder="np. od zaraz, od 15 lipca"
                      className={INPUT}
                    />
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>Wykształcenie</label>
                    <input
                      name="education"
                      value={data.education}
                      onChange={set}
                      placeholder="np. zawodowe, średnie techniczne"
                      className={INPUT}
                    />
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>Doświadczenie zawodowe</label>
                    <textarea
                      name="experience"
                      value={data.experience}
                      onChange={set}
                      rows={5}
                      placeholder="Firma, stanowisko, okres, główne obowiązki..."
                      className={`${INPUT} resize-none`}
                    />
                  </div>

                  <div className={FIELD}>
                    <label className={LABEL}>
                      Doświadczenie w drukarni / produkcji
                    </label>
                    <select
                      name="printingExp"
                      value={data.printingExp}
                      onChange={set}
                      className={INPUT}
                    >
                      <option value="nie">Nie, ale szybko się uczę</option>
                      <option value="tak">Tak, pracowałem w drukarni</option>
                      <option value="produkcja">Produkcja / magazyn</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={FIELD}>
                      <label className={LABEL}>Języki</label>
                      <input
                        name="languages"
                        value={data.languages}
                        onChange={set}
                        placeholder="np. PL ojczysty, EN podstawowy"
                        className={INPUT}
                      />
                    </div>
                    <div className={FIELD}>
                      <label className={LABEL}>Prawo jazdy</label>
                      <select
                        name="drivingLicense"
                        value={data.drivingLicense}
                        onChange={set}
                        className={INPUT}
                      >
                        <option value="brak">Brak</option>
                        <option value="kat-b">Kat. B</option>
                        <option value="inne">Inne</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-5 flex-1">
                  <div>
                    <h2 className="text-xl font-bold">Finalizacja</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      Podsumowanie AI, kompletność profilu i eksport.
                    </p>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-slate-900 border border-purple-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-400">
                        <Sparkles size={15} />
                        <span className="text-sm font-medium">Podsumowanie AI</span>
                      </div>
                      <span className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full">
                        Placeholder Beta
                      </span>
                    </div>

                    {data.aiSummary ? (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {data.aiSummary}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleAI}
                            disabled={aiLoading}
                            className="text-xs text-purple-400 hover:text-purple-300 underline"
                          >
                            Przepisz ponownie
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setData((prev) => ({ ...prev, aiSummary: "" }))
                            }
                            className="text-xs text-slate-500 hover:text-slate-400 underline"
                          >
                            Usuń
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500 leading-relaxed">
                          AI wygeneruje profesjonalne podsumowanie kandydata na podstawie
                          wprowadzonych danych. Produkcyjnie: integracja z Claude API.
                        </p>
                        <button
                          type="button"
                          onClick={handleAI}
                          disabled={aiLoading}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition"
                        >
                          {aiLoading ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                              Generuję podsumowanie...
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} /> Generuj podsumowanie AI
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Completeness */}
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">
                        Kompletność profilu
                      </span>
                      <span className={`text-xl font-bold ${scoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${scoreBarColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    {missing.length > 0 ? (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Brakujące pola ({missing.length}):
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {missing.map((f) => (
                            <span
                              key={f.key}
                              className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded"
                            >
                              {f.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Profil w pełni kompletny
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition ${
                        saved
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/50"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {saved ? (
                        <>
                          <CheckCircle2 size={15} /> Profil zapisany
                        </>
                      ) : (
                        "Zapisz profil"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-lg text-sm transition"
                      title="Eksport PDF — placeholder: produkcyjnie użyć biblioteki PDF"
                    >
                      <Download size={14} /> PDF
                    </button>
                  </div>

                  {saved && (
                    <Link
                      href="/recruiter"
                      className="block text-center text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                      → Przejdź do widoku rekrutera
                    </Link>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-sm transition"
                >
                  <ChevronLeft size={16} /> Wstecz
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
                  >
                    Dalej <ChevronRight size={16} />
                  </button>
                ) : (
                  <Link
                    href="/recruiter"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition"
                  >
                    Widok rekrutera <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Live preview column ── */}
          <div className="w-96 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 overflow-hidden">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Podgląd na żywo
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Kompletność:</span>
                <span className={`text-xs font-bold ${scoreColor(score)}`}>
                  {score}%
                </span>
              </div>
            </div>
            {/* Score bar */}
            <div className="h-1 bg-slate-800 shrink-0">
              <div
                className={`h-1 transition-all duration-300 ${scoreBarColor(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>

            {/* CV preview */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white text-black rounded-lg shadow-xl p-7 font-serif text-sm min-h-[600px]">
                {/* Header */}
                <div className="flex items-start gap-4 border-b-2 border-slate-800 pb-5 mb-5">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0">
                      <User size={24} className="text-slate-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h1
                      className={`text-xl font-bold tracking-tight ${
                        data.fullName ? "text-slate-900" : "text-slate-300"
                      }`}
                    >
                      {data.fullName || "Imię i Nazwisko"}
                    </h1>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">
                      Kandydat na stanowisko produkcyjne
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-sans text-slate-600">
                      {data.phone && <span>📞 {data.phone}</span>}
                      {data.email && <span>✉ {data.email}</span>}
                      {data.currentLocation && (
                        <span className="flex items-center gap-0.5">
                          <MapPin size={10} /> {data.currentLocation}
                        </span>
                      )}
                      {data.birthDate && <span>ur. {data.birthDate}</span>}
                    </div>
                  </div>
                </div>

                {/* AI summary */}
                {data.aiSummary && (
                  <div className="mb-5">
                    <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">
                      Profil zawodowy
                    </h3>
                    <p className="text-slate-700 font-sans text-xs leading-relaxed italic">
                      {data.aiSummary}
                    </p>
                  </div>
                )}

                {/* Printing exp */}
                <div className="mb-5">
                  <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    Doświadczenie produkcyjne
                  </h3>
                  <span className="text-xs font-sans font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                    {printingLabel}
                  </span>
                </div>

                {/* Experience */}
                {data.experience && (
                  <div className="mb-5">
                    <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">
                      Historia zawodowa
                    </h3>
                    <p className="text-slate-800 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                      {data.experience}
                    </p>
                  </div>
                )}

                {/* Education + languages */}
                {(data.education || data.languages) && (
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {data.education && (
                      <div>
                        <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-1.5">
                          Wykształcenie
                        </h3>
                        <p className="text-slate-800 font-sans text-xs">
                          {data.education}
                        </p>
                      </div>
                    )}
                    {data.languages && (
                      <div>
                        <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-1.5">
                          Języki
                        </h3>
                        <p className="text-slate-800 font-sans text-xs">
                          {data.languages}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Availability / license */}
                {(data.availability || data.drivingLicense !== "brak") && (
                  <div className="flex flex-wrap gap-4 text-xs font-sans text-slate-600 mb-5">
                    {data.availability && (
                      <span>
                        Dostępność:{" "}
                        <strong className="text-slate-800">{data.availability}</strong>
                      </span>
                    )}
                    {data.drivingLicense !== "brak" && (
                      <span>
                        Prawo jazdy:{" "}
                        <strong className="text-slate-800">{data.drivingLicense}</strong>
                      </span>
                    )}
                  </div>
                )}

                {/* GDPR */}
                <div className="mt-10 pt-3 border-t border-slate-200 text-[9px] text-slate-400 font-sans leading-tight">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb
                  niezbędnych do realizacji procesu rekrutacji (RODO).
                </div>
              </div>
            </div>

            {/* Print button */}
            <div className="p-4 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-medium transition"
              >
                <Printer size={15} /> Drukuj / Zapisz PDF
              </button>
              <p className="text-center text-xs text-slate-600 mt-2">
                Placeholder — produkcyjnie: generacja PDF po stronie serwera
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Print-only CV sheet ── */}
      <div className="hidden print:block p-16 bg-white text-black font-serif min-h-screen">
        <div className="flex items-start gap-6 border-b-2 border-slate-800 pb-8 mb-8">
          {photoUrl && (
            <img
              src={photoUrl}
              alt=""
              className="w-28 h-28 rounded-full object-cover border-2 border-slate-300 shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              {data.fullName || "—"}
            </h1>
            <p className="text-slate-600 font-sans mt-1 text-sm font-medium">
              Kandydat na stanowisko produkcyjne
            </p>
            <div className="flex flex-wrap gap-6 mt-3 text-xs font-sans text-slate-600">
              {data.phone && <span>Tel: {data.phone}</span>}
              {data.email && <span>{data.email}</span>}
              {data.currentLocation && <span>{data.currentLocation}</span>}
              {data.birthDate && <span>Data ur.: {data.birthDate}</span>}
            </div>
          </div>
        </div>

        {data.aiSummary && (
          <div className="mb-7">
            <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
              Profil zawodowy
            </h3>
            <p className="text-slate-700 italic leading-relaxed">{data.aiSummary}</p>
          </div>
        )}

        <div className="mb-7">
          <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
            Doświadczenie produkcyjne
          </h3>
          <p className="font-semibold text-slate-800">{printingLabel}</p>
        </div>

        {data.experience && (
          <div className="mb-7">
            <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
              Historia zawodowa
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-900">
              {data.experience}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-7">
          {data.education && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-2">
                Wykształcenie
              </h3>
              <p className="font-medium text-slate-900">{data.education}</p>
            </div>
          )}
          {data.languages && (
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-2">
                Języki
              </h3>
              <p className="font-medium text-slate-900">{data.languages}</p>
            </div>
          )}
        </div>

        <div className="flex gap-8 text-sm mb-8">
          {data.availability && (
            <span>
              Dostępność: <strong>{data.availability}</strong>
            </span>
          )}
          {data.drivingLicense !== "brak" && (
            <span>
              Prawo jazdy: <strong>{data.drivingLicense}</strong>
            </span>
          )}
        </div>

        <div className="mt-20 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-sans leading-tight">
          Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych
          do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu
          Europejskiego i Rady (UE) 2016/679 (RODO).
        </div>
      </div>
    </>
  );
}
