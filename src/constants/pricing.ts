import type { LucideIcon } from "lucide-react";
import {
    Clock,
    Cloud,
    MessagesSquare,
    Sparkles,
    SquareUser,
    Store,
    WalletCards,
    Zap,
} from "lucide-react";
import aiLogo from "@/assets/img/logos/ai.png";
import edenaLogo from "@/assets/img/logos/logo-small.svg";
import { intlLocaleForLang } from "@/lib/intl-locale";

/**
 * Annual billing discount: two months free, which is the sector convention and reads better
 * than a raw percentage. Kept as a fraction because every price is derived from it.
 */
export const ANNUAL_DISCOUNT = 1 / 6;

/**
 * Billing floor per audience, in the unit each page can state truthfully.
 *
 * Centres use a **headcount** minimum: the page quotes rather than publishes a table, so the floor
 * never has to be reduced to one number, and keeping it in students lets every package keep its own
 * per-student logic instead of converging on a single euro figure.
 *
 * Academies use a **monthly euro** minimum, because their page does publish closed packs and a
 * single stated figure has to be true for all four of them. A headcount minimum produces four
 * different floors (one per pack), so "minimum billing of X EUR" would be exact for
 * the cheapest pack and understate the rest. The figure matches the centres floor (30 x 1,20 EUR)
 * so both audiences enter at the same price. The trade-off is that below it the packs cost the
 * same — irrelevant here, since that only happens under ~36 students and this catalogue targets
 * academies of 100-300.
 */
export const BILLING_FLOOR = {
    centers: { unit: "students", value: 30 },
    academies: { unit: "monthly", value: 36 },
} as const;

/**
 * Marginal price decays with headcount, applied per band the way income-tax brackets are — which
 * is exactly what Stripe's graduated prices do. Cuts differ per audience because the size ranges
 * do: a nursery rarely leaves the second band, an academy of one site sits inside the first.
 */
export const VOLUME_BANDS = {
    centers: [
        { upTo: 150, factor: 1 },
        { upTo: 400, factor: 0.7 },
        { upTo: 800, factor: 0.45 },
        { upTo: Infinity, factor: 0.3 },
    ],
    academies: [
        { upTo: 300, factor: 1 },
        { upTo: 700, factor: 0.75 },
        { upTo: Infinity, factor: 0.55 },
    ],
} as const;

export type Audience = keyof typeof BILLING_FLOOR;

/** Monthly total for a headcount, with the volume bands and the audience's floor applied. */
export function monthlyFor(pricePerStudent: number, students: number, audience: Audience): number {
    const floor = BILLING_FLOOR[audience];
    const billable = floor.unit === "students" ? Math.max(students, floor.value) : students;

    let total = 0;
    let previous = 0;
    for (const { upTo, factor } of VOLUME_BANDS[audience]) {
        if (billable <= previous) break;
        total += (Math.min(billable, upTo) - previous) * pricePerStudent * factor;
        previous = upTo;
    }
    if (floor.unit === "monthly") total = Math.max(total, floor.value);
    return Math.round(total * 100) / 100;
}

/** Cheapest monthly bill for a package — what the "from …" headline shows. */
export function floorFor(pricePerStudent: number, audience: Audience): number {
    const floor = BILLING_FLOOR[audience];
    return floor.unit === "monthly"
        ? floor.value
        : monthlyFor(pricePerStudent, floor.value, audience);
}

export type ModuleId =
    | "platformBase"
    | "ena"
    | "communicationPro"
    | "extracurricular"
    | "automation"
    | "tracking"
    | "crm"
    | "billing"
    | "onlineStore"
    | "cloud";

/** Every module, in the order used across the pricing pages. */
export const MODULE_IDS: ModuleId[] = [
    "platformBase",
    "ena",
    "cloud",
    "communicationPro",
    "extracurricular",
    "automation",
    "tracking",
    "crm",
    "billing",
    "onlineStore",
];

export interface ModuleMeta {
    icon?: LucideIcon;
    iconImage?: { src: string };
    iconImageClass?: string;
    iconColor: string;
}

