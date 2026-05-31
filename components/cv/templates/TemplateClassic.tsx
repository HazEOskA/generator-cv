import type { CandidateWorkspace, CvContent } from "@/lib/cv/types";

type Props = { candidate: CandidateWorkspace; content: CvContent };

const drivingLabel = (v: string) =>
  v === "kat-b" ? "Kat. B" : v === "inne" ? "Inne uprawnienia" : "Brak";

const printingLabel = (v: string) =>
  v === "tak"
    ? "Bezpośrednie doświadczenie w drukarni"
    : v === "produkcja"
    ? "Doświadczenie na produkcji / magazynie"
    : "Gotowość do przyuczenia, szybka nauka";

export function TemplateClassic({ candidate, content }: Props) {
  const firstName = candidate.fullName.split(" ")[0] ?? "";
  const rest = candidate.fullName.split(" ").slice(1).join(" ");

  return (
    <div className="grid min-h-[297mm] grid-cols-[34%_66%] bg-white text-slate-900 font-sans">
      <aside className="bg-slate-700 text-slate-100 px-6 py-7 space-y-6">
        <div className="overflow-hidden rounded-md border-2 border-white/20">
          {candidate.cvPhotoDataUrl ? (
            <img
              src={candidate.cvPhotoDataUrl}
              alt={candidate.fullName}
              className="w-full aspect-[3/4] object-cover"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-slate-600 flex items-center justify-center text-5xl font-bold">
              {candidate.fullName.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        <SidebarBlock title="Dane osobowe">
          {candidate.email ? <DataLine label="E-mail" value={candidate.email} breakAll /> : null}
          {candidate.phone ? <DataLine label="Telefon" value={candidate.phone} /> : null}
          {candidate.birthDate ? <DataLine label="Data urodzenia" value={candidate.birthDate} /> : null}
          {candidate.currentLocation ? <DataLine label="Adres" value={candidate.currentLocation} /> : null}
          {candidate.drivingLicense ? (
            <DataLine label="Prawo jazdy" value={drivingLabel(candidate.drivingLicense)} />
          ) : null}
        </SidebarBlock>

        <SidebarBlock title="Umiejętności">
          <ul className="space-y-1.5 text-[11px] leading-snug text-slate-200">
            {content.skills.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </SidebarBlock>

        <SidebarBlock title="Znajomość języków">
          <p className="text-[11px] text-slate-200 whitespace-pre-wrap leading-snug">
            {content.languages}
          </p>
        </SidebarBlock>
      </aside>

      <main className="px-9 py-9 space-y-7">
        <header>
          <h1 className="text-[40px] font-bold uppercase tracking-tight leading-[1] text-slate-900">
            <span className="block">{firstName}</span>
            <span className="block">{rest}</span>
          </h1>
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {content.headline}
          </p>
        </header>

        <IconSection title="O mnie">
          <p className="text-[12px] leading-6 text-slate-800 whitespace-pre-wrap">{content.summary}</p>
        </IconSection>

        <IconSection title="Doświadczenie zawodowe">
          <p className="text-[12px] leading-6 text-slate-800 whitespace-pre-wrap">{content.experience}</p>
        </IconSection>

        <IconSection title="Wykształcenie">
          <p className="text-[12px] leading-6 text-slate-800">{content.education}</p>
        </IconSection>

        <IconSection title="Atuty">
          <p className="text-[12px] leading-6 text-slate-800">
            {printingLabel(candidate.printingExp)}. Dostępność: {content.availability}.
          </p>
        </IconSection>

        <p className="border-t border-slate-200 pt-3 text-[9px] leading-tight text-slate-500">
          {content.consent}
        </p>
      </main>
    </div>
  );
}

function SidebarBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 border-b border-white/15 pb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
        <span className="inline-block h-3 w-3 rounded-full bg-slate-100" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function DataLine({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div className="text-[11px] leading-snug">
      <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-slate-100 font-medium ${breakAll ? "break-all" : ""}`}>{value}</div>
    </div>
  );
}

function IconSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-slate-800">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
          ●
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
