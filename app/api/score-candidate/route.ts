import { scoreCandidate } from "@/lib/cv/scoreCandidate";
import type { CandidateWorkspace } from "@/lib/cv/types";

export async function POST(request: Request) {
  const candidate = (await request.json()) as CandidateWorkspace;

  return Response.json({
    score: scoreCandidate(candidate),
    mode: "deterministic",
  });
}
