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
