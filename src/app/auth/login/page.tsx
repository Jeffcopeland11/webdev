"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check profile for role and redirect
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "practitioner") {
        router.push("/dashboard");
      } else {
        router.push("/client");
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center text-gold text-xl mb-6">
        ✦
      </div>
      <h1 className="font-serif text-gold text-lg tracking-widest uppercase mb-8">
        Sign In
      </h1>

      <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
        <div>
          <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
          />
        </div>
        <div>
          <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
          />
        </div>

        {error && (
          <p className="text-status-active text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-xs text-text-dim">
        No account?{" "}
        <Link href="/auth/signup" className="text-gold underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
