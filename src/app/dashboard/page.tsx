"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

interface DeliveranceSession {
  id: string;
  client_id: string;
  session_date: string;
  spirits_found: string[];
  spirits_cleared: string[];
  session_notes: string;
  created_at: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [deliveranceSessions, setDeliveranceSessions] = useState<DeliveranceSession[]>([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ full_name: "", email: "" });
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
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
      .select("full_name")
      .eq("id", user.id)
      .single();
    if (p) setProfile(p);

    const { data: c } = await supabase
      .from("clients")
      .select("*")
      .eq("practitioner_id", user.id)
      .order("created_at", { ascending: false });
    if (c) setClients(c);

    const { data: ds } = await supabase
      .from("deliverance_sessions")
      .select("*")
      .eq("practitioner_id", user.id)
      .order("created_at", { ascending: false });
    if (ds) setDeliveranceSessions(ds);
  }

  async function addClient() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("clients").insert({
      practitioner_id: user.id,
      full_name: newClient.full_name,
      email: newClient.email,
    });

    setNewClient({ full_name: "", email: "" });
    setShowNewClient(false);
    loadData();
  }

  function startSession(clientId: string) {
    router.push(`/tools/sleep-deliverance?client=${clientId}`);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // Count recurring spirits across sessions for a client
  function getRecurringSpirits(clientId: string): string[] {
    const clientSessions = deliveranceSessions.filter((s) => s.client_id === clientId);
    const spiritCount: Record<string, number> = {};
    for (const s of clientSessions) {
      for (const spirit of s.spirits_found || []) {
        spiritCount[spirit] = (spiritCount[spirit] || 0) + 1;
      }
    }
    return Object.entries(spiritCount)
      .filter(([, count]) => count >= 2)
      .map(([spirit]) => spirit);
  }

  return (
    <div className="min-h-screen">
      <header className="px-5 py-6 border-b border-border bg-gradient-to-b from-[#110e12] to-bg flex items-center justify-between">
        <div>
          <div className="text-gold text-lg">✝</div>
          <h1 className="font-serif text-gold text-base tracking-widest uppercase mt-1">
            Dashboard
          </h1>
          <p className="text-[0.65rem] text-text-dim mt-0.5">
            Welcome, {profile?.full_name || "Practitioner"}
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
        {/* Quick Start */}
        <button
          onClick={() => router.push("/tools/sleep-deliverance")}
          className="w-full mb-6 py-4 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors"
        >
          ✝ Start New Sleep Deliverance Session
        </button>

        {/* Client Directory */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-gold text-[0.95rem]">
              Client Directory
            </h2>
            <button
              onClick={() => setShowNewClient(!showNewClient)}
              className="text-xs text-gold border border-gold-dim px-3 py-1.5 rounded hover:bg-gold-glow transition-colors"
            >
              + Add Client
            </button>
          </div>

          {showNewClient && (
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4 space-y-3">
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newClient.full_name}
                  onChange={(e) =>
                    setNewClient((c) => ({ ...c, full_name: e.target.value }))
                  }
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim"
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient((c) => ({ ...c, email: e.target.value }))
                  }
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-cream focus:outline-none focus:border-gold-dim"
                />
              </div>
              <button
                onClick={addClient}
                className="w-full py-2.5 border border-gold text-gold rounded text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors"
              >
                Save Client
              </button>
            </div>
          )}

          {clients.length === 0 ? (
            <p className="text-text-dim text-sm italic">
              No clients yet. Add your first client above.
            </p>
          ) : (
            <div className="space-y-2">
              {clients.map((c) => {
                const isSelected = selectedClient === c.id;
                const clientSessions = deliveranceSessions.filter(
                  (s) => s.client_id === c.id
                );
                const recurring = getRecurringSpirits(c.id);

                return (
                  <div key={c.id}>
                    <button
                      onClick={() =>
                        setSelectedClient(isSelected ? null : c.id)
                      }
                      className={`w-full text-left bg-bg-card border rounded-lg px-4 py-3 transition-colors ${
                        isSelected
                          ? "border-gold-dim"
                          : "border-border hover:border-gold-dim/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {c.full_name}
                        </span>
                        <span className="text-text-dim text-[0.65rem]">
                          {clientSessions.length} session
                          {clientSessions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {c.email && (
                        <div className="text-xs text-text-dim mt-0.5">
                          {c.email}
                        </div>
                      )}
                    </button>

                    {isSelected && (
                      <div className="bg-bg-card border border-border border-t-0 rounded-b-lg px-4 py-3 -mt-1">
                        <button
                          onClick={() => startSession(c.id)}
                          className="w-full mb-3 py-2 border border-gold text-gold rounded text-xs tracking-wider uppercase hover:bg-gold-glow transition-colors"
                        >
                          ✝ Start Deliverance Session for {c.full_name}
                        </button>

                        {recurring.length > 0 && (
                          <div className="mb-3">
                            <div className="text-[0.65rem] text-status-active uppercase tracking-wider mb-1">
                              Recurring Spirits (2+ sessions)
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {recurring.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[0.6rem] bg-status-active/15 text-status-active border border-status-active/30 rounded px-1.5 py-0.5"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {clientSessions.length > 0 ? (
                          <div>
                            <div className="text-gold text-[0.65rem] tracking-wider uppercase mb-1">
                              Deliverance History
                            </div>
                            {clientSessions.map((s) => (
                              <div
                                key={s.id}
                                className="text-xs border-b border-border/50 py-2 last:border-0"
                              >
                                <div className="text-cream">
                                  {new Date(s.session_date).toLocaleDateString()}{" "}
                                  — {(s.spirits_found || []).length} spirits
                                  found,{" "}
                                  {(s.spirits_cleared || []).length} cleared
                                </div>
                                {s.session_notes && (
                                  <div className="text-text-dim mt-0.5 line-clamp-2">
                                    {s.session_notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-text-dim text-xs italic">
                            No deliverance sessions yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-8 px-4 text-[0.6rem] text-text-dim border-t border-border mt-8">
        <span className="text-gold-dim">Divine Alignment Protocol</span> —
        Enlightuned Studios
      </footer>
    </div>
  );
}
