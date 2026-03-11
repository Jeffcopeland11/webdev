export const PHYSICAL_SYSTEMS = [
  "Vagus Nerve", "Brain Stem", "Adrenal Glands", "Endocrine System",
  "Immune System", "Kidneys / Renal System", "Liver / Gallbladder",
  "Heart / Pericardium", "Lymphatic System", "Nervous System (Parasympathetic)",
  "Nervous System (Sympathetic)", "Spinal Column", "Cervical Spine (C1–C7)",
  "Right Shoulder Joint", "Right Neck / Trapezius", "Jaw / TMJ",
  "Gut-Brain Axis", "DNA / Cellular Memory",
];

export const ENERGY_SYSTEMS = [
  "Root Chakra", "Sacral Chakra", "Solar Plexus", "Heart Chakra",
  "Throat Chakra", "Third Eye", "Crown Chakra", "Earth Star", "Soul Star",
  "Kathara Template — Integrity", "Auric Field — Sealed", "Etheric Body",
  "Emotional Body", "Mental Body", "Causal Body",
];

export type DiagnosticStatus = "clear" | "active" | "partial" | null;

export interface BranchDef {
  num: number;
  title: string;
  items: string[];
  protocolId?: string;
  protocolLabel?: string;
}

export const BRANCHES: BranchDef[] = [
  {
    num: 1, title: "Physical / Structural", items: [
      "Physical injury or structural misalignment present?",
      "Postural compensation pattern active?",
      "Referred pain from another site?",
      "Inflammatory response active?",
      "Nutritional deficiency contributing?",
    ],
  },
  {
    num: 2, title: "Emotional / Psychological", items: [
      "Unprocessed grief held in this area?",
      "Suppressed anger held in this area?",
      "Fear/dread held in this area?",
      "Shame held in this area?",
      "Unspoken truth creating physical tension?",
      "Burden or responsibility not belonging to client?",
      "Caretaking energy creating physical strain?",
    ],
  },
  {
    num: 3, title: "Relational / Soul Tie", items: [
      "Active soul tie contributing to symptom?",
      "Mother line?", "Father line?",
      "Romantic/intimate partner?", "Child?",
      "Ancestral figure?", "Named person?",
      "Cord/hook from another person's field lodged in symptom area?",
      "Collective field entanglement?",
    ],
    protocolId: "5a", protocolLabel: "Mother Line Protocol",
  },
  {
    num: 4, title: "Spiritual / Entity", items: [
      "Spirit/entity present in symptom area?",
      "Named spirit? (fear, rejection, infirmity, control, Jezebel, Pharisee, witchcraft…)",
      "Unnamed spirit?", "Collective/legion?",
      "Strongman present? If yes — what is it?",
      "Alliance between spirits present?",
      "Entity anchor point in the physical symptom?",
    ],
  },
  {
    num: 5, title: "Ancestral / Generational", items: [
      "Generational pattern expressing through symptom?",
      "Mother line ancestral pattern?",
      "Father line ancestral pattern?",
      "Both bloodlines contributing?",
      "How many generations back? (test: 1, 2, 3, 5, 7, 10, further)",
    ],
    protocolId: "5a", protocolLabel: "Mother Line Protocol",
  },
  {
    num: 6, title: "Past Life / Timeline", items: [
      "Past life trauma expressing in present body?",
      "Vow made in another lifetime active now?",
      "Curse placed in another lifetime active now?",
      "Death trauma from another timeline lodged in this area?",
      "Type of trauma? (physical injury, murder, persecution, betrayal, abandonment, castration/power removal, sacrifice)",
      "Another soul involved in that timeline?",
      "Is that soul present in current lifetime?",
    ],
    protocolId: "5b", protocolLabel: "Power Removal Curse Protocol",
  },
  {
    num: 7, title: "Curse / Vow / Agreement", items: [
      "Active curse on this area?",
      "Self-spoken?", "Spoken by another person?",
      "Generational curse?", "Past life curse?",
      "Institutional / religious curse?",
      "Active vow creating physical restriction?",
      "Vow of suffering?", "Vow of smallness / powerlessness?",
      "Vow against power / authority / creative force?",
      "Vow made to another person?",
      "Blood oath or covenant contributing?",
    ],
    protocolId: "5b", protocolLabel: "Power Removal Curse Protocol",
  },
  {
    num: 8, title: "Masculine / Feminine Architecture", items: [
      "Masculine energy integration complete?",
      "Distorted masculine (abusive / absent / controlling) imprinted?",
      "Wounded masculine from father line active?",
      "Wounded masculine from past life active?",
      "Feminine/masculine balance in symptom area?",
      "Right side (masculine/giving/doing) specifically affected?",
      "Acceptance of own inner masculine complete?",
      "Acceptance of masculine in relationship complete?",
    ],
  },
  {
    num: 9, title: "Right Shoulder / Neck (Specific)", items: [
      "Weight/burden not belonging to client being carried here?",
      "Responsibility for another person's healing/salvation active?",
      "Caretaking role creating muscular/energetic compression?",
      "Inability to say no creating chronic tension here?",
      "Masculine wounding specifically lodged in right shoulder?",
      "Castration/power-removal curse active in this area?",
      "Past-life wound — physical strike or injury to this area?",
      "Perpetrator energy from past life still attached here?",
      "Mother line entanglement pulling on right shoulder?",
      "Mother's unprocessed grief transferred here?",
      "Mother's fear transferred here?",
      "Enmeshment cord specifically anchored here?",
    ],
    protocolId: "5a", protocolLabel: "Mother Line Protocol",
  },
];

