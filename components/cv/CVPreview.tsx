import type { CandidateWorkspace, CvContent, CvTemplateId } from "@/lib/cv/types";
import { TemplateProduction } from "./templates/TemplateProduction";
import { TemplateClassic } from "./templates/TemplateClassic";
import { TemplateCompact } from "./templates/TemplateCompact";

type CVPreviewProps = {
  candidate: CandidateWorkspace;
  content: CvContent;
  template: CvTemplateId;
};

export function CVPreview({ candidate, content, template }: CVPreviewProps) {
  return (
    <article
      id="cv-print-area"
      className="overflow-hidden rounded-lg bg-white text-slate-950 shadow-2xl shadow-slate-950/40 print:rounded-none print:shadow-none"
    >
      {template === "production" && <TemplateProduction candidate={candidate} content={content} />}
      {template === "classic" && <TemplateClassic candidate={candidate} content={content} />}
      {template === "compact" && <TemplateCompact candidate={candidate} content={content} />}
    </article>
  );
}
