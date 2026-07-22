import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
    Check,
    Clock,
    Cloud,
    MessagesSquare,
    Minus,
    Sparkles,
    SquareUser,
    Store,
    WalletCards,
    Zap,
} from "lucide-react";
import aiLogo from "@/assets/img/logos/ai.png";
import edenaLogo from "@/assets/img/logos/logo-small.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PricingCalculator } from "@/components/PricingCalculator";
import type { Translation } from "@/i18n";
import { intlLocaleForLang } from "@/lib/intl-locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/link";

const ANNUAL_DISCOUNT = 0.15;

const MIN_CHILDREN = 35;
const MIN_MONTHLY = 44;

const PLAN_PRICES: Record<string, { pricePerChild: number; flatMonthly?: number }> = {
    essential: { pricePerChild: 1.0 },
    managementPro: { pricePerChild: 1.4 },
    complete: { pricePerChild: 1.9, flatMonthly: 10 },
};

/** When `t.pricing.calculator` is missing, match strings used in i18n files */
const DEFAULT_CALC_TOGGLE_LABELS: Record<string, { monthly: string; annual: string }> = {
    es: { monthly: "Mensual", annual: "Anual" },
    ca: { monthly: "Mensual", annual: "Anual" },
    fr: { monthly: "Mensuel", annual: "Annuel" },
    eus: { monthly: "Hilabetekoa", annual: "Urtekoa" },
    en: { monthly: "Monthly", annual: "Annual" },
};

const FROM_PRICE_PER_MONTH: Record<string, (formatted: string) => string> = {
    es: (p) => `Desde ${p} al mes`,
    ca: (p) => `Des de ${p}/mes`,
    fr: (p) => `À partir de ${p}/mois`,
    eus: (p) => `Gutxienez ${p}/hilean`,
    en: (p) => `From ${p}/month`,
};

const COMPLETE_PLAN_PER_CHILD: Record<string, (formatted: string) => string> = {
    es: (f) => `${f}/niño + 10€/mes`,
    ca: (f) => `${f}/nen + 10€/mes`,
    fr: (f) => `${f}/enfant + 10 €/mois`,
    eus: (f) => `${f}/haurko + 10€/hilean`,
    en: (f) => `${f}/child + €10/month`,
};

const PER_CHILD_LINE: Record<string, (formatted: string) => string> = {
    es: (f) => `${f} por niño`,
    ca: (f) => `${f} per nen`,
    fr: (f) => `${f} par enfant`,
    eus: (f) => `${f} haur bakoitzeko`,
    en: (f) => `${f} per child`,
};

function fromPricePerMonthLabel(formatted: string, lang: string): string {
    const fn = FROM_PRICE_PER_MONTH[lang] ?? FROM_PRICE_PER_MONTH.en;
    return fn(formatted);
}

function getFromPriceNumeric(
    pricePerChild: number,
    flatMonthly: number,
    minMonthly: number,
    minChildren: number,
): number {
    const raw = Math.round((pricePerChild * minChildren + flatMonthly) * 100) / 100;
    return Math.max(minMonthly, raw);
}

