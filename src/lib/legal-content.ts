import { withTrailingSlash } from "@/i18n/utils";

/** Detects numbered section headings in legal policy content (e.g. "1. TITLE", "4.1 Subsection"). */
export function isLegalSectionTitle(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;

    if (/^\d+\.\d+\s+/.test(trimmed)) {
        return trimmed.length <= 100;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
        return true;
    }

    return false;
}

/*
 * The legal documents are kept in the dictionaries as one string each: lines joined by `<br>`, a
 * blank line between paragraphs, "1. TITLE" for a section, "3.1 Title" for a subsection, "- " for a
 * list item and "Label: value" for the facts about the company. `parseLegal` turns that into a
 * document a page can lay out — sections to index, lists, fact sheets — without changing a word.
 */

export type LegalBlock =
    | { kind: "p"; text: string }
    | { kind: "h3"; text: string }
    | { kind: "ul"; items: string[] }
    | { kind: "dl"; rows: { label: string; value: string }[] };

export interface LegalSection {
    id: string;
    number: string;
    title: string;
    blocks: LegalBlock[];
}

export interface LegalDocument {
    /** "Última actualización: …", when the text opens with it. */
    updated?: string;
    intro: LegalBlock[];
    sections: LegalSection[];
}

/** Words that stay as they are when a heading leaves upper case. */
const KEEP = new Set(["RGPD", "GDPR", "LOPDGDD", "LSSI", "DPD", "DPO", "SEPA", "AEAT", "IA", "AI", "UE", "EU", "VERI*FACTU", "VERIFACTU", "API", "CIF", "NIF"]);

/**
 * "4. USUARIOS Y DATOS TRATADOS" → "Usuarios y datos tratados". Headings are stored in capitals;
 * read at title size they shout, so they are set in sentence case — acronyms, the brand and
 * anything in brackets (a domain, an abbreviation) kept as written.
 */
export function sentenceCase(title: string, lang: string): string {
    // Only headings stored in capitals: brackets may hold a lower-case domain, so they do not count.
    const outside = title.replace(/\([^)]*\)/g, "");
    if (outside !== outside.toLocaleUpperCase(lang)) return title;
    const cased = title
        .split(/(\([^)]*\))/)
        .map((part) =>
            part.startsWith("(")
                ? part
                : part.replace(/[\p{L}*]+/gu, (word) => {
                      if (KEEP.has(word)) return word;
                      if (word === "EDENA") return "Edena";
                      return word.toLocaleLowerCase(lang);
                  }),
        )
        .join("");
    const withPronoun = lang === "en" ? cased.replace(/\bi\b/g, "I") : cased;
    return withPronoun.replace(/\p{L}/u, (first) => first.toLocaleUpperCase(lang));
}

const TOP = /^(\d+)\.\s+(.+)$/;
const SUB = /^\d+\.\d+\s+/;
const BULLET = /^[-•]\s+/;
const FACT = /^([^:]{2,40}):\s+(.+)$/;

export function parseLegal(content: string, lang: string): LegalDocument {
    const doc: LegalDocument = { intro: [], sections: [] };
    let target = doc.intro;
    let group: string[] = [];

    const flush = () => {
        if (!group.length) return;
        if (group.every((line) => BULLET.test(line))) {
            target.push({ kind: "ul", items: group.map((line) => line.replace(BULLET, "")) });
        } else if (group.length >= 2 && group.every((line) => FACT.test(line) && !line.endsWith(":"))) {
            target.push({
                kind: "dl",
                rows: group.map((line) => {
                    const [, label, value] = line.match(FACT)!;
                    return { label, value };
                }),
            });
        } else {
            // A paragraph that introduces a list ("…:") keeps its items together under it.
            let items: string[] = [];
            const close = () => {
                if (items.length) target.push({ kind: "ul", items });
                items = [];
            };
            for (const line of group) {
                if (BULLET.test(line)) {
                    items.push(line.replace(BULLET, ""));
                } else {
                    close();
                    target.push({ kind: "p", text: line });
                }
            }
            close();
        }
        group = [];
    };

    const lines = content.split("<br>").map((line) => line.trim());
    lines.forEach((line, index) => {
        if (!line) return flush();
        const top = line.match(TOP);
        if (top && !SUB.test(line)) {
            flush();
            const section: LegalSection = { id: `section-${top[1]}`, number: top[1], title: sentenceCase(top[2], lang), blocks: [] };
            doc.sections.push(section);
            target = section.blocks;
            return;
        }
        if (SUB.test(line) && line.length <= 100) {
            flush();
            target.push({ kind: "h3", text: line });
            return;
        }
        // The opening date line, before anything else.
        if (!doc.updated && !doc.sections.length && !doc.intro.length && !group.length && index < 2 && line.length < 80 && /\d/.test(line) && line.includes(":")) {
            doc.updated = line;
            return;
        }
        group.push(line);
    });
    flush();
    return doc;
}

/**
 * The site's own addresses, as the legal texts write them ("www.edena.es/pricing"), linked at their
 * canonical URL: no www and a trailing slash, so the link costs no redirects.
 */
function siteHref(url: string): string {
    const u = new URL(url);
    if (u.hostname !== "www.edena.es" && u.hostname !== "edena.es") return url;
    u.hostname = "edena.es";
    if (u.pathname.startsWith("/es/")) u.pathname = u.pathname.slice(3);
    u.pathname = withTrailingSlash(u.pathname);
    return u.toString();
}

/** Splits text into plain runs and links: emails, and web addresses. */
export function linkify(text: string): { text: string; href?: string }[] {
    const parts: { text: string; href?: string }[] = [];
    const pattern = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|((?:https?:\/\/|www\.)[^\s)]+)/g;
    let last = 0;
    for (const match of text.matchAll(pattern)) {
        let found = match[0];
        // Trailing punctuation belongs to the sentence, not the address.
        const trail = found.match(/[.,;:]+$/)?.[0] ?? "";
        found = found.slice(0, found.length - trail.length);
        const start = match.index ?? 0;
        if (start > last) parts.push({ text: text.slice(last, start) });
        const href = match[1] ? `mailto:${found}` : siteHref(found.startsWith("http") ? found : `https://${found}`);
        parts.push({ text: found, href });
        last = start + found.length;
    }
    if (last < text.length) parts.push({ text: text.slice(last) });
    return parts;
}
