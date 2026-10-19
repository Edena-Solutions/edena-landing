import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Real <lastmod> dates for the sitemap. Every page but a blog post (which keeps its front-matter
 * date) is fingerprinted by its text: title, description and what <main> says. The fingerprints
 * of the live site are published at /sitemap-lastmod.json; a page whose fingerprint is unchanged
 * keeps the date it had there, and only a page whose text changed is dated today. A build that
 * cannot reach the live site dates every page today, as before.
 */

const SITE = "https://edena.es";
const MANIFEST = "sitemap-lastmod.json";

/** A post is `/blog/<slug>/` under any locale prefix; the blog index is not a post. */
const isBlogPost = (pathname) => /\/blog\/[^/]+\/$/.test(pathname);

function pageText(html) {
    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html;
    const text = main
        .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return `${title}\n${description}\n${text}`;
}

async function liveFingerprints(logger) {
    try {
        const res = await fetch(`${SITE}/${MANIFEST}`, { signal: AbortSignal.timeout(10_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()).pages ?? {};
    } catch (error) {
        logger.warn(`No fingerprints from the live site (${error}); changed pages are dated today.`);
        return {};
    }
}

/** @returns {import("astro").AstroIntegration} */
export default function sitemapLastmod() {
    return {
        name: "edena:sitemap-lastmod",
        hooks: {
            "astro:build:done": async ({ dir, logger }) => {
                const out = fileURLToPath(dir);
                const sitemapPath = path.join(out, "sitemap.xml");
                const today = new Date().toISOString().slice(0, 10);
                const live = await liveFingerprints(logger);

                let xml = await readFile(sitemapPath, "utf8");
                const pages = {};
                const dated = new Map();
                let changed = 0;

                for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
                    const pathname = new URL(loc.replace(/&amp;/g, "&")).pathname;
                    if (isBlogPost(pathname)) continue;
                    const file = path.join(out, decodeURIComponent(pathname), "index.html");
                    const html = await readFile(file, "utf8").catch(() => null);
                    if (html === null) continue;
                    const hash = createHash("sha256").update(pageText(html)).digest("hex").slice(0, 16);
                    const before = live[pathname];
                    const lastmod = before?.hash === hash ? before.lastmod : today;
                    if (lastmod === today) changed++;
                    pages[pathname] = { hash, lastmod };
                    dated.set(loc, lastmod);
                }

                xml = xml.replace(
                    /(<loc>([^<]+)<\/loc>\s*<lastmod>)[^<]*(<\/lastmod>)/g,
                    (match, open, loc, close) => (dated.has(loc) ? `${open}${dated.get(loc)}${close}` : match),
                );
                await writeFile(sitemapPath, xml);
                await writeFile(path.join(out, MANIFEST), JSON.stringify({ version: 1, pages }));
                logger.info(`${dated.size} pages fingerprinted, ${changed} dated ${today}.`);
            },
        },
    };
}
