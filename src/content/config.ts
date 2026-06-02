import { defineCollection, z } from "astro:content";

const pricingCollection = defineCollection({
    type: "content",
    schema: z.object({
        id: z.string(),
        name: z.string(),
        price: z.string(),
        description: z.string(),
        isPopular: z.boolean().optional().default(false),
        features: z.array(
            z.object({
                id: z.string(),
                included: z.boolean(),
            })
        ),
        buttonText: z.string(),
    }),
});

const faqCollection = defineCollection({
    type: "content",
    schema: z.object({
        faqs: z.array(
            z.object({
                question: z.string(),
                answer: z.string(),
            })
        ),
    }),
});

const blogFaqSchema = z.array(
    z.object({
        question: z.string(),
        answer: z.string(),
    })
);

const blogPostSchema = z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    cover: z.string().optional(),
    faqs: blogFaqSchema.optional(),
    relatedPosts: z.array(z.string()).optional(),
});

const blogEsCollection = defineCollection({
    type: "content",
    schema: blogPostSchema,
});

const blogEnCollection = defineCollection({
    type: "content",
    schema: blogPostSchema,
});

const blogCaCollection = defineCollection({
    type: "content",
    schema: blogPostSchema,
});

const blogEusCollection = defineCollection({
    type: "content",
    schema: blogPostSchema,
});

const blogFrCollection = defineCollection({
    type: "content",
    schema: blogPostSchema,
});

export const collections = {
    pricing: pricingCollection,
    faqs: faqCollection,
    blogEs: blogEsCollection,
    blogEn: blogEnCollection,
    blogCa: blogCaCollection,
    blogEus: blogEusCollection,
    blogFr: blogFrCollection,
};
