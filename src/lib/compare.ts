import { localePath, translations } from "@/i18n/index.ts";
import { intlLocaleForLang } from "@/lib/intl-locale";
import type { CompareRowId, Competitor } from "@/data/competitors";

/** The comparison hub, or one competitor's page, in a locale. */
export function comparePath(lang: string, competitor?: Pick<Competitor, "slug">): string {
    return localePath(lang, competitor ? `/compare/${competitor.slug}` : "/compare");
}

/** A score as the locale writes it: "14,5" in Spanish, "14.5" in English. */
export function formatScore(value: number, lang: string): string {
    return new Intl.NumberFormat(intlLocaleForLang(lang), { maximumFractionDigits: 1 }).format(
        value,
    );
}

/** A count with its thousands always grouped: "5.000", where Spanish would otherwise print "5000". */
export function formatCount(value: number, lang: string): string {
    return new Intl.NumberFormat(intlLocaleForLang(lang), { useGrouping: "always" }).format(value);
}

type CompareCopy = (typeof translations)[keyof typeof translations]["comparePage"];

/** One competitor's words in a locale, with its cell notes typed by criterion. */
export function competitorCopy(copy: CompareCopy, competitor: Pick<Competitor, "id">) {
    const rival = copy.competitors[competitor.id];
    return { ...rival, notes: rival.notes as Partial<Record<CompareRowId, string>> };
}
