import { BellRing, CalendarClock, Check, Download, Landmark, Tag, Ticket, Users, X } from "lucide-react";

import { PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, capitalize, easeInOut, fill, money, on, span } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { formatDate } from "@/lib/intl-locale";
import { cn } from "@/lib/utils";
import { ActionButton, Caps, Fresh, Lights, Morph, Pill, SOLO, SOLO_PHONE, SettlePill, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type AcademiesLabels = ProductSceneLabels & { ac: Translation["academiesScenes"] };

/*
 * The academies page's scenes:
 *
 *   today    (hero) the academy's afternoon: its classes and their places; the register of the
 *            class now on is taken pupil by pupil, and the one family with an absence told
 *   rates    the academy's fees, set once — monthly, termly, a ten-class pass, a sibling discount —
 *            and June's invoices drawn up from them
 *   notices  a family's phone: the class moves an hour, and the timetable on it moves too
 *   bundle   one pupil's invoice: her pass used class by class, the discount, a part payment, then
 *            the rest — and the month exported for the accountant
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: AcademiesLabels;
    locale: string;
}

const W = CONTENT.w;

/* ---------------------------------------------------------------------------------------------- */
/* today · the afternoon, and a register                                                          */
/* ---------------------------------------------------------------------------------------------- */

const CLASSES = [
    { time: "16:00", seats: [10, 10], tone: "bg-sky-500" },
    { time: "17:00", seats: [8, 8], tone: "bg-violet-500", now: true },
    { time: "18:00", seats: [11, 12], tone: "bg-green-500" },
    { time: "19:00", seats: [6, 10], tone: "bg-orange-500" },
    { time: "20:00", seats: [9, 12], tone: "bg-rose-500" },
];
const PUPILS = [
    { name: "Lucía García", hue: 25 },
    { name: "Marc Puig", hue: 265 },
    { name: "Ane Etxeberria", hue: 140 },
    { name: "Hugo Fernández", hue: 45, absent: true },
    { name: "Sofía López", hue: 300 },
    { name: "Daniel Navarro", hue: 210 },
];
const MARK_AT = (index: number) => 900 + index * 300;
const SAVED_AT = MARK_AT(PUPILS.length) + 300;

function TodayScene({ t, labels, locale }: Props) {
    const { ac } = labels;
    const marked = PUPILS.filter((_, index) => on(t, MARK_AT(index))).length;
    const present = PUPILS.filter((pupil, index) => !pupil.absent && on(t, MARK_AT(index))).length;
    const date = capitalize(formatDate(locale, new Date(2026, 5, 10), { weekday: "long", day: "numeric", month: "long" }));

    return (
        <>
            <Title aside={<span className="text-[0.46em] text-ink-2">{date}</span>}>{ac.today}</Title>

            {/* The afternoon's classes. */}
            <At x={0} y={2.5} w={13.6} h={18.1}>
                <Pop show={on(t, 100)} from="up" className="flex h-full flex-col gap-[0.4em] rounded-[0.9em] p-[0.7em] ds-glass-inner">
                    <Caps className="mb-[0.2em]">{ac.classes}</Caps>
                    {CLASSES.map((item, index) => (
                        <Pop
                            key={item.time}
                            show={on(t, 200 + index * 80)}
                            from="up"
                            className={cn("flex items-center gap-[0.5em] rounded-[0.6em] px-[0.45em] py-[0.45em] transition-colors duration-500", item.now ? "bg-surface ring-[0.1em] ring-violet-500/60 elev-1" : "")}
                        >
                            <span className="w-[2.4em] text-[0.44em] font-semibold tabular-nums text-ink-2">{item.time}</span>
                            <span className={cn("h-[1.5em] w-[0.16em] rounded-full", item.tone)} />
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
                                <span className="truncate text-[0.46em] font-semibold">{ac.classNames[index]}</span>
                                <span className="flex items-center gap-[0.25em] text-ink-3">
                                    <Users className="size-[0.45em]" />
                                    <span className="text-[0.36em] tabular-nums">
                                        {item.seats[0]}/{item.seats[1]}
                                    </span>
                                    {item.seats[0] === item.seats[1] && <span className="text-[0.36em] font-semibold text-green-600 dark:text-green-400">· {ac.full}</span>}
                                </span>
                            </span>
                            {item.now && <Pill tone="violet">{ac.now}</Pill>}
                        </Pop>
                    ))}
                </Pop>
            </At>

            {/* The register of the class now on. */}
            <At x={14.2} y={2.5} w={W - 14.2} h={18.1}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.4em] rounded-[0.9em] p-[0.7em] ds-glass-inner">
                    <span className="mb-[0.2em] flex items-center justify-between">
                        <Caps>
                            {ac.register} | {ac.classNames[1]}
                        </Caps>
                        <span className="text-[0.44em] font-semibold tabular-nums text-ink-2">
                            {present}/{PUPILS.length}
                        </span>
                    </span>
                    {PUPILS.map((pupil, index) => {
                        const done = on(t, MARK_AT(index));
                        return (
                            <span key={pupil.name} className={cn("flex items-center gap-[0.5em] rounded-[0.55em] px-[0.35em] py-[0.25em] transition-colors duration-300", between(t, MARK_AT(index) - 250, MARK_AT(index)) && "bg-fill-2")}>
                                <Avatar initials={pupil.name.split(" ").map((w) => w[0]).join("")} hue={pupil.hue} size={1.3} />
                                <span className="flex-1 truncate text-[0.46em]">{pupil.name}</span>
                                <span
                                    className={cn(
                                        "grid size-[1.25em] place-items-center rounded-full transition-[background-color,color,scale] duration-300",
                                        !done ? "bg-fill-2 text-transparent" : pupil.absent ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400" : "bg-green-500 text-white",
                                        done && "animate-[ds-pop_350ms_var(--ease-spring-bounce)]",
                                    )}
                                >
                                    {pupil.absent ? <X className="size-[0.6em]" /> : <Check className="size-[0.6em]" />}
                                </span>
                            </span>
                        );
                    })}
                    <span className="mt-auto">
                        <Morph
                            show={on(t, SAVED_AT)}
                            from={<span className="text-[0.4em] text-ink-3">{fill(ac.marked, { n: String(marked), total: String(PUPILS.length) })}</span>}
                            to={<SettlePill t={t} at={SAVED_AT} from="" to={ac.familyTold} />}
                        />
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* rates · fees set once, invoices every month                                                    */
/* ---------------------------------------------------------------------------------------------- */

const RATES = [
    { price: 45, icon: CalendarClock },
    { price: 120, icon: CalendarClock },
    { price: 90, icon: Ticket },
    { price: -10, icon: Tag },
];
const BILLED = [
    { name: "Lucía García", rate: 0, amount: 45 },
    { name: "Marc Puig", rate: 2, amount: 90 },
    { name: "Ane Etxeberria", rate: 1, amount: 120 },
    { name: "Hugo Fernández", rate: 0, amount: 40.5 },
    { name: "Sofía López", rate: 0, amount: 45 },
];
const BILL = { press: 1500, busy: 1700, from: 1800, done: 3300 };

function RatesScene({ t, labels, locale }: Props) {
    const { ac } = labels;
    const progress = easeInOut(span(t, BILL.from, BILL.done - BILL.from));
    const count = Math.round(64 * progress);

    return (
        <>
            <Title
                aside={
                    <span className="w-[8.4em]">
                        <ActionButton t={t} press={BILL.press} busy={BILL.busy} done={BILL.done} label={ac.billMonth} doneLabel={fill(ac.invoicesDone, { n: "64" })} />
                    </span>
                }
            >
                {ac.rates}
            </Title>

            {/* The fees. */}
            {RATES.map((rate, index) => {
                const Icon = rate.icon;
                return (
                    <At key={index} x={(index % 2) * 6.7} y={2.6 + Math.floor(index / 2) * 4.1} w={6.4} h={3.7}>
                        <Pop show={on(t, 150 + index * 120)} from="up" className="flex h-full flex-col justify-between rounded-[0.7em] p-[0.55em] ds-glass-inner">
                            <span className="flex items-center gap-[0.3em] text-ink-2">
                                <Icon className="size-[0.55em] shrink-0" />
                                <span className="line-clamp-2 text-[0.36em] font-semibold uppercase leading-tight tracking-[0.05em]">{ac.rateNames[index]}</span>
                            </span>
                            <span className={cn("text-[0.85em] font-semibold tabular-nums tracking-[-0.02em]", rate.price < 0 && "text-green-600 dark:text-green-400")}>
                                {rate.price < 0 ? `−${Math.abs(rate.price)} %` : money(locale, rate.price, 0)}
                            </span>
                        </Pop>
                    </At>
                );
            })}

            {/* How they are collected, set once too. */}
            <At x={0} y={11} w={13.1} h={9.6}>
                <Pop show={on(t, 700)} from="up" className="flex h-full flex-col gap-[0.5em] rounded-[0.9em] p-[0.7em] ds-glass-inner">
                    <Caps>{ac.autoCollect}</Caps>
                    {ac.rules.map((rule, index) => {
                        const Icon = [CalendarClock, Landmark, BellRing][index];
                        return (
                            <Pop key={rule} show={on(t, 900 + index * 150)} className="flex items-center gap-[0.45em] rounded-[0.5em] bg-fill/70 px-[0.5em] py-[0.4em]">
                                <Icon className="size-[0.6em] shrink-0 text-ink-2" />
                                <span className="truncate text-[0.42em]">{rule}</span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>

            {/* June, billed from them. */}
            <At x={13.8} y={2.6} w={W - 13.8} h={18}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.4em] rounded-[0.9em] p-[0.7em] ds-glass-inner">
                    <span className="flex items-center justify-between">
                        <Caps>{ac.juneBilling}</Caps>
                        <span className="text-[0.42em] font-semibold tabular-nums text-ink-2">{count}/64</span>
                    </span>
                    <span className="h-[0.25em] overflow-hidden rounded-full bg-fill-2">
                        <span className="block h-full origin-left rounded-full" style={{ transform: `scaleX(${progress})`, background: "var(--ds-brand-gradient)" }} />
                    </span>
                    {BILLED.map((row, index) => {
                        const at = BILL.from + index * 260;
                        return (
                            <Pop key={row.name} show={on(t, at)} from="down" className="relative flex items-center gap-[0.45em] border-b border-hairline py-[0.4em]">
                                <Fresh t={t} at={at} />
                                <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
                                    <span className="truncate text-[0.44em] font-medium">{row.name}</span>
                                    <span className="truncate text-[0.36em] text-ink-3">
                                        {ac.rateNames[row.rate]}
                                        {index === 3 ? ` | ${ac.rateNames[3]}` : ""}
                                    </span>
                                </span>
                                <span className="text-[0.46em] font-semibold tabular-nums">{money(locale, row.amount, 2)}</span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* notices · a class moves, the phone knows                                                       */
/* ---------------------------------------------------------------------------------------------- */

const MOVE = { notify: 900, moved: 1900 };
const WEEK = [
    { day: 0, time: [17, 18], cls: 1, moves: true },
    { day: 2, time: [17, 18], cls: 1 },
    { day: 3, time: [18, 19], cls: 2 },
];

function NoticesScene({ t, labels, locale }: Props) {
    const { ac } = labels;
    const moved = on(t, MOVE.moved);
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" });

    return (
        <>
            <Lights />
            <At {...SOLO_PHONE}>
                <PhoneFrame
                    x={0}
                    y={0}
                    w={SOLO_PHONE.w}
                    h={SOLO_PHONE.h}
                    tab={1}
                    overlay={
                        <Pop show={between(t, MOVE.notify, MOVE.moved + 600)} from="down">
                            <PhoneNotification title={ac.scheduleChange} body={ac.scheduleChangeBody} />
                        </Pop>
                    }
                >
                    <div className="flex h-full flex-col gap-[0.6em] px-[0.6em] pt-[0.3em]">
                        <span className="flex items-center gap-[0.45em]">
                            <Avatar initials="LG" hue={25} size={1.6} />
                            <span className="flex flex-col gap-[0.15em]">
                                <span className="text-[0.52em] font-semibold">Lucía García</span>
                                <span className="text-[0.38em] text-ink-3">{ac.classNames[1]}</span>
                            </span>
                        </span>
                        <Caps tone="text-ink-3">{ac.thisWeek}</Caps>
                        {WEEK.map((item, index) => {
                            const shift = item.moves && moved ? 1 : 0;
                            return (
                                <Pop key={index} show={on(t, 200 + index * 100)} from="up" className="relative flex items-center gap-[0.55em] rounded-[0.7em] bg-surface/80 p-[0.55em] ring-1 ring-hairline">
                                    {item.moves && <Fresh t={t} at={MOVE.moved} className="rounded-[0.7em]" />}
                                    <span className={cn("h-[2em] w-[0.18em] rounded-full", item.cls === 1 ? "bg-violet-500" : "bg-green-500")} />
                                    <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                        <span className="text-[0.38em] font-semibold uppercase tracking-[0.06em] text-ink-3">{weekday.format(new Date(2026, 5, 8 + item.day))}</span>
                                        <span className="truncate text-[0.48em] font-semibold">{ac.classNames[item.cls]}</span>
                                    </span>
                                    <Morph
                                        show={shift === 1}
                                        end
                                        from={<span className="text-[0.48em] font-medium tabular-nums">{`${item.time[0]}:00 – ${item.time[1]}:00`}</span>}
                                        to={<span className="text-[0.48em] font-semibold tabular-nums text-violet-600 dark:text-violet-300">{`${item.time[0] + 1}:00 – ${item.time[1] + 1}:00`}</span>}
                                    />
                                </Pop>
                            );
                        })}
                        <Pop show={on(t, 2800)} from="up" className="flex items-center gap-[0.5em] rounded-[0.7em] bg-amber-50 p-[0.55em] dark:bg-amber-500/15">
                            <Ticket className="size-[0.7em] text-amber-600" />
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
                                <span className="truncate text-[0.44em] font-semibold">{ac.bundleLeft}</span>
                                <span className="truncate text-[0.36em] text-ink-3">{ac.bundleHint}</span>
                            </span>
                        </Pop>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* bundle · a pass, a discount, a payment in two                                                  */
/* ---------------------------------------------------------------------------------------------- */

const USED = 8;
const PAY = { first: 1900, second: 2900, export: 3500, busy: 3700, done: 4200 };

function BundleScene({ t, labels, locale }: Props) {
    const { ac, p } = labels;
    const used = Array.from({ length: 10 }, (_, index) => index < USED && on(t, 300 + index * 140)).filter(Boolean).length;
    const paid = (on(t, PAY.first) ? 40.5 : 0) + (on(t, PAY.second) ? 40.5 : 0);
    const total = 81;

    return (
        <>
            <Title
                aside={
                    <span className="w-[8.6em]">
                        <ActionButton
                            t={t}
                            press={PAY.export}
                            busy={PAY.busy}
                            done={PAY.done}
                            label={
                                <span className="flex items-center gap-[0.35em]">
                                    <Download className="size-[1.05em]" />
                                    {ac.export}
                                </span>
                            }
                            doneLabel={ac.exported}
                        />
                    </span>
                }
            >
                <span className="flex items-center gap-[0.5em]">
                    <Avatar initials="MP" hue={265} size={1.5} />
                    Marc Puig
                </span>
            </Title>

            {/* The pass, class by class. */}
            <At x={0} y={2.6} w={W} h={4.2}>
                <Pop show={on(t, 100)} from="up" className="flex h-full items-center gap-[0.9em] rounded-[0.9em] px-[0.8em] ds-glass-inner">
                    <span className="flex flex-col gap-[0.25em]">
                        <span className="flex items-center gap-[0.35em]">
                            <Ticket className="size-[0.6em] text-amber-600" />
                            <span className="text-[0.48em] font-semibold">{ac.rateNames[2]}</span>
                        </span>
                        <span className="text-[0.4em] tabular-nums text-ink-3">{fill(ac.used, { n: String(used) })}</span>
                    </span>
                    <span className="ml-auto flex gap-[0.25em]">
                        {Array.from({ length: 10 }, (_, index) => (
                            <span key={index} className={cn("size-[1.05em] rounded-[0.3em] transition-colors duration-300", index < used ? "bg-amber-400" : "bg-fill-2")} />
                        ))}
                    </span>
                </Pop>
            </At>

            {/* The invoice. */}
            <At x={0} y={7.4} w={W} h={13.2}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.5em] rounded-[0.9em] p-[0.8em] ds-glass-inner">
                    <Caps>{ac.invoice} | #A-2026-0612</Caps>
                    {[
                        [ac.rateNames[2], 90],
                        [ac.rateNames[3], -9],
                    ].map(([line, amount]) => (
                        <span key={line as string} className="flex items-center justify-between border-b border-hairline pb-[0.35em]">
                            <span className="text-[0.46em] text-ink-2">{line}</span>
                            <span className={cn("text-[0.48em] font-medium tabular-nums", (amount as number) < 0 && "text-green-600 dark:text-green-400")}>
                                {(amount as number) < 0 ? "−" : ""}
                                {money(locale, Math.abs(amount as number), 2)}
                            </span>
                        </span>
                    ))}
                    <span className="flex items-center justify-between">
                        <span className="text-[0.5em] font-semibold">{p.total}</span>
                        <span className="text-[0.8em] font-semibold tabular-nums">{money(locale, total, 2)}</span>
                    </span>
                    {/* Paid in two. */}
                    <span className="flex flex-col gap-[0.35em] rounded-[0.6em] bg-fill/70 p-[0.55em]">
                        <span className="flex items-center justify-between">
                            <span className="text-[0.42em] text-ink-2">{fill(ac.paidOf, { paid: money(locale, paid, 2), total: money(locale, total, 2) })}</span>
                            <SettlePill t={t} at={PAY.second} from={ac.partial} to={p.paid} fromTone="yellow" />
                        </span>
                        <span className="h-[0.3em] overflow-hidden rounded-full bg-fill-2">
                            <span className="block h-full origin-left rounded-full bg-green-500 transition-transform duration-700 ease-spring" style={{ transform: `scaleX(${paid / total})` }} />
                        </span>
                    </span>
                </Pop>
            </At>
        </>
    );
}


/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    today: { Scene: TodayScene, duration: SAVED_AT + 800 },
    rates: { Scene: RatesScene, duration: 3800 },
    notices: { Scene: NoticesScene, duration: 3600, ...SOLO },
    bundle: { Scene: BundleScene, duration: 4600 },
} satisfies Record<string, SceneSpec<AcademiesLabels>>;

export type AcademiesSceneKey = keyof typeof SCENES;

export default function AcademiesScenes({ scene, labels, locale, max }: { scene: AcademiesSceneKey; labels: AcademiesLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
