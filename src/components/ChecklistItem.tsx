"use client";

import { DiagnosticStatus } from "@/lib/diagnostic-data";
import StatusButton from "./StatusButton";

export interface ChecklistItemData {
  status: DiagnosticStatus;
  notes: string;
}

export default function ChecklistItem({
  label,
  data,
  onChange,
}: {
  label: string;
  data: ChecklistItemData;
  onChange: (d: ChecklistItemData) => void;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-b-0">
      <StatusButton
        status={data.status}
        onChange={(s) => onChange({ ...data, status: s })}
      />
      <div className="flex-1">
        <div className="text-[0.82rem] leading-snug">{label}</div>
        {data.status && (
          <textarea
            placeholder="Notes…"
            rows={1}
            value={data.notes}
            onChange={(e) => onChange({ ...data, notes: e.target.value })}
            className="w-full mt-1.5 bg-white/[0.03] border border-border rounded px-2.5 py-1.5 text-xs text-text-primary resize-none focus:outline-none focus:border-gold-dim"
          />
        )}
      </div>
    </div>
  );
}
