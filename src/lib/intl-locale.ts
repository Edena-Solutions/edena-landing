export const INTL_LOCALE_BY_LANG: Record<string, string> = {
    es: "es-ES",
    ca: "ca-ES",
    eus: "eu-ES",
    fr: "fr-FR",
    en: "en-GB",
};

export function intlLocaleForLang(lang: string): string {
    return INTL_LOCALE_BY_LANG[lang] ?? "en-GB";
}

const BASQUE_MONTHS_GENITIVE = [
    "urtarrilaren",
    "otsailaren",
    "martxoaren",
    "apirilaren",
    "maiatzaren",
    "ekainaren",
    "uztailaren",
    "abuztuaren",
    "irailaren",
    "urriaren",
    "azaroaren",
    "abenduaren",
];

const BASQUE_MONTHS = [
    "urtarrila",
    "otsaila",
    "martxoa",
    "apirila",
    "maiatza",
    "ekaina",
    "uztaila",
    "abuztua",
    "iraila",
    "urria",
    "azaroa",
    "abendua",
];

/** A Basque year's ending: -eko after a final bat (1), bost (5) or hamar (10, 30, 50…), -ko otherwise. */
const basqueYearSuffix = (year: number) => ([1, 5].includes(year % 10) || year % 20 === 10 ? "eko" : "ko");

/**
 * Long date ("1 de septiembre de 2026") for an ISO date. ICU cannot inflect Basque and prints
 * "2026(e)ko irailaren 1(a)", so Basque is written out by hand.
 */
export function formatLongDate(lang: string, isoDate: string): string {
    const date = new Date(isoDate);
    if (lang === "eus") {
        const year = date.getUTCFullYear();
        return `${year}${basqueYearSuffix(year)} ${BASQUE_MONTHS_GENITIVE[date.getUTCMonth()]} ${date.getUTCDate()}a`;
    }
    return new Intl.DateTimeFormat(intlLocaleForLang(lang), {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(date);
}

/**
 * `Intl.DateTimeFormat` for a scene's date, Basque included. ICU leaves Basque endings open
 * ("2026(e)ko", "10(a)") and, beside a weekday, names the month in the nominative
 * ("ekaina 10(a), asteazkena"); here the endings are filled in and a month before its day takes
 * the genitive ("ekainaren 10a, asteazkena").
 */
export function formatDate(locale: string, date: Date, options: Intl.DateTimeFormatOptions): string {
    const text = new Intl.DateTimeFormat(locale, options).format(date);
    if (!locale.startsWith("eu")) return text;
    return text
        .replace(/(\d+)\(e\)ko/g, (_, year: string) => `${year}${basqueYearSuffix(Number(year))}`)
        .replace(/(\d+)\(a\)/g, "$1a")
        .replace(new RegExp(`\\b(${BASQUE_MONTHS.join("|")}) (?=\\d)`, "g"), (_, month: string) => `${BASQUE_MONTHS_GENITIVE[BASQUE_MONTHS.indexOf(month)]} `);
}
