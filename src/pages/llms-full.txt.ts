import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";
import { translations } from "@/i18n/index.ts";
import { revisedOn } from "@/lib/blog-article";
import { pricingMarkdown } from "@/lib/pricing-markdown";
import summary from "../../public/llms.txt?raw";

/*
 * /llms-full.txt: what an AI agent needs about Edena in one request. It opens with /llms.txt as
 * written, which stays the single hand-kept summary, then adds in full what that file only links
 * to: the prices, the FAQ page's answers and the index of the blog's articles. The comparisons stay
 * a link: every competitor cell there depends on the source and review date the page shows beside
 * it, which a flat excerpt would drop.
 */

const SITE = "https://edena.es";

const plain = (html: string) =>
    html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

export const GET: APIRoute = async () => {
    const t = translations.es;

    const faqs = (await getEntry("faqs", "faqspage"))?.data.faqs ?? [];
    const faqTexts = t.faqs as Record<string, unknown>;
    const faqLines = faqs.flatMap(({ question, answer }) => {
        const q = faqTexts[question];
        const a = faqTexts[answer];
        return typeof q === "string" && typeof a === "string"
            ? [`### ${plain(q)}`, "", plain(a), ""]
            : [];
    });

    const posts = (await getCollection("blogEs"))
        .map((post) => ({ post, revised: revisedOn(post.data) }))
        .sort((a, b) =>
            (b.revised ?? b.post.data.date).localeCompare(a.revised ?? a.post.data.date),
        );
    const postLines = posts.map(({ post, revised }) => {
        const dates = [
            `publicado el ${post.data.date.split("T")[0]}`,
            ...(revised ? [`actualizado el ${revised.split("T")[0]}`] : []),
        ].join(", ");
        return `- [${post.data.title}](${SITE}/blog/${post.slug}/) (${dates}): ${post.data.description}`;
    });

    const body = [
        summary.trimEnd(),
        "",
        "---",
        "",
        "# Información completa",
        "",
        pricingMarkdown().replace(/^#/gm, "##").trimEnd(),
        "",
        "## Preguntas frecuentes",
        "",
        `Fuente: ${SITE}/faqs/`,
        "",
        ...faqLines,
        "## Artículos del blog",
        "",
        `Fuente: ${SITE}/blog/ (en español; cada artículo está también en inglés, catalán, euskera y francés).`,
        "",
        ...postLines,
        "",
    ].join("\n");

    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
