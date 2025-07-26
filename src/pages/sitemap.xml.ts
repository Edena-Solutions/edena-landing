export async function GET() {
    const base = "https://edena.es";
    const paths = [
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

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
    .map(
        (path) =>
            `  <url><loc>${base}${path}</loc><changefreq>${
                path === "/" || path === "/es/" || path === "/en/" ? "weekly" : "monthly"
            }</changefreq><priority>${
                path === "/" || path === "/es/" || path === "/en/" ? "1.0" : "0.7"
            }</priority></url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}
