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

/** Book demo (Calendly) lives at /demo (es) and /[lang]/demo for the rest. */
export function localizedDemoPath(lang: string): string {
    return lang === defaultLanguage ? "/demo" : `/${lang}/demo`;
}

/**
 * Canonical path for a locale: Spanish (default) lives unprefixed at the root,
 * every other locale under its /[lang]/ prefix.
 */
export function localePath(lang: string, path: string): string {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return lang === defaultLanguage ? normalized : `/${lang}${normalized}`;
}

export function useTranslatedPath(lang: string) {
    return function translatePath(path: string, l: string = lang) {
        return localePath(l, path);
    };
}

/**
 * getStaticPaths for [...lang] pages: one route per locale plus the
 * unprefixed root route for the default language (Spanish), which is the
 * canonical URL declared in <link rel="canonical">, hreflang and the sitemap.
 */
export function localeStaticPaths() {
    return [
        { params: { lang: undefined }, props: { lang: defaultLanguage } },
        ...languages.map((lang) => ({
            params: { lang },
            props: { lang },
        })),
    ];
}
