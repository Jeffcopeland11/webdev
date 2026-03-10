"use client";

import { useState } from "react";

export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left bg-bg-card border border-border rounded-lg px-4 py-3 text-[0.85rem] flex items-center justify-between hover:bg-bg-card-hover transition-colors ${
          open ? "border-gold-dim rounded-b-none" : ""
        }`}
      >
        <span>{title}</span>
        <span
          className={`text-gold-dim text-[0.7rem] transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="bg-bg-card border border-border border-t-0 rounded-b-lg px-4 py-3 text-[0.85rem] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
