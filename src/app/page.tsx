import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      {/* Sigil */}
      <div className="w-14 h-14 rounded-full border-2 border-gold flex items-center justify-center text-gold text-2xl mb-6">
        ✦
      </div>

      <h1 className="font-serif text-gold text-xl sm:text-2xl tracking-widest uppercase text-center">
        Sleep Deliverance Diagnostic
      </h1>
      <p className="text-[0.7rem] text-text-dim tracking-[0.15em] uppercase mt-1">
        CRQH — Cellular Resonance Quantum Healing
      </p>

      <p className="font-serif italic text-text-dim text-sm text-center mt-6 max-w-md leading-relaxed">
        Completed in the hour before sleep — when the veil between conscious and
        subconscious is thinnest, and the deepest layers of cellular memory
        become accessible for healing, clearing, and restoration.
      </p>

      <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
        <Link
          href="/auth/login"
          className="block text-center py-3 px-6 border border-gold text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold-glow transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="block text-center py-3 px-6 bg-gold-glow border border-gold-dim text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold/20 transition-colors"
        >
          Create Account
        </Link>
      </div>

      <footer className="mt-16 text-center text-[0.65rem] text-text-dim">
        <span className="text-gold-dim">Inner Align CRQH Protocol</span>
        <br />
        All healing to the glory of the True Father
      </footer>
    </div>
  );
}
