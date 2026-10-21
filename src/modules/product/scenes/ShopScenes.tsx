import type { ReactNode } from "react";
import { ChevronLeft, CreditCard, Plus, ReceiptText } from "lucide-react";

import { PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Line, Pop, course, easeOut, fill, money, on, span, typed } from "@/components/wizard/scene-kit";
import { DrawnCheck, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    Caps,
    Caret,
    DUO,
    DUO_PANE_RIGHT,
    DUO_PHONE_LEFT,
    Fresh,
    Lights,
    Morph,
    Pane,
    Pill,
    ProductArt,
    SOLO,
    SOLO_PHONE,
    TRIO,
    TRIO_PHONE,
    Toggle,
    TrioFloat,
    TrioStage,
    between,
    type ProductKind,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

export type ShopLabels = ProductSceneLabels & { s: Translation["shopScenes"] };

/*
 * The shop page's scenes, drawn from `screenshots/shop/*` and `app/shop_*`:
 *
 *   trio      (hero) the shop on three phones: the catalogue, a product put in the cart, the
 *             cart paid; what was added and the order's notification float out between them
 *   quick     two taps: a product added, paid with the card already saved
 *   admin     the school's catalogue: a new article written, priced and published to the app
 *   product   a product's page: its pictures, sizes and what's left of each
 *   checkout  a cart paid on the phone; behind it, the order lands in the school's orders and
 *             the stock goes down
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ShopLabels;
    locale: string;
}

const W = CONTENT.w;
/** The catalogue, as the app sells it: names are `s.products`, in this order. */
const PRODUCTS: { kind: ProductKind; price: number }[] = [
    { kind: "paper", price: 4 },
    { kind: "hoodie", price: 31 },
    { kind: "trousers", price: 30 },
    { kind: "books", price: 120 },
    { kind: "backpack", price: 24 },
    { kind: "scissors", price: 3.5 },
];
const SIZES = ["S", "M", "L", "XL"];
const P = TRIO_PHONE;

/** A product on the catalogue's grid: its picture, its name, its price. */
function Tile({ index, labels, locale, className, children }: { index: number; labels: ShopLabels; locale: string; className?: string; children?: ReactNode }) {
    const product = PRODUCTS[index];
    return (
        <span className={cn("relative flex flex-col gap-[0.25em]", className)}>
            <ProductArt kind={product.kind} className="aspect-square w-full rounded-[0.45em]" />
            <span className="truncate text-[0.36em] font-bold uppercase tracking-[0.06em]">{labels.s.products[index]}</span>
            <span className="text-[0.36em] tabular-nums text-ink-2">{money(locale, product.price, 2)}</span>
            {children}
        </span>
    );
}

function SizePicker({ chosen, className }: { chosen: number; className?: string }) {
    return (
        <span className={cn("flex gap-[0.35em]", className)}>
            {SIZES.map((size, index) => (
                <span
                    key={size}
                    className={cn(
                        "grid h-[1.45em] min-w-[1.6em] place-items-center rounded-[0.4em] px-[0.35em] transition-colors duration-300",
                        index === chosen ? "bg-ink text-canvas" : "bg-fill text-ink-2",
                    )}
                >
                    <span className="text-[0.44em] font-semibold">{size}</span>
                </span>
            ))}
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* trio · catalogue, product, cart                                                                */
/* ---------------------------------------------------------------------------------------------- */

const TRIO_AT = { size: 900, add: 1500, added: 1750, landed: 1950, pay: 3000, busy: 3200, paid: 3700 };

function TrioScene({ t, labels, locale }: Props) {
    const { s, ui } = labels;
    const landed = on(t, TRIO_AT.landed);
    const total = 120 + 30 * easeOut(span(t, TRIO_AT.landed, 700));

    return (
        <>
            <Lights
                orbs={[
                    { x: 2, y: 4, size: 16, color: "#fbbf24" },
                    { x: 13, y: 12, size: 18, color: "#22c55e" },
                    { x: 25, y: 1, size: 16, color: "#a3e635" },
                ]}
            />

            <TrioStage
                shown={{ left: on(t, 150), right: on(t, 250), front: on(t, 0) }}
                left={
                    // The catalogue.
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} tab={0} cart>
                        <div className="flex h-full flex-col gap-[0.5em] px-[0.45em] pt-[0.3em]">
                            <span className="text-[0.4em] font-bold uppercase tracking-[0.1em]">{s.shop}</span>
                            <span className="grid grid-cols-2 gap-x-[0.4em] gap-y-[0.55em]">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <Pop key={index} show={on(t, 300 + index * 70)} from="up">
                                        <Tile index={index} labels={labels} locale={locale} />
                                    </Pop>
                                ))}
                            </span>
                        </div>
                    </PhoneFrame>
                }
                right={
                    // The cart, paid.
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} tab={0} cart cartCount={landed ? 2 : 1}>
                        <div className="flex h-full flex-col gap-[0.6em] px-[0.6em] pt-[0.3em]">
                            <span className="text-[0.44em] font-bold uppercase tracking-[0.1em]">{s.cart}</span>
                            {[2, 3].map((index) => {
                                const isNew = index === 2;
                                return (
                                    <Pop key={index} show={isNew ? landed : on(t, 400)} from={isNew ? "down" : "up"} className="relative flex items-center gap-[0.5em] rounded-[0.5em]">
                                        {isNew && <Fresh t={t} at={TRIO_AT.landed} />}
                                        <ProductArt kind={PRODUCTS[index].kind} className="size-[2.4em] shrink-0 rounded-[0.4em]" />
                                        <span className="flex min-w-0 flex-col gap-[0.25em]">
                                            <span className="truncate text-[0.38em] font-bold uppercase tracking-[0.06em]">{s.products[index]}</span>
                                            <span className="text-[0.36em] text-ink-3">{isNew ? "M" : course(ui.courses, "y3")}</span>
                                            <span className="text-[0.42em] font-semibold tabular-nums">{money(locale, PRODUCTS[index].price, 2)}</span>
                                        </span>
                                    </Pop>
                                );
                            })}
                            <span className="mt-[0.4em] flex items-center justify-between border-t border-hairline pt-[0.6em]">
                                <Caps tone="text-ink-3">{s.total}</Caps>
                                <span className="text-[0.62em] font-semibold tabular-nums">{money(locale, total, 2)}</span>
                            </span>
                            <ActionButton t={t} press={TRIO_AT.pay} busy={TRIO_AT.busy} done={TRIO_AT.paid} label={s.checkout} doneLabel={s.ordered} />
                        </div>
                    </PhoneFrame>
                }
                front={
                    // A product, sized and put in the cart.
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} tab={0} cart cartCount={on(t, TRIO_AT.added) ? 2 : 1} className="trio-front">
                        <div className="flex h-full flex-col">
                            <span className="relative">
                                <ProductArt kind="trousers" className="h-[9.6em] w-full" />
                                <span className="absolute left-[0.5em] top-[0.5em] flex size-[1.3em] items-center justify-center rounded-[0.35em] bg-white text-neutral-900 elev-1">
                                    <ChevronLeft className="size-[0.6em]" />
                                </span>
                            </span>
                            <div className="flex flex-col gap-[0.5em] px-[0.6em] pt-[0.6em]">
                                <span className="text-[0.46em] font-bold uppercase tracking-[0.08em]">{s.products[2]}</span>
                                <span className="text-[0.75em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, 30, 2)}</span>
                                <Caps tone="text-ink-3">{s.size}</Caps>
                                <SizePicker chosen={on(t, TRIO_AT.size) ? 1 : -1} />
                                <span className="mt-[0.3em]">
                                    <ActionButton t={t} press={TRIO_AT.add} done={TRIO_AT.added} label={s.addToCart} doneLabel={s.added} />
                                </span>
                            </div>
                        </div>
                    </PhoneFrame>
                }
            >
                {/* What was just added, out of the product's picture towards the catalogue. */}
                <TrioFloat wide={{ x: 3, y: 8.6 }} narrow={{ x: 0.3, y: 4 }} w={12.8} nw={14}>
                    <Pop show={on(t, TRIO_AT.added)} from="scale">
                        <span className="flex items-center gap-[0.6em] rounded-[1em] p-[0.55em] material-thick elev-3 ring-1 ring-hairline">
                            <ProductArt kind="trousers" className="size-[2.3em] shrink-0 rounded-[0.55em]" />
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
                                <span className="truncate text-[0.42em] font-bold uppercase leading-tight tracking-[0.04em]">{s.products[2]}</span>
                                <span className="text-[0.38em] tabular-nums leading-none text-ink-2">M | {money(locale, 30, 2)}</span>
                            </span>
                            <span className="flex shrink-0 items-center gap-[0.25em] rounded-full bg-green-500 py-[0.25em] pl-[0.3em] pr-[0.55em] text-white">
                                <span className="size-[0.7em]">
                                    <DrawnCheck p={span(t, TRIO_AT.added + 80, 450)} className="size-full" />
                                </span>
                                <span className="text-[0.38em] font-semibold">{s.added}</span>
                            </span>
                        </span>
                    </Pop>
                </TrioFloat>

                {/* The order, confirmed: the phone's notification, out under the cart. */}
                <TrioFloat wide={{ x: 24.6, y: 16.4 }} narrow={{ x: 3.2, y: 9.4 }} w={13} nw={12.5}>
                    <Pop show={on(t, TRIO_AT.paid)} from="up">
                        <PhoneNotification title={s.ordered} body={money(locale, 150, 2)} />
                    </Pop>
                </TrioFloat>
            </TrioStage>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* quick · two taps                                                                               */
