"use client";

import { DiagnosticStatus } from "@/lib/diagnostic-data";

export default function SummaryBar({
  items,
}: {
  items: Record<string, { status: DiagnosticStatus }>;
}) {
  let clear = 0, active = 0, partial = 0, untested = 0;
  for (const v of Object.values(items)) {
    if (v.status === "clear") clear++;
    else if (v.status === "active") active++;
    else if (v.status === "partial") partial++;
    else untested++;
  }

  return (
    <div className="flex gap-4 py-3 mb-4 border-b border-border text-xs">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-status-clear" />
        {clear} Clear
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-status-active" />
        {active} Active
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-status-partial" />
        {partial} Partial
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-border" />
        {untested} Untested
      </div>
    </div>
  );
}
