import type { Candidate } from "../../_lib/candidate";
import { drivingLicenseLabel, printingExpLabel } from "../../_lib/candidate";

type Props = { candidate: Candidate };

export default function TemplateClassic({ candidate }: Props) {
  return (
    <div className="bg-white text-slate-900 w-full min-h-[297mm] shadow-xl print:shadow-none border border-slate-200 print:border-none mx-auto font-serif">
      <div className="px-14 pt-14 pb-10">
        <div className="flex items-end justify-between gap-8 border-b-4 border-slate-900 pb-6">
          <div className="min-w-0">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.05] text-slate-900 uppercase">
              {candidate.fullName || "Imię Nazwisko"}
            </h1>
            <p className="mt-3 text-xs font-sans uppercase tracking-[0.35em] text-slate-500 font-semibold">
              Kandydat · Praca w drukarni / produkcji
            </p>
          </div>
          {candidate.photoDataUrl ? (
            <img
              src={candidate.photoDataUrl}
              alt={candidate.fullName}
              className="h-28 w-28 object-cover rounded-full border-2 border-slate-900 flex-shrink-0"
            />
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 text-[11px] font-sans text-slate-700">
          {candidate.phone ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Telefon</div>
              <div className="text-slate-900 font-semibold">{candidate.phone}</div>
            </div>
          ) : null}
          {candidate.email ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">E-mail</div>
              <div className="text-slate-900 font-semibold break-all">{candidate.email}</div>
            </div>
          ) : null}
          {candidate.currentLocation ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Miejscowość</div>
              <div className="text-slate-900 font-semibold">{candidate.currentLocation}</div>
            </div>
          ) : null}
          {candidate.birthDate ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Data urodzenia</div>
              <div className="text-slate-900 font-semibold">{candidate.birthDate}</div>
            </div>
          ) : null}
          {candidate.availability ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Dostępność</div>
              <div className="text-slate-900 font-semibold">{candidate.availability}</div>
            </div>
          ) : null}
          {candidate.drivingLicense ? (
            <div>
              <div className="uppercase tracking-wider text-[10px] text-slate-400 font-semibold">Prawo jazdy</div>
              <div className="text-slate-900 font-semibold">{drivingLicenseLabel(candidate.drivingLicense)}</div>
            </div>
          ) : null}
        </div>

        <section className="mt-10">
          <h2 className="font-sans text-[11px] tracking-[0.3em] uppercase font-bold text-slate-900 border-b border-slate-300 pb-1">
            Profil
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-800">
            {printingExpLabel(candidate.printingExp)}.
            {candidate.availability ? ` Dostępność: ${candidate.availability}.` : ""}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="font-sans text-[11px] tracking-[0.3em] uppercase font-bold text-slate-900 border-b border-slate-300 pb-1">
            Doświadczenie zawodowe
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-800 whitespace-pre-wrap">
            {candidate.experience}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="font-sans text-[11px] tracking-[0.3em] uppercase font-bold text-slate-900 border-b border-slate-300 pb-1">
              Wykształcenie
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-800">{candidate.education}</p>
          </div>
          {candidate.languages ? (
            <div>
              <h2 className="font-sans text-[11px] tracking-[0.3em] uppercase font-bold text-slate-900 border-b border-slate-300 pb-1">
                Języki
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-800">{candidate.languages}</p>
            </div>
          ) : null}
        </section>

        <p className="mt-16 pt-4 border-t border-slate-200 text-[9px] font-sans text-slate-400 leading-tight">
          Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji
          zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
        </p>
      </div>
    </div>
  );
}
