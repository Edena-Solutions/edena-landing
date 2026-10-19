import { useState } from "react";
import { Sparkles } from "lucide-react";

import { PACKS, annualPrice, formatPrice, type AcademyPackId } from "@/constants/pricing";
import { ModuleIcon } from "@/modules/pricing/ModuleIcon";
import { cn } from "@/lib/utils";

/*
 * The academy packs, side by side, with the billing cadence above them: a segmented control whose
 * thumb slides between monthly and annual. Changing it swaps every price in place — the new figure
 * rises in, the monthly one stays struck through beside it. The popular pack stands forward, ringed
 * in the brand's gradient.
 *
 * It takes only the words it shows (not the whole dictionary), so the island stays small.
 */

interface PackCopy {
    name: string;
    tagline: string;
    bestFor: string;
}

export interface AcademyPacksCopy {
    items: Record<AcademyPackId, PackCopy>;
    includes: string;
    bestFor: string;
    perStudent: string;
    mostPopular: string;
    monthly: string;
    annual: string;
    annualDiscount: string;
    bookDemo: string;
    startNow: string;
    /** Module titles by id. */
    modules: Record<string, string>;
    tokens: string;
}

interface Props {
    copy: AcademyPacksCopy;
    lang: string;
    demoUrl: string;
    registerUrl: string;
}

function CadenceToggle({
    annual,
    onChange,
    copy,
}: {
    annual: boolean;
    onChange: (annual: boolean) => void;
    copy: AcademyPacksCopy;
}) {
    const options = [
        { value: false, label: copy.monthly },
        { value: true, label: copy.annual },
    ];
    return (
        <div
            role="radiogroup"
            aria-label={`${copy.monthly} / ${copy.annual}`}
            className="relative grid grid-cols-2 rounded-full bg-fill-2 p-1 ring-1 ring-hairline"
        >
            {/* The thumb, sliding to the chosen half. */}
            <span
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface elev-2 transition-transform duration-500 ease-spring"
                style={{ transform: annual ? "translateX(100%)" : "none" }}
            />
            {options.map((option) => {
                const selected = option.value === annual;
                return (
                    <button
                        key={option.label}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "cursor-pointer relative flex h-10 min-w-[8.5rem] items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]",
                            selected ? "text-ink" : "text-ink-2 hover:text-ink",
                        )}
                    >
                        {option.label}
                        {option.value && (
                            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap text-brand-ink">
                                {copy.annualDiscount}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default function AcademyPacks({ copy, lang, demoUrl, registerUrl }: Props) {
    const [annual, setAnnual] = useState(false);
    // Prices only animate once someone has changed the cadence — not as the page loads.
    const [touched, setTouched] = useState(false);
    const choose = (next: boolean) => {
        setTouched(true);
        setAnnual(next);
    };

    return (
        <div className="flex flex-col items-center gap-10">
            <CadenceToggle annual={annual} onChange={choose} copy={copy} />

            <div className="grid w-full gap-4 lg:grid-cols-3 lg:items-stretch">
                {PACKS.map((pack) => {
                    const data = copy.items[pack.id];
                    const monthly = formatPrice(pack.pricePerStudent, lang);
                    const price = annual
                        ? formatPrice(annualPrice(pack.pricePerStudent), lang)
                        : monthly;
                    const popular = !!pack.isPopular;
                    return (
                        <article
                            key={pack.id}
                            className={cn(
                                "relative flex flex-col rounded-tile",
                                // The popular pack: a hairline of the brand's gradient round a raised card.
                                popular ? "p-[1.5px] elev-3" : "",
                            )}
                            style={popular ? { background: "var(--ds-brand-gradient)" } : undefined}
                        >
                            <div
                                className={cn(
                                    "flex h-full flex-col rounded-[calc(var(--radius-tile)-1.5px)] p-7 sm:p-8",
                                    popular ? "bg-surface" : "bg-canvas-2",
                                )}
                            >
                                {/* The badge sits on the card's top edge, centred on the gradient ring. */}
                                {popular && (
                                    <span
                                        className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-3 py-1 text-[0.75rem] font-semibold whitespace-nowrap text-black elev-2"
                                        style={{ background: "var(--ds-brand-gradient)" }}
                                    >
                                        <Sparkles className="size-3.5" />
                                        {copy.mostPopular}
                                    </span>
                                )}
                                <h3 className="type-title-2 text-ink">{data.name}</h3>
                                <p className="mt-3 type-callout text-ink-2">{data.tagline}</p>

                                <p className="mt-7 flex items-baseline gap-2.5">
                                    <span
                                        key={price}
                                        className={cn(
                                            "text-[2.75rem] font-semibold leading-none tracking-[-0.045em] tabular-nums text-ink",
                                            touched && "animate-ds-scene-fade-in",
                                        )}
                                    >
                                        {price}
                                    </span>
                                    <span
                                        className={cn(
                                            "type-callout tabular-nums text-ink-3 line-through transition-opacity duration-300",
                                            annual ? "opacity-100" : "opacity-0",
                                        )}
                                        aria-hidden={!annual}
                                    >
                                        {monthly}
                                    </span>
                                </p>
                                <p className="mt-2 type-footnote text-ink-3">{copy.perStudent}</p>

                                <p className="mt-6 rounded-[1rem] bg-fill-2 px-4 py-3 type-footnote text-ink-2">
                                    <span className="font-semibold text-ink">{copy.bestFor}</span>{" "}
                                    {data.bestFor}
                                </p>

                                <p className="mt-7 type-footnote font-semibold text-ink-2">
                                    {copy.includes}
                                </p>
                                <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
                                    {pack.modules.map((moduleId) => (
                                        <li
                                            key={moduleId}
                                            className="flex items-center gap-1.5 rounded-full bg-fill-2 py-1 pl-1 pr-3"
                                        >
                                            <ModuleIcon
                                                moduleId={moduleId}
                                                className="size-6 !shadow-none"
                                            />
                                            <span className="text-[0.8125rem] font-medium text-ink">
                                                {copy.modules[moduleId] ?? moduleId}
                                                {moduleId === "ena" && (
                                                    <span className="font-normal text-ink-3">
                                                        {" "}
                                                        ·{" "}
                                                        {copy.tokens.replace("{n}", pack.enaTokens)}
                                                    </span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto flex flex-col gap-2 pt-8">
                                    <a
                                        href={demoUrl}
                                        className={cn(
                                            "ds-btn w-full",
                                            popular ? "ds-btn--primary" : "ds-btn--secondary",
                                        )}
                                    >
                                        {copy.bookDemo}
                                    </a>
                                    <a
                                        href={registerUrl}
                                        className="ds-link justify-center py-2 type-callout"
                                    >
                                        {copy.startNow}
                                    </a>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