function formatPrice(value: number, lang: string): string {
    return new Intl.NumberFormat(intlLocaleForLang(lang), {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

type PlanFeatureModuleItem = { moduleId: string; label: string };
type PlanFeatureSection = { title: string; items: PlanFeatureModuleItem[] };

/** Icon + colors per module, matching the Products nav (NavigationMenu.tsx) */
const MODULE_META: Record<
    string,
    {
        icon?: LucideIcon;
        iconImage?: { src: string };
        iconImageClass?: string;
        iconColor: string;
    }
> = {
    platformBase: {
        iconImage: edenaLogo,
        iconImageClass: "dark:invert",
        iconColor: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
    },
    billing: {
        icon: WalletCards,
        iconColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    communicationPro: {
        icon: MessagesSquare,
        iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    },
    crm: {
        icon: SquareUser,
        iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    extracurricular: {
        icon: Sparkles,
        iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    },
    automation: {
        icon: Zap,
        iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    },
    onlineStore: {
        icon: Store,
        iconColor: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
    },
    cloud: {
        icon: Cloud,
        iconColor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    },
    tracking: {
        icon: Clock,
        iconColor: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    },
    ena: {
        iconImage: aiLogo,
        iconColor: "bg-muted text-black dark:text-white",
    },
};

/** Monthly Ena AI token allowance per plan */
const ENA_TOKENS: Record<string, string> = {
    essential: "250K",
    managementPro: "1M",
    complete: "5M",
};

const TOKENS_PER_MONTH: Record<string, (tokens: string) => string> = {
    es: (n) => `${n} tokens/mes`,
    ca: (n) => `${n} tokens/mes`,
    fr: (n) => `${n} tokens/mois`,
    eus: (n) => `${n} token/hilean`,
    en: (n) => `${n} tokens/mo`,
};

const INCLUDED_MODULES_LABEL: Record<string, string> = {
    es: "Módulos",
    ca: "Mòduls",
    fr: "Modules",
    eus: "Moduluak",
    en: "Modules",
};

const COMPARE_PLANS_TITLE: Record<string, string> = {
    es: "Compara los planes al detalle",
    ca: "Compara els plans al detall",
    fr: "Comparez les formules en détail",
    eus: "Alderatu planak xehetasunez",
    en: "Compare plans in detail",
};

const COMPARE_PLANS_DESCRIPTION: Record<string, string> = {
    es: "Revisa módulo a módulo qué incluye cada plan y elige el que mejor encaja con tu centro.",
    ca: "Revisa mòdul a mòdul què inclou cada pla i tria el que millor encaixa amb el teu centre.",
    fr: "Parcourez module par module ce que chaque offre inclut et choisissez celle qui convient le mieux à votre établissement.",
    eus: "Berrikusi moduluz modulu plan bakoitzak zer barne hartzen duen eta aukeratu zure zentrorako egokiena.",
    en: "See module by module what each plan includes and pick the one that best fits your school.",
};

function sectionModuleId(sec: PlanFeatureSection): string | undefined {
    return sec.items[0]?.moduleId;
}

function formatPricePerChild(value: number, planId: string, lang: string): string {
    const formatted = formatPrice(value, lang);
    if (planId === "complete") {
        const fn = COMPLETE_PLAN_PER_CHILD[lang] ?? COMPLETE_PLAN_PER_CHILD.en;
        return fn(formatted);
    }
    const fn = PER_CHILD_LINE[lang] ?? PER_CHILD_LINE.en;
    return fn(formatted);
}

interface PricingTabsProps {
    t: Translation;
    lang: string;
}

export function PricingTabs({ t, lang }: PricingTabsProps) {
    const [value, setValue] = React.useState("plans");
    const [plansAnnual, setPlansAnnual] = React.useState(false);
    const [comparePlan, setComparePlan] = React.useState<
        "essential" | "managementPro" | "complete"
    >("managementPro");
    const demoUrl = `/${lang}/demo`;
    const calcT = t.pricing?.calculator;
    const defaultToggle = DEFAULT_CALC_TOGGLE_LABELS[lang] ?? DEFAULT_CALC_TOGGLE_LABELS.en;
    const monthlyLabel = calcT?.monthly ?? defaultToggle.monthly;
    const annualLabel = calcT?.annual ?? defaultToggle.annual;
    const annualDiscountLabel = calcT?.annualDiscount ?? "-15%";
    const r = t.pricing?.recommended ?? {
        essential: {
            name: "Esencial",
            description: "",
            pricePerChild: "",
            from: "",
            featureIncludedIds: [] as string[],
        },
        managementPro: {
            name: "Gestión Pro",
            description: "",
            pricePerChild: "",
            from: "",
            featureIncludedIds: [] as string[],
        },
        complete: {
            name: "Completo",
            description: "",
            pricePerChild: "",
            from: "",
            featureIncludedIds: [] as string[],
        },
        cta: "",
        orCalculate: "",
    };
    const planFeatureSections =
        (t.pricing as { planFeatureSections?: PlanFeatureSection[] } | undefined)
            ?.planFeatureSections ?? [];

    const planItems = [
        { id: "essential" as const, isPopular: false },
        { id: "managementPro" as const, isPopular: true },
        { id: "complete" as const, isPopular: false },
    ];

    return (
        <Tabs
            value={value}
            onValueChange={setValue}
            className="w-full flex justify-center flex-col items-center gap-6"
        >
            <TabsList className="gap-2 justify-center flex-wrap">
                <TabsTrigger value="plans" className="text-[10px] tracking-widest uppercase">
                    {t.pricing.viewPlans}
                </TabsTrigger>
                <TabsTrigger value="calculator" className="text-[10px] tracking-widest uppercase">
                    {t.pricing.viewCalculator}
                </TabsTrigger>
            </TabsList>
            <div className="w-full flex flex-col items-center sm:px-20">
                <div className="flex flex-col items-center gap-6 -mr-10 sm:-mr-12">
                    <div className="flex items-center gap-3">
                        <span className="uppercase tracking-widest text-[10px]">
                            {monthlyLabel}
                        </span>
                        <Switch checked={plansAnnual} onCheckedChange={setPlansAnnual} />
                        <div className="flex items-center gap-1">
                            <span className="uppercase tracking-widest text-[10px]">
                                {annualLabel}
                            </span>
                            <Badge
                                variant="secondary"
                                className={`text-xs ${plansAnnual ? "" : "invisible"}`}
                                aria-hidden={!plansAnnual}
                            >
                                {annualDiscountLabel}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
            <TabsContent
                value="plans"
                className="w-full data-[state=inactive]:hidden sm:px-20"
                forceMount
            >
                <div className="grid md:grid-cols-3 px-0 gap-4 mx-auto">
                    {planItems.map((plan) => {
                        const data = r[plan.id] as {
                            name: string;
                            description: string;
                            pricePerChild: string;
                            from: string;
                            featureIncludedIds?: string[];
                        };
                        const includedSet = new Set(data.featureIncludedIds ?? []);
                        const prices = PLAN_PRICES[plan.id];
                        const fromNumeric = prices
                            ? getFromPriceNumeric(
                                  prices.pricePerChild,
                                  prices.flatMonthly ?? 0,
                                  MIN_MONTHLY,
                                  MIN_CHILDREN,
                              )
                            : null;
                        const monthlyFrom = fromNumeric ?? 0;
                        const annualFrom =
                            fromNumeric != null
                                ? Math.round(fromNumeric * (1 - ANNUAL_DISCOUNT) * 100) / 100
                                : 0;
                        const monthlyFromStr =
                            fromNumeric != null ? formatPrice(monthlyFrom, lang) : "";
                        const annualFromStr =
                            fromNumeric != null ? formatPrice(annualFrom, lang) : "";
                        const monthlyFromLabel =
                            fromNumeric != null
                                ? fromPricePerMonthLabel(monthlyFromStr, lang)
                                : null;
                        const annualFromLabel =
                            fromNumeric != null
                                ? fromPricePerMonthLabel(annualFromStr, lang)
                                : null;
                        const singleFromLabel =
                            fromNumeric != null
                                ? plansAnnual
                                    ? annualFromLabel
                                    : monthlyFromLabel
                                : data.from;
                        const monthlyPricePerChildLabel = prices
                            ? formatPricePerChild(prices.pricePerChild, plan.id, lang)
                            : data.pricePerChild;
                        const annualPricePerChildValue = prices
                            ? Math.round(prices.pricePerChild * (1 - ANNUAL_DISCOUNT) * 100) / 100
                            : 0;
                        const annualPricePerChildLabel = prices
                            ? formatPricePerChild(annualPricePerChildValue, plan.id, lang)
                            : data.pricePerChild;
                        return (
                            <Card
                                key={plan.id}
                                className="rounded bg-card flex flex-col relative h-fit"
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 rounded-bl rounded-tr-sm text-sm flex items-center gap-1">
                                        <Sparkles className="size-3.5" />
                                        {t.pricing.mostPopular}
                                    </div>
                                )}
                                <CardHeader>
                                    <Badge className="text-sm px-3 py-1">{data.name}</Badge>
                                    <CardTitle className="text-xl font-bold mt-2">
                                        {plansAnnual && prices ? (
                                            <span>{annualPricePerChildLabel}</span>
                                        ) : (
                                            monthlyPricePerChildLabel
                                        )}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground pb-4 text-[10px] tracking-widest uppercase">
                                        {plansAnnual && monthlyFromLabel && annualFromLabel ? (
                                            <>
                                                <span className="line-through">
                                                    {monthlyFromLabel}
                                                </span>{" "}
                                                <span>{annualFromLabel}</span>
                                            </>
                                        ) : (
                                            singleFromLabel
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                        {INCLUDED_MODULES_LABEL[lang] ?? INCLUDED_MODULES_LABEL.en}
                                    </p>
                                    <ul className="space-y-2 list-none p-0 m-0">
                                        {planFeatureSections.map((sec) => {
                                            const id = sectionModuleId(sec) ?? "";
                                            const meta = MODULE_META[id];
                                            const Icon = meta?.icon;
                                            const included = includedSet.has(id);
                                            const tokensFn =
                                                TOKENS_PER_MONTH[lang] ?? TOKENS_PER_MONTH.en;
                                            return (
                                                <li
                                                    key={id}
                                                    className={cn(
                                                        "flex items-center gap-2.5",
                                                        !included && "opacity-40 grayscale",
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            "flex-shrink-0 size-7 rounded-lg flex items-center justify-center",
                                                            meta?.iconColor ??
                                                                "bg-muted text-foreground",
                                                        )}
                                                        aria-hidden
                                                    >
                                                        {meta?.iconImage ? (
                                                            <img
                                                                src={meta.iconImage.src}
                                                                alt=""
                                                                className={cn(
                                                                    "size-4",
                                                                    meta.iconImageClass,
                                                                )}
                                                            />
                                                        ) : (
                                                            Icon && <Icon className="size-4" />
                                                        )}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            "text-sm leading-snug",
                                                            !included && "text-muted-foreground",
                                                        )}
                                                    >
                                                        {sec.title}
                                                    </span>
                                                    {id === "ena" && included && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="ml-auto text-[10px]"
                                                        >
                                                            {tokensFn(ENA_TOKENS[plan.id])}
                                                        </Badge>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2 pt-2">
                                    <Button className="w-full" asChild>
                                        <a href={demoUrl}>{t.bookDemo}</a>
                                    </Button>
                                    <Link
                                        href="https://app.edena.es/register-organization"
                                        className="w-full"
                                    >
                                        <Button className="w-full" variant="ghost">
                                            {t.registerButton}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                {planFeatureSections.length > 0 && (
                    <div className="mt-10 flex flex-col gap-10 mx-auto">
                        <div className="flex flex-col gap-4 items-center text-center mx-auto">
                            <h3 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent max-w-lg sm:max-w-2xl">
                                {COMPARE_PLANS_TITLE[lang] ?? COMPARE_PLANS_TITLE.en}
                            </h3>
                            <p className="text-muted-foreground max-w-150">
                                {COMPARE_PLANS_DESCRIPTION[lang] ?? COMPARE_PLANS_DESCRIPTION.en}
                            </p>
                        </div>
                        {/* Mobile: plan switcher + feature list for the selected plan */}
                        <div className="sm:hidden">
                            <Tabs
                                value={comparePlan}
                                onValueChange={(v) =>
                                    setComparePlan(v as "essential" | "managementPro" | "complete")
                                }
                                className="items-center mb-5 sticky top-2 z-10"
                            >
                                <TabsList className="grid w-full grid-cols-3">
                                    {planItems.map((plan) => (
                                        <TabsTrigger key={plan.id} value={plan.id} className="px-2">
                                            {r[plan.id].name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                            <div className="space-y-5">
                                {planFeatureSections.map((sec) => {
                                    const id = sectionModuleId(sec) ?? "";
                                    const meta = MODULE_META[id];
                                    const Icon = meta?.icon;
                                    const includedIds = r[comparePlan].featureIncludedIds ?? [];
                                    const tokensFn = TOKENS_PER_MONTH[lang] ?? TOKENS_PER_MONTH.en;
                                    return (
                                        <div key={id}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className={cn(
                                                        "flex-shrink-0 size-6 rounded flex items-center justify-center",
                                                        meta?.iconColor ??
                                                            "bg-muted text-foreground",
                                                    )}
                                                    aria-hidden
                                                >
                                                    {meta?.iconImage ? (
                                                        <img
                                                            src={meta.iconImage.src}
                                                            alt=""
                                                            className={cn(
                                                                "size-3.5",
                                                                meta.iconImageClass,
                                                            )}
                                                        />
                                                    ) : (
                                                        Icon && <Icon className="size-3.5" />
                                                    )}
                                                </span>
                                                <span className="text-[10px] font-semibold uppercase tracking-widest">
                                                    {sec.title}
                                                </span>
                                            </div>
                                            <ul className="list-none p-0 m-0 divide-y divide-border/60">
                                                {sec.items.map((item, itemIdx) => {
                                                    const included = includedIds.includes(
                                                        item.moduleId,
                                                    );
                                                    return (
                                                        <li
                                                            key={itemIdx}
                                                            className="flex items-center justify-between gap-3 py-2"
                                                        >
                                                            <span className="text-sm text-muted-foreground leading-snug">
                                                                {item.label}
                                                            </span>
                                                            {item.moduleId === "ena" && included ? (
                                                                <span className="text-xs whitespace-nowrap shrink-0">
                                                                    {tokensFn(
                                                                        ENA_TOKENS[comparePlan],
                                                                    )}
                                                                </span>
                                                            ) : included ? (
                                                                <Check
                                                                    className="size-4 shrink-0 text-primary"
                                                                    aria-label="✓"
                                                                />
                                                            ) : (
                                                                <Minus
                                                                    className="size-4 shrink-0 text-muted-foreground/40"
                                                                    aria-label="—"
                                                                />
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Desktop: full comparison table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full min-w-[560px] border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th className="w-[40%] p-3" aria-hidden />
                                        {planItems.map((plan) => (
                                            <th
                                                key={plan.id}
                                                scope="col"
                                                className={cn(
                                                    "p-3 text-center font-semibold rounded-t",
                                                    plan.isPopular && "bg-muted/50",
                                                )}
                                            >
                                                <div className="flex flex-row gap-2 items-center justify-center">
                                                    <span className="text-[10px] tracking-widest uppercase">
                                                        {r[plan.id].name}
                                                    </span>
                                                    {plan.isPopular && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-[10px]"
                                                        >
                                                            <Sparkles className="size-3.5" />
                                                            {t.pricing.mostPopular}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {planFeatureSections.map((sec) => {
                                        const id = sectionModuleId(sec) ?? "";
                                        const meta = MODULE_META[id];
                                        const Icon = meta?.icon;
                                        return (
                                            <React.Fragment key={id}>
                                                <tr>
                                                    <th
                                                        scope="rowgroup"
                                                        className="pt-5 pb-2 px-3 text-left"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    "flex-shrink-0 size-6 rounded flex items-center justify-center",
                                                                    meta?.iconColor ??
                                                                        "bg-muted text-foreground",
                                                                )}
                                                                aria-hidden
                                                            >
                                                                {meta?.iconImage ? (
                                                                    <img
                                                                        src={meta.iconImage.src}
                                                                        alt=""
                                                                        className={cn(
                                                                            "size-3.5",
                                                                            meta.iconImageClass,
                                                                        )}
                                                                    />
                                                                ) : (
                                                                    Icon && (
                                                                        <Icon className="size-3.5" />
                                                                    )
                                                                )}
                                                            </span>
                                                            <span className="text-[10px] font-semibold uppercase tracking-widest">
                                                                {sec.title}
                                                            </span>
                                                        </span>
                                                    </th>
                                                    {planItems.map((plan) => (
                                                        <td
                                                            key={plan.id}
                                                            className={cn(
                                                                "pt-5 pb-2",
                                                                plan.isPopular && "bg-muted/50",
                                                            )}
                                                        />
                                                    ))}
                                                </tr>
                                                {sec.items.map((item, itemIdx) => (
                                                    <tr
                                                        key={itemIdx}
                                                        className="border-t border-border/60"
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="py-2.5 px-3 text-left font-normal text-muted-foreground leading-snug"
                                                        >
                                                            {item.label}
                                                        </th>
                                                        {planItems.map((plan) => {
                                                            const included = (
                                                                r[plan.id].featureIncludedIds ?? []
                                                            ).includes(item.moduleId);
                                                            const tokensFn =
                                                                TOKENS_PER_MONTH[lang] ??
                                                                TOKENS_PER_MONTH.en;
                                                            return (
                                                                <td
                                                                    key={plan.id}
                                                                    className={cn(
                                                                        "py-2.5 px-3 text-center",
                                                                        plan.isPopular &&
                                                                            "bg-muted/50",
                                                                    )}
                                                                >
                                                                    {item.moduleId === "ena" &&
                                                                    included ? (
                                                                        <span className="text-xs whitespace-nowrap">
                                                                            {tokensFn(
                                                                                ENA_TOKENS[plan.id],
                                                                            )}
                                                                        </span>
                                                                    ) : included ? (
                                                                        <Check
                                                                            className="size-4 inline-block text-primary"
                                                                            aria-label="✓"
                                                                        />
                                                                    ) : (
                                                                        <Minus
                                                                            className="size-4 inline-block text-muted-foreground/40"
                                                                            aria-label="—"
                                                                        />
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <p className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => setValue("calculator")}
                        className="text-sm text-primary hover:underline underline-offset-4 bg-transparent p-0 border-0 cursor-pointer"
                    >
                        {r.orCalculate}
                    </button>
                </p>
            </TabsContent>
            <TabsContent
                value="calculator"
                className="sm:px-20 data-[state=inactive]:hidden"
                id="calculator"
                forceMount
            >
                <PricingCalculator
                    t={t.pricing.calculator}
                    demoUrl={demoUrl}
                    contactUrl={`/${lang}/contact`}
                    contactButton={t.navigation.contact}
                    registerButton={t.registerButton}
                    locale={lang}
                    isAnnual={plansAnnual}
                />
            </TabsContent>
        </Tabs>
    );
}
