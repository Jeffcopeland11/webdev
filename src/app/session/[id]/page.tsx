"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  PHYSICAL_SYSTEMS,
  ENERGY_SYSTEMS,
  BRANCHES,
  DiagnosticStatus,
} from "@/lib/diagnostic-data";
import ChecklistItem, { ChecklistItemData } from "@/components/ChecklistItem";
import SummaryBar from "@/components/SummaryBar";
import Accordion from "@/components/Accordion";
import PrayerCard from "@/components/PrayerCard";
import ProtocolModal from "@/components/ProtocolModal";

type Tab =
  | "orientation"
  | "checklist"
  | "diagnostic"
  | "prayer"
  | "morning"
  | "protocols"
  | "notes";

interface ItemState {
  status: DiagnosticStatus;
  notes: string;
}

function makeKey(module: string, idx: number) {
  return `${module}-${idx}`;
}

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orientation");
  const [items, setItems] = useState<Record<string, ItemState>>({});
  const [protocolOpen, setProtocolOpen] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedPrayer, setGeneratedPrayer] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<{
    client_name: string;
    primary_symptom: string;
    symptom_area: string;
  } | null>(null);
  const [notes, setNotes] = useState({
    root_cause: "",
    secondary_causes: "",
    systems_cleared: "",
    spirits_named: "",
    alliances_broken: "",
    curses_revoked: "",
    soul_ties: "",
    timeline_addressed: "",
    follow_up: "",
    morning_retest: "",
    observations: "",
  });

  // Load session
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      // Load session
      const { data: session } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (session) {
        setSessionData({
          client_name: session.client_name,
          primary_symptom: session.primary_symptom || "",
          symptom_area: session.symptom_area || "",
        });
        if (session.diagnostic_data) setItems(session.diagnostic_data);
        if (session.notes) setNotes({ ...notes, ...session.notes });
        if (session.generated_prayer) setGeneratedPrayer(session.generated_prayer);
      }
    }
    if (sessionId !== "new") load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Autosave
  const save = useCallback(async () => {
    if (sessionId === "new") return;
    const supabase = createClient();
    await supabase
      .from("sessions")
      .update({
        diagnostic_data: items,
        notes,
        generated_prayer: generatedPrayer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);
  }, [sessionId, items, notes, generatedPrayer]);

  useEffect(() => {
    const timer = setTimeout(save, 2000);
    return () => clearTimeout(timer);
  }, [save]);

  function updateItem(key: string, data: ChecklistItemData) {
    setItems((prev) => ({ ...prev, [key]: data }));
  }

  function getItem(key: string): ChecklistItemData {
    return items[key] || { status: null, notes: "" };
  }

  async function generatePrayer() {
    if (!sessionData) return;
    setGenerating(true);

    const findings = Object.entries(items)
      .filter(([, v]) => v.status === "active" || v.status === "partial")
      .map(([key, v]) => ({
        item: key,
        status: v.status,
        notes: v.notes,
        module: key.split("-")[0],
      }));

    try {
      const res = await fetch("/api/generate-prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: sessionData.client_name,
          primarySymptom: sessionData.primary_symptom,
          symptomArea: sessionData.symptom_area,
          findings,
        }),
      });
      const data = await res.json();
      if (data.prayer) {
        setGeneratedPrayer(data.prayer);
      }
    } catch (err) {
      console.error("Prayer generation failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "orientation", label: "Orientation" },
    { key: "checklist", label: "Checklist" },
    { key: "diagnostic", label: "Diagnostic" },
    { key: "prayer", label: "Prayer" },
    { key: "morning", label: "Morning" },
    { key: "protocols", label: "Protocols" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="text-center py-6 px-5 border-b border-border bg-gradient-to-b from-[#121210] to-bg">
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute left-4 top-6 text-text-dim text-xs hover:text-gold"
        >
          ← Back
        </button>
        <div className="text-gold text-lg">✦</div>
        <h1 className="font-serif text-gold text-base tracking-widest uppercase mt-2">
          {sessionData?.client_name || "New Session"}
        </h1>
        <p className="text-[0.65rem] text-text-dim tracking-wider uppercase mt-0.5">
          Sleep Deliverance Diagnostic
        </p>
      </header>

      {/* Nav Tabs */}
      <nav className="flex overflow-x-auto border-b border-border bg-bg-card sticky top-0 z-50 scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-none px-4 py-3 text-[0.7rem] tracking-wider uppercase whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? "text-gold border-gold"
                : "text-text-dim border-transparent hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="max-w-[640px] mx-auto p-5">
        {/* ── ORIENTATION ── */}
        {tab === "orientation" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 1
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Pre-Session Orientation
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-6">
              Establish the field before beginning.
            </p>

            <Accordion title="For the Practitioner">
              <p>Before beginning, establish your own field:</p>
              <p className="mt-3">
                <strong>1.</strong> Three full breaths, belly deep.
              </p>
              <p>
                <strong>2.</strong> Declare your field sealed:
              </p>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic text-text-dim">
                &quot;I am sealed in the Dam HaBrit. I operate as a clean
                channel only. All findings and clearings belong to the
                client&apos;s field, not mine.&quot;
              </blockquote>
              <p>
                <strong>3.</strong> Connect to Guardian Host / Krystal Star /
                Christos-Sophia field.
              </p>
              <p>
                <strong>4.</strong> State:
              </p>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic text-text-dim">
                &quot;I request only truth. Every answer I receive serves the
                highest good of this Neshama.&quot;
              </blockquote>
            </Accordion>

            <Accordion title="For the Client">
              <p>Before beginning, the client speaks:</p>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-3 font-serif italic text-text-dim leading-[1.7]">
                &quot;I open myself fully to the True Father — Father of Fathers
                — and to the Ruach HaKodesh. I give permission for all that
                needs to be seen to be seen. I give permission for all that
                needs to be cleared to be cleared. I am willing to receive the
                truth and I am willing to be free.&quot;
              </blockquote>
            </Accordion>
          </div>
        )}

        {/* ── CHECKLIST ── */}
        {tab === "checklist" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 2
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Muscle Testing Master Checklist
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Tap each circle to cycle: ✓ Clear → ✗ Active → ~ Partial → Reset
            </p>

            <SummaryBar items={items} />

            <div className="mb-6">
              <h3 className="font-serif text-gold text-[0.95rem] mb-1 pb-2 border-b border-border">
                Module A — Physical Body Systems
              </h3>
              <p className="text-[0.78rem] text-text-dim italic mb-3">
                Is this system operating at full divine capacity?
              </p>
              {PHYSICAL_SYSTEMS.map((name, i) => (
                <ChecklistItem
                  key={i}
                  label={name}
                  data={getItem(makeKey("physical", i))}
                  onChange={(d) => updateItem(makeKey("physical", i), d)}
                />
              ))}
            </div>

            <div>
              <h3 className="font-serif text-gold text-[0.95rem] mb-1 pb-2 border-b border-border">
                Module B — Energy Body Systems
              </h3>
              <p className="text-[0.78rem] text-text-dim italic mb-3">
                Is this energy center/field operating at full divine capacity?
              </p>
              {ENERGY_SYSTEMS.map((name, i) => (
                <ChecklistItem
                  key={i}
                  label={name}
                  data={getItem(makeKey("energy", i))}
                  onChange={(d) => updateItem(makeKey("energy", i), d)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── DIAGNOSTIC TREE ── */}
        {tab === "diagnostic" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 2C
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Root Cause Diagnostic Tree
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Test each branch. When you find a YES, go deeper.
            </p>

            {BRANCHES.map((branch) => (
              <Accordion
                key={branch.num}
                title={`Branch ${branch.num} — ${branch.title}`}
              >
                {branch.items.map((item, i) => (
                  <ChecklistItem
                    key={i}
                    label={item}
                    data={getItem(makeKey(`branch${branch.num}`, i))}
                    onChange={(d) =>
                      updateItem(makeKey(`branch${branch.num}`, i), d)
                    }
                  />
                ))}
                {branch.protocolId && (
                  <button
                    onClick={() => setProtocolOpen(branch.protocolId!)}
                    className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-gold text-xs border border-gold-dim rounded bg-gold-glow hover:bg-gold/20 transition-colors"
                  >
                    ⟡ Open {branch.protocolLabel}
                  </button>
                )}
              </Accordion>
            ))}
          </div>
        )}

        {/* ── PRAYER ── */}
        {tab === "prayer" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 3
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              The Sleep Deliverance Prayer
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Spoken by or over client immediately before sleep.
            </p>

            {/* AI Generate Button */}
            <button
              onClick={generatePrayer}
              disabled={generating}
              className="w-full mb-4 py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
            >
              {generating
                ? "Generating prayer from diagnostic…"
                : "✦ Generate Custom Prayer from Diagnostic"}
            </button>

            {/* Generated Prayer */}
            {generatedPrayer && (
              <div className="mb-6 bg-bg-card border border-gold-dim rounded-lg p-5">
                <h3 className="font-serif text-gold text-sm mb-3 uppercase tracking-wider">
                  Custom Prayer — Generated from Diagnostic
                </h3>
                <div className="font-serif text-[0.85rem] text-text-dim leading-[1.7] whitespace-pre-line">
                  {generatedPrayer}
                </div>
              </div>
            )}

            {/* Standard Prayer Steps */}
            <p className="text-[0.7rem] text-text-dim uppercase tracking-wider mb-3">
              Standard Protocol Prayer
            </p>

            <PrayerCard title="Step 1 — Repentance & Clearing">
              <p className="text-[0.7rem] text-gold-dim italic mb-2 font-sans">
                Client speaks:
              </p>
              <p>
                Abba — Father of Fathers — I come before You now, at the
                threshold of sleep, where my defenses are down and my Neshama is
                fully accessible.
              </p>
              <p>
                I repent for every agreement I have made — consciously or
                unconsciously — that is expressing as pain in my body. I repent
                for every burden I picked up that was never mine to carry. I
                repent for every vow of suffering, smallness, or powerlessness
                spoken in this lifetime or any other.
              </p>
              <p>
                I repent for every way I have rejected, suppressed, or wounded my
                own masculine — my capacity to initiate, to stand in authority,
                to take up space, to create without permission. I repent for the
                moments I accepted the narrative that my power was dangerous,
                wrong, or needed to be cut away.
              </p>
              <p>
                I repent for every entanglement I maintained out of love that
                became a transfer point for another person&apos;s pain into my
                body. Love does not require me to absorb what is not mine. I
                repent for confusing the two.
              </p>
              <p>
                Every door open in my body — I close it now. Every agreement
                creating physical restriction — I revoke it now. Every word
                spoken over me that I agreed with — I break the agreement now.
              </p>
              <p className="text-text-primary font-medium">
                In the name of{" "}
                <span className="text-gold italic">Yeshua HaMashiach</span> —
                every legal right is revoked. The{" "}
                <span className="text-gold italic">Dam HaBrit</span> is my
                covering.
              </p>
            </PrayerCard>

            <PrayerCard title="Step 2 — Command">
              <p className="text-[0.7rem] text-gold-dim italic mb-2 font-sans">
                Client or Practitioner speaks:
              </p>
              <p className="text-text-primary font-medium">
                In the name of{" "}
                <span className="text-gold italic">Yeshua HaMashiach</span> —
              </p>
              <p>
                I address every spirit, entity, and frequency lodged in this body
                — specifically in the{" "}
                <em>[right shoulder / neck / named area]</em>.
              </p>
              <p>
                You are operating without legal right. The repentance is
                complete. The door you used is closed.
              </p>
              <p className="text-text-primary font-medium">
                I command every one of you — OUT. Out of this tissue. Out of this
                nerve pathway. Out of this cellular memory. Out of this
                bloodline.
              </p>
              <p className="text-text-primary font-medium">
                Every alliance formed between you — broken NOW. Every
                reinforcement called — disbanded NOW. Every anchor point in the
                physical body — dissolved NOW by the{" "}
                <span className="text-gold italic">Cherev HaRuach</span>.
              </p>
              <p>
                You will not transfer to another person. You will not fragment
                and hide in another system. You will go directly to the Heart of
                True Source for transmutation.
              </p>
              <p className="text-text-primary font-medium">
                <span className="text-gold italic">
                  Tzeitzu (צְאוּ). B&apos;Shem Yeshua HaMashiach.
                </span>{" "}
                NOW.
              </p>
            </PrayerCard>

            <PrayerCard title="Step 3 — Cellular Command">
              <p className="text-[0.7rem] text-gold-dim italic mb-2 font-sans">
                Practitioner speaks over client:
              </p>
              <p>
                In the name of{" "}
                <span className="text-gold italic">Yeshua HaMashiach</span> — I
                speak to every cell in{" "}
                <em>[right shoulder / neck / named area]</em>:
              </p>
              <p>
                You were created to carry light, not burden. You were created in
                the image of the True Father — whole, free, and pain-free.
              </p>
              <p className="text-text-primary font-medium">
                Every memory of pain stored in this tissue — I command you to
                release it now. Every trauma pattern held in the muscle fiber —
                release. Every fear held in the nerve pathway — release. Every
                ancestral imprint held in the cellular memory — rewrite now in
                the code of{" "}
                <span className="text-gold italic">Ahavah</span> and{" "}
                <span className="text-gold italic">Chaim</span>.
              </p>
              <p className="text-text-primary font-medium">
                Original divine blueprint — come forward.{" "}
                <span className="text-gold italic">Tikkun (תִּיקּוּן)</span> —
                complete restoration — activate now in these cells.
              </p>
              <p>
                Vagus nerve — come to full regulation. Brainstem — come to full
                safety. Adrenals — rest. Kidneys — restore your Jing. Endocrine
                system — rebalance. Immune system — come to full authority.
              </p>
              <p className="text-text-primary font-medium">
                Every system — you have permission from the True Father. RESTORE.
                REGENERATE. RETURN to original divine design.
              </p>
              <p className="text-text-primary font-medium">
                <span className="text-gold italic">L&apos;chaim (לְחַיּ ִים)</span>.
                To life. To full life.
              </p>
            </PrayerCard>

            <PrayerCard title="Step 4 — Fill & Seal">
              <p>
                <span className="text-gold italic">Ruach HaKodesh</span> — fill
                every space now cleared. Fill the shoulder. Fill the neck. Fill
                the nervous system. Fill the cellular memory. Let the
                client&apos;s sleep tonight be a continuation of this healing.
                Let every dream serve the restoration. Let the body wake tomorrow
                carrying less than it carried today.
              </p>
              <p>
                Guardian Host — seal this field through the night. Krystal Star —
                hold the Kathara template in full integrity through sleep.{" "}
                <span className="text-gold italic">Dam HaBrit</span> — cover
                every cell.
              </p>
              <p className="text-text-primary font-medium">
                <span className="text-gold italic">Kadosh</span>. It is done.
                Sleep in peace.
              </p>
            </PrayerCard>
          </div>
        )}

        {/* ── MORNING ── */}
        {tab === "morning" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 4
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Morning Integration Protocol
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Upon waking — before checking phone, before speaking to anyone.
            </p>

            <Accordion title="Client Morning Declaration">
              <blockquote className="border-l-2 border-gold-dim pl-3 font-serif italic text-text-dim leading-[1.7]">
                &quot;Abba — I receive what was released through the night. I
                receive the restoration that continued while I slept. I open my
                eyes into freedom. I check in with my body. I give thanks for
                every shift — seen or unseen.&quot;
              </blockquote>
            </Accordion>

            <Accordion title="Practitioner Morning Checks">
              <p>
                <strong>1.</strong> Re-test all items marked ✗ or ~ from the
                night before.
              </p>
              <p className="mt-3">
                <strong>2.</strong> Note which cleared through sleep vs. which
                need additional session work.
              </p>
              <p className="mt-3">
                <strong>3.</strong> Document any dreams — dreams during sleep
                deliverance often carry direct diagnostic information.
              </p>
              <p className="mt-3">
                <strong>4.</strong> Note physical symptom level — even partial
                reduction is confirmation of movement.
              </p>
            </Accordion>
          </div>
        )}

        {/* ── PROTOCOLS ── */}
        {tab === "protocols" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Section 5
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Special Protocols
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Targeted protocols for specific diagnostic findings.
            </p>

            <Accordion title="5A — Mother Line Entanglement Protocol">
              <p className="text-text-dim text-xs mb-3">
                Use when mother entanglement is confirmed as contributing factor.
              </p>
              <h4 className="text-gold text-[0.82rem] mb-2">
                The 21-Day Energetic Fast from Mother
              </h4>
              <p>
                No direct energetic engagement with mother&apos;s field for 21
                days. This includes: reading her messages with emotional charge,
                thinking about her with longing or anger, discussing her
                frequently, absorbing her energy in conversation.
              </p>
              <p className="mt-3">
                Physical contact is not necessarily prohibited — energetic
                engagement is what creates transfer.
              </p>
              <p className="mt-3">Each day of the fast, speak:</p>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic text-text-dim leading-[1.7]">
                &quot;I love [mother&apos;s name] and I release her fully to the
                True Father. Her healing journey is hers. I am energetically
                separate, whole, and free.&quot;
              </blockquote>
              <h4 className="text-gold text-[0.82rem] mt-4 mb-2">
                If the fast is broken:
              </h4>
              <p>
                No condemnation — simply reset. Speak: &quot;I acknowledge the
                pull. I recommit to the fast. The 21 days continues from
                today.&quot; Do not restart the count — continue forward.
              </p>
              <h4 className="text-gold text-[0.82rem] mt-4 mb-2">
                Daily Cord-Cutting
              </h4>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic text-text-dim leading-[1.7]">
                &quot;In the name of Yeshua HaMashiach — I sever every cord
                activated between my field and my mother&apos;s field today. Clean
                separation. I love her. I am separate. I am whole.&quot;
              </blockquote>
            </Accordion>

            <Accordion title="5B — Past Life Power Removal Curse Protocol">
              <p className="text-text-dim text-xs mb-3">
                Use when past life power-removal curse is confirmed active.
              </p>
              <h4 className="text-gold text-[0.82rem] mb-2">
                Identification Markers
              </h4>
              <ul className="ml-4 text-[0.82rem] space-y-1">
                <li>
                  • Chronic pain in creative/power centers (lower back, hips,
                  sacral, right shoulder as &quot;sword arm&quot;)
                </li>
                <li>
                  • Pattern of gifts being suppressed, stolen, or turned against
                  self
                </li>
                <li>
                  • Relationships where own power was diminished or punished
                </li>
                <li>
                  • Deep-seated belief that full power is dangerous or will cause
                  harm/death
                </li>
              </ul>
              <h4 className="text-gold text-[0.82rem] mt-4 mb-2">
                The Revocation
              </h4>
              <blockquote className="border-l-2 border-gold-dim pl-3 my-2 font-serif italic text-text-dim leading-[1.7]">
                In the name of Yeshua HaMashiach — I address the
                castration/power-removal curse placed in the lifetime of
                [describe briefly if known].
                <br />
                <br />
                I break this curse at its origin point. I revoke every vow of
                powerlessness I made in the aftermath of that event. I forgive
                every soul involved — including myself.
                <br />
                <br />
                I reclaim my full creative power, my full authority, my full
                masculine force — purified, sanctified, and submitted to the True
                Father.
                <br />
                <br />
                The power taken from me in that lifetime is RESTORED now — in
                every cell, every dimension, every timeline.
                <br />
                <br />I am not that story anymore. Tikkun. Complete. B&apos;Shem
                Yeshua HaMashiach.
              </blockquote>
            </Accordion>

            <Accordion title="5C — Daily Maintenance Prayer">
              <p className="text-text-dim text-xs mb-3">
                30 seconds each morning — maintains what was cleared.
              </p>
              <blockquote className="border-l-2 border-gold-dim pl-3 font-serif italic text-text-dim leading-[1.7]">
                &quot;Abba — I seal myself today in the Dam HaBrit. I carry only
                what is mine. I release what is not mine. Every cord from
                yesterday — severed. Every door closed yesterday — remains
                closed. I walk in freedom today. Kadosh.&quot;
              </blockquote>
            </Accordion>
          </div>
        )}

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <div>
            <div className="text-[0.65rem] text-gold-dim tracking-wider uppercase mb-1">
              Practitioner
            </div>
            <h2 className="font-serif text-gold text-lg mb-1">
              Session Notes
            </h2>
            <p className="text-text-dim text-[0.85rem] mb-4">
              Notes auto-save to the database.
            </p>

            <div className="space-y-4">
              {Object.entries({
                root_cause: "Root Cause Identified (Top Finding)",
                secondary_causes: "Secondary Causes",
                systems_cleared: "Systems Cleared in Session",
                spirits_named: "Spirits Named & Commanded Out",
                alliances_broken: "Alliances Broken",
                curses_revoked: "Curses / Vows Revoked",
                soul_ties: "Soul Ties Severed",
                timeline_addressed: "Timeline / Past Life Addressed",
                follow_up: "Items Still Active for Follow-Up",
                morning_retest: "Morning Re-Test Results",
                observations: "Practitioner Observations",
              }).map(([key, label]) => (
                <div key={key}>
                  <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <textarea
                    rows={2}
                    value={notes[key as keyof typeof notes]}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2 text-sm text-text-primary resize-y focus:outline-none focus:border-gold-dim"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Protocol Modal */}
      <ProtocolModal
        protocolId={protocolOpen}
        onClose={() => setProtocolOpen(null)}
      />

      {/* Footer */}
      <footer className="text-center py-8 px-4 text-[0.65rem] text-text-dim border-t border-border mt-8">
        <span className="text-gold-dim">Inner Align CRQH Protocol</span>
        <br />
        All healing to the glory of the True Father
      </footer>
    </div>
  );
}
