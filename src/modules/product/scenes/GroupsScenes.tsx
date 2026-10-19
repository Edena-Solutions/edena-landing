import { Building2, Check, ChevronDown, Download, Megaphone, Send } from "lucide-react";

import { LogoMark } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Pop, easeInOut, easeOut, fill, money, number, on, percent, span, typed } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { ActionButton, Caps, Caret, Fresh, Morph, Pill, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type GroupsLabels = ProductSceneLabels & { gr: Translation["groupsScenes"] };

/*
 * The groups page's scenes — a network of schools on one platform:
 *
 *   network    (hero) every centre at a glance, and the network's totals adding up from them
 *   compare    one panel: "all centres", then one of them picked, the figures following
 *   billing    June billed for the whole network at once, centre by centre, each with its series
 *   broadcast  one message to the whole network, delivered centre by centre under each one's name
 *   report     the network's finances, centre by centre, sorted and exported
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: GroupsLabels;
    locale: string;
}

const W = CONTENT.w;
const CENTRES = [
    { students: 612, attendance: 96.8, collected: 94, tone: "#22c55e" },
    { students: 488, attendance: 95.1, collected: 89, tone: "#0ea5e9" },
    { students: 540, attendance: 97.2, collected: 96, tone: "#8b5cf6" },
    { students: 396, attendance: 94.6, collected: 87, tone: "#f97316" },
    { students: 470, attendance: 96.1, collected: 92, tone: "#ec4899" },
    { students: 434, attendance: 95.4, collected: 90, tone: "#14b8a6" },
];
const TOTAL_STUDENTS = CENTRES.reduce((sum, centre) => sum + centre.students, 0);

function CentreMark({ index, size = 1.4 }: { index: number; size?: number }) {
    return (
        <span className="flex shrink-0 items-center justify-center rounded-[0.35em] text-white" style={{ width: `${size}em`, height: `${size}em`, background: CENTRES[index].tone }}>
            <LogoMark className="size-[55%]" />
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* network · every centre at a glance                                                             */
/* ---------------------------------------------------------------------------------------------- */

function NetworkScene({ t, labels, locale }: Props) {
    const { gr } = labels;
    const count = easeOut(span(t, 600, 2200));
    const added = (index: number) => easeOut(span(t, 500 + index * 220, 900));
    const students = CENTRES.reduce((sum, centre, index) => sum + centre.students * added(index), 0);

    return (
        <>
            <Title aside={<Pill tone="gray">{fill(gr.centresCount, { n: String(CENTRES.length) })}</Pill>}>{gr.network}</Title>

            {/* The network's totals. */}
            {[
                [gr.kpis[0], number(locale, Math.round(students))],
                [gr.kpis[1], percent(locale, 95.9 * count, 1)],
                [gr.kpis[2], percent(locale, 91.4 * count, 1)],
            ].map(([label, value], index) => (
                <At key={index} x={index * 10.2} y={2.5} w={9.8} h={3.6}>
                    <Pop show={on(t, 100 + index * 90)} from="up" className="flex h-full flex-col justify-between rounded-[0.8em] bg-fill-2 p-[0.65em]">
                        <span className="text-[0.4em] font-semibold uppercase tracking-[0.1em] text-ink-2">{label}</span>
                        <span className="text-[1.2em] font-light leading-none tabular-nums tracking-[-0.03em]">{value}</span>
                    </Pop>
                </At>
            ))}

            {/* The centres. */}
            {CENTRES.map((centre, index) => {
                const p = added(index);
                return (
                    <At key={index} x={(index % 3) * 10.2} y={6.7 + Math.floor(index / 3) * 6.3} w={9.8} h={5.9}>
                        <Pop show={on(t, 400 + index * 220)} from="up" className="relative flex h-full flex-col gap-[0.45em] rounded-[0.8em] p-[0.6em] ds-glass-inner">
                            <Fresh t={t} at={400 + index * 220} className="rounded-[0.8em]" />
                            <span className="flex items-center gap-[0.4em]">
                                <CentreMark index={index} />
                                <span className="flex min-w-0 flex-col gap-[0.1em]">
                                    <span className="truncate text-[0.46em] font-semibold">{gr.centres[index]}</span>
                                    <span className="truncate text-[0.36em] text-ink-3">{gr.cities[index]}</span>
                                </span>
                            </span>
                            <span className="text-[0.75em] font-light tabular-nums tracking-[-0.02em]">
                                {number(locale, Math.round(centre.students * p))} <span className="text-[0.5em] text-ink-3">{gr.students}</span>
                            </span>
                            {[
                                [gr.kpis[1], centre.attendance],
                                [gr.kpis[2], centre.collected],
                            ].map(([label, value]) => (
                                <span key={label as string} className="flex items-center gap-[0.35em]">
                                    <span className="w-[4.6em] truncate text-[0.34em] text-ink-3">{label}</span>
                                    <span className="h-[0.22em] flex-1 overflow-hidden rounded-full bg-fill-2">
                                        <span className="block h-full origin-left rounded-full" style={{ background: centre.tone, transform: `scaleX(${((value as number) / 100) * p})` }} />
                                    </span>
                                    <span className="text-[0.34em] tabular-nums text-ink-2">{percent(locale, value as number, 0)}</span>
                                </span>
                            ))}
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* compare · all centres, then one                                                                */
/* ---------------------------------------------------------------------------------------------- */

const PICK = { open: 1300, hover: 1700, pick: 2100 };
const PICKED = 2;

function CompareScene({ t, labels, locale }: Props) {
    const { gr } = labels;
    const open = between(t, PICK.open, PICK.pick);
    const picked = on(t, PICK.pick);
    const centre = CENTRES[PICKED];
    const values = picked ? [number(locale, centre.students), percent(locale, centre.attendance, 1), percent(locale, centre.collected, 0)] : [number(locale, TOTAL_STUDENTS), percent(locale, 95.9, 1), percent(locale, 91.4, 1)];
    const grow = easeOut(span(t, 400, 1200));

    return (
        <>
            {/* The centre switcher. */}
            <At x={0} y={0} w={14} h={1.7} className="z-30">
                <span className={cn("flex h-full items-center gap-[0.45em] rounded-[0.55em] bg-fill px-[0.55em] transition-shadow duration-300", open && "ring-[0.1em] ring-ink/40")}>
                    {picked ? <CentreMark index={PICKED} size={1.1} /> : <Building2 className="size-[0.65em] text-ink-2" />}
                    <span className="flex-1 truncate text-[0.5em] font-semibold">{picked ? gr.centres[PICKED] : gr.allCentres}</span>
                    <ChevronDown className="size-[0.6em] text-ink-3" />
                </span>
                <span
                    className={cn(
                        "absolute inset-x-0 top-[1.95em] flex flex-col rounded-[0.6em] bg-surface p-[0.25em] elev-4 ring-1 ring-hairline transition-[opacity,translate,scale] duration-300 ease-spring",
                        open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-[0.4em] scale-95 opacity-0",
                    )}
                >
                    <span className="absolute inset-x-[0.25em] h-[1.4em] rounded-[0.4em] bg-fill-2 transition-transform duration-300 ease-spring" style={{ top: "0.25em", transform: `translateY(${(on(t, PICK.hover) ? PICKED + 1 : 0) * 1.4}em)` }} />
                    {[gr.allCentres, ...gr.centres.slice(0, 4)].map((name, index) => (
                        <span key={name} className="relative flex h-[1.4em] items-center gap-[0.4em] px-[0.4em]">
                            {index === 0 ? <Building2 className="size-[0.55em] text-ink-2" /> : <CentreMark index={index - 1} size={0.9} />}
                            <span className="truncate text-[0.44em]">{name}</span>
                            {((index === 0 && !picked) || (index === PICKED + 1 && picked)) && <Check className="ml-auto size-[0.55em]" />}
                        </span>
                    ))}
                </span>
            </At>

            {/* The figures, following the choice. */}
            {gr.kpis.map((label, index) => (
                <At key={label} x={index * 10.2} y={2.4} w={9.8} h={3.8}>
                    <Pop show={on(t, 100 + index * 90)} from="up" className="relative flex h-full flex-col justify-between rounded-[0.8em] p-[0.65em] ds-glass-inner">
                        {picked && <Fresh t={t} at={PICK.pick} className="rounded-[0.8em]" />}
                        <span className="text-[0.4em] font-semibold uppercase tracking-[0.1em] text-ink-2">{label}</span>
                        <Morph show={picked} from={<span className="text-[1.1em] font-light tabular-nums tracking-[-0.03em]">{index === 0 ? number(locale, TOTAL_STUDENTS) : index === 1 ? percent(locale, 95.9, 1) : percent(locale, 91.4, 1)}</span>} to={<span className="text-[1.1em] font-light tabular-nums tracking-[-0.03em]">{values[index]}</span>} />
                    </Pop>
                </At>
            ))}

            {/* Attendance by centre: the picked one stands out. */}
            <At x={0} y={6.8} w={W} h={13.8}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps>{gr.attendanceByCentre}</Caps>
                    <span className="flex flex-1 items-end justify-between gap-[0.6em] px-[0.3em] pb-[0.2em]">
                        {CENTRES.map((item, index) => {
                            const focus = !picked || index === PICKED;
                            return (
                                <span key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-[0.35em]">
                                    <span className="text-[0.38em] tabular-nums text-ink-2">{percent(locale, item.attendance, 1)}</span>
                                    <span
                                        className="w-full rounded-t-[0.4em] transition-opacity duration-500"
                                        style={{ height: `${((item.attendance - 90) / 8) * 75 * grow}%`, background: item.tone, opacity: focus ? 1 : 0.25 }}
                                    />
                                    <span className="w-full truncate text-center text-[0.34em] text-ink-3">{gr.centresShort[index]}</span>
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
/* billing · the whole network at once                                                            */
/* ---------------------------------------------------------------------------------------------- */

const RUN = { press: 700, busy: 900, from: 1000, step: 380 };
const INVOICES = [612, 488, 540, 396, 470, 434];
const AMOUNTS = [312400, 241800, 289500, 188200, 236900, 214700];
const RUN_DONE = RUN.from + CENTRES.length * RUN.step + 400;

function BillingScene({ t, labels, locale }: Props) {
    const { gr } = labels;
    const progress = (index: number) => easeInOut(span(t, RUN.from + index * RUN.step, 700));
    const billed = AMOUNTS.reduce((sum, amount, index) => sum + amount * progress(index), 0);
    const issued = INVOICES.reduce((sum, count, index) => sum + count * progress(index), 0);

    return (
        <>
            <Title
                aside={
                    <span className="w-[8.6em]">
                        <ActionButton t={t} press={RUN.press} busy={RUN.busy} done={RUN_DONE} label={gr.runBilling} doneLabel={fill(gr.billed, { n: number(locale, 2940) })} />
                    </span>
                }
            >
                {gr.billing}
            </Title>
            <At x={0} y={2.4} w={W} className="flex items-baseline justify-between px-[0.2em]">
                <span className="text-[1.15em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, billed, 0)}</span>
                <span className="text-[0.44em] tabular-nums text-ink-2">
                    {number(locale, Math.round(issued))} / {number(locale, 2940)}
                </span>
            </At>
            {CENTRES.map((centre, index) => {
                const p = progress(index);
                return (
                    <At key={index} x={0} y={4.4 + index * 2.6} w={W} h={2.6}>
                        <Pop show={on(t, 150 + index * 70)} from="up" className="relative flex h-full items-center gap-[0.55em] border-b border-hairline px-[0.2em]">
                            <CentreMark index={index} />
                            <span className="flex w-[7.6em] min-w-0 flex-col gap-[0.15em]">
                                <span className="truncate text-[0.46em] font-semibold">{gr.centres[index]}</span>
                                <span className="font-mono text-[0.34em] text-ink-3">
                                    {gr.series} {gr.seriesCodes[index]}
                                </span>
                            </span>
                            <span className="h-[0.3em] flex-1 overflow-hidden rounded-full bg-fill-2">
                                <span className="block h-full origin-left rounded-full" style={{ background: centre.tone, transform: `scaleX(${p})` }} />
                            </span>
                            <span className="w-[4.6em] text-right text-[0.46em] font-medium tabular-nums">{money(locale, AMOUNTS[index] * p, 0)}</span>
                            <span className={cn("grid size-[1em] place-items-center rounded-full bg-green-500 text-white transition-[opacity,scale] duration-300", p >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
                                <Check className="size-[0.55em]" />
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* broadcast · one message, every centre                                                          */
/* ---------------------------------------------------------------------------------------------- */

const SEND = { type: 300, audience: 1700, press: 2200, from: 2500, step: 260 };
const AUDIENCE = [612, 488, 540, 396, 470, 434];

function BroadcastScene({ t, labels, locale }: Props) {
    const { gr } = labels;
    const message = typed(gr.message, t, SEND.type, 22);
    const whole = on(t, SEND.audience);
    const sent = on(t, SEND.from);

    return (
        <>
            {/* The message. */}
            <At x={0} y={0} w={13.4} h={20.6}>
                <Pop show={on(t, 100)} from="up" className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <span className="flex items-center gap-[0.4em]">
                        <Megaphone className="size-[0.65em] text-ink-2" />
                        <span className="text-[0.52em] font-semibold">{gr.newMessage}</span>
                    </span>
                    <span className="min-h-[5em] rounded-[0.55em] bg-fill/70 p-[0.55em]">
                        <span className="text-[0.48em] leading-snug">
                            {message.text}
                            <Caret show={message.typing} />
                        </span>
                    </span>
                    <Caps tone="text-ink-3">{gr.audience}</Caps>
                    <span className="flex flex-wrap gap-[0.3em]">
                        <span className={cn("flex h-[1.4em] items-center gap-[0.3em] rounded-full px-[0.6em] transition-colors duration-300", whole ? "bg-ink text-canvas" : "bg-fill text-ink-2")}>
                            <Building2 className="size-[0.5em]" />
                            <span className="text-[0.4em] font-semibold">{gr.wholeNetwork}</span>
                        </span>
                        {gr.centresShort.slice(0, 3).map((name) => (
                            <span key={name} className="flex h-[1.4em] items-center rounded-full bg-fill px-[0.6em] text-ink-2">
                                <span className="text-[0.4em]">{name}</span>
                            </span>
                        ))}
                    </span>
                    <span className={cn("mt-auto flex h-[1.8em] items-center justify-center gap-[0.35em] rounded-full bg-ink text-canvas transition-[scale,background-color] duration-300", between(t, SEND.press, SEND.from) && "scale-95", sent && "bg-green-500 text-white")}>
                        <Send className="size-[0.55em]" />
                        <span className="text-[0.48em] font-semibold">{sent ? gr.sent : gr.send}</span>
                    </span>
                </Pop>
            </At>

            {/* Delivered, centre by centre, each under its own name. */}
            {CENTRES.map((centre, index) => {
                const at = SEND.from + index * SEND.step;
                const delivered = Math.round(AUDIENCE[index] * easeOut(span(t, at, 900)));
                return (
                    <At key={index} x={14} y={index * 3.45} w={W - 14} h={3.1}>
                        <Pop show={on(t, 200 + index * 80)} from="up" className="relative flex h-full items-center gap-[0.55em] rounded-[0.7em] p-[0.5em] ds-glass-inner">
                            <Fresh t={t} at={at} className="rounded-[0.7em]" />
                            <CentreMark index={index} size={1.6} />
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
                                <span className="truncate text-[0.46em] font-semibold">{gr.centres[index]}</span>
                                <span className="h-[0.22em] overflow-hidden rounded-full bg-fill-2">
                                    <span className="block h-full origin-left rounded-full" style={{ background: centre.tone, transform: `scaleX(${delivered / AUDIENCE[index]})` }} />
                                </span>
                            </span>
                            <span className="text-[0.4em] tabular-nums text-ink-2">
                                {number(locale, delivered)} {gr.delivered}
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* report · the network's finances                                                                */
/* ---------------------------------------------------------------------------------------------- */

const SORT_AT = 1900;
const EXPORT = { press: 3000, busy: 3200, done: 3700 };
const FIN = [
    { income: 312400, occupancy: 96, arrears: 1.8 },
    { income: 241800, occupancy: 88, arrears: 3.4 },
    { income: 289500, occupancy: 93, arrears: 1.2 },
    { income: 188200, occupancy: 81, arrears: 4.1 },
    { income: 236900, occupancy: 90, arrears: 2.2 },
    { income: 214700, occupancy: 86, arrears: 2.9 },
];
const SORTED = FIN.map((_, index) => index).sort((a, b) => FIN[b].income - FIN[a].income);
const REPORT_COLS = [0.3, 10.2, 16.6, 23.8];

function ReportScene({ t, labels, locale }: Props) {
    const { gr } = labels;
    const sorted = on(t, SORT_AT);
    const grow = easeOut(span(t, 400, 1200));

    return (
        <>
            <Title
                aside={
                    <span className="w-[6.4em]">
                        <ActionButton
                            t={t}
                            press={EXPORT.press}
                            busy={EXPORT.busy}
                            done={EXPORT.done}
                            label={
                                <span className="flex items-center gap-[0.35em]">
                                    <Download className="size-[1.05em]" />
                                    {gr.export}
                                </span>
                            }
                            doneLabel={gr.exported}
                        />
                    </span>
                }
            >
                {gr.report}
            </Title>
            <At x={0} y={2.5} w={W} h={0.8}>
                {gr.columns.map((column, index) => (
                    <span key={column} className={cn("absolute flex items-center gap-[0.2em]", index === 1 && sorted && "text-ink")} style={{ left: `${REPORT_COLS[index]}em` }}>
                        <Caps tone={index === 1 && sorted ? "text-ink" : "text-ink-3"}>{column}</Caps>
                        {index === 1 && <ChevronDown className={cn("size-[0.45em] transition-opacity duration-300", sorted ? "opacity-100" : "opacity-0")} />}
                    </span>
                ))}
            </At>
            {FIN.map((row, index) => {
                const position = sorted ? SORTED.indexOf(index) : index;
                return (
                    <span key={index} className="absolute transition-[top] duration-700 ease-spring" style={{ left: 0, width: `${W}em`, top: `${3.6 + position * 2.6}em`, height: "2.6em" }}>
                        <Pop show={on(t, 200 + index * 80)} from="up" className="relative flex h-full items-center border-b border-hairline">
                            {/* Placed by column, each cell in its own box so its text size cannot move it. */}
                            <span className="absolute flex items-center gap-[0.45em]" style={{ left: `${REPORT_COLS[0]}em`, width: "8.6em" }}>
                                <CentreMark index={index} size={1.2} />
                                <span className="truncate text-[0.46em] font-medium">{gr.centres[index]}</span>
                            </span>
                            <span className="absolute" style={{ left: `${REPORT_COLS[1]}em` }}>
                                <span className="text-[0.48em] font-semibold tabular-nums">{money(locale, row.income * grow, 0)}</span>
                            </span>
                            <span className="absolute flex w-[5.4em] items-center gap-[0.35em]" style={{ left: `${REPORT_COLS[2]}em` }}>
                                <span className="h-[0.25em] flex-1 overflow-hidden rounded-full bg-fill-2">
                                    <span className="block h-full origin-left rounded-full bg-sky-500" style={{ transform: `scaleX(${(row.occupancy / 100) * grow})` }} />
                                </span>
                                <span className="text-[0.38em] tabular-nums text-ink-2">{percent(locale, row.occupancy, 0)}</span>
                            </span>
                            <span className="absolute" style={{ left: `${REPORT_COLS[3]}em` }}>
                                <Pill tone={row.arrears >= 3 ? "red" : row.arrears >= 2 ? "yellow" : "green"}>{percent(locale, row.arrears, 1)}</Pill>
                            </span>
                        </Pop>
                    </span>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    network: { Scene: NetworkScene, duration: 3800 },
    compare: { Scene: CompareScene, duration: 3300 },
    billing: { Scene: BillingScene, duration: RUN_DONE + 900 },
    broadcast: { Scene: BroadcastScene, duration: SEND.from + 6 * SEND.step + 1100 },
    report: { Scene: ReportScene, duration: 4400 },
} satisfies Record<string, SceneSpec<GroupsLabels>>;

export type GroupsSceneKey = keyof typeof SCENES;

export default function GroupsScenes({ scene, labels, locale, max }: { scene: GroupsSceneKey; labels: GroupsLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
