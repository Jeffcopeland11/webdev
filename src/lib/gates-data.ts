export interface GateTestItem {
  statement: string;
}

export interface GateDefinition {
  num: number;
  title: string;
  category: string;
  hawkins: string;
  housesNode: string;
  testItems: GateTestItem[];
  command: string;
  fillInFields?: string[];
}

export const GATE_REFERENCE = [
  { gate: 1, category: "Night Owl / Slumber / Python", hawkins: "50–100", house: "H6: Laziness/Apathy" },
  { gate: 2, category: "Ancestral / Familiar / Generational", hawkins: "30–75", house: "H7: Pride/Separation" },
  { gate: 3, category: "Fear / Death / Infirmity / Trauma", hawkins: "75–150", house: "H2: Wrath/Suppression" },
  { gate: 4, category: "Marine / Sexual / Soul Tie / Water Spirits", hawkins: "50–125", house: "H1: Lust/Addiction" },
  { gate: 5, category: "Place-based / Object / Geo Frequency", hawkins: "varies", house: "All Houses" },
  { gate: 6, category: "Agreements / Inner Vows / Lying Spirit / Passivity", hawkins: "20–75", house: "H4: Envy/Silence" },
  { gate: 7, category: "Physical / Circadian / Pharmakia / Body", hawkins: "75–125", house: "H5: Gluttony" },
];

