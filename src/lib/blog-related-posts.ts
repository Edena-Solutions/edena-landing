import { localePath } from "@/i18n/utils";

/** Headings used for the related-articles block in blog markdown bodies */
const RELATED_HEADING =
    /Artículos relacionados|Related articles|Articles connexes|Artículos relacionats/i;

const RELATED_SECTION =
    /<strong>(?:Artículos relacionados|Related articles|Articles connexes|Artículos relacionats)<\/strong>[\s\S]*?(?=\n\n<strong>(?:Conclusión|Conclusion|Conclusió)|$)/i;

const LINK_IN_SECTION = /<a href="[^"]*\/blog\/([^"]+)">[^<]*<\/a>/gi;

export function parseRelatedSlugsFromSection(section: string): string[] {
    const slugs: string[] = [];
    let m: RegExpExecArray | null;
    const re = new RegExp(LINK_IN_SECTION.source, "gi");
    while ((m = re.exec(section)) !== null) {
        if (!slugs.includes(m[1])) slugs.push(m[1]);
    }
    return slugs;
}

export function extractRelatedSection(body: string): {
    before: string;
    after: string;
    slugs: string[];
} {
    const match = body.match(RELATED_SECTION);
    if (!match) {
        return { before: body, after: "", slugs: [] };
    }

    const idx = body.indexOf(match[0]);
    const slugs = parseRelatedSlugsFromSection(match[0]);
    return {
        before: body.slice(0, idx).trimEnd(),
        after: body.slice(idx + match[0].length).trimStart(),
        slugs,
    };
}

export function relatedSlugsForPost(
    frontmatterSlugs: string[] | undefined,
    body: string,
): string[] {
    if (frontmatterSlugs?.length) return frontmatterSlugs;
    return extractRelatedSection(body).slugs;
}

const CONCLUSION_HEADING =
    /<strong>(?:Conclusión|Conclusion|Conclusió)<\/strong>/i;

/** Split body so related-articles block can sit before the conclusion section */
export function splitBeforeConclusion(body: string): {
    before: string;
    conclusion: string;
} {
    const match = body.match(CONCLUSION_HEADING);
    if (!match || match.index === undefined) {
        return { before: body, conclusion: "" };
    }
    return {
        before: body.slice(0, match.index).trimEnd(),
        conclusion: body.slice(match.index).trimStart(),
    };
}

export type RelatedPostLink = {
    href: string;
    title: string;
};

export function resolveRelatedPosts(
    slugs: string[],
    lang: string,
    titleBySlug: Map<string, string>,
): RelatedPostLink[] {
    return slugs
        .map((slug) => {
            const title = titleBySlug.get(slug);
            if (!title) return null;
            return {
                href: localePath(lang, `/blog/${slug}`),
                title,
            };
        })
        .filter((p): p is RelatedPostLink => p !== null);
}
