import { getCollection } from "astro:content";

export async function GET() {
    const base = "https://edena.es";

    const blogEsPosts = await getCollection("blogEs");
    const blogEnPosts = await getCollection("blogEn");

    const staticPaths = [
        "/",
        "/es/",
        "/es/app/",
        "/es/dashboard/",
        "/es/demo/",
        "/es/faqs/",
        "/es/finance/",
        "/es/guardians/",
        "/es/pricing/",
        "/es/students/",
        "/es/privacy/",
        "/es/terms/",
        "/es/cookies/",
        "/es/blog/",
        "/en/",
        "/en/app/",
        "/en/dashboard/",
        "/en/demo/",
        "/en/faqs/",
        "/en/finance/",
        "/en/guardians/",
        "/en/pricing/",
        "/en/students/",
        "/en/privacy/",
        "/en/terms/",
        "/en/cookies/",
        "/en/blog/",
    ];

    const blogEsUrls = blogEsPosts.map((post) => `/es/blog/${post.slug}/`);

    const blogEnUrls = blogEnPosts.map((post) => `/en/blog/${post.slug}/`);

    const allPaths = [...staticPaths, ...blogEsUrls, ...blogEnUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
    .map((path) => {
        let priority = "0.7";
        let changefreq = "monthly";

        if (path === "/" || path === "/es/" || path === "/en/") {
            priority = "1.0";
            changefreq = "weekly";
        } else if (path.includes("/blog/")) {
            priority = "0.8";
            changefreq = "monthly";
        }

        return `  <url><loc>${base}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}
