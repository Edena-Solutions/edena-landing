import { getCollection } from "astro:content";
import type { BlogContentCollection } from "@/lib/blog-collection";

export interface BlogAlternate {
    hreflang: string;
    href: string;
}

const SITE = "https://edena.es";

/** Locale prefix in the URL, and the hreflang code it maps to. */
const LOCALES: Array<{
    lang: string;
    collection: BlogContentCollection;
    prefix: string;
    hreflang: string;
}> = [
    { lang: "es", collection: "blogEs", prefix: "", hreflang: "es" },
    { lang: "en", collection: "blogEn", prefix: "en/", hreflang: "en" },
    { lang: "ca", collection: "blogCa", prefix: "ca/", hreflang: "ca" },
    { lang: "eus", collection: "blogEus", prefix: "eus/", hreflang: "eu" },
    { lang: "fr", collection: "blogFr", prefix: "fr/", hreflang: "fr" },
];

export type BlogTranslationIndex = Map<string, Map<string, string>>;

let cached: BlogTranslationIndex | null = null;

/**
 * translationKey -> (lang -> slug), built once per build from the frontmatter
 * of all five blog collections. Posts without a translationKey are skipped:
 * they simply get no alternates rather than a wrong one.
 */
export async function buildBlogTranslationIndex(): Promise<BlogTranslationIndex> {
    if (cached) return cached;

    const index: BlogTranslationIndex = new Map();

    for (const locale of LOCALES) {
        const posts = await getCollection(locale.collection);
        for (const post of posts) {
            const key = post.data.translationKey;
            if (!key) continue;
            let byLang = index.get(key);
            if (!byLang) {
                byLang = new Map();
                index.set(key, byLang);
            }
            byLang.set(locale.lang, post.slug);
        }
    }

    cached = index;
    return index;
}

function alternatesFromGroup(byLang: Map<string, string>): BlogAlternate[] {
    const alternates: BlogAlternate[] = [];

    for (const locale of LOCALES) {
        const slug = byLang.get(locale.lang);
        if (!slug) continue;
        alternates.push({
            hreflang: locale.hreflang,
            href: `${SITE}/${locale.prefix}blog/${slug}/`,
        });
    }

    // Spanish is the unprefixed root, so it is also x-default when present.
    const esSlug = byLang.get("es");
    if (esSlug) {
        alternates.unshift({
            hreflang: "x-default",
            href: `${SITE}/blog/${esSlug}/`,
        });
    }

    return alternates;
}

/**
 * Cross-language alternates for one post. Returns an empty array when the post
 * has no translationKey or is the only version of its group, so callers can
 * fall back to emitting nothing.
 */
export async function blogAlternatesFor(
    lang: string,
    slug: string
): Promise<BlogAlternate[]> {
    const index = await buildBlogTranslationIndex();

    for (const byLang of index.values()) {
        if (byLang.get(lang) === slug) {
            return byLang.size > 1 ? alternatesFromGroup(byLang) : [];
        }
    }

    return [];
}

/** Same shape, keyed by translationKey — for the sitemap, which iterates groups. */
export function alternatesForKey(index: BlogTranslationIndex, key: string): BlogAlternate[] {
    const byLang = index.get(key);
    if (!byLang || byLang.size <= 1) return [];
    return alternatesFromGroup(byLang);
}
