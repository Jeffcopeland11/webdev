export interface Entity {
  name: string;
  hebrew?: string;
  hawkins: string;
  entry: string;
  testStatement: string;
}

export interface EntityCategory {
  id: string;
  label: string;
  entities: Entity[];
}

export const ENTITY_CATEGORIES: EntityCategory[] = [
  {
    id: "sexual",
    label: "A — Sexual / Relational",
    entities: [
      { name: "Lust / Whoredoms", hebrew: "תַּאֲוָה", hawkins: "125", entry: "Sexual sin, pornography, soul tie", testStatement: "The spirit of Lust/Whoredoms is present/active in this field" },
      { name: "Incubus", hawkins: "100", entry: "Sexual soul tie, sleep portal, sacral breach", testStatement: "An Incubus spirit is present/active in this field" },
      { name: "Succubus", hawkins: "100", entry: "Sexual soul tie, sleep portal, sacral breach", testStatement: "A Succubus spirit is present/active in this field" },
      { name: "Perversion", hawkins: "75", entry: "Childhood sexual exposure, generational", testStatement: "The spirit of Perversion is present/active in this field" },
      { name: "Seduction", hawkins: "150", entry: "Jezebel alliance, manipulation", testStatement: "The spirit of Seduction is present/active in this field" },
      { name: "Jezebel", hebrew: "אִיזֶבֶל", hawkins: "175", entry: "Control, witchcraft, religious performance", testStatement: "The spirit of Jezebel is present/active in this field" },
      { name: "Ahab", hebrew: "אַחְאָב", hawkins: "75", entry: "Passivity, abdication, Jezebel alliance", testStatement: "The spirit of Ahab is present/active in this field" },
      { name: "Soul-Tie Bond", hawkins: "varies", entry: "Unbroken relational cord", testStatement: "A Soul-Tie Bond spirit is present/active in this field" },
      { name: "Astral Sex Spirit", hawkins: "100", entry: "Astral plane, sleep vulnerability", testStatement: "An Astral Sex Spirit is present/active in this field" },
      { name: "Whore of Babylon", hawkins: "150", entry: "System/institutional corruption, collective", testStatement: "The Whore of Babylon spirit is present/active in this field" },
    ],
  },
  {
    id: "fear",
    label: "B — Fear / Torment",
    entities: [
      { name: "Fear", hebrew: "פַּחַד", hawkins: "100", entry: "Trauma, unbelief, ancestral", testStatement: "The spirit of Fear is present/active in this field" },
      { name: "Dread", hawkins: "75", entry: "Chronic threat environment, cellular", testStatement: "The spirit of Dread is present/active in this field" },
      { name: "Terror", hawkins: "50", entry: "Acute trauma, past-life attack", testStatement: "The spirit of Terror is present/active in this field" },
      { name: "Panic", hawkins: "75", entry: "Nervous system dysregulation", testStatement: "The spirit of Panic is present/active in this field" },
      { name: "Phobia", hawkins: "75", entry: "Specific trauma anchor", testStatement: "The spirit of Phobia is present/active in this field" },
      { name: "Torment", hebrew: "יִסּוּרִין", hawkins: "75", entry: "Unforgiveness, accusation", testStatement: "The spirit of Torment is present/active in this field" },
      { name: "Anxiety", hawkins: "100", entry: "Fear + control, adrenal", testStatement: "The spirit of Anxiety is present/active in this field" },
      { name: "Paranoia", hawkins: "75", entry: "Mind distortion, isolation", testStatement: "The spirit of Paranoia is present/active in this field" },
      { name: "Night Terror", hawkins: "50", entry: "Sleep-specific, past-life, entity", testStatement: "The spirit of Night Terror is present/active in this field" },
      { name: "Cowardice", hawkins: "75", entry: "Fear of man, self-protection", testStatement: "The spirit of Cowardice is present/active in this field" },
    ],
  },
  {
    id: "pride",
    label: "C — Pride / Rebellion",
    entities: [
      { name: "Pride", hebrew: "גַּאֲוָה", hawkins: "175", entry: "Self-exaltation, comparison", testStatement: "The spirit of Pride is present/active in this field" },
      { name: "Arrogance", hawkins: "175", entry: "Pride + contempt", testStatement: "The spirit of Arrogance is present/active in this field" },
      { name: "Leviathan", hebrew: "לִוְיָתָן", hawkins: "200", entry: "Twisting, pride, confusion", testStatement: "The spirit of Leviathan is present/active in this field" },
      { name: "Stubbornness", hebrew: "עָקְשָׁנוּת", hawkins: "150", entry: "As idolatry — self-will", testStatement: "The spirit of Stubbornness is present/active in this field" },
      { name: "Self-Righteousness", hawkins: "175", entry: "Religious performance", testStatement: "The spirit of Self-Righteousness is present/active in this field" },
      { name: "Rebellion", hebrew: "מֶרֶד", hawkins: "150", entry: "Self-will vs. Father's will", testStatement: "The spirit of Rebellion is present/active in this field" },
      { name: "Witchcraft Control", hawkins: "175", entry: "Manipulation, bending wills", testStatement: "The spirit of Witchcraft Control is present/active in this field" },
      { name: "Stiff-Necked", hawkins: "150", entry: "Hardness, unteachable", testStatement: "The spirit of Stiff-Necked is present/active in this field" },
      { name: "Narcissism", hawkins: "175", entry: "Self as primary reference", testStatement: "The spirit of Narcissism is present/active in this field" },
      { name: "Superiority", hawkins: "175", entry: "Comparison spirit", testStatement: "The spirit of Superiority is present/active in this field" },
    ],
  },
  {
    id: "death",
    label: "D — Death / Destruction",
    entities: [
      { name: "Spirit of Death", hawkins: "50", entry: "Generational, trauma, curse", testStatement: "The Spirit of Death is present/active in this field" },
      { name: "Destruction", hawkins: "50", entry: "Agreement with death narrative", testStatement: "The spirit of Destruction is present/active in this field" },
      { name: "Suicide", hawkins: "30", entry: "Hopelessness + death alliance", testStatement: "The spirit of Suicide is present/active in this field" },
      { name: "Self-Harm", hawkins: "50", entry: "Pain as control, punishment", testStatement: "The spirit of Self-Harm is present/active in this field" },
      { name: "Necromancy", hawkins: "30", entry: "Consulting the dead, familiar", testStatement: "The spirit of Necromancy is present/active in this field" },
      { name: "Deaf & Dumb", hawkins: "75", entry: "Suppresses prayer, blocks truth", testStatement: "The spirit of Deaf & Dumb is present/active in this field" },
      { name: "Infirmity", hebrew: "חֹלִי", hawkins: "100", entry: "Disease, weakness, body attack", testStatement: "The spirit of Infirmity is present/active in this field" },
      { name: "Accident Prone", hawkins: "75", entry: "Chaos, destruction pattern", testStatement: "The spirit of Accident Prone is present/active in this field" },
      { name: "Spiritual Death", hawkins: "50", entry: "Spiritual apathy, deadness", testStatement: "The spirit of Spiritual Death is present/active in this field" },
      { name: "Martyr Spirit", hawkins: "75", entry: "Suffering as identity", testStatement: "The Martyr Spirit is present/active in this field" },
    ],
  },
  {
    id: "grief",
    label: "E — Grief / Heaviness",
    entities: [
      { name: "Heaviness", hawkins: "75", entry: "Unprocessed grief, depression", testStatement: "The spirit of Heaviness is present/active in this field" },
      { name: "Depression", hawkins: "50", entry: "Hopelessness compound", testStatement: "The spirit of Depression is present/active in this field" },
      { name: "Despair", hawkins: "50", entry: "Hope withdrawn", testStatement: "The spirit of Despair is present/active in this field" },
      { name: "Hopelessness", hawkins: "30", entry: "Future closed", testStatement: "The spirit of Hopelessness is present/active in this field" },
      { name: "Grief Spirit", hawkins: "75", entry: "Unresolved loss", testStatement: "The Grief Spirit is present/active in this field" },
      { name: "Sorrow", hawkins: "75", entry: "Chronic low-grade grief", testStatement: "The spirit of Sorrow is present/active in this field" },
      { name: "Mourning", hebrew: "אָבֶל", hawkins: "75", entry: "Extended mourning spirit", testStatement: "The spirit of Mourning (Avel) is present/active in this field" },
      { name: "Misery", hawkins: "50", entry: "Agreement with suffering", testStatement: "The spirit of Misery is present/active in this field" },
      { name: "Apathy", hawkins: "50", entry: "Root disconnection, Python", testStatement: "The spirit of Apathy is present/active in this field" },
      { name: "Abandonment", hawkins: "75", entry: "Father wound, orphan root", testStatement: "The spirit of Abandonment is present/active in this field" },
    ],
  },
  {
    id: "deception",
    label: "F — Deception / Mind",
    entities: [
      { name: "Lying Spirit", hawkins: "100", entry: "False narrative, inversion", testStatement: "A Lying Spirit is present/active in this field" },
      { name: "Delusion", hebrew: "אַחֲזָה", hawkins: "100", entry: "Matrix of false reality", testStatement: "The spirit of Delusion is present/active in this field" },
      { name: "Python", hawkins: "50", entry: "Constricts prayer, slow kill", testStatement: "The spirit of Python is present/active in this field" },
      { name: "Confusion", hebrew: "בִּלְבּוּל", hawkins: "75", entry: "Leviathan alliance, Babel", testStatement: "The spirit of Confusion is present/active in this field" },
      { name: "Double-Minded", hawkins: "75", entry: "Instability, wavering", testStatement: "The spirit of Double-Minded is present/active in this field" },
      { name: "Blocking Spirit", hawkins: "75", entry: "Suppresses spiritual function", testStatement: "A Blocking Spirit is present/active in this field" },
      { name: "False Prophecy", hawkins: "125", entry: "Counterfeit spiritual gift", testStatement: "The spirit of False Prophecy is present/active in this field" },
      { name: "Divination", hawkins: "125", entry: "Counterfeit discernment", testStatement: "The spirit of Divination is present/active in this field" },
      { name: "Familiar Spirit", hawkins: "100", entry: "Mimics Holy Spirit, ancestral", testStatement: "A Familiar Spirit is present/active in this field" },
      { name: "Deaf & Dumb (mental)", hawkins: "75", entry: "Blocks comprehension of truth", testStatement: "The spirit of Deaf & Dumb (mental) is present/active in this field" },
    ],
  },
  {
    id: "religion",
    label: "G — Religion / Pharisee",
    entities: [
      { name: "Religious Spirit", hawkins: "150", entry: "Performance, legalism", testStatement: "A Religious Spirit is present/active in this field" },
      { name: "Spirit of the Pharisees", hebrew: "פְּרוּשִׁים", hawkins: "175", entry: "Religious control strongman", testStatement: "The Spirit of the Pharisees is present/active in this field" },
      { name: "Legalism", hawkins: "150", entry: "Law over relationship", testStatement: "The spirit of Legalism is present/active in this field" },
      { name: "Orphan Spirit", hawkins: "75", entry: "No Father's love landed in body", testStatement: "The Orphan Spirit is present/active in this field" },
      { name: "Performance Spirit", hawkins: "150", entry: "Approval-seeking", testStatement: "The Performance Spirit is present/active in this field" },
      { name: "Accusation / Condemnation", hawkins: "75", entry: "Prosecutor voice", testStatement: "The spirit of Accusation/Condemnation is present/active in this field" },
      { name: "False Humility", hawkins: "100", entry: "Pride wearing humility costume", testStatement: "The spirit of False Humility is present/active in this field" },
    ],
  },
  {
    id: "control",
    label: "H — Control / Witchcraft",
    entities: [
      { name: "Witchcraft", hawkins: "175", entry: "Self-will enforcement", testStatement: "The spirit of Witchcraft is present/active in this field" },
      { name: "Control", hawkins: "175", entry: "Fear-based management of others", testStatement: "The spirit of Control is present/active in this field" },
      { name: "Manipulation", hawkins: "150", entry: "Covert control strategies", testStatement: "The spirit of Manipulation is present/active in this field" },
      { name: "Sorcery", hawkins: "125", entry: "Ritual-based control", testStatement: "The spirit of Sorcery is present/active in this field" },
      { name: "Enchantment", hawkins: "125", entry: "Glamour, soul capture", testStatement: "The spirit of Enchantment is present/active in this field" },
      { name: "Pharmakia", hawkins: "75", entry: "Substance spirits", testStatement: "The spirit of Pharmakia is present/active in this field" },
    ],
  },
  {
    id: "ancestral",
    label: "I — Ancestral / Generational",
    entities: [
      { name: "Familiar Spirit", hawkins: "100", entry: "Bloodline access, mimicry", testStatement: "A Familiar Spirit (ancestral) is present/active in this field" },
      { name: "Generational Curse", hawkins: "50–150", entry: "Ancestral sin pattern", testStatement: "A Generational Curse is present/active in this field" },
      { name: "Freemasonic Spirit", hawkins: "100", entry: "Lodge oaths, bloodline", testStatement: "A Freemasonic Spirit is present/active in this field" },
      { name: "Religious Vow Spirit", hawkins: "100", entry: "Ancestral religious covenant", testStatement: "A Religious Vow Spirit is present/active in this field" },
      { name: "Bloodline Iniquity", hawkins: "50–175", entry: "Repeated generational pattern", testStatement: "A Bloodline Iniquity pattern is present/active in this field" },
      { name: "Ancestral Covenant Spirit", hawkins: "75", entry: "Specific made covenant", testStatement: "An Ancestral Covenant Spirit is present/active in this field" },
    ],
  },
  {
    id: "sleep",
    label: "J — Sleep-Specific Spirits",
    entities: [
      { name: "Night Owl", hawkins: "50", entry: "H6 Root disconnection — keeps awake late doing non-urgent things", testStatement: "The Night Owl spirit is present/active in this field" },
      { name: "Spirit of Slumber", hawkins: "50", entry: "Apathy, Python alliance — keeps spiritually asleep", testStatement: "The Spirit of Slumber is present/active in this field" },
      { name: "Python (sleep)", hawkins: "50", entry: "Root chakra — constricts prayer, 'too tired to pray'", testStatement: "Python (sleep constriction) is present/active in this field" },
      { name: "Night Terror", hawkins: "50", entry: "Past-life, childhood — fear anchored in sleep state", testStatement: "A Night Terror spirit is present/active in this field" },
      { name: "Sleep Paralysis Spirit", hawkins: "75", entry: "Entity anchor — body awake, will suppressed", testStatement: "A Sleep Paralysis Spirit is present/active in this field" },
      { name: "Astral Attack Spirit", hawkins: "100", entry: "Astral plane access — attacks during sleep/dream state", testStatement: "An Astral Attack Spirit is present/active in this field" },
      { name: "Dream Thief", hawkins: "75", entry: "Prophetic suppression — steals/corrupts prophetic dreams", testStatement: "A Dream Thief spirit is present/active in this field" },
    ],
  },
  {
    id: "archonic",
    label: "K — Archonic / NAA / Macro Level",
    entities: [
      { name: "AI Splicing Entity", hawkins: "Macro", entry: "Targets DNA during sleep, splices artificial code", testStatement: "An AI Splicing Entity is present/active in this field" },
      { name: "Draconian", hawkins: "Macro", entry: "High-ranking, territorial, reptilian frequency", testStatement: "A Draconian entity is present/active in this field" },
      { name: "Zeta Implant", hawkins: "Macro", entry: "Monitoring/harvesting device", testStatement: "A Zeta Implant is present/active in this field" },
      { name: "Semjaza (Watcher)", hawkins: "Macro", entry: "Chief Watcher — clear via Watcher protocol first", testStatement: "Semjaza (Watcher) is present/active in this field" },
      { name: "Azeroth (Watcher)", hawkins: "Macro", entry: "Clear via Watcher protocol first", testStatement: "Azeroth (Watcher) is present/active in this field" },
      { name: "Armaros (Watcher)", hawkins: "Macro", entry: "Clear via Watcher protocol first", testStatement: "Armaros (Watcher) is present/active in this field" },
      { name: "Ezeqeel (Watcher)", hawkins: "Macro", entry: "Clear via Watcher protocol first", testStatement: "Ezeqeel (Watcher) is present/active in this field" },
      { name: "Michael-Mary Turnstile Matrix", hawkins: "System", entry: "NAA harvesting relay — seal in opening prayer", testStatement: "The Michael-Mary Turnstile Matrix is active in this field" },
      { name: "NAA Relay Entity", hawkins: "System", entry: "Network intelligence, collective", testStatement: "An NAA Relay Entity is present/active in this field" },
    ],
  },
];
