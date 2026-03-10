export interface HebrewEntry {
  hebrew: string;
  transliteration: string;
  pronunciation: string;
  meaning: string;
}

export const HEBREW_GUIDE: HebrewEntry[] = [
  { hebrew: "תְּשׁוּבָה", transliteration: "Teshuva", pronunciation: "Teh-SHOO-vah", meaning: "Return / Repentance" },
  { hebrew: "סְלִיחָה", transliteration: "Selichah", pronunciation: "Seh-lee-CHAH", meaning: "Forgiveness" },
  { hebrew: "גְּאוּלָה", transliteration: "Geulah", pronunciation: "Geh-oo-LAH", meaning: "Redemption" },
  { hebrew: "נֶפֶשׁ", transliteration: "Nefesh", pronunciation: "NEH-fesh", meaning: "Soul life-breath" },
  { hebrew: "נְשָׁמָה", transliteration: "Neshama", pronunciation: "Neh-SHAH-mah", meaning: "Divine soul" },
  { hebrew: "חֶסֶד", transliteration: "Chesed", pronunciation: "CHEH-sed", meaning: "Loving-kindness" },
  { hebrew: "שָׁלוֹם", transliteration: "Shalom", pronunciation: "Shah-LOHM", meaning: "Peace / Wholeness" },
  { hebrew: "צְדָקָה", transliteration: "Tzedakah", pronunciation: "Tzeh-dah-KAH", meaning: "Righteousness" },
  { hebrew: "אֱמֶת", transliteration: "Emet", pronunciation: "EH-met", meaning: "Truth" },
  { hebrew: "אֱמוּנָה", transliteration: "Emunah", pronunciation: "Eh-moo-NAH", meaning: "Faith / Faithfulness" },
  { hebrew: "תִּיקּוּן", transliteration: "Tikkun", pronunciation: "Tee-KOON", meaning: "Restoration / Repair" },
  { hebrew: "גְּבוּרָה", transliteration: "Gevurah", pronunciation: "Geh-voo-RAH", meaning: "Holy might / Power" },
  { hebrew: "אַהֲבָה", transliteration: "Ahavah", pronunciation: "Ah-hah-VAH", meaning: "Love" },
  { hebrew: "קָדוֹשׁ", transliteration: "Kadosh", pronunciation: "Kah-DOHSH", meaning: "Holy" },
  { hebrew: "דָּבָר", transliteration: "Davar", pronunciation: "Dah-VAR", meaning: "Word / Divine Word" },
  { hebrew: "רוּחַ", transliteration: "Ruach", pronunciation: "ROO-akh", meaning: "Spirit / Wind / Breath" },
  { hebrew: "חֶרֶב הָרוּחַ", transliteration: "Cherev HaRuach", pronunciation: "CHEH-rev ha-ROO-akh", meaning: "Sword of the Spirit" },
  { hebrew: "דַּם הַבְּרִית", transliteration: "Dam HaBrit", pronunciation: "Dahm ha-BREET", meaning: "Blood of the Covenant" },
  { hebrew: "צְאוּ", transliteration: "Tzeitzu", pronunciation: "Tze-OO", meaning: "Go out / Depart" },
  { hebrew: "לְחַיִּים", transliteration: "L'chaim", pronunciation: "Leh-KHAH-yim", meaning: "To life" },
  { hebrew: "אֵין סוֹף", transliteration: "Ein Sof", pronunciation: "Ain SOHF", meaning: "No end / Infinite Source" },
  { hebrew: "מִשְׁפָּט", transliteration: "Mishpat", pronunciation: "Meesh-PAHT", meaning: "Justice / Divine order" },
  { hebrew: "רַחֲמִים", transliteration: "Rachamim", pronunciation: "Rah-CHAH-meem", meaning: "Mercy / Compassion" },
  { hebrew: "בֶּטַח", transliteration: "Betach", pronunciation: "BEH-takh", meaning: "Safety / Secure trust" },
  { hebrew: "שִׂמְחָה", transliteration: "Simcha", pronunciation: "Sim-CHAH", meaning: "Joy" },
  { hebrew: "עֲנָוָה", transliteration: "Anavah", pronunciation: "Ah-nah-VAH", meaning: "Humility" },
  { hebrew: "דְּבֵקוּת", transliteration: "Deveikut", pronunciation: "Deh-vay-KOOT", meaning: "Cleaving to Source" },
];

export const HOUSES_FRAMEWORK = [
  { house: "H1", ego: "Addiction/Lust", antidote: "Agape Love", chakra: "Sacral (2nd)", hawkinsLow: 175, hawkinsHigh: 540, sleepSig: "Incubus/succubus; sacral portal; compulsive late-night patterns", spirits: "Lust, Incubus, Succubus" },
  { house: "H2", ego: "Wrath/Rage", antidote: "Forgiveness", chakra: "Solar Plexus (3rd)", hawkinsLow: 150, hawkinsHigh: 600, sleepSig: "Hypervigilant nervous system; cortisol elevation; fight state", spirits: "Anger, Retaliation, Revenge" },
  { house: "H3", ego: "Greed/Avarice", antidote: "Generosity", chakra: "Heart (4th)", hawkinsLow: 125, hawkinsHigh: 570, sleepSig: "Heart chakra closure; fear of losing control in sleep", spirits: "Fear, Control" },
  { house: "H4", ego: "Envy/Jealousy", antidote: "Celebration", chakra: "Throat (5th)", hawkinsLow: 75, hawkinsHigh: 550, sleepSig: "Throat suppression; Night Owl during others' silence", spirits: "Lying Spirit, Witchcraft" },
  { house: "H5", ego: "Gluttony/Waste", antidote: "Discernment", chakra: "Third Eye (6th)", hawkinsLow: 125, hawkinsHigh: 600, sleepSig: "Third eye block; overstimulation; can't perceive what's needed", spirits: "Pharmakia, Confusion" },
  { house: "H6", ego: "Laziness/Discouragement", antidote: "Vohu Manah (Purpose)", chakra: "Root (1st)", hawkinsLow: 50, hawkinsHigh: 500, sleepSig: "PRIMARY SLEEP HOUSE — Slumber/Python/Apathy — root disconnection", spirits: "Night Owl, Slumber, Python", primary: true },
  { house: "H7", ego: "Pride/Self-Importance", antidote: "Surrender", chakra: "Crown (7th)", hawkinsLow: 175, hawkinsHigh: 700, sleepSig: "Hyperactive mind at night; control programs preventing surrender", spirits: "Pride, Leviathan" },
];

export const SAGAR_EXPLANATION = `SAGAR = Seal + Close + Guard + Protect every door

Usage: SAGAR is spoken as a sealing command after each major clearing. It closes the door permanently — not just casting the spirit out, but SEALING the entry point behind them.

SAGAR on every [named access point / door / thread / cord / covenant].
Repeat three times for major doors:
SAGAR. SAGAR. SAGAR.`;

export const SLEEP_BATTLEFIELD = `Sleep is the single most exploited vulnerability in spiritual warfare because:

1. The conscious will is offline — cannot command removal of spirits
2. The emotional body is unguarded — processes unresolved trauma as open invitations
3. The Manifestor field (operates through initiation and active authority) collapses into passivity during sleep
4. Dimensional boundaries thin during delta and theta brainwave states
5. Trauma held cellularly activates without waking-state suppression
6. Prophetic gifts, clairvoyance, and claircognizance are most active — making the sleep state a primary harvest target for entities seeking to suppress or steal these capacities

The practitioner who cannot sleep safely cannot function at full capacity.
The healer who does not protect the sleep field is working at partial power.`;
