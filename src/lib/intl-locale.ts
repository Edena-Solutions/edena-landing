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

/**
 * Long date ("1 de septiembre de 2026") for an ISO date. ICU cannot inflect Basque and prints
 * "2026(e)ko irailaren 1(a)", so Basque is written out by hand: the year takes -eko after a final
 * bat (1), bost (5) or hamar (10, 30, 50…), and -ko otherwise.
 */
export function formatLongDate(lang: string, isoDate: string): string {
    const date = new Date(isoDate);
    if (lang === "eus") {
        const year = date.getUTCFullYear();
        const yearSuffix = [1, 5].includes(year % 10) || year % 20 === 10 ? "eko" : "ko";
        return `${year}${yearSuffix} ${BASQUE_MONTHS_GENITIVE[date.getUTCMonth()]} ${date.getUTCDate()}a`;
    }
    return new Intl.DateTimeFormat(intlLocaleForLang(lang), {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(date);
}
