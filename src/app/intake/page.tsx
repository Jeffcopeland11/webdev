"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { scanPrayer } from "@/lib/false-light-scanner";

interface PrayerRow {
  id: string;
  title: string;
  content: string;
  source: string;
  scan_overall: "pass" | "warn" | "fail" | null;
  scan_critical_count: number;
  scan_warn_count: number;
  structure_pct: number;
  created_at: string;
  tags: string[];
}

export default function IntakePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [prayers, setPrayers] = useState<PrayerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function load() {
    const { data, error } = await supabase
      .from("prayers")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPrayers(data as PrayerRow[]);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!title) setTitle(f.name.replace(/\.(md|txt)$/i, ""));
    const reader = new FileReader();
    reader.onload = ev => setContent(ev.target?.result as string);
    reader.readAsText(f);
  }

  async function save() {
    if (!content.trim()) { alert("Paste or upload prayer content."); return; }
    setLoading(true);
    const scan = scanPrayer(content);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) { alert("Not signed in."); setLoading(false); return; }

    const { error } = await supabase.from("prayers").insert({
      practitioner_id: user.user.id,
      title: title || "Untitled",
      content,
      source: "uploaded",
      scan_result: scan,
      scan_overall: scan.overall,
      scan_critical_count: scan.criticalCount,
      scan_warn_count: scan.warnCount,
      structure_pct: scan.structurePct,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    });

    setLoading(false);
    if (error) { alert("Save failed: " + error.message); return; }
    setTitle(""); setContent(""); setTags("");
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this prayer?")) return;
    await supabase.from("prayers").delete().eq("id", id);
    load();
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 28, fontFamily: "Georgia, serif" }}>
      <h1 style={{ color: "#4B0082", borderBottom: "2px solid #B8860B", paddingBottom: 8 }}>Prayer Intake</h1>
      <p style={{ color: "#3a2d1a", fontStyle: "italic" }}>
        Upload or paste prayer documents. Each is automatically scanned against the Divine Alignment false-light filter and archived with scan results.
      </p>

      <div style={cardStyle}>
        <label style={labelStyle}>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="e.g. Covenant Restoration April 13" />

        <label style={labelStyle}>Upload .md / .txt</label>
        <input type="file" accept=".md,.txt" onChange={handleFile} style={{ padding: 4 }} />

        <label style={labelStyle}>Content</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} style={{ ...inputStyle, minHeight: 220 }} placeholder="Paste prayer text..." />

        <label style={labelStyle}>Tags (comma-separated)</label>
        <input value={tags} onChange={e => setTags(e.target.value)} style={inputStyle} placeholder="covenant, nadine, proxy, deliverance" />

        <div style={{ marginTop: 14 }}>
          <button onClick={save} disabled={loading} style={primaryBtn}>
            {loading ? "Scanning & archiving…" : "Archive & Scan"}
          </button>
        </div>
      </div>

      <h2 style={{ color: "#4B0082", marginTop: 28 }}>Archive ({prayers.length})</h2>
      {prayers.length === 0 && <div style={{ textAlign: "center", color: "#3a2d1a", fontStyle: "italic", padding: 40 }}>No prayers archived yet.</div>}
      {prayers.map(p => (
        <div key={p.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: "#4B0082", fontSize: 17, fontWeight: "bold" }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#3a2d1a" }}>
                {new Date(p.created_at).toLocaleString()} · {p.source}
              </div>
              <div style={{ marginTop: 6 }}>
                <StatusTag overall={p.scan_overall} />
                <span style={{ marginLeft: 10, fontSize: 12 }}>
                  Critical: <strong>{p.scan_critical_count}</strong> · Warn: <strong>{p.scan_warn_count}</strong> · Structure: <strong>{p.structure_pct}%</strong>
                </span>
              </div>
              {p.tags?.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {p.tags.map((t, i) => <span key={i} style={tagStyle}>{t}</span>)}
                </div>
              )}
            </div>
            <div>
              <button onClick={() => setViewId(viewId === p.id ? null : p.id)} style={secondaryBtn}>
                {viewId === p.id ? "Hide" : "View"}
              </button>
              <button onClick={() => del(p.id)} style={dangerBtn}>Delete</button>
            </div>
          </div>
          {viewId === p.id && <pre style={preStyle}>{p.content}</pre>}
        </div>
      ))}
    </div>
  );
}

function StatusTag({ overall }: { overall: "pass" | "warn" | "fail" | null }) {
  const color = overall === "pass" ? "#3a8a3e" : overall === "warn" ? "#c9a833" : overall === "fail" ? "#5C0A0A" : "#888";
  const bg = overall === "pass" ? "#d7f0d9" : overall === "warn" ? "#fdf0c4" : overall === "fail" ? "#f8d7d7" : "#eee";
  return (
    <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 10, fontSize: 11, background: bg, color, border: `1px solid ${color}`, fontWeight: "bold" }}>
      {(overall || "—").toUpperCase()}
    </span>
  );
}

const cardStyle: React.CSSProperties = { background: "#fff", border: "1px solid #d4c59a", borderRadius: 4, padding: 20, marginBottom: 16 };
const labelStyle: React.CSSProperties = { display: "block", margin: "14px 0 4px", fontSize: 13, color: "#3a2d1a", fontWeight: "bold" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1px solid #d4c59a", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 14 };
const primaryBtn: React.CSSProperties = { background: "#2D0050", color: "#f5e6a8", border: "1px solid #B8860B", padding: "10px 20px", cursor: "pointer", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 14 };
const secondaryBtn: React.CSSProperties = { background: "#fff", color: "#4B0082", border: "1px solid #4B0082", padding: "6px 14px", cursor: "pointer", borderRadius: 3, fontFamily: "Georgia, serif", fontSize: 12, marginRight: 6 };
const dangerBtn: React.CSSProperties = { background: "#5C0A0A", color: "#fff", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: 3, fontSize: 12 };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 11, margin: "2px 4px 2px 0", background: "#f0e6c8", color: "#8B6914", border: "1px solid #B8860B" };
const preStyle: React.CSSProperties = { background: "#fdfaf0", border: "1px solid #d4c59a", padding: 18, fontFamily: "Georgia, serif", fontSize: 13, whiteSpace: "pre-wrap", maxHeight: 400, overflowY: "auto", borderRadius: 3, marginTop: 12 };
