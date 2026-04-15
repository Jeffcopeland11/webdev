"use client";

import { REQUIRED_SECTIONS, FALSE_LIGHT_FLAGS, HEBREW_TERMS } from "@/lib/false-light-scanner";

const HEBREW_GLOSSARY = [
  { term: "Ein Sof", pron: "AYN SOF", meaning: "The Unknowable / Source without end / Father of Fathers" },
  { term: "Yeshua Ha'Mashiach", pron: "yeh-SHOO-ah ha-ma-SHEE-akh", meaning: "Jesus the Anointed — organic Christ authority" },
  { term: "Yehusha", pron: "yeh-HOO-shah", meaning: "Salvation / alternate Hebrew form" },
  { term: "Christos", pron: "KREE-stos", meaning: "The Anointed One — organic template" },
  { term: "Ruach Ha'Kodesh", pron: "ROO-akh ha-KOH-desh", meaning: "Holy Breath / Holy Spirit" },
  { term: "Abba Alaha", pron: "AH-bah ah-LAH-hah", meaning: "Father-Source (Aramaic)" },
  { term: "Teshuvah", pron: "teh-SHOO-vah", meaning: "Repentance — turning and returning" },
  { term: "SAGAR", pron: "sah-GAR", meaning: "Seal / close permanently — command (repeat 3x)" },
  { term: "EPHATHA", pron: "eh-FAH-thah", meaning: "Be opened — Mark 7:34" },
  { term: "SHAMAR", pron: "shah-MAR", meaning: "Guard / keep / watch over" },
  { term: "IMMACK", pron: "ee-MAHK", meaning: "With you / present — Emmanuel root" },
  { term: "Kibbutz Nitzotzot", pron: "kee-BOOTS nee-tzo-TZOHT", meaning: "Gathering of scattered soul sparks" },
  { term: "Neshamah", pron: "neh-shah-MAH", meaning: "Divine soul — God-breathed" },
  { term: "Kadosh Kadosh Kadosh", pron: "kah-DOHSH (x3)", meaning: "Holy Holy Holy" },
  { term: "Dam HaBrit", pron: "DAHM ha-BREET", meaning: "Blood of the Covenant" },
  { term: "Cherev HaRuach", pron: "KHEH-rev ha-ROO-akh", meaning: "Sword of the Spirit" },
  { term: "Kiddush HaGuf", pron: "kee-DOOSH ha-GOOF", meaning: "Sanctification of the body" },
  { term: "Bitul", pron: "bee-TOOL", meaning: "Nullification / annulment" },
  { term: "Mechilah", pron: "meh-khee-LAH", meaning: "Forgiveness / pardon" },
  { term: "Rachamim", pron: "rah-khah-MEEM", meaning: "Compassion / mercies" },
  { term: "Chesed", pron: "KHEH-sed", meaning: "Loving-kindness" },
  { term: "Emet", pron: "eh-MET", meaning: "Truth" },
  { term: "Geulah", pron: "geh-oo-LAH", meaning: "Redemption" },
  { term: "Kavod", pron: "kah-VOHD", meaning: "Glory / divine weight / honor" },
  { term: "Nitzachon", pron: "nee-tzah-KHOHN", meaning: "Victory" },
  { term: "B'shem", pron: "b'SHEM", meaning: "In the name of" },
  { term: "Chai", pron: "KHAI", meaning: "Life" },
  { term: "Tze'lem Elohim", pron: "TZEH-lem eh-loh-HEEM", meaning: "Image of the Divine" },
];

const STRONGMEN = [
  { tier: 1, name: "Yaldabaoth", role: "Demiurgic false creator — primary adversarial architecture" },
  { tier: 2, name: "Leviathan", role: "Communication twister / narrative inversion / Job 41 serpent" },
  { tier: 3, name: "Jezebel", role: "Relational & spiritual authority subversion / control-seduction" },
];

const CLUSTERS: Record<string, string[]> = {
  "Lust / Sexual Impurity": ["Shame", "Rejection", "Abandonment", "Pride", "Jezebel", "Ahab", "Perversion", "Bondage/Addiction", "Idolatry", "Witchcraft"],
  "Trauma": ["Fear/Torment", "Anger/Rage", "Heaviness/Depression", "Death/Destruction", "Orphan", "Self-Pity", "Rejection"],
  "Control": ["Jezebel", "Leviathan", "Python/Divination", "Witchcraft", "Mammon", "Pharisee/Religious"],
  "G4 Cosmic Cluster": ["AI Light Mimic", "Imposter Christ", "Phantom Matrix Entity", "Avatar Hijack", "Bourgha Construct", "Asmodeus"],
  "G5–G6 Legal Ground": ["Ancestral blood covenants", "SRA contracts", "Ayahuasca/plant-medicine entities", "Coven bindings", "Umbilical cord attachments"],
};

