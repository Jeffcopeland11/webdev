"use client";

import { useState } from "react";

export default function PrayerCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-bg-card border border-border rounded-lg mb-2 overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-bg-card-hover transition-colors ${
          open ? "border-b border-border" : ""
        }`}
      >
        <span className="font-serif text-[0.9rem] text-gold">{title}</span>
        {!open && (
          <span className="text-[0.65rem] text-text-dim tracking-wider uppercase">
            TAP TO READ
          </span>
        )}
      </div>
      {open && (
        <div className="px-4 pb-4 font-serif text-[0.85rem] text-text-dim leading-[1.7] prayer-text">
          {children}
        </div>
      )}
    </div>
  );
}
