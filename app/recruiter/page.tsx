"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Briefcase,
  FileText,
  User,
  Printer,
  X,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SavedCandidate = {
  id: number;
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
  hasPhoto: boolean;
  photoUrl: string | null;
  score: number;
  date: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(n: number) {
  return n >= 80
    ? "text-emerald-400"
    : n >= 50
    ? "text-yellow-400"
    : "text-red-400";
}

function scoreBg(n: number) {
  return n >= 80
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
    : n >= 50
    ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/40"
    : "bg-red-500/15 text-red-400 border-red-500/40";
}

function printingLabel(exp: string) {
  return exp === "tak"
    ? "Drukarnia"
    : exp === "produkcja"
    ? "Produkcja"
    : "Bez dośw.";
}

function printingBadgeCls(exp: string) {
  return exp === "tak"
    ? "bg-blue-500/20 text-blue-300"
    : exp === "produkcja"
    ? "bg-purple-500/20 text-purple-300"
    : "bg-slate-800 text-slate-400";
}

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreBg(score)}`}
    >
      {score ?? 0}%
    </span>
  );
}

// ─── Candidate card ───────────────────────────────────────────────────────────

function CandidateCard({
  c,
  isSelected,
  onSelect,
}: {
  c: SavedCandidate;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left bg-slate-900 border rounded-xl p-5 transition flex flex-col gap-3 ${
        isSelected
          ? "border-blue-500 shadow-lg shadow-blue-500/10"
          : "border-slate-800 hover:border-slate-600"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {c.hasPhoto && c.photoUrl ? (
            <img
              src={c.photoUrl}
              alt=""
              className="w-11 h-11 rounded-full object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <span className="text-slate-400 font-bold">
                {c.fullName?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">
              {c.fullName || "Brak nazwy"}
            </p>
            <p className="text-xs text-slate-400 truncate">{c.email}</p>
          </div>
        </div>
        <ScoreBadge score={c.score ?? 0} />
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {c.currentLocation && (
          <span className="flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            <MapPin size={10} /> {c.currentLocation}
          </span>
        )}
        {c.availability && (
          <span className="flex items-center gap-1 text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            <Calendar size={10} /> {c.availability}
          </span>
        )}
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${printingBadgeCls(c.printingExp)}`}
        >
          {printingLabel(c.printingExp)}
        </span>
        {c.drivingLicense && c.drivingLicense !== "brak" && (
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
            PJ {c.drivingLicense.toUpperCase()}
          </span>
        )}
      </div>

      {/* AI summary snippet */}
      {c.aiSummary && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {c.aiSummary}
        </p>
      )}

      {/* Education + languages row */}
      {(c.education || c.languages) && (
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {c.education && <span>🎓 {c.education}</span>}
          {c.languages && <span>🌐 {c.languages}</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-1">
        <span className="text-xs text-slate-600">Dodano: {c.date}</span>
        <span className="flex items-center gap-1 text-xs text-blue-400">
          Zobacz CV <ChevronRight size={11} />
        </span>
      </div>
    </button>
  );
}

// ─── CV Detail panel ──────────────────────────────────────────────────────────

function CVDetail({
  c,
  onClose,
}: {
  c: SavedCandidate;
  onClose: () => void;
}) {
  const printLabel =
    c.printingExp === "tak"
      ? "✓ Bezpośrednie doświadczenie w drukarni"
      : c.printingExp === "produkcja"
      ? "✓ Doświadczenie na produkcji / magazynie"
      : "Brak bezpośredniego doświadczenia";

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-blue-400" />
          <span className="font-semibold text-sm">{c.fullName}</span>
          <ScoreBadge score={c.score ?? 0} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            <Printer size={13} /> Drukuj CV
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* CV content */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="bg-white text-black rounded-lg shadow-xl p-8 font-serif text-sm">
          {/* Header */}
          <div className="flex items-start gap-5 border-b-2 border-slate-800 pb-6 mb-6">
            {c.hasPhoto && c.photoUrl ? (
              <img
                src={c.photoUrl}
                alt=""
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0">
                <User size={28} className="text-slate-300" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {c.fullName}
              </h1>
              <p className="text-slate-500 font-sans text-xs mt-1">
                Kandydat na stanowisko produkcyjne
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-sans text-slate-600">
                {c.phone && <span>📞 {c.phone}</span>}
                {c.email && <span>✉ {c.email}</span>}
                {c.currentLocation && (
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} /> {c.currentLocation}
                  </span>
                )}
                {c.birthDate && <span>ur. {c.birthDate}</span>}
              </div>
            </div>
            <div className="text-right text-xs font-sans text-slate-500 shrink-0">
              <p>Aplikacja: {c.date}</p>
              <p className={`mt-1 font-bold ${scoreColor(c.score ?? 0)}`}>
                {c.score ?? 0}% kompletności
              </p>
            </div>
          </div>

          {/* AI summary */}
          {c.aiSummary && (
            <div className="mb-6">
              <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-purple-400" />
                Profil zawodowy (AI)
              </h3>
              <p className="text-slate-700 italic leading-relaxed">
                {c.aiSummary}
              </p>
            </div>
          )}

          {/* Printing exp */}
          <div className="mb-6">
            <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-3">
              Doświadczenie produkcyjne
            </h3>
            <span className="text-xs font-sans font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded inline-block">
              {printLabel}
            </span>
          </div>

          {/* Experience */}
          {c.experience && (
            <div className="mb-6">
              <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-3">
                Historia zawodowa
              </h3>
              <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">
                {c.experience}
              </p>
            </div>
          )}

          {/* Education + languages */}
          {(c.education || c.languages) && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              {c.education && (
                <div>
                  <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    Wykształcenie
                  </h3>
                  <p className="font-medium text-slate-900">{c.education}</p>
                </div>
              )}
              {c.languages && (
                <div>
                  <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-2">
                    Języki
                  </h3>
                  <p className="font-medium text-slate-900">{c.languages}</p>
                </div>
              )}
            </div>
          )}

          {/* Availability + license */}
          {(c.availability || (c.drivingLicense && c.drivingLicense !== "brak")) && (
            <div className="flex gap-6 text-sm mb-8">
              {c.availability && (
                <span>
                  Dostępność: <strong>{c.availability}</strong>
                </span>
              )}
              {c.drivingLicense && c.drivingLicense !== "brak" && (
                <span>
                  Prawo jazdy: <strong>{c.drivingLicense.toUpperCase()}</strong>
                </span>
              )}
            </div>
          )}

          {/* GDPR */}
          <div className="mt-16 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-sans leading-tight">
            Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb
            niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem
            Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Recruiter view ────────────────────────────────────────────────────────────

export default function RecruiterView() {
  const [candidates, setCandidates] = useState<SavedCandidate[]>([]);
  const [selected, setSelected] = useState<SavedCandidate | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cv-builder-candidates");
      if (raw) setCandidates(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = candidates.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.currentLocation?.toLowerCase().includes(q) ||
      c.languages?.toLowerCase().includes(q) ||
      c.education?.toLowerCase().includes(q)
    );
  });

  // Score stats
  const avgScore =
    candidates.length > 0
      ? Math.round(candidates.reduce((s, c) => s + (c.score ?? 0), 0) / candidates.length)
      : 0;
  const complete = candidates.filter((c) => (c.score ?? 0) >= 80).length;

  return (
    <>
      {/* ── Screen view ── */}
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:hidden">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Briefcase size={18} className="text-blue-500" />
            <span className="font-bold text-base">Widok Rekrutera</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            {candidates.length > 0 && (
              <>
                <div className="text-xs text-slate-500">
                  Śr. kompletność:{" "}
                  <span className={`font-bold ${scoreColor(avgScore)}`}>
                    {avgScore}%
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Kompletnych:{" "}
                  <span className="font-bold text-emerald-400">{complete}</span>
                </div>
              </>
            )}
            <div className="text-sm bg-slate-800 px-3 py-1.5 rounded-full text-slate-400 flex items-center gap-1.5">
              <Users size={13} /> {candidates.length} kandydatów
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cv-builder"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
            >
              + Nowy kandydat
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Dashboard →
            </Link>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          {/* ── Left: card list ── */}
          <div className="w-[420px] shrink-0 border-r border-slate-800 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Szukaj po nazwisku, miejscowości, języku..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              {search && (
                <p className="text-xs text-slate-500 mt-2">
                  {filtered.length} z {candidates.length} wyników
                </p>
              )}
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <CandidateCard
                    key={c.id}
                    c={c}
                    isSelected={selected?.id === c.id}
                    onSelect={() =>
                      setSelected((prev) => (prev?.id === c.id ? null : c))
                    }
                  />
                ))
              ) : candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-3 text-center">
                  <Users size={40} className="stroke-1" />
                  <p className="font-medium text-sm">Brak kandydatów w bazie</p>
                  <p className="text-xs text-slate-600">
                    Dodaj pierwszego kandydata przez CV Builder
                  </p>
                  <Link
                    href="/cv-builder"
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition mt-1"
                  >
                    Otwórz CV Builder
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500 space-y-2 text-center">
                  <Search size={32} className="stroke-1" />
                  <p className="text-sm">
                    Brak wyników dla &quot;{search}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: CV detail or empty state ── */}
          <div className="flex-1 overflow-hidden">
            {selected ? (
              <CVDetail c={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                <FileText size={48} className="stroke-1" />
                <p className="text-sm">
                  Wybierz kandydata z listy, aby zobaczyć jego CV
                </p>
                {candidates.length === 0 && (
                  <Link
                    href="/cv-builder"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-2"
                  >
                    Utwórz pierwszy profil <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Print-only CV ── */}
      {selected && (
        <div className="hidden print:block p-16 bg-white text-black font-serif min-h-screen">
          <div className="flex items-start gap-6 border-b-2 border-slate-800 pb-8 mb-8">
            {selected.hasPhoto && selected.photoUrl && (
              <img
                src={selected.photoUrl}
                alt=""
                className="w-28 h-28 rounded-full object-cover border-2 border-slate-300 shrink-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {selected.fullName}
              </h1>
              <p className="text-slate-600 font-sans mt-1 text-sm font-medium">
                Kandydat na stanowisko produkcyjne
              </p>
              <div className="flex flex-wrap gap-6 mt-3 text-xs font-sans text-slate-600">
                {selected.phone && <span>Tel: {selected.phone}</span>}
                {selected.email && <span>{selected.email}</span>}
                {selected.currentLocation && <span>{selected.currentLocation}</span>}
                {selected.birthDate && <span>ur. {selected.birthDate}</span>}
              </div>
            </div>
            <div className="text-right text-xs font-sans text-slate-500 shrink-0">
              <p>Aplikacja: {selected.date}</p>
            </div>
          </div>

          {selected.aiSummary && (
            <div className="mb-7">
              <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
                Profil zawodowy
              </h3>
              <p className="text-slate-700 italic leading-relaxed">
                {selected.aiSummary}
              </p>
            </div>
          )}

          <div className="mb-7">
            <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
              Doświadczenie produkcyjne
            </h3>
            <p className="font-semibold">
              {selected.printingExp === "tak"
                ? "✓ Bezpośrednie doświadczenie w drukarni"
                : selected.printingExp === "produkcja"
                ? "✓ Doświadczenie na produkcji / magazynie"
                : "Brak bezpośredniego doświadczenia"}
            </p>
          </div>

          {selected.experience && (
            <div className="mb-7">
              <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-3">
                Historia zawodowa
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-900">
                {selected.experience}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mb-7">
            {selected.education && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-2">
                  Wykształcenie
                </h3>
                <p className="font-medium">{selected.education}</p>
              </div>
            )}
            {selected.languages && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold font-sans text-slate-400 border-b border-slate-200 pb-1 mb-2">
                  Języki
                </h3>
                <p className="font-medium">{selected.languages}</p>
              </div>
            )}
          </div>

          <div className="flex gap-8 text-sm mb-8">
            {selected.availability && (
              <span>
                Dostępność: <strong>{selected.availability}</strong>
              </span>
            )}
            {selected.drivingLicense && selected.drivingLicense !== "brak" && (
              <span>
                Prawo jazdy: <strong>{selected.drivingLicense.toUpperCase()}</strong>
              </span>
            )}
          </div>

          <div className="mt-20 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-sans leading-tight">
            Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb
            niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem
            Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
          </div>
        </div>
      )}
    </>
  );
}
