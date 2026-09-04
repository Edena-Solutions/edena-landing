import * as React from "react";
import { Check, Sparkles } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "@/components/ui/link";
import {
    MODULE_META,
    PACKS,
    annualPrice,
    formatPrice,
    moduleSectionsById,
    type PlanFeatureSection,
} from "@/constants/pricing";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";

const TOKENS_PER_MONTH: Record<string, (tokens: string) => string> = {
    es: (n) => `${n} tokens/mes`,
    ca: (n) => `${n} tokens/mes`,
    fr: (n) => `${n} tokens/mois`,
    eus: (n) => `${n} token/hilean`,
    en: (n) => `${n} tokens/mo`,
};

function moduleTitle(sections: Record<string, PlanFeatureSection>, moduleId: string): string {
    return sections[moduleId]?.title ?? moduleId;
}

/** Coloured icon tile for a module, sized by the caller. */
function ModuleTile({
    moduleId,
    className,
    iconClassName,
}: {
    moduleId: string;
    className: string;
    iconClassName: string;
}) {
    const meta = MODULE_META[moduleId];
    const Icon = meta?.icon;
    return (
        <span
            className={cn(
                "flex flex-shrink-0 items-center justify-center rounded-lg",
                meta?.iconColor ?? "bg-muted text-foreground",
                className,
            )}
            aria-hidden
        >
            {meta?.iconImage ? (
                <img
                    src={meta.iconImage.src}
                    alt=""
                    className={cn(iconClassName, meta.iconImageClass)}
                />
            ) : (
                Icon && <Icon className={iconClassName} />
            )}
        </span>
    );
}

interface PricingPacksProps {
    t: Translation;
    lang: string;
    demoUrl: string;
    registerUrl: string;
}

export function PricingPacks({ t, lang, demoUrl, registerUrl }: PricingPacksProps) {
    const [isAnnual, setIsAnnual] = React.useState(false);
    const packsT = t.pricing.packs;
    const calcT = t.pricing.calculator;
    const sections = moduleSectionsById(
        (t.pricing as { planFeatureSections?: PlanFeatureSection[] }).planFeatureSections ?? [],
    );
    const tokensLabel = TOKENS_PER_MONTH[lang] ?? TOKENS_PER_MONTH.en;

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 px-0 sm:px-4">
            <ul className="m-0 grid w-full list-none gap-4 p-0 sm:grid-cols-3">
                {packsT.notes.map((note) => (
                    <li key={note.title} className="flex items-start gap-2.5">
                        <span
                            className="mt-0.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-muted"
                            aria-hidden
                        >
                            <Check className="size-3 text-foreground" />
                        </span>
                        <span className="text-sm leading-snug">
                            <span className="font-semibold">{note.title}.</span>{" "}
                            <span className="text-muted-foreground">{note.description}</span>
                        </span>
                    </li>
                ))}
            </ul>

            <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="justify-self-end uppercase tracking-widest text-[10px]">
                    {calcT.monthly}
                </span>
                <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
                <div className="flex items-center gap-1.5 justify-self-start">
                    <span className="uppercase tracking-widest text-[10px]">{calcT.annual}</span>
                    <Badge
                        variant="secondary"
                        className={cn("whitespace-nowrap text-xs", !isAnnual && "invisible")}
                        aria-hidden={!isAnnual}
                    >
                        {calcT.annualDiscount}
                    </Badge>
                </div>
            </div>

            <div className="grid w-full gap-4 md:grid-cols-3">
                {PACKS.map((pack) => {
                    const data = packsT.items[pack.id];
                    const monthly = formatPrice(pack.pricePerStudent, lang);
                    const annual = formatPrice(annualPrice(pack.pricePerStudent), lang);
                    return (
                        <Card
                            key={pack.id}
                            // `h-full`, not `h-fit`: grid cells already stretch to the tallest
                            // card, and only a full-height card gives `mt-auto` on the footer the
                            // slack it needs to pin the buttons to the bottom of every card.
                            className="relative flex h-full flex-col rounded bg-card"
                        >
                            {pack.isPopular && (
                                <div className="absolute top-0 right-0 flex items-center gap-1 rounded-tr-sm rounded-bl bg-primary px-4 py-1 text-sm text-primary-foreground">
                                    <Sparkles className="size-3.5" />
                                    {t.pricing.mostPopular}
                                </div>
                            )}
                            <CardHeader className="gap-0">
                                <Badge className="text-sm px-3 py-1">{data.name}</Badge>
                                <CardTitle className="mt-4 flex items-baseline gap-2 text-3xl font-bold">
                                    {isAnnual ? annual : monthly}
                                    {isAnnual && (
                                        <span className="text-base font-normal text-muted-foreground line-through">
                                            {monthly}
                                        </span>
                                    )}
                                </CardTitle>
                                <p className="mt-1 text-[10px] tracking-widest uppercase text-muted-foreground">
                                    {t.pricing.perStudent}
                                </p>
                                <CardDescription className="pt-4 pb-4 text-sm leading-snug">
                                    {data.tagline}
                                </CardDescription>
                                <p className="mb-5 rounded bg-muted p-3 text-xs leading-snug text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                        {packsT.bestFor}
                                    </span>{" "}
                                    {data.bestFor}
                                </p>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    {packsT.includes}
                                </p>
                                {/* Mobile keeps the labelled list: tooltips need a hover. */}
                                <ul className="m-0 grid list-none gap-2 p-0 sm:hidden">
                                    {pack.modules.map((moduleId) => (
                                        <li key={moduleId} className="flex items-center gap-2.5">
                                            <ModuleTile
                                                moduleId={moduleId}
                                                className="size-9"
                                                iconClassName="size-5"
                                            />
                                            <span className="text-sm leading-snug">
                                                {moduleTitle(sections, moduleId)}
                                            </span>
                                            {moduleId === "ena" && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-auto text-[10px]"
                                                >
                                                    {tokensLabel(pack.enaTokens)}
                                                </Badge>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {/* From sm up: icons only, with the module name on hover. */}
                                <div className="hidden sm:flex sm:flex-col sm:gap-3">
                                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                                        {pack.modules.map((moduleId) => {
                                            const title = moduleTitle(sections, moduleId);
                                            return (
                                                <li key={moduleId}>
                                                    <Tooltip>
                                                        <TooltipTrigger
                                                            aria-label={title}
                                                            className="block cursor-default rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        >
                                                            <ModuleTile
                                                                moduleId={moduleId}
                                                                className="size-11"
                                                                iconClassName="size-6"
                                                            />
                                                        </TooltipTrigger>
                                                        {/* Bordered: the tooltip sits on a same-colour card. */}
                                                        <TooltipContent>{title}</TooltipContent>
                                                    </Tooltip>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    <Badge variant="secondary" className="text-[10px]">
                                        {moduleTitle(sections, "ena")} ·{" "}
                                        {tokensLabel(pack.enaTokens)}
                                    </Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto flex flex-col gap-2 pt-2">
                                <Button className="w-full" asChild>
                                    <a href={demoUrl}>{t.bookDemo}</a>
                                </Button>
                                <Link href={registerUrl} className="w-full hover:no-underline">
                                    <Button className="w-full" variant="ghost">
                                        {t.pricing.startNow}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
