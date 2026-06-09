/** Detects numbered section headings in legal policy content (e.g. "1. TITLE", "4.1 Subsection"). */
export function isLegalSectionTitle(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;

    if (/^\d+\.\d+\s+/.test(trimmed)) {
        return trimmed.length <= 100;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
        return true;
    }

    return false;
}