export const GATES: GateDefinition[] = [
  {
    num: 1,
    title: "Spiritual Attack",
    category: "Night Owl / Slumber / Python",
    hawkins: "50–100",
    housesNode: "H6: Laziness/Apathy",
    testItems: [
      { statement: "A spirit is actively disrupting my sleep patterns right now" },
      { statement: "The Night Owl Spirit is operating in this field" },
      { statement: "The Spirit of Slumber is operating — keeping me spiritually asleep" },
      { statement: "Python is constricting prayer vitality and spiritual authority" },
      { statement: "There is a three-part sleep suppression system active (Night Owl + Slumber + Python together)" },
    ],
    command: `In the name of Yeshua HaMashiach —
I bind Night Owl, Spirit of Slumber, and Python — together.
I break the three-part suppression system operating against this field.

Python — I cut your constriction from the prayer life NOW.
Night Owl — your assignment over the night hours is terminated.
Spirit of Slumber — the veil is removed. Spiritual eyes open NOW.

Tzeitzu (צְאוּ). B'shem Yeshua HaMashiach.`,
  },
  {
    num: 2,
    title: "Ancestral / Familiar / Generational",
    category: "Ancestral / Familiar / Generational",
    hawkins: "30–75",
    housesNode: "H7: Pride/Separation",
    testItems: [
      { statement: "A familiar spirit is operating in this field — known to this bloodline" },
      { statement: "A generational spirit has legal access through the ancestral line" },
      { statement: "Father's bloodline is the primary entry point" },
      { statement: "Mother's bloodline is the primary entry point" },
      { statement: "Both bloodlines are contributing simultaneously" },
      { statement: "A Freemasonic covenant in the bloodline is still active" },
      { statement: "A religious vow in the bloodline is still active" },
      { statement: "A blood or bone covenant from an ancestor is still active" },
      { statement: "The ancestral access is 1 generation back" },
      { statement: "The ancestral access is 2 generations back" },
      { statement: "The ancestral access is 3 or more generations back" },
    ],
    fillInFields: ["Ancestor name (if known)", "Generation number", "Type of covenant"],
    command: `In the name of Yeshua HaMashiach —
I stand as representative of this bloodline.
I renounce and break every [covenant type] made by [ancestor / ancestor's line]
that gave dark entities legal access through the generational line.

Every Freemasonic oath — null and void.
Every religious vow that bound descendants — broken.
Every blood or bone covenant — dissolved in the Dam HaBrit.

The bloodline is washed clean. The cycle ends NOW.
SAGAR on every ancestral open door.
B'shem Yeshua HaMashiach.`,
  },
  {
    num: 3,
    title: "Fear / Death / Infirmity / Trauma",
    category: "Fear / Death / Infirmity / Trauma",
    hawkins: "75–150",
    housesNode: "H2: Wrath/Suppression",
    testItems: [
      { statement: "Spirit of Fear is the primary driver of sleep disruption" },
      { statement: "Spirit of Death is operating — 'sleep = death' body memory active" },
      { statement: "Spirit of Infirmity is present in the body" },
      { statement: "Spirit of Dread is active" },
      { statement: "Spirit of Torment is present" },
      { statement: "Spirit of Night Terror is active" },
      { statement: "Spirit of Martyr is present" },
      { statement: "Body memory: unconsciousness equals danger/death" },
      { statement: "The body is in chronic freeze/shutdown survival loop" },
    ],
    command: `Spirit of [name] — your legal right is the [trauma/cellular agreement].
That agreement is repented of. The door is closed.

In the name of Yeshua HaMashiach — OUT.
You will not transfer. You will not fragment.
Go directly to the Heart of True Source. NOW.
Tzeitzu. B'shem Yeshua HaMashiach.`,
  },
  {
    num: 4,
    title: "Marine / Sexual / Soul Tie",
    category: "Marine / Sexual / Soul Tie / Water Spirits",
    hawkins: "50–125",
    housesNode: "H1: Lust/Addiction",
    testItems: [
      { statement: "An Incubus spirit is present / active during sleep" },
      { statement: "A Succubus spirit is present / active during sleep" },
      { statement: "A Marine spirit is operating through a water/sexual gateway" },
      { statement: "An Astral Sex Spirit is active" },
      { statement: "A soul tie is acting as a conduit for sexual spirits during sleep" },
      { statement: "The Whore of Babylon spirit has access through a soul tie" },
      { statement: "A specific person's soul tie is the entry point" },
      { statement: "The sacral center is the primary breach point" },
    ],
    command: `In the name of Yeshua HaMashiach —
I sever every soul tie acting as a conduit for sexual spirits — NOW.
Incubus — OUT. Succubus — OUT. Marine spirit — OUT.
Every sexual spirit that gained access through [source] — GONE.

The sacral center is sealed. This body is the Temple of the Ruach HaKodesh.
You have no access. No legal right. No ground.
Tzeitzu. B'shem Yeshua HaMashiach.`,
  },
  {
    num: 5,
    title: "Place-Based / Object / Geo Frequency",
    category: "Place-based / Object / Geo Frequency",
    hawkins: "varies",
    housesNode: "All Houses",
    testItems: [
      { statement: "The sleep location itself has an entity or dark frequency present" },
      { statement: "An object in the sleep environment is a frequency carrier" },
      { statement: "A geographic ley line or portal is influencing this sleep field" },
      { statement: "A previous occupant/owner left a spiritual imprint on this space" },
      { statement: "Technology in the room is being used as an access point" },
      { statement: "The bedroom needs to be spiritually cleansed and sealed" },
    ],
    command: `In the name of Yeshua HaMashiach —
I declare every spirit in this location — OUT.
Every frequency imprint in these walls, this floor, this air — cleared.
Every object carrying a dark assignment — neutralized NOW.

I plead the Dam HaBrit over every corner of this space.
Guardian Host — seal every gate in this location.
Krystal Star — seal the field of this room.

This space is declared holy ground. Dedicated to the True Father.
SAGAR on every spatial access point.`,
  },
  {
    num: 6,
    title: "Agreements / Inner Vows / Lying Spirit",
    category: "Agreements / Inner Vows / Lying Spirit / Passivity",
    hawkins: "20–75",
    housesNode: "H4: Envy/Silence",
    testItems: [
      { statement: "A Lying Spirit is active — distorting perception of sleep and rest" },
      { statement: "An inner vow is giving entities legal access ('I'll be invisible', 'sleep = exposure')" },
      { statement: "A spirit of Passivity is present — collapsing initiating authority during sleep" },
      { statement: "A childhood survival agreement is still active as a legal right" },
      { statement: "A vow of suffering or powerlessness from this or another lifetime is active" },
      { statement: "A vow of sacrifice, allegiance, or initiation from a past lifetime is active" },
      { statement: "A word curse spoken over sleep/rest by another person is still active" },
    ],
    command: `I repent for the agreement my [body/child-self/past-life self] made:
[describe the vow/agreement]

I honor the part of me that made that agreement — it was survival.
I now, standing in Christos authority, release that part from the agreement.

B'shem Yeshua HaMashiach — this vow is renounced.
This agreement is NULL AND VOID.

Spirit of [Passivity/Lying/name] — your legal ground is gone.
OUT. NOW. Tzeitzu.
SAGAR on this access point.`,
  },
  {
    num: 7,
    title: "Physical / Circadian / Pharmakia / Body",
    category: "Physical / Circadian / Pharmakia / Body",
    hawkins: "75–125",
    housesNode: "H5: Gluttony",
    testItems: [
      { statement: "A physical body system is being spiritually interfered with" },
      { statement: "The circadian rhythm has been spiritually disrupted" },
      { statement: "Pharmakia spirit is operating (substance interference with natural sleep)" },
      { statement: "The vagus nerve is carrying a spirit of suppression" },
      { statement: "The brainstem is blown out / carrying trauma frequency" },
      { statement: "The adrenal glands have a spiritual interference component" },
      { statement: "Kidneys are carrying ancestral fear (TCM: kidneys store generational Jing/fear)" },
    ],
    command: `In the name of Yeshua HaMashiach —
I speak directly to every cell in this body:
You were created to carry light, not burden.

Every memory of sleep as danger stored in this tissue — RELEASE NOW.
Every "sleep = death" code in the cellular memory — REWRITE.
Every trauma pattern held in the nervous system — RELEASE.

Vagus nerve — come to full regulation. Safety signal: ON.
Brainstem — come to full rest. Threat response: OFF.
Adrenals — rest. You are not in danger. REST.
Kidneys — restore your Jing. Release generational fear.
Endocrine system — rebalance. Circadian rhythm — restore to divine order.

L'chaim (לְחַיִּים). To life. To full life.`,
  },
];

