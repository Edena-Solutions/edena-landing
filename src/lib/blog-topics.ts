import { getCollection } from "astro:content";
import type { Translation } from "@/i18n";
import { localePath } from "@/i18n/utils";
import { BLOG_TOPICS, TOPIC_PARAM, type BlogTopic } from "@/data/blogTopics";

let byKey: Map<string, BlogTopic[]> | null = null;

/** translationKey -> the topics its Spanish original names, built once per build. */
async function topicsByTranslationKey(): Promise<Map<string, BlogTopic[]>> {
    if (byKey) return byKey;
    byKey = new Map();
    for (const post of await getCollection("blogEs")) {
        const key = post.data.translationKey ?? post.slug;
        if (post.data.topics?.length) byKey.set(key, post.data.topics);
    }
    return byKey;
}

/**
 * A post's topics, in the list's order: its own if it names any, otherwise its Spanish original's.
 * A translation therefore needs no `topics` of its own.
 */
export async function topicsFor(post: {
    slug: string;
    data: { topics?: BlogTopic[]; translationKey?: string };
}): Promise<BlogTopic[]> {
    const own = post.data.topics;
    const topics = own?.length
        ? own
        : ((await topicsByTranslationKey()).get(post.data.translationKey ?? post.slug) ?? []);
    return BLOG_TOPICS.filter((topic) => topics.includes(topic));
}

export interface TopicLabel {
    id: BlogTopic;
    label: string;
}

export function topicLabels(t: Translation, topics: BlogTopic[]): TopicLabel[] {
    return topics.map((id) => ({ id, label: t.blogTopics.names[id] }));
}

/** The blog, filtered to one topic. */
export function topicHref(lang: string, topic: BlogTopic): string {
    return `${localePath(lang, "/blog")}?${TOPIC_PARAM}=${topic}`;
}
