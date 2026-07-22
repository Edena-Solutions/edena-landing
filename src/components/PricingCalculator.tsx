import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import Link from "@/components/ui/link";
import { intlLocaleForLang } from "@/lib/intl-locale";
import { cn } from "@/lib/utils";
import TopGlow from "@/components/TopGlow";

const BASE_PRICE_PER_CHILD = 1.0;
const MIN_MONTHLY = 44;
const ANNUAL_DISCOUNT = 0.15;
const MIN_CHILDREN = 35;
const VOLUME_THRESHOLD = 200;
const PACK_PER_CHILD = 1.9;
const ONLINE_STORE_FLAT_MONTHLY = 10;

/** Icons + colors match the Products nav (NavigationMenu.tsx) and the plan cards (PricingTabs.tsx) */
const MODULES = [
    {
        key: "communicationPro" as const,
        pricePerChild: 0.1,
        icon: "MessagesSquare",
        iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    },
    {
        key: "extracurricular" as const,
        pricePerChild: 0.1,
        icon: "Sparkles",
        iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    },
    {
        key: "automation" as const,
        pricePerChild: 0.25,
        icon: "Zap",
        iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    },
    {
        key: "tracking" as const,
        pricePerChild: 0.1,
        icon: "Clock",
        iconColor: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
    },
    {
        key: "crm" as const,
        pricePerChild: 0.1,
        icon: "SquareUser",
        iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    {
        key: "billing" as const,
        pricePerChild: 0.2,
        icon: "WalletCards",
        iconColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
        key: "onlineStore" as const,
        pricePerChild: 0,
        icon: "Store",
        flatMonthly: 10 as const,
        iconColor: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
    },
    {
        key: "cloud" as const,
        pricePerChild: 0.25,
        icon: "Cloud",
        iconColor: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    },
] as const;

export type CalculatorTranslations = {
    title: string;
    subtitle: string;
    childrenLabel: string;
    childrenHint: string;
    billingToggle: string;
    billingDescription: string;
    billingHint: string;
    crmToggle: string;
    crmDescription: string;
    crmHint: string;
    trackingToggle: string;
    trackingDescription: string;
    trackingHint: string;
    extracurricularToggle: string;
    extracurricularDescription: string;
    extracurricularHint: string;
    communicationProToggle: string;
    communicationProDescription: string;
    communicationProHint: string;
    automationToggle: string;
    automationDescription: string;
    automationHint: string;
    onlineStoreToggle: string;
    onlineStoreDescription: string;
    onlineStoreHint: string;
    cloudToggle: string;
    cloudDescription: string;
    cloudHint: string;
    packCompleteMessage: string;
    packCompleteDescription: string;
    monthly: string;
    annual: string;
    annualDiscount: string;
    annualSavings: string;
    totalMonthly: string;
    perChild: string;
    totalAnnual: string;
    volumeBadge: string;
    cta: string;
};

interface PricingCalculatorProps {
    t: CalculatorTranslations;
    demoUrl: string;
    contactUrl: string;
    contactButton: string;
    registerButton: string;
    locale?: string;
    className?: string;
    isAnnual: boolean;
}

const CLOSE_LABEL: Record<string, string> = {
    es: "Cerrar",
    ca: "Tanca",
    fr: "Fermer",
    eus: "Itxi",
    en: "Close",
};

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

function formatPrice(value: number, locale: string): string {
    return new Intl.NumberFormat(intlLocaleForLang(locale), {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(round2(value));
}

const MODULE_LABELS: Record<
    string,
    {
        titleKey: keyof CalculatorTranslations;
        descriptionKey: keyof CalculatorTranslations;
        hintKey: keyof CalculatorTranslations;
        extraKey?: keyof CalculatorTranslations;
    }
> = {
    billing: {
        titleKey: "billingToggle",
        descriptionKey: "billingDescription",
        hintKey: "billingHint",
    },
    crm: { titleKey: "crmToggle", descriptionKey: "crmDescription", hintKey: "crmHint" },
    tracking: {
        titleKey: "trackingToggle",
        descriptionKey: "trackingDescription",
        hintKey: "trackingHint",
    },
    extracurricular: {
        titleKey: "extracurricularToggle",
        descriptionKey: "extracurricularDescription",
        hintKey: "extracurricularHint",
    },
    communicationPro: {
        titleKey: "communicationProToggle",
        descriptionKey: "communicationProDescription",
        hintKey: "communicationProHint",
    },
    automation: {
        titleKey: "automationToggle",
        descriptionKey: "automationDescription",
        hintKey: "automationHint",
    },
    onlineStore: {
        titleKey: "onlineStoreToggle",
        descriptionKey: "onlineStoreDescription",
        hintKey: "onlineStoreHint",
    },
    cloud: { titleKey: "cloudToggle", descriptionKey: "cloudDescription", hintKey: "cloudHint" },
};

export function PricingCalculator({
    t,
    demoUrl,
    contactUrl,
    contactButton,
    registerButton,
    locale = "es",
    className,
    isAnnual,
}: PricingCalculatorProps) {
    const [children, setChildren] = React.useState(MIN_CHILDREN);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [sheetClosing, setSheetClosing] = React.useState(false);

    const closeSheet = React.useCallback(() => {
        setSheetClosing(true);
        window.setTimeout(() => {
            setSheetOpen(false);
            setSheetClosing(false);
        }, 200);
    }, []);
    const [modules, setModules] = React.useState<Record<string, boolean>>({
        billing: false,
        crm: false,
        tracking: false,
        extracurricular: false,
        communicationPro: false,
        automation: false,
        onlineStore: false,
        cloud: false,
    });

    const effectiveChildren = Math.max(MIN_CHILDREN, Math.round(Number(children)) || MIN_CHILDREN);
    const allModulesSelected = MODULES.every((m) => modules[m.key]);

    const pricePerChild = React.useMemo(() => {
        if (allModulesSelected) return round2(PACK_PER_CHILD);
        let total = BASE_PRICE_PER_CHILD;
        MODULES.forEach((m) => {
            if (modules[m.key]) total += m.pricePerChild;
        });
        return round2(total);
    }, [modules, allModulesSelected]);

    const onlineStoreFlat = modules.onlineStore ? ONLINE_STORE_FLAT_MONTHLY : 0;
    const rawMonthly = round2(pricePerChild * effectiveChildren + onlineStoreFlat);
    const monthlyTotal = round2(Math.max(MIN_MONTHLY, rawMonthly));
    const discountMultiplier = isAnnual ? 1 - ANNUAL_DISCOUNT : 1;
    const displayMonthly = round2(monthlyTotal * discountMultiplier);
    const annualTotal = round2(displayMonthly * 12);
    const annualSavings = isAnnual ? round2(monthlyTotal * ANNUAL_DISCOUNT * 12) : 0;
    const showVolumeBadge = effectiveChildren > VOLUME_THRESHOLD;

    const setModuleChecked = (key: string, checked: boolean) => {
        setModules((prev) => ({ ...prev, [key]: checked }));
    };

    const selectedModules = MODULES.filter((m) => modules[m.key]);
    const closeLabel = CLOSE_LABEL[locale] ?? CLOSE_LABEL.en;

    const packCompleteBanner = allModulesSelected && (
        <div
            className="relative overflow-hidden rounded-lg bg-card border border-border p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-300"
            role="status"
        >
            <TopGlow />
            <div className="relative z-10 text-white">
                <p className="text-[10px] uppercase tracking-widest font-semibold">
                    {t.packCompleteMessage}
                </p>
                <p className="mt-1">{t.packCompleteDescription}</p>
            </div>
        </div>
    );

    const renderSummaryCard = (inputId: string, isSheetOpen?: boolean) => (
        <Card className={cn("rounded", isSheetOpen && "bg-background")}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-widest mb-0">
                    {t.totalMonthly}
                </CardTitle>
                <CardDescription className="sr-only">
                    {t.perChild}, {t.totalAnnual}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="space-y-2">
                    <label
                        htmlFor={inputId}
                        className="text-[10px] uppercase tracking-widest leading-none"
                    >
                        {t.childrenLabel}
                    </label>
                    <Input
                        id={inputId}
                        type="number"
                        min={MIN_CHILDREN}
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value) || MIN_CHILDREN)}
                    />
                    <p className="text-xs text-muted-foreground">{t.childrenHint}</p>
                </div>
                {selectedModules.length > 0 && (
                    <ul className="list-none p-0 m-0 space-y-1.5">
                        {selectedModules.map((m) => {
                            const labels = MODULE_LABELS[m.key];
                            return (
                                <li
                                    key={m.key}
                                    className="flex items-center gap-2 animate-in fade-in slide-in-from-left-1 duration-200"
                                >
                                    <span
                                        className={cn(
                                            "flex-shrink-0 size-6 rounded flex items-center justify-center",
                                            m.iconColor,
                                        )}
                                        aria-hidden
                                    >
                                        <Icon name={m.icon} size={14} />
                                    </span>
                                    <span className="flex-1 truncate text-xs">
                                        {t[labels.titleKey]}
                                    </span>
                                    <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                                        {m.pricePerChild > 0
                                            ? `+${formatPrice(m.pricePerChild, locale)}`
                                            : `+${formatPrice(ONLINE_STORE_FLAT_MONTHLY, locale)}/mes`}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <div className="flex items-baseline gap-2">
                    <span
                        className="text-3xl font-bold tabular-nums transition-all duration-300 ease-out"
                        data-value={displayMonthly}
                    >
                        {formatPrice(displayMonthly, locale)}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                </div>
                <p className="text-[10px] tracking-widest uppercase">
                    {t.perChild}:{" "}
                    {isAnnual ? (
                        <>
                            <span className="line-through">
                                {formatPrice(pricePerChild, locale)}
                            </span>{" "}
                            {formatPrice(round2(pricePerChild * (1 - ANNUAL_DISCOUNT)), locale)}
                        </>
                    ) : (
                        formatPrice(pricePerChild, locale)
                    )}
                </p>
                {isAnnual && (
                    <div className="space-y-1 pt-4">
                        <p className="text-[10px] uppercase tracking-widest">
                            {t.totalAnnual}: {formatPrice(annualTotal, locale)}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest">
                            {t.annualSavings}: {formatPrice(annualSavings, locale)}
                        </p>
                    </div>
                )}
                {showVolumeBadge && (
                    <div className="space-y-2">
                        <Badge variant="secondary" className="w-full justify-center py-1.5">
                            {t.volumeBadge}
                        </Badge>
                        <Button asChild className="w-full">
                            <a href={contactUrl}>{contactButton}</a>
                        </Button>
                    </div>
                )}
                <Button asChild className="w-full" size="lg">
                    <a href={demoUrl}>{t.cta}</a>
                </Button>
                <Link href="https://app.edena.es/register-organization">
                    <Button className="w-full" variant="ghost">
                        {registerButton}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );

    return (
        <div className={cn("grid gap-8 lg:grid-cols-[1fr_380px] pb-20 lg:pb-0", className)}>
            <div className="order-2 lg:order-1 space-y-6">
                <Card className="rounded">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xs uppercase tracking-widest">
                            {t.title}
                        </CardTitle>
                        <CardDescription>{t.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            {MODULES.map((module) => {
                                const labels = MODULE_LABELS[module.key];
                                const title = t[labels.titleKey];
                                const description = t[labels.descriptionKey];
                                const hint = t[labels.hintKey];
                                const extra = labels.extraKey ? t[labels.extraKey] : null;
                                const checked = modules[module.key];
                                return (
                                    <div
                                        key={module.key}
                                        className={`group cursor-pointer relative w-full overflow-hidden rounded-[0.3em] bg-background p-[2px] transition-all duration-300 ease-in-out hover-gradient-primary hover:bg-gradient-to-r`}
                                        onClick={() => setModuleChecked(module.key, !checked)}
                                    >
                                        <div className="group-hover:animate-spin-slow invisible absolute -top-40 -bottom-40 left-10 right-10 bg-gradient-to-r from-transparent via-white/90 to-transparent group-hover:visible" />
                                        <Card
                                            key={module.key}
                                            role="button"
                                            tabIndex={0}
                                            className="relative rounded flex flex-col p-6 bg-background justify-between h-full"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    setModuleChecked(module.key, !checked);
                                                }
                                            }}
                                        >
                                            <div>
                                                <CardHeader className="p-0 flex flex-col">
                                                    <div className="flex items-start justify-between gap-2 mb-4">
                                                        <div
                                                            className={cn(
                                                                "flex w-fit p-4 rounded",
                                                                module.iconColor,
                                                            )}
                                                        >
                                                            <Icon name={module.icon} size={20} />
                                                        </div>
                                                        <Checkbox
                                                            checked={checked}
                                                            onCheckedChange={(value) =>
                                                                setModuleChecked(
                                                                    module.key,
                                                                    value === true,
                                                                )
                                                            }
                                                            onClick={(e) => e.stopPropagation()}
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                            aria-label={title}
                                                        />
                                                    </div>
                                                    <h3 className="uppercase tracking-widest text-[10px] font-semibold">
                                                        {title}
                                                    </h3>
                                                </CardHeader>
                                                <CardContent className="px-0">
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {description}
                                                    </p>
                                                </CardContent>
                                            </div>
                                            <CardFooter className="p-0 flex flex-col gap-1 items-start">
                                                {extra && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {extra}
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    {hint}
                                                </p>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop: sticky sidebar summary */}
            <div className="hidden lg:flex lg:order-2 lg:sticky lg:top-24 lg:self-start flex-col gap-4">
                {renderSummaryCard("children")}
                {packCompleteBanner}
            </div>

            {/* Mobile: fixed bottom bar + bottom sheet with the full breakdown */}
            <div className="lg:hidden">
                {sheetOpen && (
                    <>
                        <div
                            className={cn(
                                "fixed inset-0 z-40 bg-black/40 duration-200",
                                sheetClosing
                                    ? "animate-out fade-out fill-mode-forwards"
                                    : "animate-in fade-in",
                            )}
                            onClick={closeSheet}
                            aria-hidden
                        />
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={t.totalMonthly}
                            className={cn(
                                "fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl",
                                sheetClosing
                                    ? "animate-out slide-out-to-bottom duration-200 fill-mode-forwards"
                                    : "animate-in slide-in-from-bottom duration-300",
                            )}
                        >
                            <button
                                type="button"
                                onClick={closeSheet}
                                aria-label={closeLabel}
                                className="mx-auto mb-3 block h-1.5 w-10 rounded bg-muted-foreground/30 border-0 p-0 cursor-pointer"
                            />
                            <div className="flex flex-col gap-4">
                                {renderSummaryCard("children-mobile", true)}
                                {packCompleteBanner}
                            </div>
                        </div>
                    </>
                )}
                {!sheetOpen && (
                    <div
                        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3"
                        onClick={() => setSheetOpen(true)}
                    >
                        <button
                            type="button"
                            className="flex-1 flex items-center gap-3 min-w-0 bg-transparent border-0 p-0 cursor-pointer text-left"
                            aria-expanded={sheetOpen}
                        >
                            <span className="flex flex-col min-w-0">
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                                    {t.totalMonthly}
                                </span>
                                <span className="text-lg font-bold tabular-nums leading-tight">
                                    {formatPrice(displayMonthly, locale)}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        /mes
                                    </span>
                                </span>
                            </span>
                        </button>
                        {selectedModules.length > 0 && (
                            <span className="flex -space-x-1.5 shrink-0" aria-hidden>
                                {selectedModules.map((m) => (
                                    <span
                                        key={m.key}
                                        className={cn(
                                            "size-6 rounded ring-2 ring-background flex items-center justify-center",
                                            m.iconColor,
                                        )}
                                    >
                                        <Icon name={m.icon} size={12} />
                                    </span>
                                ))}
                            </span>
                        )}
                        <Icon
                            name="ChevronUp"
                            size={18}
                            className="text-muted-foreground ml-auto shrink-0"
                        />
                        <Button asChild size="sm" className="shrink-0">
                            <a href={demoUrl}>{t.cta}</a>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
