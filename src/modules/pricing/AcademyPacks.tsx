import { useState } from "react";

import { PACKS, annualPrice, formatPrice, type AcademyPackId } from "@/constants/pricing";
import { ModuleIcon } from "@/modules/pricing/ModuleIcon";
import { cn } from "@/lib/utils";

/*
 * The academy packs, side by side, with the billing cadence above them: a segmented control whose
 * thumb slides between monthly and annual. Changing it swaps every price in place — the new figure
 * rises in, the monthly one stays struck through beside it. The popular pack stands forward on a
 * quiet wash of the brand's light — no coloured stroke.
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
                            className={cn("relative flex flex-col", popular && "isolate")}
                        >
                            {/*
                                Light behind the card, not a border around it: a wide, soft bloom of
                                the brand's greens, the way a product sits in Apple's photography.
                            */}
                            {popular && (
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 blur-3xl"
                                    style={{
                                        background:
                                            "radial-gradient(ellipse 75% 65% at 50% 42%, rgb(163 230 53 / 0.55), rgb(34 197 94 / 0.22) 46%, rgb(20 184 166 / 0.08) 68%, transparent 78%)",
                                    }}
                                />
                            )}
                            <div
                                className={cn(
                                    "flex h-full flex-col rounded-tile p-7 sm:p-8",
                                    popular ? "bg-surface ring-1 ring-hairline elev-3" : "bg-canvas-2",
                                )}
                            >
                                {popular && (
                                    <p className="mb-5">
                                        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.01em] text-brand-ink">
                                            {copy.mostPopular}
                                        </span>
                                    </p>
                                )}
                                <h2 className="type-title-2 text-ink">{data.name}</h2>
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
