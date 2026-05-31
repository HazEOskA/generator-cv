import type { Candidate } from "../../_lib/candidate";
import { drivingLicenseLabel, printingExpLabel } from "../../_lib/candidate";

type Props = { candidate: Candidate };

export default function TemplateMinimal({ candidate }: Props) {
  return (
    <div className="bg-white text-slate-900 w-full min-h-[297mm] shadow-xl print:shadow-none border border-slate-200 print:border-none mx-auto font-sans">
      <header className="bg-emerald-700 text-white px-12 py-10 print:bg-emerald-700 print:text-white">
        <div className="flex items-center gap-6">
          {candidate.photoDataUrl ? (
            <img
              src={candidate.photoDataUrl}
              alt={candidate.fullName}
              className="h-24 w-24 object-cover rounded-md border-2 border-white/40 flex-shrink-0"
            />
          ) : null}
          <div className="min-w-0">
            <h1 className="text-4xl font-bold tracking-tight leading-tight">
              {candidate.fullName || "Imię Nazwisko"}
            </h1>
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] font-medium text-emerald-100">
              Kandydat · Praca w drukarni / produkcji
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-[30%_70%] gap-0">
        <aside className="bg-slate-50 px-8 py-10 space-y-6 text-[12px] text-slate-800">
          <Block title="Kontakt">
            {candidate.phone ? <Line label="Tel." value={candidate.phone} /> : null}
            {candidate.email ? <Line label="E-mail" value={candidate.email} breakAll /> : null}
            {candidate.currentLocation ? <Line label="Lokalizacja" value={candidate.currentLocation} /> : null}
          </Block>

          <Block title="Dane">
            {candidate.birthDate ? <Line label="Ur." value={candidate.birthDate} /> : null}
            {candidate.availability ? <Line label="Dostępność" value={candidate.availability} /> : null}
            {candidate.drivingLicense ? (
              <Line label="Prawo jazdy" value={drivingLicenseLabel(candidate.drivingLicense)} />
            ) : null}
          </Block>

          {candidate.languages ? (
            <Block title="Języki">
              <p className="whitespace-pre-wrap leading-relaxed">{candidate.languages}</p>
            </Block>
          ) : null}
        </aside>

        <main className="px-10 py-10 space-y-8">
          <section>
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-emerald-700">
              Profil zawodowy
            </h2>
            <div className="mt-2 h-[2px] w-full bg-slate-200">
              <div className="h-full w-12 bg-emerald-700" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-800">
              {printingExpLabel(candidate.printingExp)}.
              {candidate.availability ? ` Dostępność: ${candidate.availability}.` : ""}
            </p>
          </section>

          <section>
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-emerald-700">
              Doświadczenie zawodowe
            </h2>
            <div className="mt-2 h-[2px] w-full bg-slate-200">
              <div className="h-full w-12 bg-emerald-700" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
              {candidate.experience}
            </p>
          </section>

          <section>
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-emerald-700">
              Wykształcenie
            </h2>
            <div className="mt-2 h-[2px] w-full bg-slate-200">
              <div className="h-full w-12 bg-emerald-700" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-800">{candidate.education}</p>
          </section>

          <p className="pt-4 border-t border-slate-200 text-[9px] text-slate-400 leading-tight">
            Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu
            rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
          </p>
        </main>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-2 pb-1 border-b border-slate-300">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Line({ label, value, breakAll }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div className="leading-snug">
      <span className="text-[9px] uppercase tracking-wider text-slate-500 mr-1">{label}</span>
      <span className={`text-slate-900 font-medium ${breakAll ? "break-all" : ""}`}>{value}</span>
    </div>
  );
}
