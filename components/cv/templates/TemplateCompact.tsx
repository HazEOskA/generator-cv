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

const ageFromBirthDate = (iso: string): number | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

export function TemplateCompact({ candidate, content }: Props) {
  const age = ageFromBirthDate(candidate.birthDate);

  return (
    <div className="bg-white text-slate-900 min-h-[297mm] font-serif">
      <header className="px-9 pt-9 pb-5 flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-[40px] font-bold uppercase leading-[1.05] tracking-tight text-slate-900">
            {candidate.fullName || "Imię Nazwisko"}
          </h1>
          <p className="mt-1 text-[14px] font-medium text-slate-700">{content.headline}</p>
          {age !== null ? <p className="mt-0.5 text-[12px] text-slate-500">{age} lat</p> : null}
        </div>
        {candidate.cvPhotoDataUrl ? (
          <img
            src={candidate.cvPhotoDataUrl}
            alt={candidate.fullName}
            className="h-24 w-24 rounded-md object-cover border border-slate-300"
          />
        ) : null}
      </header>

      <div className="grid grid-cols-[36%_64%] gap-0">
        <aside className="bg-[#f1ece4] px-7 py-7 space-y-6">
          <CompactBlock title="Edukacja" accent="#b08968">
            <p className="text-[11px] leading-snug text-slate-800">{content.education}</p>
          </CompactBlock>

          <CompactBlock title="Kursy i szkolenia" accent="#b08968">
            <p className="text-[11px] leading-snug text-slate-800">
              {printingLabel(candidate.printingExp)}
            </p>
          </CompactBlock>

          <CompactBlock title="Mocne strony" accent="#b08968">
            <ul className="space-y-1 text-[11px] text-slate-800">
              {content.skills.map((s) => (
                <li key={s} className="leading-snug">— {s}</li>
              ))}
            </ul>
          </CompactBlock>

          <CompactBlock title="Języki obce" accent="#b08968">
            <p className="text-[11px] leading-snug text-slate-800 whitespace-pre-wrap">
              {content.languages}
            </p>
          </CompactBlock>

          <CompactBlock title="Kontakt" accent="#b08968">
            {candidate.phone ? <ContactLine label="tel." value={candidate.phone} /> : null}
            {candidate.email ? <ContactLine label="@" value={candidate.email} breakAll /> : null}
            {candidate.currentLocation ? (
              <ContactLine label="adres" value={candidate.currentLocation} />
            ) : null}
            <ContactLine label="prawo jazdy" value={drivingLabel(candidate.drivingLicense)} />
          </CompactBlock>
        </aside>

        <main className="px-8 py-7 space-y-6">
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-slate-800 border-b-2 border-[#b08968] pb-1">
              Doświadczenie zawodowe
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-800 whitespace-pre-wrap">
              {content.experience}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-slate-800 border-b-2 border-[#b08968] pb-1">
              Profil
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-800 whitespace-pre-wrap">
              {content.summary}
            </p>
          </section>

          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-slate-800 border-b-2 border-[#b08968] pb-1">
              Dostępność
            </h2>
            <p className="mt-3 text-[12px] leading-6 text-slate-800">{content.availability}</p>
          </section>

          <p className="border-t border-slate-200 pt-3 text-[9px] leading-tight text-slate-500">
            {content.consent}
          </p>
        </main>
      </div>
    </div>
  );
}

function CompactBlock({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-800 border-b-2 pb-1 mb-2"
        style={{ borderColor: accent }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function ContactLine({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div className="text-[11px] leading-snug">
      <span className="text-slate-500 mr-1">{label}</span>
      <span className={`text-slate-800 font-medium ${breakAll ? "break-all" : ""}`}>{value}</span>
    </div>
  );
}
