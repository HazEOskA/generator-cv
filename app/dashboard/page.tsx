"use client";
import { useEffect, useState } from "react";
import { Printer, Users, Briefcase, FileText, LayoutTemplate } from "lucide-react";
import type { Candidate } from "../_lib/candidate";
import TemplateClassic from "../_components/templates/TemplateClassic";
import TemplateSidebar from "../_components/templates/TemplateSidebar";
import TemplateMinimal from "../_components/templates/TemplateMinimal";

type TemplateId = "classic" | "sidebar" | "minimal";

const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  { id: "classic", label: "Classic", description: "Stonowany, serifowy, jedna kolumna" },
  { id: "sidebar", label: "Sidebar", description: "Ciemny pasek boczny z danymi i zdjęciem" },
  { id: "minimal", label: "Minimal", description: "Akcent kolorystyczny, dwie kolumny" },
];

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [template, setTemplate] = useState<TemplateId>("classic");

  useEffect(() => {
    const data = localStorage.getItem("candidates");
    if (!data) return;
    try {
      const parsed: Candidate[] = JSON.parse(data);
      setCandidates(parsed);
      if (parsed.length > 0) setActiveCandidate(parsed[0]);
    } catch {
      setCandidates([]);
    }
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:bg-white print:text-black">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <Briefcase className="text-blue-500" />
          <span className="font-bold text-lg">Drukarnia Recruitment OS</span>
        </div>
        <div className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400 flex items-center gap-1.5">
          <Users size={14} /> Kandydatów: {candidates.length}
        </div>
      </header>

      <div className="flex-1 flex print:block">
        <aside className="w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-2 overflow-y-auto print:hidden">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Wpłynięte aplikacje
          </h2>
          {candidates.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-2">Brak zgłoszeń w bazie.</p>
          ) : (
            candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCandidate(c)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${
                  activeCandidate?.id === c.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                }`}
              >
                {c.photoDataUrl ? (
                  <img
                    src={c.photoDataUrl}
                    alt={c.fullName}
                    className="h-9 w-9 rounded-full object-cover border border-white/10 flex-shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {c.fullName.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-sm block truncate">{c.fullName}</span>
                  <span className="text-xs opacity-70">{c.date}</span>
                </div>
              </button>
            ))
          )}
        </aside>

        <main className="flex-1 p-6 bg-slate-950 print:bg-white print:p-0 flex flex-col items-center overflow-y-auto">
          {activeCandidate ? (
            <div className="w-full max-w-[860px] space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3 print:hidden">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <LayoutTemplate size={16} className="text-slate-400 ml-2" />
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      title={t.description}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${
                        template === t.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition shadow-lg"
                >
                  <Printer size={16} /> Drukuj / Zapisz jako PDF
                </button>
              </div>

              <div id="cv-print-area">
                {template === "classic" && <TemplateClassic candidate={activeCandidate} />}
                {template === "sidebar" && <TemplateSidebar candidate={activeCandidate} />}
                {template === "minimal" && <TemplateMinimal candidate={activeCandidate} />}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2">
              <FileText size={48} className="stroke-1" />
              <p>Wybierz kandydata z listy po lewej, aby wygenerować arkusz CV.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
