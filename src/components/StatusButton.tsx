"use client";

import { DiagnosticStatus } from "@/lib/diagnostic-data";

const STATUS_CYCLE: DiagnosticStatus[] = [null, "clear", "active", "partial"];
const STATUS_DISPLAY: Record<string, { symbol: string; className: string }> = {
  clear: {
    symbol: "✓",
    className:
      "border-status-clear text-status-clear bg-status-clear/10",
  },
  active: {
    symbol: "✗",
    className:
      "border-status-active text-status-active bg-status-active/10",
  },
  partial: {
    symbol: "~",
    className:
      "border-status-partial text-status-partial bg-status-partial/10",
  },
};

export default function StatusButton({
  status,
  onChange,
}: {
  status: DiagnosticStatus;
  onChange: (s: DiagnosticStatus) => void;
}) {
  function cycle() {
    const idx = STATUS_CYCLE.indexOf(status);
    onChange(STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
  }

  const display = status ? STATUS_DISPLAY[status] : null;

  return (
    <button
      type="button"
      onClick={cycle}
      className={`w-8 h-8 rounded-full border-[1.5px] flex items-center justify-center text-sm shrink-0 transition-all status-btn ${
        display?.className ?? "border-border text-text-dim"
      }`}
    >
      {display?.symbol ?? ""}
    </button>
  );
}
