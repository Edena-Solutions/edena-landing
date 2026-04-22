export type BlogContentCollection = "blogEs" | "blogEn" | "blogCa" | "blogEus" | "blogFr";

const BLOG_COLLECTION_BY_LANG: Record<string, BlogContentCollection> = {
    es: "blogEs",
    en: "blogEn",
    fr: "blogFr",
    ca: "blogCa",
    eus: "blogEus",
};

export function blogCollectionForLang(lang: string): BlogContentCollection {
    return BLOG_COLLECTION_BY_LANG[lang] ?? "blogEs";
}
