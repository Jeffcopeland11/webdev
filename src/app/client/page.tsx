"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import PrayerCard from "@/components/PrayerCard";

interface SessionRecord {
  id: string;
  client_name: string;
  primary_symptom: string;
  symptom_area: string;
  created_at: string;
  status: string;
  generated_prayer: string | null;
}

export default function ClientPortal() {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { data: p } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();
    if (p) setProfile(p);

    // Find sessions where client name matches this user's name
    const { data: s } = await supabase
      .from("sessions")
      .select("*")
      .or(`client_email.eq.${user.email},client_name.ilike.%${p?.full_name || ""}%`)
      .order("created_at", { ascending: false });
    if (s) setSessions(s);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen">
      <header className="px-5 py-6 border-b border-border bg-gradient-to-b from-[#121210] to-bg flex items-center justify-between">
        <div>
          <div className="text-gold text-sm">✦</div>
          <h1 className="font-serif text-gold text-base tracking-widest uppercase mt-1">
            My Healing Journey
          </h1>
          <p className="text-[0.65rem] text-text-dim mt-0.5">
            Welcome, {profile?.full_name || "Client"}
          </p>
        </div>
        <button
          onClick={signOut}
          className="text-xs text-text-dim hover:text-gold border border-border px-3 py-1.5 rounded"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-[640px] mx-auto p-5">
        {/* Daily Maintenance */}
        <div className="mb-8">
          <h2 className="font-serif text-gold text-[0.95rem] mb-3">
            Daily Maintenance Prayer
          </h2>
          <PrayerCard title="Morning Prayer — 30 Seconds">
            <p>
              &quot;Abba — I seal myself today in the Dam HaBrit. I carry only
              what is mine. I release what is not mine. Every cord from yesterday
              — severed. Every door closed yesterday — remains closed. I walk in
              freedom today. Kadosh.&quot;
            </p>
          </PrayerCard>
        </div>

        {/* Session History */}
        <div className="mb-8">
          <h2 className="font-serif text-gold text-[0.95rem] mb-3">
            My Sessions
          </h2>

          {sessions.length === 0 ? (
            <div className="bg-bg-card border border-border rounded-lg p-6 text-center">
              <p className="text-text-dim text-sm">
                No sessions found yet. Your practitioner will create a session
                for you.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    setSelectedSession(selectedSession?.id === s.id ? null : s)
                  }
                  className={`w-full text-left bg-bg-card border rounded-lg px-4 py-3 transition-colors ${
                    selectedSession?.id === s.id
                      ? "border-gold-dim"
                      : "border-border hover:border-gold-dim/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {new Date(s.created_at).toLocaleDateString()} —{" "}
                      {s.primary_symptom || "Session"}
                    </span>
                    <span
                      className={`text-[0.65rem] uppercase tracking-wider ${
                        s.status === "active"
                          ? "text-status-partial"
                          : "text-status-clear"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  {s.symptom_area && (
                    <div className="text-xs text-text-dim mt-0.5">
                      Focus area: {s.symptom_area}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Session Prayer */}
        {selectedSession?.generated_prayer && (
          <div className="mb-8">
            <h2 className="font-serif text-gold text-[0.95rem] mb-3">
              Your Custom Prayer —{" "}
              {new Date(selectedSession.created_at).toLocaleDateString()}
            </h2>
            <div className="bg-bg-card border border-gold-dim rounded-lg p-5">
              <p className="text-[0.65rem] text-gold-dim uppercase tracking-wider mb-3">
                Generated from your diagnostic findings
              </p>
              <div className="font-serif text-[0.85rem] text-text-dim leading-[1.7] whitespace-pre-line">
                {selectedSession.generated_prayer}
              </div>
            </div>
          </div>
        )}

        {/* Client Opening Prayer */}
        <div>
          <h2 className="font-serif text-gold text-[0.95rem] mb-3">
            Prayers & Declarations
          </h2>

          <PrayerCard title="Pre-Session Opening">
            <p>
              &quot;I open myself fully to the True Father — Father of Fathers —
              and to the Ruach HaKodesh. I give permission for all that needs to
              be seen to be seen. I give permission for all that needs to be
              cleared to be cleared. I am willing to receive the truth and I am
              willing to be free.&quot;
            </p>
          </PrayerCard>

          <PrayerCard title="Morning Integration">
            <p>
              &quot;Abba — I receive what was released through the night. I
              receive the restoration that continued while I slept. I open my
              eyes into freedom. I check in with my body. I give thanks for
              every shift — seen or unseen.&quot;
            </p>
          </PrayerCard>
        </div>
      </div>

      <footer className="text-center py-8 px-4 text-[0.65rem] text-text-dim border-t border-border mt-8">
        <span className="text-gold-dim">Inner Align CRQH Protocol</span>
        <br />
        All healing to the glory of the True Father
      </footer>
    </div>
  );
}
