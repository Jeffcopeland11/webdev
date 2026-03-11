"use client";

import { PROTOCOLS } from "@/lib/diagnostic-data";

export default function ProtocolModal({
  protocolId,
  onClose,
}: {
  protocolId: string | null;
  onClose: () => void;
}) {
  if (!protocolId) return null;
  const protocol = PROTOCOLS[protocolId];
  if (!protocol) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-gold-dim rounded-t-lg w-full max-w-[640px] max-h-[85vh] overflow-y-auto p-6 animate-[slideUp_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right border border-border rounded-full w-7 h-7 flex items-center justify-center text-text-dim text-sm hover:text-text-primary"
        >
          ✕
        </button>
        <h3 className="font-serif text-gold text-base mb-4">
          {protocol.title}
        </h3>
        <div className="text-[0.82rem] text-text-dim leading-relaxed whitespace-pre-line">
          {protocol.content.split("\n").map((line, i) => {
            if (line.startsWith("> ")) {
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic"
                >
                  {line.slice(2)}
                </blockquote>
              );
            }
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <h4 key={i} className="text-gold text-[0.8rem] mt-4 mb-1">
                  {line.replace(/\*\*/g, "")}
                </h4>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <p key={i} className="ml-3 text-[0.8rem]">
                  • {line.slice(2)}
                </p>
              );
            }
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="mb-2">{line.replace(/\*\*/g, "")}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