/* ---------------------------------------------------------------------------------------------- */

const QUICK = { add: 900, sheet: 1300, pay: 2300, busy: 2500, paid: 3100 };

function QuickScene({ t, labels, locale }: Props) {
    const { s } = labels;
    const sheet = on(t, QUICK.sheet);

    return (
        <>
            <Lights orbs={[{ x: -2, y: 5, size: 14, color: "#fbbf24" }, { x: 18, y: 2, size: 15, color: "#a3e635" }, { x: 8, y: 15, size: 13, color: "#22c55e" }]} />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={0} cart cartCount={on(t, QUICK.add) ? 1 : 0}>
                    <div className="relative h-full overflow-hidden">
                        <div className="flex flex-col gap-[0.5em] px-[0.6em] pt-[0.3em]">
                            <span className="text-[0.44em] font-bold uppercase tracking-[0.1em]">{s.shop}</span>
                            <span className="grid grid-cols-2 gap-x-[0.5em] gap-y-[0.6em]">
                                {[0, 3, 1, 2].map((index) => (
                                    <Tile key={index} index={index} labels={labels} locale={locale}>
                                        {index === 3 && (
                                            <span
                                                className={cn(
                                                    "absolute right-[0.3em] top-[0.3em] flex size-[1.4em] items-center justify-center rounded-full elev-2 transition-[scale,background-color,color] duration-300",
                                                    on(t, QUICK.add) ? "bg-green-500 text-white" : "bg-white text-neutral-900",
                                                    between(t, QUICK.add - 200, QUICK.add) && "scale-90",
                                                )}
                                            >
                                                {on(t, QUICK.add) ? (
                                                    <span className="size-[0.85em]">
                                                        <DrawnCheck p={span(t, QUICK.add, 400)} className="size-full" />
                                                    </span>
                                                ) : (
                                                    <Plus className="size-[0.7em]" />
                                                )}
                                            </span>
                                        )}
                                    </Tile>
                                ))}
                            </span>
                        </div>

                        {/* The cart, as a sheet: the card is already saved. */}
                        <div className={cn("absolute inset-0 z-20 bg-black/25 transition-opacity duration-500", sheet ? "opacity-100" : "opacity-0")} />
                        <div
                            className={cn(
                                "absolute inset-x-0 bottom-0 top-[5.5em] z-30 flex flex-col gap-[0.7em] rounded-t-[1.2em] bg-canvas px-[0.75em] pt-[0.6em] elev-4 transition-transform duration-700 ease-spring",
                                sheet ? "translate-y-0" : "translate-y-full",
                            )}
                        >
                            <span className="mx-auto h-[0.22em] w-[2.4em] rounded-full bg-fill-2" />
                            <span className="flex items-center gap-[0.4em]">
                                <span className="text-[0.46em] font-bold uppercase tracking-[0.1em]">{s.cart}</span>
                                <span className="grid size-[0.9em] place-items-center rounded-[0.25em] bg-red-500 text-white">
                                    <span className="text-[0.38em] font-bold">1</span>
                                </span>
                            </span>
                            <span className="flex items-center gap-[0.55em]">
                                <ProductArt kind="books" className="size-[2.6em] shrink-0 rounded-[0.45em]" />
                                <span className="flex min-w-0 flex-col gap-[0.25em]">
                                    <span className="truncate text-[0.42em] font-bold uppercase tracking-[0.06em]">{s.products[3]}</span>
                                    <span className="text-[0.46em] font-semibold tabular-nums">{money(locale, 120, 2)}</span>
                                </span>
                            </span>
                            <span className="flex items-center gap-[0.5em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.5em]">
                                <CreditCard className="size-[0.7em] text-ink-2" />
                                <span className="flex flex-col gap-[0.2em]">
                                    <span className="text-[0.42em] font-medium tabular-nums">•••• 4242</span>
                                    <span className="text-[0.34em] text-ink-3">{s.savedCard}</span>
                                </span>
                            </span>
                            <ActionButton t={t} press={QUICK.pay} busy={QUICK.busy} done={QUICK.paid} label={`${s.pay} ${money(locale, 120, 2)}`} doneLabel={s.ordered} />
                        </div>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* admin · the school's catalogue                                                                 */
/* ---------------------------------------------------------------------------------------------- */

const CATEGORY = [
    { bar: "bg-violet-500", count: 3 },
    { bar: "bg-orange-500", count: 2 },
    { bar: "bg-amber-400", count: 8 },
    { bar: "bg-rose-500", count: 4 },
    { bar: "bg-red-500", count: 6 },
    { bar: "bg-sky-500", count: 10 },
];
const ADMIN = { press: 800, form: 1050, name: 1500, price: 2300, publish: 2800, landed: 3100 };
const FORM_X = 18.4;

function AdminScene({ t, labels, locale }: Props) {
    const { s } = labels;
    const name = typed(s.articleName, t, ADMIN.name, 38);
    const published = on(t, ADMIN.publish);
    const landed = on(t, ADMIN.landed);

    return (
        <>
            <Title
                aside={
                    <>
                        <span className="flex h-[1.7em] items-center rounded-full bg-fill px-[0.8em]">
                            <span className="whitespace-nowrap text-[0.5em] font-medium">{s.newCategory}</span>
                        </span>
                        <span className={cn("flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas transition-[scale] duration-200", between(t, ADMIN.press - 200, ADMIN.press) && "scale-95")}>
                            <Plus className="size-[0.62em]" />
                            <span className="whitespace-nowrap text-[0.5em] font-semibold">{s.addArticle}</span>
                        </span>
                    </>
                }
            >
                {s.shop}
            </Title>

            {/* The categories. */}
            {CATEGORY.map((category, index) => {
                const uniforms = index === 5;
                const count = uniforms && landed ? category.count + 1 : category.count;
                return (
                    <At key={index} x={0} y={2.6 + index * 2.25} w={FORM_X - 0.8} h={2.25}>
                        <Pop show={on(t, 150 + index * 70)} from="up" className="relative flex h-full items-center gap-[0.5em] border-b border-hairline px-[0.3em]">
                            {uniforms && <Fresh t={t} at={ADMIN.landed} />}
                            <span className={cn("h-[0.9em] w-[0.14em] rounded-full", category.bar)} />
                            <span className="flex-1 truncate text-[0.48em] font-medium">{s.categories[index]}</span>
                            <span key={count} className="animate-[ds-pop_350ms_var(--ease-spring-bounce)] text-[0.46em] tabular-nums text-ink-2">
                                {count} {s.articles}
                            </span>
                        </Pop>
                    </At>
                );
            })}

            {/* The new article. */}
            <At x={FORM_X} y={2.6} w={W - FORM_X} h={16}>
                <Pop show={on(t, ADMIN.form)} from="up" className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.8em] ds-glass-inner">
                    <span className="flex items-center gap-[0.6em]">
                        <span className="relative size-[3em] shrink-0 overflow-hidden rounded-[0.55em] border border-dashed border-hairline-strong bg-fill/60">
                            <Pop show={on(t, ADMIN.form + 300)} from="scale" className="absolute inset-0">
                                <ProductArt kind="hoodie" className="size-full" />
                            </Pop>
                        </span>
                        <span className="flex min-w-0 flex-col gap-[0.35em]">
                            <Caps tone="text-ink-3">{s.name}</Caps>
                            <span className="truncate text-[0.5em] font-medium">
                                {name.text}
                                <Caret show={name.typing} />
                            </span>
                        </span>
                    </span>
                    <span className="grid grid-cols-2 gap-[0.5em]">
                        {[
                            [s.price, money(locale, 25, 2)],
                            [s.stock, "40"],
                        ].map(([label, value]) => (
                            <span key={label} className="flex flex-col gap-[0.3em] rounded-[0.5em] bg-fill/70 px-[0.55em] py-[0.45em]">
                                <Caps tone="text-ink-3">{label}</Caps>
                                <span className={cn("text-[0.5em] font-semibold tabular-nums transition-opacity duration-300", on(t, ADMIN.price) ? "opacity-100" : "opacity-0")}>{value}</span>
                            </span>
                        ))}
                    </span>
                    <span className="flex items-center justify-between rounded-[0.5em] bg-fill/70 px-[0.55em] py-[0.45em]">
                        <Caps tone="text-ink-3">{s.category}</Caps>
                        <Pill tone="blue">{s.categories[5]}</Pill>
                    </span>
                    <span className="flex items-center justify-between px-[0.2em]">
                        <span className="text-[0.46em] font-medium">{s.published}</span>
                        <Toggle on={published} />
                    </span>
                    <Pop show={landed} from="up" className="flex items-center gap-[0.35em] rounded-[0.5em] bg-green-100 px-[0.55em] py-[0.4em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                        <span className="size-[0.75em]">
                            <DrawnCheck p={span(t, ADMIN.landed + 100, 450)} className="size-full" />
                        </span>
                        <span className="text-[0.44em] font-semibold">{s.visibleInApp}</span>
                    </Pop>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* product · pictures, sizes, stock                                                               */
/* ---------------------------------------------------------------------------------------------- */

const PRODUCT = { slide: 900, size: 1800, stock: 2000, add: 3000, added: 3250 };
const STOCK = [12, 7, 3, 9];

function ProductScene({ t, labels, locale }: Props) {
    const { s } = labels;
    const slide = easeOut(span(t, PRODUCT.slide, 700));
    const chosen = on(t, PRODUCT.size) ? 2 : 1;

    return (
        <>
            <Lights orbs={[{ x: -2, y: 5, size: 14, color: "#fbbf24" }, { x: 18, y: 2, size: 15, color: "#a3e635" }, { x: 8, y: 15, size: 13, color: "#22c55e" }]} />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={0} cart cartCount={on(t, PRODUCT.added) ? 1 : 0}>
                    <div className="flex h-full flex-col">
                        {/* Its pictures: the trousers, then the top. */}
                        <span className="relative block h-[9.8em] overflow-hidden">
                            <span className="absolute inset-0 flex" style={{ width: "200%", transform: `translateX(${-50 * slide}%)` }}>
                                <ProductArt kind="trousers" className="h-full w-1/2" />
                                <ProductArt kind="hoodie" className="h-full w-1/2" />
                            </span>
                            <span className="absolute inset-x-0 bottom-[0.5em] flex justify-center gap-[0.3em]">
                                {[0, 1].map((dot) => (
                                    <span key={dot} className={cn("size-[0.35em] rounded-full transition-colors duration-500", (slide > 0.5 ? 1 : 0) === dot ? "bg-neutral-900" : "bg-neutral-900/25")} />
                                ))}
                            </span>
                        </span>
                        <div className="flex flex-col gap-[0.5em] px-[0.7em] pt-[0.6em]">
                            <span className="text-[0.46em] font-bold uppercase tracking-[0.08em]">{s.products[2]}</span>
                            <span className="text-[0.75em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, 30, 2)}</span>
                            <Caps tone="text-ink-3">{s.size}</Caps>
                            <SizePicker chosen={chosen} />
                            <span className="flex h-[1em] items-center">
                                <Morph
                                    show={on(t, PRODUCT.stock)}
                                    from={<span className="text-[0.4em] text-ink-3">{fill(s.left, { n: String(STOCK[1]) })}</span>}
                                    to={
                                        <span className="flex items-center gap-[0.3em] text-amber-600 dark:text-amber-400">
                                            <span className="size-[0.4em] rounded-full bg-current" />
                                            <span className="text-[0.4em] font-semibold">{fill(s.left, { n: String(STOCK[2]) })}</span>
                                        </span>
                                    }
                                />
                            </span>
                            <Line w={10} className="h-[0.26em]" />
                            <Line w={8} className="h-[0.26em]" />
                            <span className="mt-[0.2em]">
                                <ActionButton t={t} press={PRODUCT.add} done={PRODUCT.added} label={s.addToCart} doneLabel={s.added} />
                            </span>
                        </div>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* checkout · paid on the phone, an order for the school                                          */
/* ---------------------------------------------------------------------------------------------- */

const CHECKOUT = { pay: 900, busy: 1100, paid: 1700, receipt: 2000, landed: 2200, stock: 2700 };
const ORDERS = [
    { id: "#1042", name: "Pedro Castro", total: 31 },
    { id: "#1041", name: "Ane Etxeberria", total: 7.5 },
    { id: "#1040", name: "Marc Puig", total: 120 },
];

function CheckoutScene({ t, labels, locale }: Props) {
    const { s } = labels;
    const landed = on(t, CHECKOUT.landed);
    const receipt = on(t, CHECKOUT.receipt);
    const rows = landed ? [{ id: "#1043", name: "María García", total: 150 }, ...ORDERS] : ORDERS;

    return (
        <>
            <Lights orbs={[{ x: -2, y: 5, size: 14, color: "#fbbf24" }, { x: 18, y: 2, size: 15, color: "#a3e635" }, { x: 8, y: 15, size: 13, color: "#22c55e" }]} />

            {/* The school's orders, and the stock that follows them. */}
            <Pane box={DUO_PANE_RIGHT} clear="left">
                <span className="text-[0.62em] font-semibold">{s.orders}</span>
                <span className="relative block" style={{ height: `${4 * 2.1}em` }}>
                    {rows.map((order, index) => {
                        const isNew = order.id === "#1043";
                        return (
                            <span key={order.id} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2.1}em` }}>
                                <Pop show={isNew ? landed : on(t, 200 + index * 80)} from={isNew ? "down" : "up"} className="relative flex h-[2.1em] items-center gap-[0.5em] border-b border-hairline px-[0.2em]">
                                    {isNew && <Fresh t={t} at={CHECKOUT.landed} />}
                                    <span className="w-[2.4em] font-mono text-[0.42em] text-ink-3">{order.id}</span>
                                    <span className="flex-1 truncate text-[0.46em] font-medium">{order.name}</span>
                                    <span className="text-[0.46em] tabular-nums">{money(locale, order.total, 2)}</span>
                                    <Pill tone="green">{s.paidLabel}</Pill>
                                </Pop>
                            </span>
                        );
                    })}
                </span>
                <span className="flex items-center gap-[0.5em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]">
                    <ProductArt kind="trousers" className="size-[1.6em] shrink-0 rounded-[0.35em]" />
                    <span className="flex-1 truncate text-[0.44em]">{s.products[2]} | M</span>
                    <Caps tone="text-ink-3">{s.stock}</Caps>
                    <Morph
                        show={on(t, CHECKOUT.stock)}
                        from={<span className="text-[0.5em] font-semibold tabular-nums">12</span>}
                        to={<span className="text-[0.5em] font-semibold tabular-nums text-amber-600 dark:text-amber-400">11</span>}
                    />
                </span>
            </Pane>

            {/* The family pays its cart; the receipt stays in the app. */}
            <At {...DUO_PHONE_LEFT}>
                <Pop show={on(t, 80)} from="up" className="size-full">
                    <PhoneFrame x={0} y={0} w={DUO_PHONE_LEFT.w} h={DUO_PHONE_LEFT.h} tab={0} cart cartCount={receipt ? 0 : 2}>
                        <div className="grid h-full">
                            <div className={cn("[grid-area:1/1] flex flex-col gap-[0.6em] px-[0.65em] pt-[0.3em] transition-opacity duration-500", receipt && "opacity-0")}>
                                <span className="text-[0.44em] font-bold uppercase tracking-[0.1em]">{s.cart}</span>
                                {[2, 3].map((index) => (
                                    <span key={index} className="flex items-center gap-[0.5em]">
                                        <ProductArt kind={PRODUCTS[index].kind} className="size-[2.3em] shrink-0 rounded-[0.4em]" />
                                        <span className="flex min-w-0 flex-col gap-[0.25em]">
                                            <span className="truncate text-[0.38em] font-bold uppercase tracking-[0.06em]">{s.products[index]}</span>
                                            <span className="text-[0.42em] font-semibold tabular-nums">{money(locale, PRODUCTS[index].price, 2)}</span>
                                        </span>
                                    </span>
                                ))}
                                <span className="flex items-center justify-between border-t border-hairline pt-[0.6em]">
                                    <Caps tone="text-ink-3">{s.total}</Caps>
                                    <span className="text-[0.62em] font-semibold tabular-nums">{money(locale, 150, 2)}</span>
                                </span>
                                <ActionButton t={t} press={CHECKOUT.pay} busy={CHECKOUT.busy} done={CHECKOUT.paid} label={`${s.pay} ${money(locale, 150, 2)}`} doneLabel={s.paidLabel} />
                            </div>
                            <div className={cn("[grid-area:1/1] flex flex-col items-center gap-[0.6em] px-[0.65em] pt-[1.2em] transition-[opacity,translate] duration-500 ease-spring", receipt ? "opacity-100" : "translate-y-[1em] opacity-0")}>
                                <span className="grid size-[2.6em] place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                                    <span className="size-[1.6em]">
                                        <DrawnCheck p={span(t, CHECKOUT.receipt + 100, 500)} className="size-full" />
                                    </span>
                                </span>
                                <span className="text-[0.6em] font-semibold">{s.ordered}</span>
                                <span className="flex w-full flex-col gap-[0.45em] rounded-[0.7em] bg-fill/70 p-[0.6em]">
                                    <span className="flex items-center gap-[0.35em]">
                                        <ReceiptText className="size-[0.6em] text-ink-2" />
                                        <Caps tone="text-ink-3">{s.receipt} #1043</Caps>
                                    </span>
                                    {[2, 3].map((index) => (
                                        <span key={index} className="flex justify-between">
                                            <span className="truncate text-[0.4em] text-ink-2">{s.products[index]}</span>
                                            <span className="text-[0.4em] tabular-nums">{money(locale, PRODUCTS[index].price, 2)}</span>
                                        </span>
                                    ))}
                                    <span className="flex justify-between border-t border-hairline pt-[0.4em]">
                                        <span className="text-[0.42em] font-semibold">{s.total}</span>
                                        <span className="text-[0.42em] font-semibold tabular-nums">{money(locale, 150, 2)}</span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    trio: { Scene: TrioScene, duration: 4400, ...TRIO },
    quick: { Scene: QuickScene, duration: 3800, ...SOLO },
    admin: { Scene: AdminScene, duration: 3900 },
    product: { Scene: ProductScene, duration: 3800, ...SOLO },
    checkout: { Scene: CheckoutScene, duration: 3400, ...DUO },
} satisfies Record<string, SceneSpec<ShopLabels>>;

export type ShopSceneKey = keyof typeof SCENES;

export default function ShopScenes({ scene, labels, locale, max }: { scene: ShopSceneKey; labels: ShopLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
