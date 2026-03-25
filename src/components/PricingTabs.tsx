import * as React from "react";
import { Check, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ANNUAL_DISCOUNT = 0.15;

const MIN_CHILDREN = 35;
const MIN_MONTHLY = 44;

const PLAN_PRICES: Record<string, { pricePerChild: number; flatMonthly?: number }> = {
    essential: { pricePerChild: 1.22 },
    managementPro: { pricePerChild: 1.52 },
    complete: { pricePerChild: 2.12, flatMonthly: 10 },
};

function getFromPriceNumeric(
    pricePerChild: number,
    flatMonthly: number,
    minMonthly: number,
    minChildren: number,
): number {
    const raw = Math.round((pricePerChild * minChildren + flatMonthly) * 100) / 100;
    return Math.max(minMonthly, raw);
}

function formatPrice(value: number, locale: string): string {
    return new Intl.NumberFormat(locale === "en" ? "en-GB" : "es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

type PlanFeatureModuleItem = { moduleId: string; label: string };
type PlanFeatureSection = { title: string; items: PlanFeatureModuleItem[] };

function buildPlanFeatureBlocks(
    sections: PlanFeatureSection[] | undefined,
    includedIds: string[] | undefined,
): {
    included: { title: string; items: { label: string }[] }[];
    excluded: { title: string; items: { label: string }[] }[];
} {
    const set = new Set(includedIds ?? []);
    const included: { title: string; items: { label: string }[] }[] = [];
    const excluded: { title: string; items: { label: string }[] }[] = [];
    for (const sec of sections ?? []) {
        const incItems = sec.items
            .filter((i) => set.has(i.moduleId))
            .map((i) => ({ label: i.label }));
        const excItems = sec.items
            .filter((i) => !set.has(i.moduleId))
            .map((i) => ({ label: i.label }));
        if (incItems.length > 0) included.push({ title: sec.title, items: incItems });
        if (excItems.length > 0) excluded.push({ title: sec.title, items: excItems });
    }
    return { included, excluded };
}

function formatPricePerChild(value: number, planId: string, locale: string): string {
    const formatted = formatPrice(value, locale);
    if (planId === "complete") {
        return locale === "es" ? `${formatted}/niño + 10€/mes` : `${formatted}/child + €10/month`;
    }
    return locale === "es" ? `${formatted} por niño` : `${formatted} per child`;
}

interface PricingTabsProps {
    t: Translation;
    lang: string;
}

export function PricingTabs({ t, lang }: PricingTabsProps) {
    const [value, setValue] = React.useState("plans");
    const [plansAnnual, setPlansAnnual] = React.useState(false);
    const demoUrl = `/demo`;
    const calcT = t.pricing?.calculator;
    const monthlyLabel = calcT?.monthly ?? (lang === "es" ? "Mensual" : "Monthly");
    const annualLabel = calcT?.annual ?? (lang === "es" ? "Anual" : "Annual");
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
            className="w-full flex justify-center flex-col items-center gap-10"
        >
            <TabsList className="gap-2 justify-center flex-wrap">
                <TabsTrigger value="plans" className="text-[10px] tracking-widest uppercase">
                    {t.pricing.viewPlans}
                </TabsTrigger>
                <TabsTrigger value="calculator" className="text-[10px] tracking-widest uppercase">
                    {t.pricing.viewCalculator}
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="plans"
                className="w-full data-[state=inactive]:hidden sm:px-20"
                forceMount
            >
                <div className="flex flex-col items-center gap-6 mb-8 -mr-10 sm:-mr-12">
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
                <div className="grid md:grid-cols-3 px-0 gap-4 mx-auto">
                    {planItems.map((plan) => {
                        const data = r[plan.id] as {
                            name: string;
                            description: string;
                            pricePerChild: string;
                            from: string;
                            featureIncludedIds?: string[];
                        };
                        const { included: includedBlocks, excluded: excludedBlocks } =
                            buildPlanFeatureBlocks(planFeatureSections, data.featureIncludedIds);
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
                                ? lang === "es"
                                    ? `Desde ${monthlyFromStr} al mes`
                                    : `From ${monthlyFromStr}/month`
                                : null;
                        const annualFromLabel =
                            fromNumeric != null
                                ? lang === "es"
                                    ? `Desde ${annualFromStr} al mes`
                                    : `From ${annualFromStr}/month`
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
                                    <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 rounded-bl rounded-tr-sm text-sm font-medium">
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
                                <CardContent>
                                    <div className="space-y-3">
                                        {includedBlocks.map((block, blockIdx) => (
                                            <div
                                                key={`inc-${block.title}-${blockIdx}`}
                                                className={cn(blockIdx > 0 && "pt-1")}
                                            >
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">
                                                    {block.title}
                                                </p>
                                                <ul className="space-y-1.5 list-none p-0 m-0">
                                                    {block.items.map((item, itemIdx) => (
                                                        <li
                                                            key={itemIdx}
                                                            className="flex gap-2 items-start"
                                                        >
                                                            <Check
                                                                className="size-3 mt-1 shrink-0 text-primary"
                                                                aria-hidden
                                                            />
                                                            <span className="text-sm hyphens-auto leading-snug">
                                                                {item.label}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                        {excludedBlocks.length > 0 && (
                                            <>
                                                {excludedBlocks.map((block, blockIdx) => (
                                                    <div
                                                        key={`exc-${block.title}-${blockIdx}`}
                                                        className={cn(blockIdx > 0 && "pt-1")}
                                                    >
                                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                                                            {block.title}
                                                        </p>
                                                        <ul className="space-y-1.5 list-none p-0 m-0">
                                                            {block.items.map((item, itemIdx) => (
                                                                <li
                                                                    key={itemIdx}
                                                                    className="flex gap-2 items-start"
                                                                >
                                                                    <X
                                                                        className="size-3 mt-1 shrink-0 text-muted-foreground"
                                                                        aria-hidden
                                                                    />
                                                                    <span className="text-sm hyphens-auto leading-snug text-muted-foreground">
                                                                        {item.label}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2 pt-2">
                                    <Button className="w-full" asChild>
                                        <a href={demoUrl}>{t.bookDemo}</a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                <p className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => setValue("calculator")}
                        className="text-sm font-medium text-primary hover:underline underline-offset-4 bg-transparent p-0 border-0 cursor-pointer"
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
                <PricingCalculator t={t.pricing.calculator} demoUrl={demoUrl} locale={lang} />
            </TabsContent>
        </Tabs>
    );
}
