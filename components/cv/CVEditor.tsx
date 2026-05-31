"use client";

import type { CvContent } from "@/lib/cv/types";

type CVEditorProps = {
  content: CvContent;
  onChange: (content: CvContent) => void;
};

export function CVEditor({ content, onChange }: CVEditorProps) {
  const updateField = (field: keyof CvContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <section className="rounded-lg border border-slate-700 bg-slate-900 p-4">
      <h2 className="text-lg font-semibold text-white">Edytor CV</h2>
      <div className="mt-4 space-y-3">
        <label className="block text-sm text-slate-300">
          Nagłówek
          <input
            value={content.headline}
            onChange={(event) => updateField("headline", event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Profil zawodowy
          <textarea
            rows={4}
            value={content.summary}
            onChange={(event) => updateField("summary", event.target.value)}
            className="mt-1 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Doświadczenie
          <textarea
            rows={6}
            value={content.experience}
            onChange={(event) => updateField("experience", event.target.value)}
            className="mt-1 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Wykształcenie
          <input
            value={content.education}
            onChange={(event) => updateField("education", event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Umiejętności
          <textarea
            rows={4}
            value={content.skills.join("\n")}
            onChange={(event) =>
              onChange({
                ...content,
                skills: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            className="mt-1 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </label>
      </div>
    </section>
  );
}
