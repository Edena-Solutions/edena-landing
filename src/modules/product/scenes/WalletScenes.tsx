import { ArrowDownLeft, ArrowUpRight, Bus, Cookie, Download, Landmark, Pencil, Plus, Utensils, Wallet, type LucideIcon } from "lucide-react";

import { PhoneFrame } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Line, Pop, capitalize, easeInOut, easeOut, fill, money, monthName, on, span } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { ActionButton, Caps, DUO, DUO_PANE_RIGHT, DUO_PHONE_LEFT, Fresh, Lights, Pane, Pill, SOLO, SOLO_PHONE, SettlePill, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type WalletLabels = ProductSceneLabels & { w: Translation["walletScenes"] };

/*
 * The internal payments page's scenes — each family's wallet, and the school's small charges:
 *
 *   wallets   (hero) the school's wallets, live: a top-up comes in, a lunch and a trip are paid
 *   charge    a trip charged to a class from its wallets, family by family; one short, reminded
 *   balance   a family's wallet on the app: topped up in a tap
 *   spend     a trip paid from the wallet on the phone; behind it, the school's ledger takes it
 *   report    a month's spending by service and the families' balances, exported
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: WalletLabels;
    locale: string;
}

const W = CONTENT.w;
const SERVICE_ICONS: LucideIcon[] = [Utensils, Bus, Cookie, Pencil];

/** An amount in or out: green and up, or plain and down. */
function Amount({ value, locale, className }: { value: number; locale: string; className?: string }) {
    const up = value > 0;
    return (
        <span className={cn("flex items-center gap-[0.2em] tabular-nums", up ? "text-green-600 dark:text-green-400" : "text-ink", className)}>
            {up ? <ArrowDownLeft className="size-[0.95em]" /> : <ArrowUpRight className="size-[0.95em] text-ink-3" />}
            {up ? "+" : "−"}
            {money(locale, Math.abs(value), 2)}
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* wallets · live                                                                                 */
/* ---------------------------------------------------------------------------------------------- */

const FAMILIES = [
    { name: "García", child: "Lucía · I-3 A", initials: "G", hue: 25, balance: 32.5 },
    { name: "Puig", child: "Marc · 2.º A", initials: "P", hue: 265, balance: 48.2 },
    { name: "Etxeberria", child: "Ane · 4.º B", initials: "E", hue: 140, balance: 21 },
    { name: "Fernández", child: "Hugo · I-3 A", initials: "F", hue: 45, balance: 82.5 },
    { name: "Castro", child: "Pedro · 6.º A", initials: "C", hue: 205, balance: 15.75 },
];
const MOVES = [
    { at: 1200, family: 0, value: 50, service: -1 },
    { at: 2200, family: 1, value: -6.5, service: 0 },
    { at: 3100, family: 2, value: -12, service: 1 },
];

function WalletsScene({ t, labels, locale }: Props) {
    const { w } = labels;
    const done = MOVES.filter((move) => on(t, move.at));
    const settle = (move: (typeof MOVES)[number]) => easeOut(span(t, move.at, 700));
    const total = 4820 + MOVES.reduce((sum, move) => sum + move.value * settle(move), 0);
    const topUps = 340 + MOVES.filter((move) => move.value > 0).reduce((sum, move) => sum + move.value * settle(move), 0);
    const spent = 186 + MOVES.filter((move) => move.value < 0).reduce((sum, move) => sum - move.value * settle(move), 0);

    return (
        <>
            <Title
                aside={
                    <span className="flex items-center gap-[0.35em] rounded-full bg-fill-2 px-[0.65em] py-[0.25em]">
                        <span className="size-[0.4em] animate-pulse rounded-full bg-green-500" />
                        <span className="text-[0.46em] font-medium text-ink-2">{w.live}</span>
                    </span>
                }
            >
                {w.wallet}
            </Title>

            {[
                [w.totalBalance, total, "bg-fill-2 text-ink"],
                [w.topUpsToday, topUps, "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"],
                [w.spentToday, spent, "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300"],
            ].map(([label, value, tone], index) => (
                <At key={index} x={index * 10.2} y={2.5} w={9.8} h={3.7}>
                    <Pop show={on(t, 100 + index * 90)} from="up" className={cn("flex h-full flex-col justify-between rounded-[0.8em] p-[0.7em]", tone as string)}>
                        <span className="truncate text-[0.42em] font-semibold uppercase tracking-[0.1em]">{label as string}</span>
                        <span className="text-[1.15em] font-light leading-none tabular-nums tracking-[-0.03em]">{money(locale, value as number, 2)}</span>
                    </Pop>
                </At>
            ))}

            {/* The families and their balances. */}
            <At x={0} y={6.8} w={18.8} h={13.8}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps className="mb-[0.4em]">{w.families}</Caps>
                    {FAMILIES.map((family, index) => {
                        const moves = MOVES.filter((move) => move.family === index);
                        const balance = family.balance + moves.reduce((sum, move) => sum + move.value * settle(move), 0);
                        const last = moves.find((move) => on(t, move.at));
                        return (
                            <span key={family.name} className="relative flex h-[2.05em] items-center gap-[0.5em] border-b border-hairline px-[0.2em]">
                                {last && <Fresh t={t} at={last.at} className={last.value < 0 ? "bg-yellow-400/20" : undefined} />}
                                <Avatar initials={family.initials} hue={family.hue} size={1.25} />
                                <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                    <span className="truncate text-[0.46em] font-medium">
                                        {w.family} {family.name}
                                    </span>
                                    <span className="truncate text-[0.36em] text-ink-3">{family.child}</span>
                                </span>
                                <span className="text-[0.5em] font-semibold tabular-nums">{money(locale, balance, 2)}</span>
                            </span>
                        );
                    })}
                </Pop>
            </At>

            {/* What moves, as it moves. */}
            <At x={19.4} y={6.8} w={W - 19.4} h={13.8}>
                <Pop show={on(t, 400)} from="up" className="flex h-full flex-col rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps className="mb-[0.5em]">{w.movements}</Caps>
                    <span className="relative block flex-1">
                        {MOVES.map((move) => {
                            const index = done.length - 1 - done.indexOf(move);
                            const Icon = move.service < 0 ? Wallet : SERVICE_ICONS[move.service];
                            return (
                                <span key={move.at} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${Math.max(0, index) * 2.3}em` }}>
                                    <Pop show={on(t, move.at)} from="down" className="flex h-[2em] items-center gap-[0.45em]">
                                        <span className={cn("flex size-[1.25em] items-center justify-center rounded-[0.4em]", move.value > 0 ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-fill-2 text-ink-2")}>
                                            <Icon className="size-[0.6em]" />
                                        </span>
                                        <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                            <span className="truncate text-[0.42em] font-medium">{move.service < 0 ? w.topUp : w.services[move.service]}</span>
                                            <span className="truncate text-[0.34em] text-ink-3">{FAMILIES[move.family].name}</span>
                                        </span>
                                        <Amount value={move.value} locale={locale} className="text-[0.44em] font-semibold" />
                                    </Pop>
                                </span>
                            );
                        })}
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* charge · a trip, from the class's wallets                                                      */
/* ---------------------------------------------------------------------------------------------- */

const CLASS = [
    { name: "Lucía García", initials: "LG", hue: 25, balance: 32.5 },
    { name: "Mateo Ruiz", initials: "MR", hue: 200, balance: 41 },
    { name: "Sofía López", initials: "SL", hue: 300, balance: 8 },
    { name: "Hugo Fernández", initials: "HF", hue: 45, balance: 82.5 },
    { name: "Leo Serrano", initials: "LS", hue: 140, balance: 27.25 },
];
const PRICE = 12;
const CHARGE = { press: 1300, from: 1600, step: 260, remind: 3400 };

function ChargeScene({ t, labels, locale }: Props) {
    const { w } = labels;
    const charged = (index: number) => on(t, CHARGE.from + index * CHARGE.step);
    const count = CLASS.filter((child, index) => child.balance >= PRICE && charged(index)).length;
    const collected = (24 - CLASS.length + count) * PRICE * clamp(span(t, CHARGE.from, CLASS.length * CHARGE.step));

    return (
        <>
            <Title
                aside={
                    <span className="w-[8.6em]">
                        <ActionButton t={t} press={CHARGE.press} done={CHARGE.from} label={fill(w.chargeFamilies, { n: "24" })} doneLabel={w.charged} />
                    </span>
                }
            >
                {w.chargeService}
            </Title>

            {/* What is charged, and to whom. */}
            <At x={0} y={2.5} w={W} h={3.3} className="grid grid-cols-[1.6fr_1fr_1fr] gap-[0.5em]">
                {[
                    [w.concept, <span key="c" className="flex items-center gap-[0.4em]"><Bus className="size-[0.6em] text-ink-2" /><span className="truncate text-[0.5em] font-medium">{w.tripName}</span></span>],
                    [w.amount, <span key="a" className="text-[0.5em] font-semibold tabular-nums">{money(locale, PRICE, 2)}</span>],
                    [w.group, <span key="g" className="flex gap-[0.3em]"><Pill tone="violet">3.º A</Pill></span>],
                ].map(([label, value], index) => (
                    <Pop key={index} show={on(t, 100 + index * 90)} from="up" className="flex flex-col justify-center gap-[0.4em] rounded-[0.7em] px-[0.7em] ds-glass-inner">
                        <Caps tone="text-ink-3">{label}</Caps>
                        {value}
                    </Pop>
                ))}
            </At>

            {/* The class, family by family. */}
            {CLASS.map((child, index) => {
                const short = child.balance < PRICE;
                const done = charged(index);
                const balance = short || !done ? child.balance : child.balance - PRICE * easeOut(span(t, CHARGE.from + index * CHARGE.step, 500));
                return (
                    <At key={child.name} x={0} y={6.4 + index * 2.15} w={W} h={2.15}>
                        <Pop show={on(t, 300 + index * 70)} from="up" className="relative flex h-full items-center gap-[0.55em] border-b border-hairline px-[0.3em]">
                            {done && <Fresh t={t} at={CHARGE.from + index * CHARGE.step} className={short ? "bg-yellow-400/20" : undefined} />}
                            <Avatar initials={child.initials} hue={child.hue} size={1.3} />
                            <span className="w-[11em] truncate text-[0.48em] font-medium">{child.name}</span>
                            <span className="flex items-center gap-[0.3em] text-ink-2">
                                <Wallet className="size-[0.55em]" />
                                <span className="text-[0.46em] tabular-nums">{money(locale, balance, 2)}</span>
                            </span>
                            <span className="ml-auto flex">
                                {!done ? (
                                    <Pill tone="gray">{money(locale, PRICE, 2)}</Pill>
                                ) : short ? (
                                    <SettlePill t={t} at={CHARGE.remind} from={w.lowBalance} to={w.notified} fromTone="yellow" />
                                ) : (
                                    <SettlePill t={t} at={CHARGE.from + index * CHARGE.step} from="" to={w.charged} />
                                )}
                            </span>
                        </Pop>
                    </At>
                );
            })}
            <At x={0} y={17.4} w={W} className="flex items-center justify-end gap-[0.5em]">
                <Caps tone="text-ink-3">{w.collected}</Caps>
                <span className="text-[0.8em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, collected, 2)}</span>
            </At>
        </>
    );
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/* ---------------------------------------------------------------------------------------------- */
/* balance · the family's wallet, topped up                                                       */
/* ---------------------------------------------------------------------------------------------- */

const TOPUP = { open: 1100, pick: 1700, press: 2300, busy: 2500, done: 3000 };
const CHIPS = [20, 50, 100];
const HISTORY = [
    { service: 0, value: -6.5 },
    { service: 1, value: -12 },
    { service: 2, value: -2 },
];

function BalanceScene({ t, labels, locale }: Props) {
    const { w } = labels;
    const balance = 32.5 + 50 * easeOut(span(t, TOPUP.done, 900));
    const open = on(t, TOPUP.open);
    const picked = on(t, TOPUP.pick);
    const toppedUp = on(t, TOPUP.done);
    const rows = toppedUp ? [{ service: -1, value: 50 }, ...HISTORY] : HISTORY;

    return (
        <>
            <Lights />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={1}>
                    <div className="flex h-full flex-col gap-[0.7em] px-[0.7em] pt-[0.3em]">
                        <span className="flex items-center gap-[0.45em]">
                            <Avatar initials="HF" hue={45} size={1.4} />
                            <span className="text-[0.48em] font-semibold">Hugo Fernández</span>
                        </span>
                        {/* The wallet. */}
                        <span className="relative flex flex-col gap-[0.5em] overflow-hidden rounded-[0.9em] p-[0.9em] text-white" style={{ background: "linear-gradient(135deg, #22c55e, #0d9488)" }}>
                            <span className="absolute -right-[1.5em] -top-[1.5em] size-[5em] rounded-full bg-white/15" />
                            <span className="flex items-center gap-[0.35em]">
                                <Wallet className="size-[0.6em]" />
                                <span className="text-[0.4em] font-semibold uppercase tracking-[0.12em] text-white/85">{w.balance}</span>
                            </span>
                            <span className="text-[1.5em] font-semibold leading-none tabular-nums tracking-[-0.03em]">{money(locale, balance, 2)}</span>
                            <span
                                className={cn(
                                    "mt-[0.2em] flex h-[1.5em] w-fit items-center gap-[0.3em] rounded-full bg-white px-[0.7em] text-green-700 transition-[scale] duration-200",
                                    between(t, TOPUP.open - 220, TOPUP.open) && "scale-90",
                                )}
                            >
                                <Plus className="size-[0.55em]" />
                                <span className="text-[0.44em] font-semibold">{w.topUpAction}</span>
                            </span>
                        </span>

                        {/* How much: three amounts, one chosen, paid. */}
                        <span className={cn("flex flex-col gap-[0.5em] overflow-hidden transition-[max-height,opacity] duration-700 ease-spring", open && !toppedUp ? "max-h-[6em] opacity-100" : "max-h-0 opacity-0")}>
                            <span className="grid grid-cols-3 gap-[0.4em]">
                                {CHIPS.map((amount) => (
                                    <span
                                        key={amount}
                                        className={cn(
                                            "grid h-[1.7em] place-items-center rounded-[0.55em] ring-1 transition-[background-color,box-shadow,color] duration-300",
                                            picked && amount === 50 ? "bg-green-50 text-green-700 ring-[0.12em] ring-green-500 dark:bg-green-500/15 dark:text-green-400" : "ring-hairline",
                                        )}
                                    >
                                        <span className="text-[0.5em] font-semibold tabular-nums">{money(locale, amount, 0)}</span>
                                    </span>
                                ))}
                            </span>
                            <ActionButton t={t} press={TOPUP.press} busy={TOPUP.busy} done={TOPUP.done} label={`${w.topUpAction} ${money(locale, 50, 2)}`} doneLabel={w.topUpDone} />
                        </span>

                        <Caps tone="text-ink-3">{w.movements}</Caps>
                        <span className="relative block" style={{ height: "8em" }}>
                            {rows.map((row, index) => {
                                const Icon = row.service < 0 ? Wallet : SERVICE_ICONS[row.service];
                                return (
                                    <span key={row.service} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2}em` }}>
                                        <Pop show={row.service < 0 ? toppedUp : on(t, 200 + index * 90)} from={row.service < 0 ? "down" : "up"} className="relative flex h-[1.9em] items-center gap-[0.45em] border-b border-hairline">
                                            {row.service < 0 && <Fresh t={t} at={TOPUP.done} />}
                                            <span className={cn("flex size-[1.25em] items-center justify-center rounded-[0.4em]", row.value > 0 ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-fill-2 text-ink-2")}>
                                                <Icon className="size-[0.6em]" />
                                            </span>
                                            <span className="flex-1 truncate text-[0.44em]">{row.service < 0 ? w.topUp : w.services[row.service]}</span>
                                            <Amount value={row.value} locale={locale} className="text-[0.44em] font-semibold" />
                                        </Pop>
                                    </span>
                                );
                            })}
                        </span>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* spend · paid on the phone, in the school's ledger                                              */
/* ---------------------------------------------------------------------------------------------- */

const SPEND = { press: 1300, busy: 1500, paid: 2000, landed: 2300 };
const LEDGER = [
    { family: "Puig", service: 0, value: -6.5, time: "12:41" },
    { family: "García", service: -1, value: 50, time: "12:30" },
    { family: "Castro", service: 2, value: -2, time: "11:02" },
    { family: "Etxeberria", service: 1, value: -12, time: "10:15" },
];

function SpendScene({ t, labels, locale }: Props) {
    const { w } = labels;
    const landed = on(t, SPEND.landed);
    const rows = landed ? [{ family: "Fernández", service: 1, value: -12, time: "13:05" }, ...LEDGER] : LEDGER;
    const balance = 82.5 - 12 * easeOut(span(t, SPEND.paid, 700));
    const payments = 14 + (landed ? 1 : 0);

    return (
        <>
            <Lights />

            {/* The school's ledger. */}
            <Pane box={DUO_PANE_RIGHT} clear="left">
                <span className="flex items-end justify-between gap-[0.5em]">
                    <span className="flex flex-col gap-[0.3em]">
                        <Caps>{w.ledger}</Caps>
                        <span className="text-[0.46em] tabular-nums text-ink-2">
                            <b key={payments} className="inline-block animate-[ds-pop_350ms_var(--ease-spring-bounce)] font-semibold text-ink">
                                {payments}
                            </b>{" "}
                            {w.paymentsToday}
                        </span>
                    </span>
                    <Pill tone="green">{w.live}</Pill>
                </span>
                <span className="relative block" style={{ height: `${5 * 2.1}em` }}>
                    {rows.map((row, index) => {
                        const isNew = row.family === "Fernández";
                        const Icon = row.service < 0 ? Wallet : SERVICE_ICONS[row.service];
                        return (
                            <span key={row.family + row.time} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2.1}em` }}>
                                <Pop show={isNew ? landed : on(t, 200 + index * 80)} from={isNew ? "down" : "up"} className="relative flex h-[2.1em] items-center gap-[0.45em] border-b border-hairline px-[0.2em]">
                                    {isNew && <Fresh t={t} at={SPEND.landed} />}
                                    <span className={cn("flex size-[1.25em] items-center justify-center rounded-[0.4em]", row.value > 0 ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" : "bg-fill-2 text-ink-2")}>
                                        <Icon className="size-[0.6em]" />
                                    </span>
                                    <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                        <span className="truncate text-[0.44em] font-medium">
                                            {w.family} {row.family}
                                        </span>
                                        <span className="truncate text-[0.34em] text-ink-3">
                                            {row.service < 0 ? w.topUp : w.services[row.service]} · {row.time}
                                        </span>
                                    </span>
                                    <Amount value={row.value} locale={locale} className="text-[0.44em] font-semibold" />
                                </Pop>
                            </span>
                        );
                    })}
                </span>
            </Pane>

            {/* The family pays the trip from its wallet. */}
            <At {...DUO_PHONE_LEFT}>
                <Pop show={on(t, 80)} from="up" className="size-full">
                    <PhoneFrame x={0} y={0} w={DUO_PHONE_LEFT.w} h={DUO_PHONE_LEFT.h} tab={1}>
                        <div className="flex h-full flex-col gap-[0.6em] px-[0.7em] pt-[0.3em]">
                            <span className="relative flex h-[6em] w-full items-center justify-center overflow-hidden rounded-[0.8em] text-white" style={{ background: "linear-gradient(145deg, #7dd3fc, #0284c7)" }}>
                                <span className="absolute -right-[1em] -top-[1em] size-[4em] rounded-full bg-white/15" />
                                <Landmark className="relative size-[2.4em] drop-shadow-[0_0.08em_0.2em_rgb(0_0_0/0.18)]" strokeWidth={1.8} />
                            </span>
                            <span className="text-[0.5em] font-bold uppercase tracking-[0.08em]">{w.museumTrip}</span>
                            <span className="text-[1em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, 12, 2)}</span>
                            <Line w={9.5} className="h-[0.26em]" />
                            <Line w={7} className="h-[0.26em]" />
                            <span className="mt-[0.2em] flex items-center justify-between rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.5em]">
                                <span className="flex items-center gap-[0.35em] text-ink-2">
                                    <Wallet className="size-[0.6em]" />
                                    <span className="text-[0.42em]">{w.available}</span>
                                </span>
                                <span className="text-[0.48em] font-semibold tabular-nums">{money(locale, balance, 2)}</span>
                            </span>
                            <ActionButton t={t} press={SPEND.press} busy={SPEND.busy} done={SPEND.paid} label={w.payWithBalance} doneLabel={w.paid} />
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* report · every euro, by service and family                                                     */
/* ---------------------------------------------------------------------------------------------- */

const BY_SERVICE = [1240, 860, 312, 196];
const BALANCES = [
    { name: "Fernández", value: 70.5 },
    { name: "Puig", value: 41.7 },
    { name: "García", value: 82.5 },
    { name: "Castro", value: 15.75 },
];
const EXPORT = { press: 3200, busy: 3400, done: 3900 };

function ReportScene({ t, labels, locale }: Props) {
    const { w } = labels;
    const max = Math.max(...BY_SERVICE);
    const barColors = ["bg-green-500", "bg-sky-500", "bg-amber-400", "bg-violet-500"];

    return (
        <>
            <Title
                aside={
                    <>
                        <Pill tone="gray">{capitalize(monthName(locale, 5))}</Pill>
                        <span className="w-[6.2em]">
                            <ActionButton
                                t={t}
                                press={EXPORT.press}
                                busy={EXPORT.busy}
                                done={EXPORT.done}
                                label={
                                    <span className="flex items-center gap-[0.35em]">
                                        <Download className="size-[1.1em]" />
                                        {w.export}
                                    </span>
                                }
                                doneLabel={w.exported}
                            />
                        </span>
                    </>
                }
            >
                {w.report}
            </Title>

            {/* Spending by service. */}
            <At x={0} y={2.5} w={18.8} h={15.6}>
                <Pop show={on(t, 150)} from="up" className="flex h-full flex-col gap-[0.9em] rounded-[0.9em] p-[0.85em] ds-glass-inner">
                    <Caps>{w.byService}</Caps>
                    {w.services.map((service, index) => {
                        const grow = easeInOut(span(t, 500 + index * 180, 1200));
                        const Icon = SERVICE_ICONS[index];
                        return (
                            <span key={service} className="flex flex-col gap-[0.4em]">
                                <span className="flex items-center gap-[0.4em]">
                                    <Icon className="size-[0.6em] text-ink-2" />
                                    <span className="flex-1 text-[0.46em] font-medium">{service}</span>
                                    <span className="text-[0.48em] font-semibold tabular-nums">{money(locale, BY_SERVICE[index] * grow, 0)}</span>
                                </span>
                                <span className="h-[0.45em] overflow-hidden rounded-full bg-fill-2">
                                    <span className={cn("block h-full origin-left rounded-full", barColors[index])} style={{ transform: `scaleX(${(BY_SERVICE[index] / max) * grow})` }} />
                                </span>
                            </span>
                        );
                    })}
                </Pop>
            </At>

            {/* The families' balances. */}
            <At x={19.4} y={2.5} w={W - 19.4} h={15.6}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.55em] rounded-[0.9em] p-[0.85em] ds-glass-inner">
                    <Caps>{w.balancesByFamily}</Caps>
                    <span className="text-[1.05em] font-light tabular-nums tracking-[-0.03em]">{money(locale, 4863.5 * easeOut(span(t, 400, 1400)), 2)}</span>
                    {BALANCES.map((family, index) => (
                        <Pop key={family.name} show={on(t, 900 + index * 140)} className="flex items-center justify-between border-b border-hairline pb-[0.35em]">
                            <span className="truncate text-[0.44em] text-ink-2">{family.name}</span>
                            <span className="text-[0.44em] font-semibold tabular-nums">{money(locale, family.value, 2)}</span>
                        </Pop>
                    ))}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    wallets: { Scene: WalletsScene, duration: 4200 },
    charge: { Scene: ChargeScene, duration: 4200 },
    balance: { Scene: BalanceScene, duration: 4200, ...SOLO },
    spend: { Scene: SpendScene, duration: 3600, ...DUO },
    report: { Scene: ReportScene, duration: 4400 },
} satisfies Record<string, SceneSpec<WalletLabels>>;

export type WalletSceneKey = keyof typeof SCENES;

export default function WalletScenes({ scene, labels, locale, max }: { scene: WalletSceneKey; labels: WalletLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
