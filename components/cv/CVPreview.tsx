import type { CandidateWorkspace, CvContent, CvTemplateId } from "@/lib/cv/types";

type CVPreviewProps = {
  candidate: CandidateWorkspace;
  content: CvContent;
  template: CvTemplateId;
};

const templateClass: Record<CvTemplateId, string> = {
  production: "border-cyan-600",
  classic: "border-slate-300",
  compact: "border-emerald-600",
};

export function CVPreview({ candidate, content, template }: CVPreviewProps) {
  return (
    <article
      id="cv-print-area"
      className={`min-h-[297mm] rounded-lg border-t-4 bg-white p-7 text-slate-950 shadow-2xl shadow-slate-950/40 print:min-h-0 print:rounded-none print:border-0 print:p-0 print:shadow-none ${templateClass[template]}`}
    >
      <header className="border-b border-slate-300 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          WorkPeople CV
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{candidate.fullName}</h1>
            <p className="mt-1 text-sm font-semibold text-cyan-700">{content.headline}</p>
          </div>
          <div className="text-sm text-slate-600 sm:text-right">
            <p>{candidate.phone}</p>
            <p>{candidate.email}</p>
            <p>{candidate.currentLocation}</p>
          </div>
        </div>
      </header>

      <div className={template === "compact" ? "mt-6 grid gap-6 md:grid-cols-[1fr_0.7fr]" : "mt-7 space-y-7"}>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Profil
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{content.summary}</p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Doświadczenie
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{content.experience}</p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Wykształcenie
          </h2>
          <p className="mt-2 text-sm font-medium">{content.education}</p>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Umiejętności i dostępność
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {content.skills.map((skill) => (
              <li key={skill}>- {skill}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm">Języki: {content.languages}</p>
        </section>
      </div>

      <footer className="mt-12 border-t border-slate-200 pt-3 text-[10px] leading-tight text-slate-500">
        {content.consent}
      </footer>
    </article>
  );
}
