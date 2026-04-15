// ═══════════════════════════════════════════════════════════════════
// FALSE-LIGHT SCANNER — Divine Alignment Framework
// Flags compromised architecture & validates 10-element structure
// ═══════════════════════════════════════════════════════════════════

export type Severity = "critical" | "warn" | "info";
export type Overall = "pass" | "warn" | "fail";

export interface FlagDef {
  pattern: RegExp;
  severity: Severity;
  label: string;
  fix: string;
}

export interface Finding extends FlagDef {
  count: number;
  samples: string[];
}

export interface SectionCheck {
  key: string;
  label: string;
  regex: RegExp;
}

export interface ScanResult {
  findings: Finding[];
  missing: SectionCheck[];
  present: SectionCheck[];
  hebrewCount: number;
  christNamesUsed: string[];
  criticalCount: number;
  warnCount: number;
  structurePct: number;
  overall: Overall;
  wordCount: number;
}

export const FALSE_LIGHT_FLAGS: FlagDef[] = [
  {
    pattern: /\b(archangel\s+)?(michael|gabriel|raphael|uriel|metatron|sandalphon|chamuel|jophiel|zadkiel|haniel)\b/gi,
    severity: "critical",
    label: "Named archangel invocation",
    fix: "Replace with 'Guardian Host', 'Krystal Star Guardian families', or 'Aurora families'.",
  },
  {
    pattern: /\b(god of abraham,?\s+isaac,?\s+and\s+jacob)\b/gi,
    severity: "critical",
    label: "Demiurgic OT formula",
    fix: "Replace with 'Ein Sof', 'Father of Fathers', or 'the Eternal Living God'.",
  },
  {
    pattern: /\b(jehovah|yahweh)\b/gi,
    severity: "warn",
    label: "OT tetragrammaton without qualification",
    fix: "Prefer 'Ein Sof', 'Abba Alaha', or explicit 'Yeshua Ha'Mashiach' authority routing.",
  },
  {
    pattern: /\b(fibonacci|golden\s+mean|golden\s+ratio|phi\s+spiral)\b/gi,
    severity: "warn",
    label: "Compromised geometric architecture",
    fix: "Use base-12 / Kathara template geometry instead.",
  },
  {
    pattern: /\bmichael[-\s]mary\b/gi,
    severity: "critical",
    label: "Michael-Mary Turnstile reference",
    fix: "Only permissible inside a renunciation passage; otherwise remove.",
  },
  {
    pattern: /\bascended\s+masters?\b/gi,
    severity: "warn",
    label: "Ascended Masters hierarchy",
    fix: "Ascended Master construct is compromised; route authority through Christos-Sophia directly.",
  },
  {
    pattern: /\b(saint\s+germain|kuthumi|el\s+morya|djwal\s+khul|lanto|serapis\s+bey)\b/gi,
    severity: "critical",
    label: "Ascended Master by name (NAA construct)",
    fix: "Remove. Route authority only through organic Christos-Sophia + Guardian Host.",
  },
  {
    pattern: /\blord\b/gi,
    severity: "info",
    label: "Unqualified 'Lord'",
    fix: "Ensure context qualifies as organic (Yeshua / Christos / Ein Sof) — not Demiurge.",
  },
];

