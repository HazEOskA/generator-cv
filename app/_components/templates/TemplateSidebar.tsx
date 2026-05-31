import type { Candidate } from "../../_lib/candidate";
import { drivingLicenseLabel, printingExpLabel } from "../../_lib/candidate";

type Props = { candidate: Candidate };

export default function TemplateSidebar({ candidate }: Props) {
  const initials = candidate.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="bg-white text-slate-900 w-full min-h-[297mm] shadow-xl print:shadow-none border border-slate-200 print:border-none mx-auto font-sans grid grid-cols-[34%_66%]">
      <aside className="bg-slate-900 text-slate-100 p-8 print:bg-slate-900 print:text-slate-100">
        <div className="flex flex-col items-center text-center">
          {candidate.photoDataUrl ? (
            <img
              src={candidate.photoDataUrl}
              alt={candidate.fullName}
              className="h-36 w-36 object-cover rounded-full border-4 border-white/20"
            />
          ) : initials ? (
            <div className="h-36 w-36 rounded-full bg-slate-700 border-4 border-white/20 flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
          ) : null}
        </div>

        <div className="mt-8 space-y-6 text-[11px] leading-relaxed">
          <Section title="Kontakt">
            {candidate.phone ? <Field label="Telefon" value={candidate.phone} /> : null}
            {candidate.email ? <Field label="E-mail" value={candidate.email} breakAll /> : null}
            {candidate.currentLocation ? <Field label="Lokalizacja" value={candidate.currentLocation} /> : null}
          </Section>

          <Section title="Dane">
            {candidate.birthDate ? <Field label="Data urodzenia" value={candidate.birthDate} /> : null}
            {candidate.availability ? <Field label="Dostępność" value={candidate.availability} /> : null}
            {candidate.drivingLicense ? (
              <Field label="Prawo jazdy" value={drivingLicenseLabel(candidate.drivingLicense)} />
            ) : null}
          </Section>

          {candidate.languages ? (
            <Section title="Języki">
              <p className="text-slate-200 whitespace-pre-wrap">{candidate.languages}</p>
            </Section>
          ) : null}

          <Section title="Doświadczenie">
            <p className="text-slate-200">{printingExpLabel(candidate.printingExp)}</p>
          </Section>
        </div>
      </aside>

      <main className="p-10">
        <header className="border-b-2 border-slate-900 pb-5">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-slate-900">
            {candidate.fullName || "Imię Nazwisko"}
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] font-semibold text-blue-700">
            Kandydat · Praca w drukarni / produkcji
          </p>
        </header>

        <section className="mt-7">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-slate-500">Profil zawodowy</h2>
          <div className="mt-2 h-[2px] w-10 bg-blue-600" />
          <p className="mt-3 text-[13px] leading-relaxed text-slate-800">
            {printingExpLabel(candidate.printingExp)}.
            {candidate.availability ? ` Dostępność: ${candidate.availability}.` : ""}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-slate-500">Doświadczenie zawodowe</h2>
          <div className="mt-2 h-[2px] w-10 bg-blue-600" />
          <p className="mt-3 text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {candidate.experience}
          </p>
        </section>

        <section className="mt-7">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-slate-500">Wykształcenie</h2>
          <div className="mt-2 h-[2px] w-10 bg-blue-600" />
          <p className="mt-3 text-[13px] leading-relaxed text-slate-800">{candidate.education}</p>
        </section>

        <p className="mt-12 pt-4 border-t border-slate-200 text-[9px] text-slate-400 leading-tight">
          Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji
          zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 mb-2 pb-1 border-b border-white/15">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-slate-100 font-medium ${breakAll ? "break-all" : ""}`}>{value}</div>
    </div>
  );
}
