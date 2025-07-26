import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogPost {
    id: string;
    slug: string;
    body: string;
    collection: string;
    data: {
        title: string;
        description: string;
        date: string;
        author?: string;
        cover?: string;
        tags?: string[];
    };
    render?: unknown;
    rendered?: unknown;
    filePath?: string;
}

const tagVariantMap = {
    facturación: "default",
    automatización: "secondary",
    finanzas: "default",
    comunicación: "secondary",
    familias: "secondary",
    seguridad: "destructive",
    datos: "destructive",
    tendencias: "default",
    tecnología: "default",
    innovación: "secondary",
    asistencia: "secondary",
    gestión: "default",
    analítica: "default",
    rendimiento: "default",
    software: "default",
    comparativa: "secondary",
    UX: "secondary",
    apps: "default",
    móvil: "secondary",
    sostenibilidad: "secondary",
    digitalización: "default",
    "medio ambiente": "secondary",
    documentos: "secondary",
    administración: "default",
    eficiencia: "secondary",
} as const;

interface BlogPostListProps {
    posts: BlogPost[];
    lang: string;
}

const POSTS_PER_PAGE = 12;

export const BlogPostList: React.FC<BlogPostListProps> = ({ posts, lang }) => {
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
    const showLoadMore = visibleCount < posts.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, posts.length));
    };

    const buttonText = lang === "es" ? "Cargar más" : "Load more";

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {posts.slice(0, visibleCount).map((post, idx) => (
                    <Card
                        key={post.slug}
                        className="overflow-hidden rounded bg-gray-50 p-4 group animate-fadeIn"
                        style={{ animationDelay: `${(idx % POSTS_PER_PAGE) * 40}ms` }}
                    >
                        <a href={`/${lang}/blog/${post.slug}`} className="block">
                            {post.data.cover && (
                                <div className="overflow-hidden rounded relative h-80">
                                    {post.data.tags && post.data.tags.length > 0 && (
                                        <span className="absolute top-1 left-2 z-10">
                                            <Badge
                                                variant={
                                                    tagVariantMap[
                                                        post.data
                                                            .tags[0] as keyof typeof tagVariantMap
                                                    ] ?? "default"
                                                }
                                                className="capitalize rounded-sm"
                                            >
                                                {post.data.tags[0]}
                                            </Badge>
                                        </span>
                                    )}
                                    <img
                                        src={post.data.cover}
                                        alt={post.data.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <CardHeader className="px-0 py-2 group-hover:text-primary/70 transition-colors">
                                <CardTitle className="text-lg font-semibold line-clamp-2">
                                    {post.data.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col gap-2">
                                <p className="text-sm line-clamp-2">{post.data.description}</p>
                            </CardContent>
                            <CardFooter className="p-0 pt-4">
                                <p className="text-muted-foreground text-sm">
                                    {new Date(post.data.date).toLocaleDateString(lang, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}{" "}
                                    - {post.data.author}
                                </p>
                            </CardFooter>
                        </a>
                    </Card>
                ))}
            </div>
            {showLoadMore && (
                <div className="flex justify-center mt-8">
                    <Button variant="secondary" size="lg" onClick={handleLoadMore}>
                        {buttonText}
                    </Button>
                </div>
            )}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </>
    );
};

export default BlogPostList;