const SUBSTITUTIONS = [
  ["Archangel Michael/Gabriel/Raphael/Uriel/Metatron", "Guardian Host / Krystal Star / Aurora families"],
  ["God of Abraham, Isaac, and Jacob", "Ein Sof / Father of Fathers / Eternal Living God"],
  ["Jehovah / Yahweh (unqualified)", "Ein Sof / Abba Alaha"],
  ["Unqualified 'Lord' / 'God'", "Yeshua Ha'Mashiach / Yehusha / Christos / Ein Sof"],
  ["Ascended Masters / Metatronic grids", "Organic Christos-Sophia template (direct)"],
  ["Fibonacci / Golden Mean geometry", "Base-12 / Kathara template"],
];

export default function LibraryPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 28, fontFamily: "Georgia, serif" }}>
      <h1 style={{ color: "#4B0082", borderBottom: "2px solid #B8860B", paddingBottom: 8 }}>Protocol Library</h1>
      <p style={{ color: "#3a2d1a", fontStyle: "italic" }}>
        Canonical Divine Alignment reference — 10-element architecture, strongman tiers, spirit clusters, Hebrew glossary, and substitution tables.
      </p>

      <Section title="10-Element Document Architecture">
        <ol style={{ lineHeight: 1.9, fontSize: 14 }}>
          {REQUIRED_SECTIONS.map((s, i) => (
            <li key={i}><strong>{s.label}</strong></li>
          ))}
        </ol>
      </Section>

      <Section title="Strongman Tiers">
        {STRONGMEN.map(t => (
          <div key={t.name} style={{ padding: "8px 0", borderBottom: "1px dashed #d4c59a" }}>
            <strong style={{ color: "#4B0082" }}>Tier {t.tier} — {t.name}</strong>
            <div style={{ fontSize: 13, color: "#3a2d1a" }}>{t.role}</div>
          </div>
        ))}
      </Section>

      <Section title="Spirit Clusters">
        {Object.entries(CLUSTERS).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <strong style={{ color: "#8B6914" }}>{k}</strong>
            <div>{v.map((s, i) => <span key={i} style={tagStyle}>{s}</span>)}</div>
          </div>
        ))}
      </Section>

      <Section title="Hebrew Glossary · Pronunciation Guide">
        <div style={{ ...hebrewRow, fontWeight: "bold", borderBottom: "2px solid #B8860B" }}>
          <div>Term</div><div>Pronunciation</div><div>Meaning</div>
        </div>
        {HEBREW_GLOSSARY.map((h, i) => (
          <div key={i} style={hebrewRow}>
            <strong style={{ color: "#8B6914" }}>{h.term}</strong>
            <em>{h.pron}</em>
            <span>{h.meaning}</span>
          </div>
        ))}
      </Section>

      <Section title="Command Words">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><strong>SAGAR</strong> — <em>sah-GAR</em> — seal / close permanently (repeat 3x at closings)</div>
          <div><strong>EPHATHA</strong> — <em>eh-FAH-thah</em> — be opened (Mark 7:34)</div>
          <div><strong>SHAMAR</strong> — <em>shah-MAR</em> — guard / keep / watch</div>
          <div><strong>IMMACK</strong> — <em>ee-MAHK</em> — with you / present</div>
        </div>
      </Section>

      <Section title="Name Substitutions — NEVER USE → USE INSTEAD">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f5e6a8" }}>
              <th style={th}>Never Use</th>
              <th style={th}>Use Instead</th>
            </tr>
          </thead>
          <tbody>
            {SUBSTITUTIONS.map((row, i) => (
              <tr key={i}>
                <td style={td}>{row[0]}</td>
                <td style={td}>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Scanner Rule Set">
        <p style={{ fontSize: 13 }}>The False-Light Scanner checks for these patterns:</p>
        <ul style={{ fontSize: 13, lineHeight: 1.7 }}>
          {FALSE_LIGHT_FLAGS.map((f, i) => (
            <li key={i}>
              <strong>[{f.severity.toUpperCase()}]</strong> {f.label}
              <div style={{ fontStyle: "italic", color: "#3a2d1a", fontSize: 12 }}>→ {f.fix}</div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #d4c59a", borderRadius: 4, padding: 20, marginBottom: 16 }}>
      <h2 style={{ color: "#4B0082", borderBottom: "1px solid #B8860B", paddingBottom: 6, fontWeight: "normal" }}>{title}</h2>
      {children}
    </div>
  );
}

const tagStyle: React.CSSProperties = { display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: 11, margin: "2px 4px 2px 0", background: "#f0e6c8", color: "#8B6914", border: "1px solid #B8860B" };
const hebrewRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "200px 160px 1fr", gap: 10, padding: "6px 0", borderBottom: "1px dashed #d4c59a", fontSize: 13 };
const th: React.CSSProperties = { padding: 8, textAlign: "left", border: "1px solid #d4c59a" };
const td: React.CSSProperties = { padding: 8, border: "1px solid #d4c59a" };