export const PROTOCOLS: Record<string, { title: string; content: string }> = {
  "5a": {
    title: "5A — Mother Line Entanglement Protocol",
    content: `Use when mother entanglement is confirmed as contributing factor.

**The 21-Day Energetic Fast from Mother:**

No direct energetic engagement with mother's field for 21 days. This includes: reading her messages with emotional charge, thinking about her with longing or anger, discussing her frequently, absorbing her energy in conversation.

Physical contact is not necessarily prohibited — energetic engagement is what creates transfer.

Each day of the fast, speak:

> "I love [mother's name] and I release her fully to the True Father. Her healing journey is hers. I am energetically separate, whole, and free."

**If the fast is broken:**

No condemnation — simply reset. Speak: "I acknowledge the pull. I recommit to the fast. The 21 days continues from today." Do not restart the count — continue forward.

**Daily Cord-Cutting:**

> "In the name of Yeshua HaMashiach — I sever every cord activated between my field and my mother's field today. Clean separation. I love her. I am separate. I am whole."`,
  },
  "5b": {
    title: "5B — Past Life Power Removal Curse Protocol",
    content: `Use when past life power-removal curse is confirmed active.

**Identification Markers:**
- Chronic pain in creative/power centers (lower back, hips, sacral, right shoulder as "sword arm")
- Pattern of gifts being suppressed, stolen, or turned against self
- Relationships where own power was diminished or punished
- Deep-seated belief that full power is dangerous or will cause harm/death

**The Revocation:**

> In the name of Yeshua HaMashiach — I address the castration/power-removal curse placed in the lifetime of [describe briefly if known].
>
> I break this curse at its origin point. I revoke every vow of powerlessness I made in the aftermath of that event. I forgive every soul involved — including myself.
>
> I reclaim my full creative power, my full authority, my full masculine force — purified, sanctified, and submitted to the True Father.
>
> The power taken from me in that lifetime is RESTORED now — in every cell, every dimension, every timeline.
>
> I am not that story anymore. Tikkun. Complete. B'Shem Yeshua HaMashiach.`,
  },
  "5c": {
    title: "5C — Daily Maintenance Prayer",
    content: `30 seconds each morning — maintains what was cleared.

> "Abba — I seal myself today in the Dam HaBrit. I carry only what is mine. I release what is not mine. Every cord from yesterday — severed. Every door closed yesterday — remains closed. I walk in freedom today. Kadosh."`,
  },
};
