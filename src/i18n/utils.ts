export const languages = ["es", "en", "ca", "eus", "fr"];
export const defaultLanguage = "es";

const knownLocalePrefixes = new Set(["eus", "es", "en", "ca", "fr"]);

export function getLanguageFromURL(pathname: string): string {
    const segment = pathname.split("/").filter(Boolean)[0];
    if (segment && knownLocalePrefixes.has(segment)) {
        return segment;
    }
    return defaultLanguage;
}

/** Book demo (Calendly) lives under [...lang]/demo for every locale. */
export function localizedDemoPath(lang: string): string {
    return `/${lang}/demo`;
}

export function useTranslatedPath(lang: string) {
    return function translatePath(path: string, l: string = lang) {
        return `/${l}${path}`;
    };
}
