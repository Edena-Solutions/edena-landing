import { getCollection } from "astro:content";

export async function GET() {
    const base = "https://edena.es";
    const currentDate = new Date().toISOString().split("T")[0];

    const blogEsPosts = await getCollection("blogEs");
    const blogEnPosts = await getCollection("blogEn");

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

    const buildHreflang = (slug: string, defaultPath?: string): HreflangEntry[] => {
        const esPath = `/es/${slug}`;
        const enPath = `/en/${slug}`;
        const xDefault = defaultPath ?? `/${slug}`;
        return [
            { hreflang: "x-default", href: `${base}${xDefault}` },
            { hreflang: "es", href: `${base}${esPath}` },
            { hreflang: "en", href: `${base}${enPath}` },
        ];
    };

    const homeHreflang: HreflangEntry[] = [
        { hreflang: "x-default", href: `${base}/` },
        { hreflang: "es", href: `${base}/es/` },
        { hreflang: "en", href: `${base}/en/` },
    ];

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
                    title: "Edena - School Management Software",
                },
            ],
        },
        {
            path: "/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("app/"),
            images: [{ loc: `${base}/assets/img/app-hero.png`, title: "Edena Kids Mobile App" }],
        },
        {
            path: "/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("dashboard/"),
            images: [
                {
                    loc: `${base}/assets/img/dashboard-hero.png`,
                    title: "Edena School Analytics Dashboard",
                },
            ],
        },
        {
            path: "/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("students/"),
            images: [
                {
                    loc: `${base}/assets/img/students-hero.png`,
                    title: "Edena Student Information System",
                },
            ],
        },
        {
            path: "/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("guardians/"),
            images: [
                {
                    loc: `${base}/assets/img/guardians-hero.png`,
                    title: "Edena Family Portal",
                },
            ],
        },
        {
            path: "/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("finance/"),
            images: [
                {
                    loc: `${base}/assets/img/finance-hero.png`,
                    title: "Edena School Billing Software",
                },
            ],
        },
        {
            path: "/crm/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("crm/"),
            images: [{ loc: `${base}/assets/img/crm-hero.png`, title: "Edena School CRM" }],
        },
        {
            path: "/assignment/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("assignment/"),
            images: [
                {
                    loc: `${base}/assets/img/assignment-hero.png`,
                    title: "Edena Assignment & Evaluation Management",
                },
            ],
        },
        {
            path: "/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("pricing/"),
        },
        {
            path: "/demo/",
            priority: "1.0",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("demo/"),
        },
        {
            path: "/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("faqs/"),
        },
        {
            path: "/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("families/"),
        },
        {
            path: "/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("centers/"),
        },
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
            path: "/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("privacy/"),
        },
        {
            path: "/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("terms/"),
        },
        {
            path: "/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("cookies/"),
        },
        {
            path: "/es/",
            priority: "0.9",
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
        {
            path: "/es/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("app/"),
        },
        {
            path: "/es/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("dashboard/"),
        },
        {
            path: "/es/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("students/"),
        },
        {
            path: "/es/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("guardians/"),
        },
        {
            path: "/es/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("finance/"),
        },
        {
            path: "/es/crm/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("crm/"),
        },
        {
            path: "/es/assignment/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("assignment/"),
        },
        {
            path: "/es/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("pricing/"),
        },
        {
            path: "/es/demo/",
            priority: "1.0",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("demo/"),
        },
        {
            path: "/es/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("faqs/"),
        },
        {
            path: "/es/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("families/"),
        },
        {
            path: "/es/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("centers/"),
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
        {
            path: "/es/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("privacy/"),
        },
        {
            path: "/es/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("terms/"),
        },
        {
            path: "/es/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("cookies/"),
        },
        {
            path: "/en/",
            priority: "0.9",
            changefreq: "weekly",
            lastmod: currentDate,
            hreflangLinks: homeHreflang,
            images: [
                {
                    loc: `${base}/assets/img/logo.png`,
                    title: "Edena - School Management Software",
                },
            ],
        },
        {
            path: "/en/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("app/"),
        },
        {
            path: "/en/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("dashboard/"),
        },
        {
            path: "/en/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("students/"),
        },
        {
            path: "/en/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("guardians/"),
        },
        {
            path: "/en/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("finance/"),
        },
        {
            path: "/en/crm/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("crm/"),
        },
        {
            path: "/en/assignment/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("assignment/"),
        },
        {
            path: "/en/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("pricing/"),
        },
        {
            path: "/en/demo/",
            priority: "1.0",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("demo/"),
        },
        {
            path: "/en/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("faqs/"),
        },
        {
            path: "/en/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("families/"),
        },
        {
            path: "/en/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("centers/"),
        },
        {
            path: "/en/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEnDate,
            hreflangLinks: [
                { hreflang: "x-default", href: `${base}/blog/` },
                { hreflang: "es", href: `${base}/es/blog/` },
                { hreflang: "en", href: `${base}/en/blog/` },
            ],
        },
        {
            path: "/en/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("privacy/"),
        },
        {
            path: "/en/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("terms/"),
        },
        {
            path: "/en/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
            hreflangLinks: buildHreflang("cookies/"),
        },
    ];

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

    const allUrls = [...staticUrls, ...blogEsUrls, ...blogEsUrlsWithPrefix, ...blogEnUrls];

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
                            `    <xhtml:link rel="alternate" hreflang="${link.hreflang}" href="${escapeXmlUrl(link.href)}"/>`
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
