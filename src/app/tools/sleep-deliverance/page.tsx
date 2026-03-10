"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { GATES, GATE_REFERENCE, ROOT_CAUSE_GATES } from "@/lib/gates-data";
import { ENTITY_CATEGORIES } from "@/lib/entity-data";
import {
  PRAYERS,
  QUICK_COMMANDS,
  SEAL_DECLARATION,
  CALIBRATION_RESET,
  MORNING_DECLARATION,
} from "@/lib/prayer-content";
import {
  HEBREW_GUIDE,
  HOUSES_FRAMEWORK,
  SAGAR_EXPLANATION,
  SLEEP_BATTLEFIELD,
} from "@/lib/hebrew-guide";
import {
  PHYSICAL_SYSTEMS,
  ENERGY_SYSTEMS,
} from "@/lib/diagnostic-data";

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TestStatus = "strong" | "weak" | "partial" | null;

const PHASE_LABELS = [
  "Seal",
  "Spirit Diagnostic",
  "Root Cause",
  "Body & Energy",
  "Prayers",
  "Session Notes",
  "Morning",
];

interface TestResult {
  status: TestStatus;
  notes: string;
}

export default function SleepDeliverancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client");

  const [phase, setPhase] = useState<Phase>(0);
  const [sealLines, setSealLines] = useState<boolean[]>([false, false, false, false, false, false]);
  const [calibration, setCalibration] = useState<boolean[]>([false, false, false, false, false]);
  const [gateResults, setGateResults] = useState<Record<string, TestResult>>({});
  const [rootResults, setRootResults] = useState<Record<string, TestResult>>({});
  const [bodyResults, setBodyResults] = useState<Record<string, TestResult>>({});
  const [prayersCompleted, setPrayersCompleted] = useState<Set<string>>(new Set());
  const [expandedGate, setExpandedGate] = useState<number | null>(null);
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null);
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);
  const [showEntityRef, setShowEntityRef] = useState(false);
  const [showRefPanel, setShowRefPanel] = useState(false);
  const [entitySearch, setEntitySearch] = useState("");
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [expandedRootGate, setExpandedRootGate] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState({
    session_notes: "",
    follow_up: "",
    alliances_broken: "",
  });
  const [morningNotes, setMorningNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clientName, setClientName] = useState("");

  // Load client info
  useEffect(() => {
    if (clientId) {
      const supabase = createClient();
      supabase
        .from("clients")
        .select("full_name")
        .eq("id", clientId)
        .single()
        .then(({ data }) => {
          if (data) setClientName(data.full_name);
        });
    }
  }, [clientId]);

  function getResult(key: string, store: Record<string, TestResult>): TestResult {
    return store[key] || { status: null, notes: "" };
  }

  function setResult(
    key: string,
    val: Partial<TestResult>,
    setter: React.Dispatch<React.SetStateAction<Record<string, TestResult>>>,
    store: Record<string, TestResult>
  ) {
    setter({ ...store, [key]: { ...getResult(key, store), ...val } });
  }

  function cycleStatus(current: TestStatus): TestStatus {
    const cycle: TestStatus[] = [null, "strong", "weak", "partial"];
    return cycle[(cycle.indexOf(current) + 1) % cycle.length];
  }

  const sealComplete = sealLines.every(Boolean);
  const calibrationComplete = calibration.every(Boolean);
  const canProceed = sealComplete && calibrationComplete;

  // Gather found spirits for session save
  const spiritsFound = Object.entries(gateResults)
    .filter(([, v]) => v.status === "strong" || v.status === "partial")
    .map(([k]) => k);

  // Save session to Supabase
  async function saveSession() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase.from("deliverance_sessions").insert({
      practitioner_id: user.id,
      client_id: clientId || null,
      seal_confirmed: canProceed,
      calibration_passed: calibrationComplete,
      gate_results: gateResults,
      spirits_found: spiritsFound,
      spirits_cleared: Array.from(prayersCompleted),
      alliances_broken: sessionNotes.alliances_broken ? sessionNotes.alliances_broken.split("\n") : [],
      root_origin: Object.entries(rootResults).filter(([, v]) => v.status === "strong").map(([k]) => k).join(", "),
      root_details: rootResults,
      body_systems_tested: bodyResults,
      prayers_completed: Array.from(prayersCompleted),
      session_notes: sessionNotes.session_notes,
      follow_up_items: sessionNotes.follow_up ? sessionNotes.follow_up.split("\n") : [],
      morning_retest_notes: morningNotes,
      generated_prayer: generatedPrayer,
    });

    setSaving(false);
    if (!error) {
      alert("Session saved to client profile.");
    }
  }

  // Generate AI prayer
  async function generatePrayer() {
    setGenerating(true);
    try {
      const findings = Object.entries(gateResults)
        .filter(([, v]) => v.status === "strong" || v.status === "partial")
        .map(([key, v]) => ({
          item: key,
          status: v.status,
          notes: v.notes,
          module: "spirit-diagnostic",
        }));

      const rootFindings = Object.entries(rootResults)
        .filter(([, v]) => v.status === "strong" || v.status === "partial")
        .map(([key, v]) => ({
          item: key,
          status: v.status,
          notes: v.notes,
          module: "root-cause",
        }));

      const res = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName || "Client",
          primarySymptom: "Sleep deliverance",
          symptomArea: "sleep field",
          findings: [...findings, ...rootFindings],
        }),
      });
      const data = await res.json();
      if (data.prayer) setGeneratedPrayer(data.prayer);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  // Status button component
  function StatusBtn({ status, onCycle }: { status: TestStatus; onCycle: () => void }) {
    const styles: Record<string, string> = {
      strong: "border-status-active text-status-active bg-status-active/10",
      weak: "border-status-clear text-status-clear bg-status-clear/10",
      partial: "border-status-partial text-status-partial bg-status-partial/10",
    };
    const labels: Record<string, string> = { strong: "S", weak: "W", partial: "~" };
    return (
      <button
        onClick={onCycle}
        className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center text-xs shrink-0 transition-all status-btn ${styles[status || ""] || "border-border text-text-dim"}`}
      >
        {status ? labels[status] : ""}
      </button>
    );
  }

  // Command block component
  function CommandBlock({ text, expanded, onToggle }: { text: string; expanded: boolean; onToggle: () => void }) {
    return (
      <div className="mt-3">
        <button onClick={onToggle} className="text-xs text-command border border-command/30 px-3 py-1.5 rounded bg-command-bg hover:bg-command/20 transition-colors">
          {expanded ? "Hide Command" : "✝ Expand Command"}
        </button>
        {expanded && (
          <div className="command-block mt-2 text-sm whitespace-pre-line">{text}</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-4 px-5 border-b border-border bg-gradient-to-b from-[#110e12] to-bg">
        <button onClick={() => router.push("/dashboard")} className="absolute left-4 top-4 text-text-dim text-xs hover:text-gold">
          ← Dashboard
        </button>
        <div className="text-gold text-lg">✝</div>
        <h1 className="font-serif text-gold text-sm tracking-widest uppercase mt-1">
          {clientName ? `${clientName} — ` : ""}Sleep Deliverance
        </h1>
        <p className="text-[0.6rem] text-text-dim tracking-wider uppercase">Divine Alignment Protocol</p>
      </header>

      {/* Phase Progress */}
      <div className="phase-progress">
        {PHASE_LABELS.map((_, i) => (
          <div key={i} className={`phase-dot ${i < phase ? "completed" : i === phase ? "active" : ""}`} />
        ))}
      </div>

      {/* Phase Nav */}
      <nav className="flex overflow-x-auto border-b border-border bg-bg-card sticky top-0 z-50 scrollbar-hide">
        {PHASE_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => (i === 0 || canProceed || i <= phase) && setPhase(i as Phase)}
            className={`flex-none px-3 py-2.5 text-[0.6rem] tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${
              phase === i ? "text-gold border-gold" : i <= phase || canProceed ? "text-text-dim border-transparent hover:text-cream" : "text-text-muted border-transparent"
            }`}
          >
            {i}. {label}
          </button>
        ))}
        {/* Reference drawer toggle */}
        <button
          onClick={() => setShowRefPanel(!showRefPanel)}
          className="flex-none px-3 py-2.5 text-[0.6rem] tracking-wider uppercase text-gold-dim border-b-2 border-transparent hover:text-gold ml-auto"
        >
          ☰ Ref
        </button>
      </nav>

      {/* Main Content */}
      <div className="max-w-[640px] mx-auto p-5">

        {/* ═══════ PHASE 0 — SEAL + CALIBRATION ═══════ */}
        {phase === 0 && (
          <div>
            <div className="text-center mb-6">
              <div className="text-gold text-3xl mb-3">✝</div>
              <h2 className="font-serif text-gold text-lg">Seal &amp; Calibration</h2>
              <p className="text-text-dim text-xs mt-1">Confirm each line of the seal. All calibration checks must pass.</p>
            </div>

            {/* Seal */}
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-3">Seal Declaration</h3>
              <div className="font-serif text-sm text-cream/80 leading-[1.8]">
                {SEAL_DECLARATION.split("\n").filter(l => l.trim()).map((line, i) => (
                  <label key={i} className="flex items-start gap-3 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sealLines[i] || false}
                      onChange={() => {
                        const next = [...sealLines];
                        next[i] = !next[i];
                        setSealLines(next);
                      }}
                      className="mt-1 accent-[#B8960C]"
                    />
                    <span className={sealLines[i] ? "text-cream" : "text-text-dim"}>{line.trim()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Calibration */}
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-3">Calibration Checklist</h3>
              {["Client is hydrated", "Practitioner field is sealed", "YES baseline tests STRONG", "NO baseline tests WEAK", "No spirit of suppression active"].map((item, i) => (
                <label key={i} className="flex items-start gap-3 mb-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={calibration[i] || false}
                    onChange={() => {
                      const next = [...calibration];
                      next[i] = !next[i];
                      setCalibration(next);
                    }}
                    className="mt-0.5 accent-[#B8960C]"
                  />
                  <span className={calibration[i] ? "text-cream" : "text-text-dim"}>{item}</span>
                </label>
              ))}
              {/* Suppression reset */}
              <button
                onClick={() => setExpandedCommand(expandedCommand === "cal-reset" ? null : "cal-reset")}
                className="text-[0.7rem] text-command border border-command/30 px-2 py-1 rounded bg-command-bg"
              >
                If suppression detected → Calibration Reset Command
              </button>
              {expandedCommand === "cal-reset" && (
                <div className="command-block mt-2 text-sm whitespace-pre-line">{CALIBRATION_RESET}</div>
              )}
            </div>

            <button
              onClick={() => canProceed && setPhase(1)}
              disabled={!canProceed}
              className={`w-full py-3 rounded-lg text-sm tracking-wider uppercase transition-colors ${
                canProceed
                  ? "border border-gold text-gold hover:bg-gold-glow"
                  : "border border-border text-text-muted cursor-not-allowed"
              }`}
            >
              {canProceed ? "✝ Field Sealed — Begin Diagnostic" : "Complete all checks to proceed"}
            </button>
          </div>
        )}

        {/* ═══════ PHASE 1 — SPIRIT DIAGNOSTIC ═══════ */}
        {phase === 1 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Spirit Diagnostic</h2>
            <p className="text-text-dim text-xs mb-4">7-Gate diagnostic. Tap S (Strong) / W (Weak) / ~ (Partial) for each test.</p>

            {/* Quick Command Panel */}
            <div className="bg-command-bg border border-command/30 rounded-lg p-3 mb-4">
              <div className="text-command text-[0.65rem] tracking-wider uppercase mb-2">Emergency Override — Quick Bind &amp; Cast</div>
              <div className="flex flex-wrap gap-2">
                {QUICK_COMMANDS.map((cmd) => (
                  <div key={cmd.id} className="flex-1 min-w-[140px]">
                    <button
                      onClick={() => setExpandedCommand(expandedCommand === cmd.id ? null : cmd.id)}
                      className="w-full text-xs text-cream bg-command/20 border border-command/40 rounded px-2 py-2 hover:bg-command/30 transition-colors"
                    >
                      {cmd.label}
                    </button>
                    {expandedCommand === cmd.id && (
                      <div className="command-block mt-1 text-xs whitespace-pre-line">{cmd.command}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gate Reference Header */}
            <div className="bg-bg-card border border-border rounded-lg p-3 mb-4 overflow-x-auto">
              <div className="text-gold text-[0.65rem] tracking-wider uppercase mb-2">Gate Reference Map</div>
              <table className="w-full text-[0.7rem]">
                <thead>
                  <tr className="text-text-dim">
                    <th className="text-left pr-2 pb-1">Gate</th>
                    <th className="text-left pr-2 pb-1">Category</th>
                    <th className="text-left pr-2 pb-1">Hawkins</th>
                    <th className="text-left pb-1">House</th>
                  </tr>
                </thead>
                <tbody>
                  {GATE_REFERENCE.map((g) => (
                    <tr key={g.gate} className="text-cream/70">
                      <td className="pr-2 py-0.5 text-gold">{g.gate}</td>
                      <td className="pr-2 py-0.5">{g.category}</td>
                      <td className="pr-2 py-0.5">{g.hawkins}</td>
                      <td className="py-0.5">{g.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 7 Gates */}
            {GATES.map((gate) => {
              const isOpen = expandedGate === gate.num;
              const hasStrong = gate.testItems.some(
                (_, i) => getResult(`g${gate.num}-${i}`, gateResults).status === "strong"
              );
              return (
                <div key={gate.num} className="mb-2">
                  <button
                    onClick={() => setExpandedGate(isOpen ? null : gate.num)}
                    className={`w-full text-left bg-bg-card border rounded-lg px-4 py-3 flex items-center gap-3 transition-colors ${
                      hasStrong ? "border-status-active/50" : isOpen ? "border-gold-dim" : "border-border hover:border-gold-dim/50"
                    } ${isOpen ? "rounded-b-none" : ""}`}
                  >
                    <span className="text-gold text-[0.6rem] tracking-wider">GATE {gate.num}</span>
                    <span className="text-sm flex-1">{gate.title}</span>
                    {hasStrong && <span className="text-status-active text-[0.6rem] tracking-wider">ACTIVE</span>}
                    <span className={`text-gold-dim text-[0.6rem] transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="bg-bg-card border border-border border-t-0 rounded-b-lg px-4 py-3">
                      <div className="text-text-dim text-[0.7rem] mb-2">{gate.category} • Hawkins {gate.hawkins} • {gate.housesNode}</div>
                      {gate.testItems.map((item, i) => {
                        const key = `g${gate.num}-${i}`;
                        const result = getResult(key, gateResults);
                        return (
                          <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
                            <StatusBtn
                              status={result.status}
                              onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setGateResults, gateResults)}
                            />
                            <div className="flex-1">
                              <div className="text-[0.8rem] leading-snug">{item.statement}</div>
                              {result.status && (
                                <textarea
                                  placeholder="Notes…"
                                  rows={1}
                                  value={result.notes}
                                  onChange={(e) => setResult(key, { notes: e.target.value }, setGateResults, gateResults)}
                                  className="w-full mt-1 bg-white/[0.03] border border-border rounded px-2 py-1 text-xs text-cream resize-none focus:outline-none focus:border-gold-dim"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Command */}
                      {hasStrong && (
                        <CommandBlock
                          text={gate.command}
                          expanded={expandedCommand === `gate-${gate.num}`}
                          onToggle={() => setExpandedCommand(expandedCommand === `gate-${gate.num}` ? null : `gate-${gate.num}`)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Entity Reference Toggle */}
            <button
              onClick={() => setShowEntityRef(!showEntityRef)}
              className="w-full mt-4 py-2.5 text-xs text-gold border border-gold-dim rounded-lg hover:bg-gold-glow transition-colors"
            >
              {showEntityRef ? "Hide" : "Show"} Full Entity Frequency Reference ({ENTITY_CATEGORIES.reduce((a, c) => a + c.entities.length, 0)} entities)
            </button>

            {showEntityRef && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search entities…"
                  value={entitySearch}
                  onChange={(e) => setEntitySearch(e.target.value)}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-cream mb-3 focus:outline-none focus:border-gold-dim"
                />
                {ENTITY_CATEGORIES.map((cat) => {
                  const filtered = entitySearch
                    ? cat.entities.filter((e) => e.name.toLowerCase().includes(entitySearch.toLowerCase()))
                    : cat.entities;
                  if (filtered.length === 0) return null;
                  return (
                    <div key={cat.id} className="mb-3">
                      <div className="text-gold text-[0.7rem] tracking-wider uppercase mb-1">{cat.label}</div>
                      {filtered.map((entity, i) => {
                        const eKey = `entity-${cat.id}-${i}`;
                        const isExp = expandedEntity === eKey;
                        const result = getResult(eKey, gateResults);
                        return (
                          <div key={i} className="bg-bg-card border border-border rounded mb-1 px-3 py-2">
                            <div className="flex items-center gap-2">
                              <StatusBtn
                                status={result.status}
                                onCycle={() => setResult(eKey, { status: cycleStatus(result.status) }, setGateResults, gateResults)}
                              />
                              <div className="flex-1">
                                <button onClick={() => setExpandedEntity(isExp ? null : eKey)} className="text-left w-full">
                                  <span className="text-[0.8rem] font-medium">{entity.name}</span>
                                  {entity.hebrew && <span className="text-gold text-xs ml-2">{entity.hebrew}</span>}
                                  <span className="text-text-dim text-[0.65rem] block">Hawkins: {entity.hawkins} • {entity.entry}</span>
                                </button>
                              </div>
                            </div>
                            {isExp && (
                              <div className="mt-2 pl-11">
                                <div className="text-text-dim text-xs mb-1">Test: &quot;{entity.testStatement}&quot;</div>
                                {result.status === "strong" && (
                                  <div className="command-block mt-1 text-xs whitespace-pre-line">
                                    {`In the name of Yeshua HaMashiach —\nI address ${entity.name}.\nYour legal right has been revoked through repentance.\nThe door you used is closed.\nYou have no ground. You have no legal right.\nYou are commanded OUT — NOW.\nGo directly to the Heart of True Source for transmutation.\nYou will not transfer. You will not fragment. You will not return.\nTzeitzu (צְאוּ). B'shem Yeshua HaMashiach.`}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setPhase(2)}
              className="w-full mt-6 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors"
            >
              Proceed to Root Cause →
            </button>
          </div>
        )}

        {/* ═══════ PHASE 2 — ROOT CAUSE ═══════ */}
        {phase === 2 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Root Cause Diagnostic</h2>
            <p className="text-text-dim text-xs mb-4">Finding WHERE the spirits got in. Test each gate.</p>

            {/* Origin Gate */}
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-3">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-3">Gate 1 — Root Origin</h3>
              {ROOT_CAUSE_GATES.origin.items.map((item, i) => {
                const key = `root-origin-${i}`;
                const result = getResult(key, rootResults);
                return (
                  <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
                    <StatusBtn
                      status={result.status}
                      onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setRootResults, rootResults)}
                    />
                    <div className="flex-1">
                      <div className="text-[0.8rem]">{item.statement}</div>
                      {result.status === "strong" && (
                        <div className="text-[0.65rem] text-gold mt-1">→ Expand Gate 2{item.branch === "childhood" ? "A" : item.branch === "pastlife" ? "B" : item.branch === "epigenetic" ? "C" : ""} below</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gate 2A - Childhood */}
            {["childhood", "pastlife", "epigenetic"].map((gateKey) => {
              const gateData = ROOT_CAUSE_GATES[gateKey as keyof typeof ROOT_CAUSE_GATES];
              if (!gateData || !("items" in gateData)) return null;
              const isOpen = expandedRootGate === gateKey;
              return (
                <div key={gateKey} className="mb-2">
                  <button
                    onClick={() => setExpandedRootGate(isOpen ? null : gateKey)}
                    className={`w-full text-left bg-bg-card border rounded-lg px-4 py-3 flex items-center justify-between ${isOpen ? "border-gold-dim rounded-b-none" : "border-border"}`}
                  >
                    <span className="text-sm">{gateData.title}</span>
                    <span className={`text-gold-dim text-[0.6rem] transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="bg-bg-card border border-border border-t-0 rounded-b-lg px-4 py-3">
                      {"ageWindows" in gateData && (
                        <div className="mb-3">
                          <div className="text-gold text-[0.65rem] tracking-wider uppercase mb-1">Age Window (test each)</div>
                          {(gateData as typeof ROOT_CAUSE_GATES.childhood).ageWindows.map((aw, i) => {
                            const key = `root-${gateKey}-age-${i}`;
                            const result = getResult(key, rootResults);
                            return (
                              <div key={i} className="flex items-center gap-2.5 py-1.5">
                                <StatusBtn
                                  status={result.status}
                                  onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setRootResults, rootResults)}
                                />
                                <span className="text-[0.8rem]">{aw}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {(gateData.items as string[]).map((item: string, i: number) => {
                        const key = `root-${gateKey}-${i}`;
                        const result = getResult(key, rootResults);
                        return (
                          <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/50 last:border-0">
                            <StatusBtn
                              status={result.status}
                              onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setRootResults, rootResults)}
                            />
                            <div className="flex-1">
                              <div className="text-[0.8rem]">{item}</div>
                              {result.status && (
                                <textarea
                                  placeholder="Notes…"
                                  rows={1}
                                  value={result.notes}
                                  onChange={(e) => setResult(key, { notes: e.target.value }, setRootResults, rootResults)}
                                  className="w-full mt-1 bg-white/[0.03] border border-border rounded px-2 py-1 text-xs text-cream resize-none focus:outline-none focus:border-gold-dim"
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {"soulFragmentCommand" in gateData && (
                        <CommandBlock
                          text={(gateData as typeof ROOT_CAUSE_GATES.pastlife).soulFragmentCommand}
                          expanded={expandedCommand === `root-${gateKey}-cmd`}
                          onToggle={() => setExpandedCommand(expandedCommand === `root-${gateKey}-cmd` ? null : `root-${gateKey}-cmd`)}
                        />
                      )}
                      {"command" in gateData && (
                        <CommandBlock
                          text={(gateData as typeof ROOT_CAUSE_GATES.epigenetic).command}
                          expanded={expandedCommand === `root-${gateKey}-main`}
                          onToggle={() => setExpandedCommand(expandedCommand === `root-${gateKey}-main` ? null : `root-${gateKey}-main`)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={() => setPhase(3)} className="w-full mt-6 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors">
              Proceed to Body &amp; Energy →
            </button>
          </div>
        )}

        {/* ═══════ PHASE 3 — BODY & ENERGY ═══════ */}
        {phase === 3 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Body &amp; Energy Systems</h2>
            <p className="text-text-dim text-xs mb-4">Supporting diagnostic — secondary to spirit identification.</p>

            <div className="mb-6">
              <h3 className="font-serif text-gold text-[0.95rem] mb-2 pb-2 border-b border-border">Body Systems</h3>
              {PHYSICAL_SYSTEMS.map((name, i) => {
                const key = `body-${i}`;
                const result = getResult(key, bodyResults);
                return (
                  <div key={i} className="flex items-center gap-2.5 py-2 border-b border-border/50 last:border-0">
                    <StatusBtn
                      status={result.status}
                      onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setBodyResults, bodyResults)}
                    />
                    <span className="text-[0.82rem]">{name}</span>
                  </div>
                );
              })}
            </div>

            <div className="mb-6">
              <h3 className="font-serif text-gold text-[0.95rem] mb-2 pb-2 border-b border-border">Energy Systems</h3>
              {ENERGY_SYSTEMS.map((name, i) => {
                const key = `energy-${i}`;
                const result = getResult(key, bodyResults);
                return (
                  <div key={i} className="flex items-center gap-2.5 py-2 border-b border-border/50 last:border-0">
                    <StatusBtn
                      status={result.status}
                      onCycle={() => setResult(key, { status: cycleStatus(result.status) }, setBodyResults, bodyResults)}
                    />
                    <span className="text-[0.82rem]">{name}</span>
                  </div>
                );
              })}
            </div>

            {/* 7 Houses Framework */}
            <div className="bg-bg-card border border-border rounded-lg p-3 mb-4 overflow-x-auto">
              <div className="text-gold text-[0.65rem] tracking-wider uppercase mb-2">7 Houses × Sleep Framework</div>
              <table className="w-full text-[0.65rem]">
                <thead>
                  <tr className="text-text-dim">
                    <th className="text-left pr-2 pb-1">House</th>
                    <th className="text-left pr-2 pb-1">Ego</th>
                    <th className="text-left pr-2 pb-1">Chakra</th>
                    <th className="text-left pb-1">Sleep Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {HOUSES_FRAMEWORK.map((h) => (
                    <tr key={h.house} className={h.primary ? "text-status-active" : "text-cream/70"}>
                      <td className="pr-2 py-0.5 text-gold">{h.house}</td>
                      <td className="pr-2 py-0.5">{h.ego}</td>
                      <td className="pr-2 py-0.5">{h.chakra}</td>
                      <td className="py-0.5 text-[0.6rem]">{h.sleepSig}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setPhase(4)} className="w-full mt-4 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors">
              Proceed to Prayers →
            </button>
          </div>
        )}

        {/* ═══════ PHASE 4 — PRAYERS ═══════ */}
        {phase === 4 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Targeted Deliverance Prayers</h2>
            <p className="text-text-dim text-xs mb-4">Organized by diagnostic findings. Mark each as completed.</p>

            {/* AI Generate */}
            <button
              onClick={generatePrayer}
              disabled={generating}
              className="w-full mb-4 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
            >
              {generating ? "Generating custom prayer…" : "✝ Generate Custom Prayer from Diagnostic Findings"}
            </button>

            {generatedPrayer && (
              <div className="bg-bg-card border border-gold-dim rounded-lg p-5 mb-6">
                <h3 className="text-gold text-xs tracking-wider uppercase mb-2">AI-Generated Custom Prayer</h3>
                <div className="font-serif text-[0.85rem] text-cream/80 leading-[1.7] whitespace-pre-line">{generatedPrayer}</div>
              </div>
            )}

            {/* Prayer Library */}
            {PRAYERS.map((prayer) => {
              const isOpen = expandedPrayer === prayer.id;
              const completed = prayersCompleted.has(prayer.id);
              return (
                <div key={prayer.id} className={`mb-2 bg-bg-card border rounded-lg overflow-hidden ${completed ? "border-status-clear/40" : "border-border"}`}>
                  <button
                    onClick={() => setExpandedPrayer(isOpen ? null : prayer.id)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-bg-card-hover transition-colors"
                  >
                    <div>
                      <span className="font-serif text-[0.9rem] text-gold">{prayer.title}</span>
                      {completed && <span className="text-status-clear text-[0.6rem] ml-2">✓ COMPLETED</span>}
                    </div>
                    <span className="text-text-dim text-[0.6rem]">{isOpen ? "" : "TAP"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4">
                      {prayer.instruction && (
                        <div className="text-text-dim text-[0.7rem] italic mb-2">{prayer.instruction}</div>
                      )}
                      <div className="font-serif text-[0.85rem] text-cream/80 leading-[1.7] whitespace-pre-line border-l-2 border-gold-dim pl-3">
                        {prayer.text}
                      </div>
                      <button
                        onClick={() => {
                          const next = new Set(prayersCompleted);
                          if (completed) next.delete(prayer.id); else next.add(prayer.id);
                          setPrayersCompleted(next);
                        }}
                        className={`mt-3 text-xs px-3 py-1.5 rounded border transition-colors ${
                          completed
                            ? "border-status-clear/40 text-status-clear"
                            : "border-gold-dim text-gold hover:bg-gold-glow"
                        }`}
                      >
                        {completed ? "✓ Completed" : "Mark as Completed"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <button onClick={() => setPhase(5)} className="w-full mt-6 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors">
              Proceed to Session Notes →
            </button>
          </div>
        )}

        {/* ═══════ PHASE 5 — SESSION NOTES ═══════ */}
        {phase === 5 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Session Notes</h2>
            <p className="text-text-dim text-xs mb-4">Save this session to the client&apos;s profile.</p>

            {/* Auto-populated summary */}
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-2">Auto-Populated from Diagnostic</h3>
              <div className="text-xs space-y-1.5">
                <div><span className="text-text-dim">Seal:</span> <span className={canProceed ? "text-status-clear" : "text-status-active"}>{canProceed ? "✓ Confirmed" : "✗ Incomplete"}</span></div>
                <div>
                  <span className="text-text-dim">Spirits Found:</span>{" "}
                  <span className="text-status-active">{spiritsFound.length > 0 ? spiritsFound.length : "None"}</span>
                </div>
                <div>
                  <span className="text-text-dim">Prayers Completed:</span>{" "}
                  <span className="text-status-clear">{prayersCompleted.size}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">Alliances Broken</label>
                <textarea
                  rows={2}
                  value={sessionNotes.alliances_broken}
                  onChange={(e) => setSessionNotes(n => ({ ...n, alliances_broken: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-cream resize-y focus:outline-none focus:border-gold-dim"
                  placeholder="One per line…"
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">Session Notes</label>
                <textarea
                  rows={4}
                  value={sessionNotes.session_notes}
                  onChange={(e) => setSessionNotes(n => ({ ...n, session_notes: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-cream resize-y focus:outline-none focus:border-gold-dim"
                  placeholder="Practitioner observations, dreams reported, etc."
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">Follow-Up Items</label>
                <textarea
                  rows={2}
                  value={sessionNotes.follow_up}
                  onChange={(e) => setSessionNotes(n => ({ ...n, follow_up: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-cream resize-y focus:outline-none focus:border-gold-dim"
                  placeholder="One per line…"
                />
              </div>
            </div>

            <button
              onClick={saveSession}
              disabled={saving}
              className="w-full mt-6 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "✝ Save Session to Client Profile"}
            </button>

            <button onClick={() => setPhase(6)} className="w-full mt-3 py-2.5 text-xs text-text-dim border border-border rounded-lg hover:text-cream transition-colors">
              Continue to Morning Protocol →
            </button>
          </div>
        )}

        {/* ═══════ PHASE 6 — MORNING ═══════ */}
        {phase === 6 && (
          <div>
            <h2 className="font-serif text-gold text-lg mb-1">Morning Integration</h2>
            <p className="text-text-dim text-xs mb-4">Upon waking — before phone, before speaking to anyone.</p>

            <div className="bg-bg-card border border-gold-dim rounded-lg p-4 mb-4">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-2">Client Morning Declaration</h3>
              <div className="font-serif text-[0.85rem] text-cream/80 leading-[1.7] whitespace-pre-line border-l-2 border-gold-dim pl-3">
                {MORNING_DECLARATION}
              </div>
            </div>

            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4">
              <h3 className="text-gold text-xs tracking-wider uppercase mb-2">Practitioner Morning Retest</h3>
              <ul className="text-sm space-y-2 text-cream/80">
                <li>• Re-test all spirits that tested STRONG the prior session</li>
                <li>• Note which cleared through sleep vs. which need additional work</li>
                <li>• Document any dreams — sleep deliverance dreams carry diagnostic info</li>
                <li>• Note physical symptom level — even partial reduction confirms movement</li>
              </ul>
            </div>

            <div>
              <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">Morning Retest Notes</label>
              <textarea
                rows={4}
                value={morningNotes}
                onChange={(e) => setMorningNotes(e.target.value)}
                className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-cream resize-y focus:outline-none focus:border-gold-dim"
                placeholder="Document morning findings, dreams, symptom changes…"
              />
            </div>

            <button
              onClick={saveSession}
              disabled={saving}
              className="w-full mt-4 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "✝ Update Session with Morning Notes"}
            </button>
          </div>
        )}
      </div>

      {/* ═══════ REFERENCE PANEL (DRAWER) ═══════ */}
      {showRefPanel && (
        <div className="fixed inset-0 bg-black/85 z-50 flex justify-end" onClick={() => setShowRefPanel(false)}>
          <div className="bg-bg-card w-full max-w-sm h-full overflow-y-auto p-5 border-l border-gold-dim" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-gold text-sm">Reference Panel</h3>
              <button onClick={() => setShowRefPanel(false)} className="text-text-dim text-sm hover:text-cream">✕</button>
            </div>

            {/* Hebrew Guide */}
            <details className="mb-3">
              <summary className="text-gold text-xs tracking-wider uppercase cursor-pointer py-2">Hebrew Pronunciation Guide</summary>
              <div className="mt-2 space-y-1">
                {HEBREW_GUIDE.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[0.75rem] py-1 border-b border-border/30">
                    <span className="text-gold text-base w-16 text-right" dir="rtl">{h.hebrew}</span>
                    <span className="text-cream">{h.transliteration}</span>
                    <span className="text-text-dim text-[0.65rem]">({h.pronunciation})</span>
                    <span className="text-text-dim text-[0.65rem] ml-auto">{h.meaning}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* 7 Houses */}
            <details className="mb-3">
              <summary className="text-gold text-xs tracking-wider uppercase cursor-pointer py-2">7 Houses × Sleep Framework</summary>
              <div className="mt-2 space-y-2">
                {HOUSES_FRAMEWORK.map((h) => (
                  <div key={h.house} className={`bg-bg border border-border rounded p-2 text-[0.7rem] ${h.primary ? "border-status-active/40" : ""}`}>
                    <div className="text-gold font-medium">{h.house} — {h.ego}</div>
                    <div className="text-text-dim">Antidote: {h.antidote} • {h.chakra}</div>
                    <div className="text-text-dim">Hawkins: {h.hawkinsLow}→{h.hawkinsHigh}</div>
                    <div className="text-cream/70 mt-1">{h.sleepSig}</div>
                    <div className="text-status-active text-[0.65rem]">Spirits: {h.spirits}</div>
                  </div>
                ))}
              </div>
            </details>

            {/* Quick Commands */}
            <details className="mb-3">
              <summary className="text-gold text-xs tracking-wider uppercase cursor-pointer py-2">Quick Commands</summary>
              <div className="mt-2 space-y-2">
                {QUICK_COMMANDS.map((cmd) => (
                  <div key={cmd.id}>
                    <div className="text-command text-xs font-medium mb-1">{cmd.label}</div>
                    <div className="command-block text-[0.7rem] whitespace-pre-line">{cmd.command}</div>
                  </div>
                ))}
              </div>
            </details>

            {/* SAGAR */}
            <details className="mb-3">
              <summary className="text-gold text-xs tracking-wider uppercase cursor-pointer py-2">SAGAR Protocol</summary>
              <div className="mt-2 text-[0.8rem] text-cream/80 whitespace-pre-line">{SAGAR_EXPLANATION}</div>
            </details>

            {/* Why Sleep */}
            <details className="mb-3">
              <summary className="text-gold text-xs tracking-wider uppercase cursor-pointer py-2">Why Sleep is the Primary Battlefield</summary>
              <div className="mt-2 text-[0.8rem] text-cream/80 whitespace-pre-line">{SLEEP_BATTLEFIELD}</div>
            </details>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 px-4 text-[0.6rem] text-text-dim border-t border-border mt-8">
        <span className="text-gold-dim">Divine Alignment Protocol</span> — Developed by Godfr&eacute; JC
        <br />Enlightuned Studios
        <br />All healing to the glory of the True Father through Yeshua HaMashiach
      </footer>
    </div>
  );
}
