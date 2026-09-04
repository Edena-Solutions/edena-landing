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

/** Annual billing discount applied to every per-student price. */
export const ANNUAL_DISCOUNT = 0.15;

/** Billing floor: no centre pays less than this, whatever its headcount. */
export const MIN_MONTHLY = 44;

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

/** Academy packs omit extracurriculars: that module is for schools. */
export const ACADEMY_MODULE_IDS: ModuleId[] = MODULE_IDS.filter(
    (id) => id !== "extracurricular",
);

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

export type PackId = "communication" | "automation" | "finance" | "complete";

export interface Pack {
    id: PackId;
    /** Monthly price per enrolled student, billed monthly. */
    pricePerStudent: number;
    /** Ena AI allowance included with the pack. */
    enaTokens: string;
    modules: ModuleId[];
    isPopular?: boolean;
}

/**
 * Packs for academies: bundles priced per student, no à-la-carte modules.
 * Every pack ships the base platform and Ena; the allowance is what changes.
 */
export const PACKS: Pack[] = [
    {
        id: "communication",
        pricePerStudent: 1.2,
        enaTokens: "250K",
        modules: ["platformBase", "ena", "cloud", "communicationPro", "tracking"],
    },
    {
        id: "automation",
        pricePerStudent: 1.4,
        enaTokens: "2M",
        modules: ["platformBase", "ena", "cloud", "automation", "crm"],
    },
    {
        id: "finance",
        pricePerStudent: 1.5,
        enaTokens: "500K",
        modules: ["platformBase", "ena", "cloud", "crm", "billing", "onlineStore"],
        isPopular: true,
    },
    {
        id: "complete",
        pricePerStudent: 2.2,
        enaTokens: "5M",
        modules: ACADEMY_MODULE_IDS,
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
