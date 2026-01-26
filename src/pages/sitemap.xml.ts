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

    interface SitemapUrl {
        path: string;
        priority: string;
        changefreq: string;
        lastmod: string;
        images?: Array<{
            loc: string;
            title?: string;
        }>;
    }

    const staticUrls: SitemapUrl[] = [
        {
            path: "/",
            priority: "1.0",
            changefreq: "weekly",
            lastmod: currentDate,
            images: [{ loc: `${base}/assets/img/logo.png`, title: "Edena Logo" }],
        },
        {
            path: "/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/demo/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEsDate,
        },
        {
            path: "/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/es/",
            priority: "0.9",
            changefreq: "weekly",
            lastmod: currentDate,
            images: [{ loc: `${base}/assets/img/logo.png`, title: "Edena Logo" }],
        },
        {
            path: "/es/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/demo/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/es/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEsDate,
        },
        {
            path: "/es/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/es/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/es/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/en/",
            priority: "0.9",
            changefreq: "weekly",
            lastmod: currentDate,
            images: [{ loc: `${base}/assets/img/logo.png`, title: "Edena Logo" }],
        },
        {
            path: "/en/app/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/dashboard/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/students/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/guardians/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/finance/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/pricing/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/demo/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/faqs/",
            priority: "0.8",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/families/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/centers/",
            priority: "0.9",
            changefreq: "monthly",
            lastmod: currentDate,
        },
        {
            path: "/en/blog/",
            priority: "0.8",
            changefreq: "weekly",
            lastmod: latestBlogEnDate,
        },
        {
            path: "/en/privacy/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/en/terms/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
        },
        {
            path: "/en/cookies/",
            priority: "0.5",
            changefreq: "yearly",
            lastmod: currentDate,
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
            images: images.length > 0 ? images : undefined,
        };
    });

    const allUrls = [...staticUrls, ...blogEsUrls, ...blogEsUrlsWithPrefix, ...blogEnUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
            .map((url) => {
                let urlXml = `  <url>
    <loc>${base}${url.path}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

                if (url.images && url.images.length > 0) {
                    urlXml += "\n" + url.images.map((image) => {
                        let imageXml = `    <image:image>
      <image:loc>${image.loc}</image:loc>`;
                        if (image.title) {
                            imageXml += `\n      <image:title>${image.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>`;
                        }
                        imageXml += "\n    </image:image>";
                        return imageXml;
                    }).join("\n");
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
