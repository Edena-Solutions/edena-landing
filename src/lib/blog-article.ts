import { renderBlogBodyHtml } from "@/lib/render-blog-markdown";

/*
 * What the blog's pages need from a post beyond its frontmatter: how long it takes to read, its cover
 * at the size a card shows it, and its body as HTML whose section headings carry ids for the index.
 */

/** The post's last substantial revision: its `updated` date, when later than the publication. */
export function revisedOn(data: { date: string; updated?: string }): string | undefined {
    return data.updated && data.updated > data.date ? data.updated : undefined;
}

/** Minutes to read the body, at an unhurried 220 words a minute. */
export function readingMinutes(body: string): number {
    const words = body
        .replace(/<[^>]+>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
}

/** The cover at a width: Unsplash serves any size, so a card does not download the full photo. */
export function coverAt(url: string, width: number): string {
    try {
        const u = new URL(url);
        if (!u.hostname.endsWith("unsplash.com")) return url;
        u.searchParams.set("w", String(width));
        u.searchParams.set("q", "75");
        u.searchParams.set("auto", "format");
        u.searchParams.set("fit", "crop");
        return u.toString();
    } catch {
        return url;
    }
}

/** The cover as a 1200×630 social card, cropped by Unsplash; other covers are left as they are. */
export function coverOg(url: string): string | undefined {
    try {
        const u = new URL(coverAt(url, 1200));
        if (!u.hostname.endsWith("unsplash.com")) return undefined;
        u.searchParams.set("h", "630");
        return u.toString();
    } catch {
        return undefined;
    }
}

export function coverSrcset(url: string, widths: number[]): string | undefined {
    if (!url.includes("unsplash.com")) return undefined;
    return widths.map((width) => `${coverAt(url, width)} ${width}w`).join(", ");
}

export interface ArticleHeading {
    id: string;
    text: string;
}

const HEADING = /<h2 class="blog-section-heading">([^<]*)<\/h2>/g;

function slug(text: string): string {
    return text
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/&[a-z]+;/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 64);
}

const same = (a: string, b: string) => slug(a) === slug(b);

/**
 * A part of the body as HTML, each section heading given an id (unique across the parts, through
 * `seen`) and listed in `headings`. A body that opens by repeating the post's title drops that line:
 * the page's title already says it.
 */
export function renderArticlePart(
    markdown: string,
    options: { title: string; seen: Set<string>; headings: ArticleHeading[] },
): string {
    let html = renderBlogBodyHtml(markdown);
    const opening = html.match(/^<h2 class="blog-section-heading">([^<]*)<\/h2>\s*/);
    if (opening && same(opening[1], options.title)) html = html.slice(opening[0].length);
    return html.replace(HEADING, (_, text: string) => {
        const base = slug(text) || "section";
        let id = base;
        for (let n = 2; options.seen.has(id); n++) id = `${base}-${n}`;
        options.seen.add(id);
        options.headings.push({ id, text });
        return `<h2 class="blog-section-heading" id="${id}">${text}</h2>`;
    });
}
