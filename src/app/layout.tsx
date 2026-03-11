import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Divine Alignment — Sleep Deliverance Diagnostic",
  description:
    "Spirit deliverance ministry tool for practitioners and clients. By Enlightuned Studios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
