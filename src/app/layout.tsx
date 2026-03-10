import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sleep Deliverance Diagnostic — CRQH Inner Align Protocol",
  description:
    "Cellular Resonance Quantum Healing diagnostic and prayer platform for practitioners and clients.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
