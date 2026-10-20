import type { APIRoute } from "astro";
import { pricingMarkdown } from "@/lib/pricing-markdown";

/** /pricing.md: the prices as Markdown, for AI agents that read files rather than pages. */
export const GET: APIRoute = () =>
    new Response(pricingMarkdown(), {
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
