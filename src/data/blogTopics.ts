/*
 * The blog's topics: a short, closed list, so readers can filter by them. Each article names one to
 * three in its Spanish original (`topics` in the front matter); its translations inherit them
 * through `translationKey`. Labels live in the translations (`blogTopics.names`), and the ids are
 * what the blog's address carries (`/blog/?topic=billing`).
 *
 * Each topic has a system colour, the same ones the home hero uses for its centre pills: the label
 * is that colour and the fill is the colour at low opacity.
 */

export const BLOG_TOPICS = [
    "billing",
    "communication",
    "admissions",
    "management",
    "regulation",
    "ai",
    "data-protection",
    "nurseries",
    "academies",
    "teaching",
] as const;

export type BlogTopic = (typeof BLOG_TOPICS)[number];

export const BLOG_TOPIC_COLORS: Record<BlogTopic, string> = {
    billing: "var(--ds-sys-orange)",
    communication: "var(--ds-sys-green)",
    admissions: "var(--ds-sys-blue)",
    management: "var(--ds-sys-indigo)",
    regulation: "var(--ds-sys-purple)",
    ai: "var(--ds-sys-mint)",
    "data-protection": "var(--ds-sys-teal)",
    nurseries: "var(--ds-sys-pink)",
    academies: "var(--ds-sys-yellow)",
    teaching: "var(--ds-sys-red)",
};

/** The query parameter the blog filters on. */
export const TOPIC_PARAM = "topic";