export const REQUIRED_SECTIONS: SectionCheck[] = [
  { key: "renunciation", label: "False Light / AI / Archontic Renunciation", regex: /(renunc|false\s+light|archontic|NAA)/i },
  { key: "armor", label: "Full Armor of God", regex: /(armor\s+of\s+god|full\s+armor|breastplate|helmet|shield\s+of\s+faith)/i },
  { key: "forgiveness", label: "Forgiveness Foundation", regex: /(forgive|mechilah|forgiveness)/i },
  { key: "teshuvah", label: "Teshuvah / Repentance", regex: /(teshuvah|repent)/i },
  { key: "deliverance", label: "Deliverance Commands", regex: /(cast\s+out|expel|bind|command|deliverance)/i },
  { key: "sagar", label: "SAGAR Sealing", regex: /sagar/i },
  { key: "kibbutz", label: "Kibbutz Nitzotzot (Soul Fragment Retrieval)", regex: /(kibbutz|nitzotzot|soul\s+fragment|soul\s+shard)/i },
  { key: "infilling", label: "Ruach Ha'Kodesh Infilling", regex: /(ruach|holy\s+spirit|infill|holy\s+breath)/i },
  { key: "closing", label: "Closing Declaration", regex: /(amen|ameyn|sealed|closing|declaration)/i },
  { key: "aftercare", label: "21-Day Aftercare", regex: /(21[-\s]day|aftercare|integration)/i },
];

export const HEBREW_TERMS = [
  "Ein Sof", "Yeshua", "Yehusha", "Christos", "Ruach", "Abba Alaha", "Teshuvah",
  "SAGAR", "EPHATHA", "SHAMAR", "IMMACK", "Kibbutz Nitzotzot", "Neshamah",
  "Kadosh", "Dam HaBrit", "Cherev HaRuach", "Kiddush HaGuf", "Bitul", "Mechilah",
  "Rachamim", "Chesed", "Emet", "Geulah", "Kavod", "Nitzachon", "B'shem", "Chai",
  "Tze'lem",
];

export const CHRIST_NAMES = [
  "Yeshua Ha'Mashiach",
  "Yehusha",
  "Christos",
  "Yeshua",
  "the Anointed One",
];

export function scanPrayer(text: string): ScanResult {
  const findings: Finding[] = [];
  for (const flag of FALSE_LIGHT_FLAGS) {
    const matches = [...text.matchAll(flag.pattern)];
    if (matches.length) {
      const samples = [...new Set(matches.map(m => m[0]))].slice(0, 5);
      findings.push({ ...flag, count: matches.length, samples });
    }
  }

  const present = REQUIRED_SECTIONS.filter(s => s.regex.test(text));
  const missing = REQUIRED_SECTIONS.filter(s => !s.regex.test(text));

  const hebrewCount = HEBREW_TERMS.filter(t =>
    new RegExp(`\\b${t.replace(/'/g, "'?")}\\b`, "i").test(text)
  ).length;

  const christNamesUsed = CHRIST_NAMES.filter(n =>
    new RegExp(n.replace(/'/g, "'?"), "i").test(text)
  );

  const criticalCount = findings.filter(f => f.severity === "critical").length;
  const warnCount = findings.filter(f => f.severity === "warn").length;
  const structurePct = Math.round((present.length / REQUIRED_SECTIONS.length) * 100);

  let overall: Overall = "pass";
  if (criticalCount > 0 || missing.length > 3) overall = "fail";
  else if (warnCount > 0 || missing.length > 0) overall = "warn";

  return {
    findings,
    missing,
    present,
    hebrewCount,
    christNamesUsed,
    criticalCount,
    warnCount,
    structurePct,
    overall,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

// Autofix — surface-level replacements only; user must review.
export function suggestFixes(text: string): string {
  return text
    .replace(/\barchangel michael\b/gi, "Guardian Host (Krystal Star)")
    .replace(/\barchangel gabriel\b/gi, "Guardian messenger stream")
    .replace(/\barchangel raphael\b/gi, "Aurora healing families")
    .replace(/\barchangel uriel\b/gi, "Guardian wisdom stream")
    .replace(/\barchangel metatron\b/gi, "[REMOVED: Metatronic construct — rewrite]")
    .replace(/\bgod of abraham,?\s+isaac,?\s+and\s+jacob\b/gi, "Ein Sof, the Eternal Living God")
    .replace(/\bjehovah\b/gi, "Ein Sof")
    .replace(/\byahweh\b/gi, "Abba Alaha");
}