/** Icon + colors per module, matching the Products nav (NavigationMenu.tsx). */
export const MODULE_META: Record<string, ModuleMeta> = {
    platformBase: {
        iconImage: edenaLogo,
        iconImageClass: "dark:invert",
        iconColor: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
    },
    ena: {
        iconImage: aiLogo,
        iconColor: "bg-muted text-black dark:text-white",
    },
    communicationPro: {
        icon: MessagesSquare,
        iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    },
    extracurricular: {
        icon: Sparkles,
        iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    },
    automation: {
        icon: Zap,
        iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    },
    tracking: {
        icon: Clock,
        iconColor: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    },
    crm: {
        icon: SquareUser,
        iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    billing: {
        icon: WalletCards,
        iconColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    onlineStore: {
        icon: Store,
        iconColor: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
    },
    cloud: {
        icon: Cloud,
        iconColor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    },
};

/** Ids of the academy catalogue — these index `pricing.packs.items` in the locales. */
export type AcademyPackId = "communication" | "finance" | "complete";

/** Ids of the centre catalogue — these index `pricing.centers.packs` in the locales. */
export type CenterPackId = "base" | "centre" | "complete";

export type PackId = AcademyPackId | CenterPackId;

export interface Pack<Id extends PackId = PackId> {
    id: Id;
    /** Monthly price per enrolled student, billed monthly. */
    pricePerStudent: number;
    /** Ena AI allowance included with the pack. */
    enaTokens: string;
    modules: ModuleId[];
    isPopular?: boolean;
}

/**
 * Packs for academies: bundles priced per student, no à-la-carte modules.
 * Every pack ships the base platform, Ena and cloud storage; what changes is what sits on top.
 *
 * Two rules this list must keep:
 *
 * 1. **Cumulative.** Each pack contains the previous one. Non-overlapping packs leave the most
 *    common request with no home — an academy wanting communication *and* invoicing had to jump
 *    to the top tier — and they put the automation engine in a pack with nothing to automate.
 * 2. **Priced for the audience.** An academy bills 40–250 € per student where a nursery bills
 *    300–600, so the same per-student rate is a different share of revenue entirely. At 1,00 €
 *    the top pack is ~0,9 % of what an academy of 100 €/student invoices, inside the sector band;
 *    the previous 2,20 € was 2,2 %, above every Spanish competitor that publishes a price.
 */
export const PACKS: Pack<AcademyPackId>[] = [
    {
        id: "communication",
        pricePerStudent: 0.6,
        enaTokens: "250K",
        modules: ["platformBase", "ena", "cloud", "communicationPro", "tracking"],
    },
    {
        id: "finance",
        pricePerStudent: 0.9,
        enaTokens: "500K",
        modules: ["platformBase", "ena", "cloud", "crm", "billing", "onlineStore"],
        isPopular: true,
    },
    {
        id: "complete",
        pricePerStudent: 1.0,
        enaTokens: "5M",
        // Every module except `extracurricular`. Note that for an academy that module is not
        // after-school activities but its own course catalogue — activity name, age range,
        // assigned teacher, weekly slots, linked billing concept and online enrolment requests,
        // which is exactly how a language school sells "B2, Tue+Thu 18:00, ten places". It is
        // excluded here as a product decision, not because it does not fit; if it comes back,
        // it should come back renamed per organization profile ("Cursos"), since the label is
        // what does not fit, not the feature.
        modules: [
            "platformBase",
            "ena",
            "cloud",
            "communicationPro",
            "tracking",
            "crm",
            "billing",
            "onlineStore",
            "automation",
        ],
    },
];

/**
 * Packages for education centres. Same platform, own rate: a nursery child generates a daily
 * report, attendance, photos and messages every school day, where an academy student generates
 * an enrolment, a monthly invoice and two attendances a week — the platform does several times
 * the work per student, which is what the difference pays for and what to say if asked.
 *
 * `centre` is the recommended one: the three modules that decide the purchase and nothing else.
 * `complete` adds admissions, extracurricular and the automation engine for 20 cents more — a 6 %
 * discount on buying the same set à la carte (2,55 €). An earlier revision set it five cents above
 * `centre`, which made the upsell automatic but priced its extra modules at 0,05 € against 0,30 €
 * loose: that reads as "what the top tier adds is worthless", not as a bargain.
 *
 * These figures are the internal reference for quoting a centre. Unlike the academy packs they are
 * not published: `/pricing/centers` shows a "from" price only, because that page addresses
 * nurseries, schools and groups at once and no single list serves all three.
 */
export const CENTER_PACKS: Pack<CenterPackId>[] = [
    {
        id: "base",
        pricePerStudent: 1.2,
        enaTokens: "250K",
        modules: ["platformBase", "ena", "cloud"],
    },
    {
        id: "centre",
        pricePerStudent: 2.25,
        enaTokens: "1M",
        modules: [
            "platformBase",
            "ena",
            "cloud",
            "communicationPro",
            "tracking",
            "billing",
            "onlineStore",
        ],
        isPopular: true,
    },
    {
        id: "complete",
        pricePerStudent: 2.4,
        enaTokens: "5M",
        modules: MODULE_IDS,
    },
];

export function formatPrice(value: number, lang: string, fractionDigits = 2): string {
    return new Intl.NumberFormat(intlLocaleForLang(lang), {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}

/**
 * Like `formatPrice`, but a whole amount drops its decimals: "36 €", not "36,00 €". Used for the
 * "from …" headlines, where trailing zeros add noise to a figure meant to be read at a glance.
 * Keeps the cents when there are any, so 67,50 € still reads correctly.
 */
export function formatPriceTrim(value: number, lang: string): string {
    return formatPrice(value, lang, Number.isInteger(value) ? 0 : 2);
}

export function annualPrice(value: number): number {
    return Math.round(value * (1 - ANNUAL_DISCOUNT) * 100) / 100;
}

/** Section title per module, read from the shared `pricing.planFeatureSections` copy. */
export interface PlanFeatureSection {
    title: string;
    items: Array<{ moduleId: string; label: string }>;
}

export function moduleSectionsById(
    sections: PlanFeatureSection[],
): Record<string, PlanFeatureSection> {
    return sections.reduce<Record<string, PlanFeatureSection>>((acc, section) => {
        const id = section.items[0]?.moduleId;
        if (id) acc[id] = section;
        return acc;
    }, {});
}
