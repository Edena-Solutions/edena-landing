import type { ImageMetadata } from "astro";

export function ogFromAsset(
    image: ImageMetadata,
    site: URL | undefined,
): { ogImage: string; ogImageWidth: string; ogImageHeight: string } {
    const base = site ?? new URL("https://edena.es");
    return {
        ogImage: new URL(image.src, base).href,
        ogImageWidth: String(image.width),
        ogImageHeight: String(image.height),
    };
}
