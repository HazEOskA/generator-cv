"use client";

import { useState } from "react";
import type { CvContent, TranslationLanguage } from "@/lib/cv/types";
import { translateCvMock } from "@/lib/cv/translateCvMock";

type TranslationPanelProps = {
  content: CvContent;
};

const languages: Array<{ id: TranslationLanguage; label: string }> = [
  { id: "en", label: "EN" },
  { id: "nl", label: "NL" },
  { id: "de", label: "DE" },
];

export function TranslationPanel({ content }: TranslationPanelProps) {
  const [language, setLanguage] = useState<TranslationLanguage>("en");
  const translated = translateCvMock(content, language);

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Tłumaczenie mock
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">Pomoc dla rekrutera</h2>
        </div>
        <div className="flex rounded-md border border-slate-700 bg-slate-950 p-1">
          {languages.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLanguage(item.id)}
              className={`rounded px-3 py-1 text-sm font-medium ${
                language === item.id ? "bg-violet-500 text-white" : "text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-slate-950 p-3 text-sm leading-6 text-slate-300">
        <p className="font-semibold text-slate-100">{translated.headline}</p>
        <p className="mt-2">{translated.summary}</p>
      </div>
    </section>
  );
}
