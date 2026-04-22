/** First breadcrumb label pointing at the localized site root (JSON-LD / nav) */
const HOME_NAME_BY_LANG: Record<string, string> = {
    es: "Inicio",
    ca: "Inici",
    eus: "Hasiera",
    fr: "Accueil",
    en: "Home",
};

export function homeBreadcrumbName(lang: string): string {
    return HOME_NAME_BY_LANG[lang] ?? HOME_NAME_BY_LANG.en;
}
