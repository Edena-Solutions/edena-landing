import type { Translation } from "@/i18n";
import { localePath } from "@/i18n/utils";
import type { CompareRowId, Competitor } from "@/data/competitors";

/** The comparison hub, or one competitor's page, in a locale. */
export function comparePath(lang: string, competitor?: Pick<Competitor, "slug">): string {
    return localePath(lang, competitor ? `/compare/${competitor.slug}` : "/compare");
}

type CompareCopy = Translation["comparePage"];

/** One competitor's words in a locale, with its cell notes typed by criterion. */
export function competitorCopy(copy: CompareCopy, competitor: Pick<Competitor, "id">) {
    const rival = copy.competitors[competitor.id];
    return { ...rival, notes: rival.notes as Partial<Record<CompareRowId, string>> };
}
