import Link from "@/components/ui/link";
import { LinkIcon } from "lucide-react";

export type BlogRelatedArticlesProps = {
    title: string;
    posts: { href: string; title: string }[];
};

export default function BlogRelatedArticles({ title, posts }: BlogRelatedArticlesProps) {
    if (!posts.length) return null;

    return (
        <section className="not-prose my-5">
            <h2 className="font-bold mb-4">{title}</h2>
            <ul className="list-disc space-y-2 pl-5">
                {posts.map((post) => (
                    <li key={post.href}>
                        <span className="flex items-center gap-2">
                            <Link href={post.href} variant="link">
                                {post.title}
                            </Link>
                            <LinkIcon className="w-4 h-4" />
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
