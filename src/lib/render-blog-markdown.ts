/**
 * Blog posts mix HTML blocks (<strong>, <br>, <a>) with plain-text paragraphs.
 * set:html skips markdown, so plain lines need inline + block processing.
 */

type LineKind = "ul" | "ol" | "paragraph";

function applyInlineMarkdown(text: string): string {
    return text
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
}

function isHtmlBlock(block: string): boolean {
    return /^<[a-zA-Z!/]/.test(block);
}

function classifyLine(line: string): LineKind {
    if (/^-\s+/.test(line)) return "ul";
    if (/^\d+\.\s+/.test(line)) return "ol";
    return "paragraph";
}

function listItemText(line: string, kind: LineKind): string {
    if (kind === "ul") return line.replace(/^-\s+/, "");
    return line.replace(/^\d+\.\s+/, "");
}

function renderParagraph(line: string): string {
    const text = line.startsWith(": ") ? line.slice(2) : line;
    return `<p>${applyInlineMarkdown(text)}</p>`;
}

function renderListItems(items: string[], tag: "ul" | "ol"): string {
    const lis = items.map((item) => `<li>${applyInlineMarkdown(item)}</li>`).join("");
    return `<${tag}>${lis}</${tag}>`;
}

/** Parse a non-HTML block into alternating paragraphs and lists */
function renderTextBlock(block: string): string {
    const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (!lines.length) return "";

    const parts: string[] = [];
    let listKind: "ul" | "ol" | null = null;
    let listItems: string[] = [];

    const flushList = () => {
        if (listKind && listItems.length) {
            parts.push(renderListItems(listItems, listKind));
        }
        listKind = null;
        listItems = [];
    };

    for (const line of lines) {
        const kind = classifyLine(line);

        if (kind === "ul" || kind === "ol") {
            if (listKind && listKind !== kind) {
                flushList();
            }
            listKind = kind;
            listItems.push(listItemText(line, kind));
        } else {
            flushList();
            parts.push(renderParagraph(line));
        }
    }

    flushList();
    return parts.join("\n");
}

function isSectionTitleBlock(block: string): boolean {
    return /^<strong>[^<]+<\/strong>$/i.test(block.trim());
}

function renderSectionTitle(block: string): string {
    const title = block.match(/^<strong>([^<]+)<\/strong>$/i)?.[1] ?? block;
    return `<h2 class="blog-section-heading">${title}</h2>`;
}

function isBrBlock(block: string): boolean {
    return /^<br\s*\/?>$/i.test(block.trim());
}

function renderBlock(block: string): string {
    const trimmed = block.trim();
    if (!trimmed) return "";

    if (isHtmlBlock(trimmed)) {
        return trimmed;
    }

    return renderTextBlock(trimmed);
}

export function renderBlogBodyHtml(raw: string): string {
    if (!raw.trim()) return "";

    const blocks = raw
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map(renderBlock);

    const withBreaks: string[] = [];
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        if (isSectionTitleBlock(block)) {
            withBreaks.push(renderSectionTitle(block));
            if (blocks[i + 1] && isBrBlock(blocks[i + 1])) i++;
            continue;
        }

        if (isBrBlock(block)) {
            withBreaks.push('<div class="blog-section-spacer" aria-hidden="true"></div>');
            continue;
        }

        withBreaks.push(block);
    }

    return withBreaks.join("\n");
}

/** Count list tags in rendered HTML (for audit) */
export function countListTags(html: string): { ul: number; ol: number } {
    return {
        ul: (html.match(/<ul>/g) || []).length,
        ol: (html.match(/<ol>/g) || []).length,
    };
}
