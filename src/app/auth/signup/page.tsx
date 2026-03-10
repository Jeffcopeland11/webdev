"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"practitioner" | "client">("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create profile
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
        role,
      });

      if (role === "practitioner") {
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
        Create Account
      </h1>

      <form onSubmit={handleSignup} className="w-full max-w-xs space-y-4">
        <div>
          <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
          />
        </div>
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
            minLength={6}
            className="w-full bg-white/[0.03] border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold-dim"
          />
        </div>

        <div>
          <label className="block text-[0.7rem] text-gold-dim uppercase tracking-wider mb-2">
            I am a…
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRole("practitioner")}
              className={`flex-1 py-2.5 rounded-lg text-xs tracking-wider uppercase border transition-colors ${
                role === "practitioner"
                  ? "border-gold text-gold bg-gold-glow"
                  : "border-border text-text-dim"
              }`}
            >
              Practitioner
            </button>
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 py-2.5 rounded-lg text-xs tracking-wider uppercase border transition-colors ${
                role === "client"
                  ? "border-gold text-gold bg-gold-glow"
                  : "border-border text-text-dim"
              }`}
            >
              Client
            </button>
          </div>
        </div>

        {error && (
          <p className="text-status-active text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-xs text-text-dim">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-gold underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
