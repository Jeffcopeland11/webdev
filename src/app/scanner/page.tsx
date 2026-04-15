"use client";

import { useState } from "react";
import { scanPrayer, suggestFixes, type ScanResult } from "@/lib/false-light-scanner";

export default function ScannerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [autofixed, setAutofixed] = useState<string | null>(null);

  function run() {
    setResult(scanPrayer(text));
    setAutofixed(null);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target?.result as string);
    reader.readAsText(f);
  }

  function applyAutofix() {
    const fixed = suggestFixes(text);
    setAutofixed(fixed);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px", fontFamily: "Georgia, serif" }}>
      <h1 style={{ color: "#4B0082", borderBottom: "2px solid #B8860B", paddingBottom: 8 }}>
        False-Light Scanner
      </h1>
      <p style={{ color: "#3a2d1a", fontStyle: "italic" }}>
        Validates prayer documents against Divine Alignment framework conventions — flags compromised architecture, missing sections, and Hebrew coverage.
      </p>

      <div style={cardStyle}>
        <label style={labelStyle}>Upload .md / .txt or paste below</label>
        <input type="file" accept=".md,.txt" onChange={handleFile} style={{ marginBottom: 10 }} />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ ...inputStyle, minHeight: 260 }}
          placeholder="Paste prayer text..."
        />
        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={run} style={primaryBtn}>Scan for False Light</button>
          <button onClick={applyAutofix} style={secondaryBtn}>Suggest Autofixes</button>
          <span style={{ fontSize: 12, color: "#666" }}>
            {text.length} chars · {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {autofixed && (
        <div style={cardStyle}>
          <h3 style={{ color: "#B8860B" }}>Autofixed Draft (review before using)</h3>
          <pre style={preStyle}>{autofixed}</pre>
          <button onClick={() => setText(autofixed)} style={secondaryBtn}>Replace Input with Autofixed</button>
        </div>
      )}

      {result && (
        <div style={cardStyle}>
          <div
            style={{
              padding: 14,
              borderRadius: 4,
              marginBottom: 16,
              fontWeight: "bold",
              background: result.overall === "pass" ? "#e8f5e8" : result.overall === "warn" ? "#fdf5d6" : "#fbecec",
              color: result.overall === "pass" ? "#1d5b1f" : result.overall === "warn" ? "#7a5a00" : "#5C0A0A",
              border: `1px solid ${result.overall === "pass" ? "#3a8a3e" : result.overall === "warn" ? "#c9a833" : "#5C0A0A"}`,
            }}
          >
            {result.overall === "pass" && "✓ PASS — No critical false-light flags. Structure complete."}
            {result.overall === "warn" && "⚠ WARN — Review recommended before use."}
            {result.overall === "fail" && "✗ FAIL — Critical flags detected. DO NOT use until corrected."}
          </div>

          <div style={{ marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Stat num={result.criticalCount} label="Critical" />
            <Stat num={result.warnCount} label="Warnings" />
            <Stat num={`${result.structurePct}%`} label="Structure" />
            <Stat num={result.hebrewCount} label="Hebrew terms" />
            <Stat num={result.christNamesUsed.length} label="Christ names" />
            <Stat num={result.wordCount} label="Word count" />
          </div>

          {result.findings.length > 0 && (
            <div>
              <h3 style={{ color: "#B8860B" }}>Flags</h3>
              {result.findings.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 14px",
                    margin: "8px 0",
                    borderLeft: `4px solid ${f.severity === "critical" ? "#5C0A0A" : f.severity === "warn" ? "#c9a833" : "#B8860B"}`,
                    background: f.severity === "critical" ? "#fbecec" : f.severity === "warn" ? "#fdf5d6" : "#fdf7e3",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#4B0082" }}>
                    [{f.severity.toUpperCase()}] {f.label} ({f.count} occurrence{f.count > 1 ? "s" : ""})
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Samples:{" "}
                    {f.samples.map((s, j) => (
                      <span key={j} style={tagStyle}>{s}</span>
                    ))}
                  </div>
                  <div style={{ fontStyle: "italic", color: "#3a2d1a", marginTop: 4, fontSize: 12 }}>→ {f.fix}</div>
                </div>
              ))}
            </div>
          )}

          <h3 style={{ color: "#B8860B", marginTop: 20 }}>10-Element Architecture</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <strong style={{ color: "#1d5b1f" }}>Present ({result.present.length}):</strong>
              {result.present.map((s, i) => (
                <div key={i} style={{ fontSize: 13, padding: "3px 0" }}>✓ {s.label}</div>
              ))}
            </div>
            <div>
              <strong style={{ color: "#5C0A0A" }}>Missing ({result.missing.length}):</strong>
              {result.missing.map((s, i) => (
                <div key={i} style={{ fontSize: 13, padding: "3px 0" }}>✗ {s.label}</div>
              ))}
            </div>
          </div>

          {result.christNamesUsed.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <strong>Christ names rotation:</strong>{" "}
              {result.christNamesUsed.map((n, i) => (
                <span key={i} style={tagStyle}>{n}</span>
              ))}
              {result.christNamesUsed.length < 2 && (
                <div style={{ fontStyle: "italic", color: "#3a2d1a", marginTop: 4, fontSize: 12 }}>
                  → Vary the names used — rotate between Yeshua Ha&apos;Mashiach / Yehusha / Christos.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ num, label }: { num: number | string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 24, color: "#4B0082", fontWeight: "bold" }}>{num}</div>
      <div style={{ fontSize: 11, color: "#3a2d1a", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d4c59a",
  borderRadius: 4,
  padding: 20,
  marginBottom: 16,
  boxShadow: "0 1px 3px rgba(75, 0, 130, 0.06)",
};
const labelStyle: React.CSSProperties = { display: "block", margin: "14px 0 4px", fontSize: 13, color: "#3a2d1a", fontWeight: "bold" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #d4c59a", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 14 };
const primaryBtn: React.CSSProperties = { background: "#2D0050", color: "#f5e6a8", border: "1px solid #B8860B", padding: "10px 20px", cursor: "pointer", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 14 };
const secondaryBtn: React.CSSProperties = { background: "#fff", color: "#4B0082", border: "1px solid #4B0082", padding: "8px 16px", cursor: "pointer", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 13 };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 11, margin: "2px 4px", background: "#f0e6c8", color: "#8B6914", border: "1px solid #B8860B" };
const preStyle: React.CSSProperties = { background: "#fdfaf0", border: "1px solid #d4c59a", padding: 18, fontFamily: "Georgia, serif", fontSize: 14, whiteSpace: "pre-wrap", maxHeight: 400, overflowY: "auto", borderRadius: 3 };
