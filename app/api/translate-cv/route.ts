import { translateCvMock } from "@/lib/cv/translateCvMock";
import type { CvContent, TranslationLanguage } from "@/lib/cv/types";

type TranslateRequest = {
  content: CvContent;
  language?: TranslationLanguage;
};

export async function POST(request: Request) {
  const body = (await request.json()) as TranslateRequest;

  return Response.json({
    content: translateCvMock(body.content, body.language ?? "en"),
    mode: "mock",
  });
}
