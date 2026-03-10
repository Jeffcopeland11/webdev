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

interface Session {
  id: string;
  client_name: string;
  primary_symptom: string;
  symptom_area: string;
  created_at: string;
  updated_at: string;
  status: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showNewClient, setShowNewClient] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [newClient, setNewClient] = useState({ full_name: "", email: "" });
  const [newSession, setNewSession] = useState({
    client_name: "",
    primary_symptom: "",
    symptom_area: "",
  });
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

    const { data: s } = await supabase
      .from("sessions")
      .select("*")
      .eq("practitioner_id", user.id)
      .order("created_at", { ascending: false });
    if (s) setSessions(s);
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

  async function createSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("sessions")
      .insert({
        practitioner_id: user.id,
        client_name: newSession.client_name,
        primary_symptom: newSession.primary_symptom,
        symptom_area: newSession.symptom_area,
        status: "active",
        diagnostic_data: {},
        notes: {},
      })
      .select()
      .single();

    if (data) {
      router.push(`/session/${data.id}`);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-5 py-6 border-b border-border bg-gradient-to-b from-[#121210] to-bg flex items-center justify-between">
        <div>
          <div className="text-gold text-sm">✦</div>
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
        {/* New Session */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-gold text-[0.95rem]">Sessions</h2>
            <button
              onClick={() => setShowNewSession(!showNewSession)}
              className="text-xs text-gold border border-gold-dim px-3 py-1.5 rounded hover:bg-gold-glow transition-colors"
            >
              + New Session
            </button>
          </div>

          {showNewSession && (
            <div className="bg-bg-card border border-border rounded-lg p-4 mb-4 space-y-3">
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={newSession.client_name}
                  onChange={(e) =>
                    setNewSession((s) => ({
                      ...s,
                      client_name: e.target.value,
                    }))
                  }
                  placeholder="Client's full name"
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                  Primary Symptom
                </label>
                <input
                  type="text"
                  value={newSession.primary_symptom}
                  onChange={(e) =>
                    setNewSession((s) => ({
                      ...s,
                      primary_symptom: e.target.value,
                    }))
                  }
                  placeholder="e.g. Right shoulder pain"
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
                />
              </div>
              <div>
                <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
                  Symptom Area
                </label>
                <input
                  type="text"
                  value={newSession.symptom_area}
                  onChange={(e) =>
                    setNewSession((s) => ({
                      ...s,
                      symptom_area: e.target.value,
                    }))
                  }
                  placeholder="e.g. right shoulder, neck"
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
                />
              </div>
              <button
                onClick={createSession}
                className="w-full py-2.5 border border-gold text-gold rounded text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors"
              >
                Begin Session
              </button>
            </div>
          )}

          {/* Session List */}
          {sessions.length === 0 ? (
            <p className="text-text-dim text-sm italic">
              No sessions yet. Create your first session above.
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/session/${s.id}`)}
                  className="w-full text-left bg-bg-card border border-border rounded-lg px-4 py-3 hover:bg-bg-card-hover hover:border-gold-dim transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {s.client_name}
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
                  <div className="text-xs text-text-dim mt-1">
                    {s.primary_symptom && (
                      <span>{s.primary_symptom} • </span>
                    )}
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clients */}
        <div>
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
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
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
                  className="w-full bg-white/[0.03] border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
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
              No clients yet.
            </p>
          ) : (
            <div className="space-y-2">
              {clients.map((c) => (
                <div
                  key={c.id}
                  className="bg-bg-card border border-border rounded-lg px-4 py-3"
                >
                  <div className="text-sm">{c.full_name}</div>
                  {c.email && (
                    <div className="text-xs text-text-dim mt-0.5">
                      {c.email}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-8 px-4 text-[0.65rem] text-text-dim border-t border-border mt-8">
        <span className="text-gold-dim">Inner Align CRQH Protocol</span>
      </footer>
    </div>
  );
}
