import { getCollection } from "astro:content";

export async function GET() {
    const base = "https://edena.es";
    const currentDate = new Date().toISOString().split("T")[0];

    const blogEsPosts = await getCollection("blogEs");
    const blogEnPosts = await getCollection("blogEn");
    const blogCaPosts = await getCollection("blogCa");
    const blogEusPosts = await getCollection("blogEus");
    const blogFrPosts = await getCollection("blogFr");

    const latestBlogEsDate =
        blogEsPosts.length > 0
            ? blogEsPosts
                  .sort((a, b) => b.data.date.localeCompare(a.data.date))[0]
                  .data.date.split("T")[0]
            : currentDate;
    const latestBlogEnDate =
        blogEnPosts.length > 0
            ? blogEnPosts
                  .sort((a, b) => b.data.date.localeCompare(a.data.date))[0]
                  .data.date.split("T")[0]
            : currentDate;
    const latestBlogEusDate =
        blogEusPosts.length > 0
            ? blogEusPosts
                  .sort((a, b) => b.data.date.localeCompare(a.data.date))[0]
                  .data.date.split("T")[0]
            : currentDate;
    const latestBlogCaDate =
        blogCaPosts.length > 0
            ? blogCaPosts
                  .sort((a, b) => b.data.date.localeCompare(a.data.date))[0]
                  .data.date.split("T")[0]
            : currentDate;
    const latestBlogFrDate =
        blogFrPosts.length > 0
            ? blogFrPosts
                  .sort((a, b) => b.data.date.localeCompare(a.data.date))[0]
                  .data.date.split("T")[0]
            : currentDate;

    interface HreflangEntry {
        hreflang: string;
        href: string;
    }

    interface SitemapUrl {
        path: string;
        priority: string;
        changefreq: string;
        lastmod: string;
        hreflangLinks?: HreflangEntry[];
        images?: Array<{
            loc: string;
            title?: string;
        }>;
    }

    /**
     * Canonical URL layout: Spanish (default locale) lives unprefixed at the
     * root; en/ca/eus/fr live under their locale prefix. /es/* duplicates are
     * canonicalised to the root and are therefore NOT listed here.
     */
    const locales: Array<{ prefix: string; hreflang: string }> = [
        { prefix: "en", hreflang: "en" },
        { prefix: "ca", hreflang: "ca" },
        { prefix: "eus", hreflang: "eu" },
        { prefix: "fr", hreflang: "fr" },
    ];

    const buildHreflang = (slug: string): HreflangEntry[] => [
        { hreflang: "x-default", href: `${base}/${slug}` },
        { hreflang: "es", href: `${base}/${slug}` },
        ...locales.map((l) => ({ hreflang: l.hreflang, href: `${base}/${l.prefix}/${slug}` })),
    ];

    const homeHreflang = buildHreflang("");

    /** Every non-blog page, shared by all 5 locales. */
    const sharedLocaleSubpaths: Array<{ segment: string; priority: string; changefreq: string }> = [
        { segment: "app/", priority: "0.9", changefreq: "monthly" },
        { segment: "dashboard/", priority: "0.9", changefreq: "monthly" },
        { segment: "students/", priority: "0.9", changefreq: "monthly" },
        { segment: "finance/", priority: "0.9", changefreq: "monthly" },
        { segment: "crm/", priority: "0.9", changefreq: "monthly" },
        { segment: "assignment/", priority: "0.9", changefreq: "monthly" },
        { segment: "extracurricular/", priority: "0.9", changefreq: "monthly" },
        { segment: "tracking/", priority: "0.9", changefreq: "monthly" },
        { segment: "workflows/", priority: "0.9", changefreq: "monthly" },
        { segment: "shop/", priority: "0.9", changefreq: "monthly" },
        { segment: "communication/", priority: "0.9", changefreq: "monthly" },
        { segment: "internal-payments/", priority: "0.9", changefreq: "monthly" },
        { segment: "ena/", priority: "0.9", changefreq: "monthly" },
        { segment: "pricing/", priority: "0.9", changefreq: "monthly" },
        { segment: "demo/", priority: "1.0", changefreq: "monthly" },
        { segment: "faqs/", priority: "0.8", changefreq: "monthly" },
        { segment: "families/", priority: "0.9", changefreq: "monthly" },
        { segment: "nurseries/", priority: "0.9", changefreq: "monthly" },
        { segment: "schools/", priority: "0.9", changefreq: "monthly" },
        { segment: "academies/", priority: "0.9", changefreq: "monthly" },
        { segment: "groups/", priority: "0.9", changefreq: "monthly" },
        { segment: "contact/", priority: "0.8", changefreq: "monthly" },
        { segment: "privacy/", priority: "0.5", changefreq: "yearly" },
        { segment: "terms/", priority: "0.5", changefreq: "yearly" },
        { segment: "cookies/", priority: "0.5", changefreq: "yearly" },
        { segment: "data-processing/", priority: "0.5", changefreq: "yearly" },
    ];

    // Root (canonical Spanish) URLs.
    const staticUrls: SitemapUrl[] = [
        {
            path: "/",
            priority: "1.0",
            changefreq: "weekly",
            lastmod: currentDate,
            hreflangLinks: homeHreflang,
            images: [
                {
                    loc: `${base}/assets/img/logo.png`,
                    title: "Edena - Software de Gestión Escolar",
                },
            ],
        },
        ...sharedLocaleSubpaths.map((p) => ({
            path: `/${p.segment}`,
            priority: p.priority,
            changefreq: p.changefreq,
            lastmod: currentDate,
            hreflangLinks: buildHreflang(p.segment),
        })),
        {
            path: "/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEsDate,
            hreflangLinks: [
                { hreflang: "x-default", href: `${base}/blog/` },
                { hreflang: "es", href: `${base}/es/blog/` },
                { hreflang: "en", href: `${base}/en/blog/` },
            ],
        },
        {
            path: "/es/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEsDate,
            hreflangLinks: [
                { hreflang: "x-default", href: `${base}/blog/` },
                { hreflang: "es", href: `${base}/es/blog/` },
                { hreflang: "en", href: `${base}/en/blog/` },
            ],
        },
    ];

    // Locale-prefixed URLs (en/ca/eus/fr).
    const blogLastmodByPrefix: Record<string, string> = {
        en: latestBlogEnDate,
        ca: latestBlogCaDate,
        eus: latestBlogEusDate,
        fr: latestBlogFrDate,
    };

    const localeStaticUrls: SitemapUrl[] = locales.flatMap((l) => [
        {
            path: `/${l.prefix}/`,
            priority: "0.9",
            changefreq: "weekly",
            lastmod: currentDate,
            hreflangLinks: homeHreflang,
        },
        {
            path: `/${l.prefix}/blog/`,
            priority: "0.8",
            changefreq: "weekly",
            lastmod: blogLastmodByPrefix[l.prefix],
            hreflangLinks: [
                { hreflang: l.hreflang, href: `${base}/${l.prefix}/blog/` },
            ],
        },
        ...sharedLocaleSubpaths.map((p) => ({
            path: `/${l.prefix}/${p.segment}`,
            priority: p.priority,
            changefreq: p.changefreq,
            lastmod: currentDate,
            hreflangLinks: buildHreflang(p.segment),
        })),
    ]);

    const blogEsUrls: SitemapUrl[] = blogEsPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [
                { hreflang: "x-default", href: `${base}/blog/${post.slug}/` },
                { hreflang: "es", href: `${base}/es/blog/${post.slug}/` },
            ],
            images: images.length > 0 ? images : undefined,
        };
    });

    const blogEsUrlsWithPrefix: SitemapUrl[] = blogEsPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/es/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [
                { hreflang: "x-default", href: `${base}/blog/${post.slug}/` },
                { hreflang: "es", href: `${base}/es/blog/${post.slug}/` },
            ],
            images: images.length > 0 ? images : undefined,
        };
    });

    const blogEnUrls: SitemapUrl[] = blogEnPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/en/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [{ hreflang: "en", href: `${base}/en/blog/${post.slug}/` }],
            images: images.length > 0 ? images : undefined,
        };
    });

    const blogCaUrls: SitemapUrl[] = blogCaPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/ca/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [{ hreflang: "ca", href: `${base}/ca/blog/${post.slug}/` }],
            images: images.length > 0 ? images : undefined,
        };
    });

    const blogEusUrls: SitemapUrl[] = blogEusPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/eus/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [{ hreflang: "eu", href: `${base}/eus/blog/${post.slug}/` }],
            images: images.length > 0 ? images : undefined,
        };
    });

    const blogFrUrls: SitemapUrl[] = blogFrPosts.map((post) => {
        const postDate = post.data.date.split("T")[0];
        const images: Array<{ loc: string; title?: string }> = [];

        if (post.data.cover) {
            const imageUrl = post.data.cover.startsWith("http")
                ? post.data.cover
                : `${base}${post.data.cover.startsWith("/") ? "" : "/"}${post.data.cover}`;
            images.push({
                loc: imageUrl,
                title: post.data.title,
            });
        }

        return {
            path: `/fr/blog/${post.slug}/`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: postDate,
            hreflangLinks: [{ hreflang: "fr", href: `${base}/fr/blog/${post.slug}/` }],
            images: images.length > 0 ? images : undefined,
        };
    });

    const allUrls = [
        ...staticUrls,
        ...localeStaticUrls,
        ...blogEsUrls,
        ...blogEsUrlsWithPrefix,
        ...blogEnUrls,
        ...blogCaUrls,
        ...blogEusUrls,
        ...blogFrUrls,
    ];

    const escapeXmlUrl = (url: string): string => {
        return url.replace(/&/g, "&amp;");
    };

    const escapeXmlText = (text: string): string => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    };

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
    .map((url) => {
        let urlXml = `  <url>
    <loc>${escapeXmlUrl(base + url.path)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

        if (url.hreflangLinks && url.hreflangLinks.length > 0) {
            urlXml +=
                "\n" +
                url.hreflangLinks
                    .map(
                        (link) =>
                            `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${escapeXmlUrl(link.href)}"/>`,
                    )
                    .join("\n");
        }

        if (url.images && url.images.length > 0) {
            urlXml +=
                "\n" +
                url.images
                    .map((image) => {
                        let imageXml = `    <image:image>
      <image:loc>${escapeXmlUrl(image.loc)}</image:loc>`;
                        if (image.title) {
                            imageXml += `\n      <image:title>${escapeXmlText(image.title)}</image:title>`;
                        }
                        imageXml += "\n    </image:image>";
                        return imageXml;
                    })
                    .join("\n");
        }

        urlXml += "\n  </url>";
        return urlXml;
    })
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
        },
    });
}
