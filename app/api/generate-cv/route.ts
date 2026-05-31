import { buildCandidateMarkdown } from "@/lib/cv/buildCandidateMarkdown";
import { buildCvContent } from "@/lib/cv/buildCvContent";
import { scoreCandidate } from "@/lib/cv/scoreCandidate";
import type { CandidateWorkspace } from "@/lib/cv/types";

export async function POST(request: Request) {
  const candidate = (await request.json()) as CandidateWorkspace;
  const cvContent = buildCvContent(candidate);

  return Response.json({
    candidate,
    cvContent,
    markdown: buildCandidateMarkdown(candidate, cvContent),
    score: scoreCandidate(candidate),
    mode: "deterministic",
  });
}
