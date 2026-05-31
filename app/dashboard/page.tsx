"use client";
import { useEffect, useState } from "react";
import { Printer, Users, Briefcase, FileText } from "lucide-react";

interface Candidate {
  id: number;
  fullName: string;
  phone: string;
  birthDate: string;
  education: string;
  experience: string;
  printingExp: string;
  date: string;
}

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("candidates");
    if (data) {
      const parsed = JSON.parse(data);
      setCandidates(parsed);
      if (parsed.length > 0) setActiveCandidate(parsed[0]);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col print:bg-white print:text-black">
      {/* Pasek nawigacyjny - Ukryty w druku */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <Briefcase className="text-blue-500" />
          <span className="font-bold text-lg">Drukarnia Recruitment OS</span>
        </div>
        <div className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400 flex items-center gap-1.5">
          <Users size={14} /> Kandydatów: {candidates.length}
        </div>
      </header>

      {/* Główny Layout */}
      <div className="flex-1 flex print:block">
        {/* Lewa kolumna: lista kandydatów - Ukryta w druku */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 p-4 space-y-2 overflow-y-auto print:hidden">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Wpłynięte aplikacje</h2>
          {candidates.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-2">Brak zgłoszeń w bazie.</p>
          ) : (
            candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCandidate(c)}
                className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 ${
                  activeCandidate?.id === c.id ? "bg-blue-600 text-white" : "bg-slate-950 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <span className="font-medium text-sm block truncate">{c.fullName}</span>
                <span className="text-xs opacity-70">{c.date}</span>
              </button>
            ))
          )}
        </aside>

        {/* Prawa kolumna: Podgląd CV / Generator PDF */}
        <main className="flex-1 p-6 bg-slate-950 print:bg-white print:p-0 flex flex-col items-center overflow-y-auto">
          {activeCandidate ? (
            <div className="w-full max-w-2xl space-y-4">
              {/* Przyciski kontrolne - Ukryte w druku */}
              <div className="flex justify-end print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition shadow-lg"
                >
                  <Printer size={16} /> Drukuj / Zapisz jako PDF
                </button>
              </div>

              {/* ARKUSZ CV DO GENEROWANIA (Zoptymalizowany pod A4 i wydruk) */}
              <div className="bg-white text-black p-12 rounded-lg shadow-xl print:shadow-none print:p-0 min-h-[297mm] font-serif border border-slate-200 print:border-none">
                <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">{activeCandidate.fullName}</h1>
                    <p className="text-slate-600 font-sans mt-1 font-medium text-sm">Kandydat na stanowisko produkcyjne</p>
                  </div>
                  <div className="text-right text-xs font-sans text-slate-500 space-y-0.5">
                    <p>Telefon: <span className="font-bold text-slate-900">{activeCandidate.phone}</span></p>
                    <p>Data ur.: {activeCandidate.birthDate}</p>
                    <p>Aplikacja z dnia: {activeCandidate.date}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Sekcja: Profil zawodowy / Doświadczenie w druku */}
                  <div>
                    <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 mb-2">Doświadczenie w Drukarni / Produkcji</h3>
                    <p className="text-sm font-sans font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded inline-block">
                      {activeCandidate.printingExp === "tak" && "✓ Posiada bezpośrednie doświadczenie w drukarni"}
                      {activeCandidate.printingExp === "produkcja" && "✓ Posiada doświadczenie na produkcji / magazynie"}
                      {activeCandidate.printingExp === "nie" && "Brak bezpośredniego doświadczenia (deklaruje szybką naukę)"}
                    </p>
                  </div>

                  {/* Sekcja: Historia zatrudnienia */}
                  <div>
                    <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-3">Przebieg Kariery Zawodowej</h3>
                    <p className="text-base text-slate-900 leading-relaxed whitespace-pre-wrap">{activeCandidate.experience}</p>
                  </div>

                  {/* Sekcja: Wykształcenie */}
                  <div>
                    <h3 className="text-xs uppercase font-sans tracking-widest font-bold text-slate-400 border-b border-slate-200 pb-1 mb-3">Wykształcenie</h3>
                    <p className="text-base text-slate-900 font-medium">{activeCandidate.education}</p>
                  </div>
                </div>

                {/* Stopka z klauzulą */}
                <div className="mt-24 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-sans leading-tight">
                  Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
                </div>
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