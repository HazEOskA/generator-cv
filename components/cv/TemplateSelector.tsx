"use client";

import type { CvTemplateId } from "@/lib/cv/types";

type TemplateSelectorProps = {
  value: CvTemplateId;
  onChange: (value: CvTemplateId) => void;
};

const templates: Array<{ id: CvTemplateId; label: string }> = [
  { id: "production", label: "Produkcja" },
  { id: "classic", label: "Klasyczny" },
  { id: "compact", label: "Kompakt" },
];

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Szablon CV
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              value === template.id
                ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
            }`}
          >
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
}
