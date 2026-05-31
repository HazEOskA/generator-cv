import type { CandidateScore } from "@/lib/cv/types";

type CandidateScoreCardProps = {
  score: CandidateScore;
};

export function CandidateScoreCard({ score }: CandidateScoreCardProps) {
  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl shadow-slate-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Ocena kandydata
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">{score.label}</h2>
        </div>
        <div className="grid h-16 w-16 place-items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-xl font-bold text-cyan-100">
          {score.total}
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-cyan-400"
          style={{ width: `${score.total}%` }}
        />
      </div>

      <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-emerald-300">Mocne strony</h3>
          <ul className="mt-2 space-y-1 text-slate-300">
            {score.strengths.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-amber-300">Ryzyka / pytania</h3>
          <ul className="mt-2 space-y-1 text-slate-300">
            {score.risks.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <h3 className="text-sm font-semibold text-slate-100">Notatki dla rekrutera</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-300">
          {score.recruiterNotes.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
