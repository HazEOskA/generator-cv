import type { CandidateWorkspace, CvContent } from "@/lib/cv/types";

type Props = { candidate: CandidateWorkspace; content: CvContent };

const drivingLabel = (v: string) =>
  v === "kat-b" ? "Prawo jazdy kat. B" : v === "inne" ? "Inne uprawnienia" : "Brak prawa jazdy";

const printingLabel = (v: string) =>
  v === "tak"
    ? "Bezpośrednie doświadczenie w drukarni"
    : v === "produkcja"
    ? "Doświadczenie na produkcji / magazynie"
    : "Gotowość do przyuczenia, szybka nauka";

export function TemplateProduction({ candidate, content }: Props) {
  const firstName = candidate.fullName.split(" ")[0] ?? "";
  const rest = candidate.fullName.split(" ").slice(1).join(" ");

  return (
    <div className="grid min-h-[297mm] grid-cols-[38%_62%] bg-white text-slate-900 font-sans">
      <aside className="bg-slate-800 text-slate-100 px-6 py-7 flex flex-col gap-6">
        <div className="flex justify-center">
          {candidate.cvPhotoDataUrl ? (
            <img
              src={candidate.cvPhotoDataUrl}
              alt={candidate.fullName}
              className="h-28 w-28 rounded-full border-[3px] border-white object-cover"
            />
          ) : (
            <div className="h-28 w-28 rounded-full border-[3px] border-white bg-slate-600 flex items-center justify-center text-2xl font-bold">
              {candidate.fullName.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <div className="space-y-1 text-[11px] leading-relaxed">
          {candidate.currentLocation ? (
            <SidebarRow label="Adres" value={candidate.currentLocation} />
          ) : null}
          {candidate.phone ? <SidebarRow label="Telefon" value={candidate.phone} /> : null}
          {candidate.email ? <SidebarRow label="E-mail" value={candidate.email} breakAll /> : null}
          {candidate.birthDate ? (
            <SidebarRow label="Data urodzenia" value={candidate.birthDate} />
          ) : null}
        </div>

        <Section title="Opis">
          <p className="text-[11px] leading-snug text-slate-200 whitespace-pre-wrap">
            {content.summary}
          </p>
        </Section>

        <Section title="Cechy">
          <ul className="space-y-1 text-[11px]">
            {content.skills.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-slate-200">{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Języki">
          <p className="text-[11px] text-slate-200 whitespace-pre-wrap leading-snug">
            {content.languages}
          </p>
        </Section>

        <Section title="Uprawnienia">
          <p className="text-[11px] text-slate-200">{drivingLabel(candidate.drivingLicense)}</p>
        </Section>
      </aside>

      <main className="px-8 py-8">
        <header className="border-b-2 border-slate-800 pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight leading-tight text-slate-900">
            <span className="block">{firstName}</span>
            <span className="block">{rest}</span>
          </h1>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-700">
            {content.headline}
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Doświadczenie zawodowe
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-cyan-700" />
          <p className="mt-3 text-[12px] leading-6 text-slate-800 whitespace-pre-wrap">
            {content.experience}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Wykształcenie
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-cyan-700" />
          <p className="mt-3 text-[12px] leading-6 text-slate-800">{content.education}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Atuty
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-cyan-700" />
          <p className="mt-3 text-[12px] leading-6 text-slate-800">
            {printingLabel(candidate.printingExp)}. Dostępność: {content.availability}.
          </p>
        </section>

        <p className="mt-10 border-t border-slate-200 pt-3 text-[9px] leading-tight text-slate-500">
          {content.consent}
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 border-b border-white/15 pb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/85">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SidebarRow({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-slate-100 font-medium ${breakAll ? "break-all" : ""}`}>{value}</div>
    </div>
  );
}
