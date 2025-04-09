export const languages = ["en", "es"];
export const defaultLanguage = "es";

export function getLanguageFromURL(pathname: string): string {
    const langCodeMatch = pathname.match(/\/([a-z]{2})\//);
    return langCodeMatch ? langCodeMatch[1] : defaultLanguage;
}

export function useTranslatedPath(lang: string) {
    return function translatePath(path: string, l: string = lang) {
        return `/${l}${path}`;
    };
}