export const ROOT_CAUSE_GATES = {
  origin: {
    title: "Gate 1 — Root Origin",
    items: [
      { statement: "The primary root is this lifetime — childhood/formative years", branch: "childhood" },
      { statement: "The primary root is a past-life/other-lifetime imprint", branch: "pastlife" },
      { statement: "The primary root is epigenetic — bloodline/ancestral code", branch: "epigenetic" },
      { statement: "Multiple roots are active simultaneously — layered attack", branch: "all" },
      { statement: "A spirit is suppressing root identification right now", branch: "suppression" },
    ],
  },
  childhood: {
    title: "Gate 2A — Childhood / This-Lifetime Trauma Root",
    ageWindows: ["Ages 0–3 (pre-verbal / womb)", "Ages 3–7 (early childhood)", "Ages 7–12 (latency/school)", "Ages 12–18 (adolescence)"],
    items: [
      "Abandonment / father absence — 'I was left. No one protected the night.'",
      "Unsafe sleep environment — Sleep was the place of threat or violation",
      "Witnessing parental conflict/violence at night",
      "Nighttime spiritual exposure — occult objects, practices in home",
      "Medical/physical threat during sleep",
      "Sexual violation or threat during sleep hours",
      "Severe emotional neglect — 'I cried in the night and no one came'",
      "Childhood sleep paralysis or nightmares never addressed",
      "Word curses spoken over sleep/rest",
      "Childhood survival vow ('I'll be invisible / small / still')",
    ],
  },
  pastlife: {
    title: "Gate 2B — Past-Life / Other-Lifetime Imprint Root",
    items: [
      "I was killed or attacked during sleep in another lifetime",
      "I witnessed someone be killed or violated during sleep and could not stop it",
      "In a past lifetime I was a healer attacked during sleep because of my gifts",
      "There is a past-life vow giving entities legal access during sleep",
      "There is an unresolved soul fragment anchored in a past-lifetime sleep-attack event",
      "The entity currently attacking during sleep is one encountered in a previous lifetime",
      "A murder or violent death in a past lifetime has left a sleep-terror body memory",
      "A shared traumatic timeline with another soul is affecting the sleep field",
    ],
    soulFragmentCommand: `In the name of Yeshua HaMashiach —
I call back every soul fragment that was scattered in the [describe] event/lifetime.
Every part that fled in terror during that sleep attack — I call you home.
Every part that shattered when [describe trauma] — I call you home.
Every fragment that has been held by entities as a bargaining chip — RELEASED NOW.

The Dam HaBrit purchases you back. You belong to no entity.
Every soul fragment — hear me. It is over. The threat is gone.
You are safe now. Come back into the wholeness of this Neshama.

I welcome you. I receive you. I honor what you survived.
Father of Fathers — receive these fragments. Integrate them fully.
Tikkun HaNefesh (תִּיקּוּן הַנֶּפֶשׁ) — complete restoration of the soul. Now.
Ruach HaKodesh — fill every space the fragments now return to.
Shalom. Complete. Nothing missing. Nothing broken.`,
  },
  epigenetic: {
    title: "Gate 2C — Epigenetic / Bloodline Root",
    items: [
      "An epigenetic cellular code is the primary root",
      "The cellular code 'sleep equals death/danger' is stored in the body's epigenetic memory",
      "This code is stored in: heart",
      "This code is stored in: solar plexus",
      "This code is stored in: sacral",
      "This code is stored in: root",
      "The code entered through mother's bloodline",
      "The code entered through father's bloodline",
      "The code entered through both bloodlines",
      "A specific ancestor's traumatic experience is the origin point",
      "A specific ancestor made a covenant that encoded this into the bloodline",
    ],
    command: `In the name of Yeshua HaMashiach —
I speak to every cell holding the epigenetic code [sleep = danger/death/exposure].
This frequency was never yours to carry. It traveled through the bloodline.
Today it ends with you.

I command this code to be released — heart cells, solar plexus, sacral, root — RELEASE.

I invite the Aurora families and the Ruach HaKodesh to run re-encryption
through every cellular location holding this code.

Replace the generational frequency with the organic frequency of Shalom —
safety in unconsciousness, protected rest, the sleep of the beloved.

Psalm 127:2 — "He grants sleep to those He loves."
THAT is the frequency this body now operates on.

SAGAR on every epigenetic open door.`,
  },
};
