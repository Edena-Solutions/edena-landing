import {
    ArrowLeftRight,
    CreditCard,
    FileText,
    History,
    Landmark,
    Mail,
    Send,
    ShieldCheck,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";

import type { ReactNode } from "react";

import { PhoneFrame, PhoneNotification, wordmarkSrc } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Chip, Line, Pop, capitalize, clamp01, course, easeInOut, easeOut, money, monthName, on, percent, shortDate, span } from "@/components/wizard/scene-kit";
import { DrawnCheck, KEY_FEATURE_SCENES, Ripple, Title } from "@/modules/home/KeyFeaturesScenes";
import { cn } from "@/lib/utils";
import { ActionButton, Caps, DUO, DUO_PANE_RIGHT, DUO_PHONE_LEFT, Fresh, Lights, Pane, Pill, SettlePill, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

/*
 * The billing page's scenes, drawn from `screenshots/finance/*` and `invoice/*` in the home's
 * abstract style:
 *
 *   breakdown  (hero) the month's billing: invoices drawn up, the totals by way of payment filling
 *              in, then everything sent to the families
 *   pay        an invoice reaches a family's phone and is paid there; on the school's collections
 *              behind it, that family's row settles and the month's total grows
 *   cycle      the billing cycle settling family by family, sealed by Verifactu (the home's scene)
 *   analytics  what was billed, what was collected, month by month
 *   invoice    an invoice composed — its Verifactu QR drawn — and on its way: registered, sent, paid
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ProductSceneLabels;
    locale: string;
}

const W = CONTENT.w;
const SECTION = "block truncate text-[0.42em] font-semibold uppercase tracking-[0.12em] text-ink-2";
const FIELD_LABEL = "block truncate text-[0.36em] font-semibold uppercase tracking-[0.1em] text-ink-3";

function IconSquare({ icon: Icon, pressed = false, className }: { icon: LucideIcon; pressed?: boolean; className?: string }) {
    return (
        <span
            className={cn(
                "flex size-[1.55em] items-center justify-center rounded-[0.45em] ds-glass-inner transition-[scale,background-color,color] duration-300",
                pressed && "scale-90 bg-ink text-canvas",
                className,
            )}
        >
            <Icon className="size-[0.68em]" />
        </span>
    );
}

/** A pill whose words change in place: the old ones leave upward, the new ones rise in. */
function Morph({ show, from, to, className }: { show: boolean; from: ReactNode; to: ReactNode; className?: string }) {
    return (
        <span className={cn("inline-grid", className)}>
            <span className={cn("[grid-area:1/1] transition-[opacity,translate,filter] duration-500 ease-spring", show ? "-translate-y-[0.5em] opacity-0 blur-[3px]" : "opacity-100")}>
                {from}
            </span>
            <span className={cn("[grid-area:1/1] transition-[opacity,translate,filter] duration-500 ease-spring", show ? "opacity-100" : "translate-y-[0.5em] opacity-0 blur-[3px]")}>
                {to}
            </span>
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* breakdown · the month's billing                                                                */
/* ---------------------------------------------------------------------------------------------- */

const METHODS: { icon: LucideIcon; amount: number; tone: string; bar: string }[] = [
    { icon: Landmark, amount: 4120.8, tone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300", bar: "bg-indigo-500" },
    { icon: ArrowLeftRight, amount: 1781.43, tone: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300", bar: "bg-sky-400" },
    { icon: CreditCard, amount: 600, tone: "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300", bar: "bg-teal-400" },
];
const TOTAL = METHODS.reduce((sum, method) => sum + method.amount, 0);
const STUDENTS = [
    { name: "Leo Serrano", year: "p2", group: "A", method: 0, amount: 500 },
    { name: "Sofía López", year: "i4", group: "B", method: 1, amount: 739.65 },
    { name: "Thiago Rodríguez", year: "y2", group: "A", method: 0, amount: 547.01 },
    { name: "Valeria Vargas", year: "y6", group: "B", method: 2, amount: 592.1 },
    { name: "Daniel Navarro", year: "y6", group: "A", method: 0, amount: 753.65 },
] as const;
const BILL = { at: 900, duration: 1700 };
const SEND_AT = 3300;
const SENT_AT = SEND_AT + 900;

function BreakdownScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const billed = easeOut(span(t, BILL.at, BILL.duration));
    const sending = span(t, SEND_AT, 900);
    const sent = on(t, SENT_AT);
    const period = `${capitalize(monthName(locale, 5))} 2026`;

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, 150)} from="scale">
                            <Chip>{period}</Chip>
                        </Pop>
                        <Pop show={on(t, 220)} from="scale">
                            <IconSquare icon={History} className="text-ink-2" />
                        </Pop>
                        <Pop show={on(t, 290)} from="scale" className="relative">
                            <IconSquare icon={Send} pressed={t >= SEND_AT && t < SEND_AT + 260} className="text-ink-2" />
                            <Ripple p={span(t, SEND_AT, 900)} className="rounded-[0.45em] text-brand" />
                        </Pop>
                    </>
                }
            >
                {labels.billing}
            </Title>

            <At x={0} y={2.45} w={W} h={1.6} className="flex items-center gap-[0.4em]">
                <Pop show={on(t, 120)} from="blur" className="h-full">
                    <span className="flex h-full items-center gap-[0.4em] rounded-full px-[0.7em] ds-glass-inner">
                        <span className={cn("size-[0.35em] rounded-full transition-colors duration-500", billed < 1 ? "bg-orange-400" : "bg-green-500")} />
                        <span className="text-[0.5em]">
                            <b className="font-bold tabular-nums">{Math.round(22 * (1 - billed))}</b> {ui.toInvoice}
                        </span>
                    </span>
                </Pop>
                <Pop show={on(t, 180)} from="blur" className="h-full">
                    <Morph
                        show={sent}
                        className="h-full"
                        from={
                            <span className="flex h-full items-center gap-[0.4em] rounded-full px-[0.7em] ds-glass-inner">
                                <span className="size-[0.35em] rounded-full bg-sky-500" />
                                <span className="text-[0.5em]">
                                    <b className="font-bold tabular-nums">{Math.round(11 * (1 - easeOut(sending)))}</b> {p.toSend}
                                </span>
                            </span>
                        }
                        to={
                            <span className="flex h-full items-center gap-[0.35em] rounded-full bg-green-100 px-[0.7em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                <span className="size-[0.8em]">
                                    <DrawnCheck p={span(t, SENT_AT + 100, 450)} className="size-full" />
                                </span>
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{p.allSent}</span>
                            </span>
                        }
                    />
                </Pop>
                <span className="ml-auto flex flex-col items-end gap-[0.25em]">
                    <span className={FIELD_LABEL}>{ui.invoiced}</span>
                    <span className="text-[0.9em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, TOTAL * billed, 2)}</span>
                </span>
            </At>

            <At x={0} y={4.55} w={W} h={1.45}>
                <Pop show={on(t, 220)} from="blur" className="flex h-full rounded-full bg-fill p-[0.15em]">
                    {p.billingTabs.map((tab, index) => (
                        <span
                            key={tab}
                            className={cn(
                                "flex h-full min-w-0 flex-1 items-center justify-center rounded-full",
                                index === 2 ? "bg-surface text-ink elev-1" : "text-ink-3",
                            )}
                        >
                            <span className="truncate text-[0.42em] font-medium uppercase tracking-[0.08em]">{tab}</span>
                        </span>
                    ))}
                </Pop>
            </At>

            {/* Totals by way of payment, and their shares. */}
            {METHODS.map((method, index) => (
                <At key={index} x={index * 10.2} y={6.55} w={9.8} h={3.3}>
                    <Pop show={on(t, 400 + index * 90)} from="blur" className="flex h-full flex-col justify-between rounded-[0.8em] p-[0.7em] ds-glass-inner">
                        <span className="flex items-center gap-[0.4em]">
                            <span className={cn("flex size-[1.25em] items-center justify-center rounded-[0.4em]", method.tone)}>
                                <method.icon className="size-[0.6em]" />
                            </span>
                            <span className="truncate text-[0.46em] font-medium text-ink-2">{p.paymentMethods[index]}</span>
                        </span>
                        <span className="text-[0.95em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, method.amount * billed, 2)}</span>
                    </Pop>
                </At>
            ))}
            <At x={0} y={10.3} w={W} h={0.42} className="flex gap-[0.15em] overflow-hidden rounded-full bg-fill">
                {METHODS.map((method, index) => (
                    <span
                        key={index}
                        className={cn("h-full rounded-full", method.bar)}
                        style={{ width: `${(method.amount / TOTAL) * 100 * billed}%` }}
                    />
                ))}
            </At>

            {/* The students billed. */}
            <At x={0} y={11.35} w={W} className="flex items-center justify-between">
                <span className={SECTION}>
                    {p.billedStudents} ({Math.round(11 * billed)})
                </span>
            </At>
            {STUDENTS.map((student, index) => {
                const method = METHODS[student.method];
                const at = BILL.at + index * 280;
                const landed = on(t, SEND_AT + 150 + index * 120);
                return (
                    <At key={student.name} x={0} y={12.5 + index * 1.9} w={W} h={1.9}>
                        <Pop show={on(t, at)} from="blur" className="flex h-full items-center gap-[0.6em] border-b border-hairline px-[0.3em]">
                            <span className="w-[8.6em] truncate">
                                <span className="text-[0.52em] font-medium">{student.name}</span>
                            </span>
                            <span className={cn("flex size-[1.2em] shrink-0 items-center justify-center rounded-[0.35em]", method.tone)}>
                                <method.icon className="size-[0.55em]" />
                            </span>
                            <span className="ml-[0.8em] w-[4em]">
                                <span className="text-[0.48em] text-ink-2">{course(ui.courses, student.year, student.group)}</span>
                            </span>
                            <Line w={5 - (index % 3)} className="h-[0.26em]" />
                            <span className="ml-auto flex items-center gap-[0.5em]">
                                <span className={cn("size-[0.75em] text-sky-500 transition-opacity duration-300", landed ? "opacity-100" : "opacity-0")}>
                                    <Mail className="size-full" />
                                </span>
                                <span className="text-[0.52em] font-medium tabular-nums">{money(locale, student.amount, 2)}</span>
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* pay · on the family's phone                                                                    */
/* ---------------------------------------------------------------------------------------------- */

const INVOICE_LINES = [161.5, 50, 520];
const INVOICE_TOTAL = INVOICE_LINES.reduce((sum, amount) => sum + amount, 0);
const PAY = { notify: 400, open: 1450, press: 2750, busy: 2950, paid: 3500, settled: 3800 };
/** The month's collections, as the school sees them; María García's is the one paid on the phone. */
const COLLECTIONS = [
    { name: "María García", amount: INVOICE_TOTAL, paidAt: PAY.settled },
    { name: "Pedro Castro", amount: 731.46, paidAt: 0 },
    { name: "Ane Etxeberria", amount: 439.11, paidAt: -1 },
    { name: "Marc Puig", amount: 744.95, paidAt: 0 },
    { name: "Mónica Delgado", amount: 621.07, paidAt: -1 },
];
const COLLECTED = 2096.48;

function PayScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const opened = on(t, PAY.open);
    const collected = COLLECTED + INVOICE_TOTAL * easeOut(span(t, PAY.settled, 900));

    return (
        <>
            <Lights />

            {/* The school's collections: the one paid on the phone settles here. */}
            <Pane box={DUO_PANE_RIGHT} clear="left">
                <span className="flex items-end justify-between gap-[0.6em]">
                    <span className="flex min-w-0 flex-col gap-[0.35em]">
                        <Caps>{p.collectionsReport}</Caps>
                        <span className="text-[1em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, collected, 2)}</span>
                    </span>
                    <Pop show={on(t, PAY.settled + 300)} from="scale">
                        <Chip icon={TrendingUp} className="bg-brand-soft text-brand-ink">
                            +{money(locale, INVOICE_TOTAL, 2)}
                        </Chip>
                    </Pop>
                </span>
                <span className="flex flex-col">
                    {COLLECTIONS.map((row, index) => (
                        <Pop key={row.name} show={on(t, 200 + index * 80)} from="up" className="relative flex h-[2.05em] items-center gap-[0.5em] border-b border-hairline px-[0.25em]">
                            {index === 0 && <Fresh t={t} at={PAY.settled} />}
                            <span className="w-[6.6em] truncate">
                                <span className="text-[0.48em] font-medium">{row.name}</span>
                            </span>
                            <span className="text-[0.46em] tabular-nums text-ink-2">{money(locale, row.amount, 2)}</span>
                            <span className="ml-auto">
                                {row.paidAt < 0 ? (
                                    <Pill tone="yellow">{ui.pending}</Pill>
                                ) : (
                                    <SettlePill t={row.paidAt === 0 ? Number.POSITIVE_INFINITY : t} at={row.paidAt} from={ui.pending} to={p.paid} />
                                )}
                            </span>
                        </Pop>
                    ))}
                </span>
            </Pane>

            {/* The family's phone: the invoice arrives, and is paid. */}
            <At {...DUO_PHONE_LEFT}>
                <Pop show={on(t, 100)} from="up" className="size-full">
                    <PhoneFrame
                        x={0}
                        y={0}
                        w={DUO_PHONE_LEFT.w}
                        h={DUO_PHONE_LEFT.h}
                        tab={1}
                        overlay={
                            <Pop show={between(t, PAY.notify, PAY.open)} from="down">
                                <PhoneNotification title={p.newInvoice} body={money(locale, INVOICE_TOTAL, 2)} />
                            </Pop>
                        }
                    >
                        <div className={cn("flex h-full flex-col gap-[0.7em] px-[0.75em] pt-[0.4em] transition-opacity duration-500", opened ? "opacity-100" : "opacity-0")}>
                            <span className="flex flex-col gap-[0.35em]">
                                <Caps tone="text-ink-3">{p.invoiceMeta[2]}</Caps>
                                <span className="text-[0.5em] font-semibold tabular-nums">#F-202606-1278</span>
                            </span>
                            <Pop show={opened} from="up" className="flex flex-col items-center gap-[0.3em] rounded-[0.8em] py-[0.8em] ds-glass-inner">
                                <Caps tone="text-ink-3">{p.total}</Caps>
                                <span className="text-[1.3em] font-semibold tabular-nums tracking-[-0.03em]">{money(locale, INVOICE_TOTAL, 2)}</span>
                                <span className="text-[0.42em] text-ink-3">{shortDate(locale, new Date(2026, 5, 5))}</span>
                            </Pop>
                            {p.invoiceLines.map((line, index) => (
                                <Pop key={line} show={on(t, PAY.open + 120 + index * 110)} className="flex items-center justify-between border-b border-hairline pb-[0.45em]">
                                    <span className="truncate text-[0.46em] text-ink-2">{line}</span>
                                    <span className="text-[0.46em] font-medium tabular-nums">{money(locale, INVOICE_LINES[index], 2)}</span>
                                </Pop>
                            ))}
                            <Pop show={on(t, PAY.open + 500)} className="mt-[0.3em]">
                                <ActionButton t={t} press={PAY.press} busy={PAY.busy} done={PAY.paid} label={p.payNow} doneLabel={p.paid} />
                            </Pop>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* analytics · billed and collected                                                               */
/* ---------------------------------------------------------------------------------------------- */

const KPIS = [
    { value: 48920, tone: "bg-fill-2 text-ink" },
    { value: 45310, tone: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
    { value: 3610, tone: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
];
const MONTHS = [
    { billed: 0.72, collected: 0.68 },
    { billed: 0.78, collected: 0.75 },
    { billed: 0.8, collected: 0.74 },
    { billed: 0.86, collected: 0.83 },
    { billed: 0.94, collected: 0.88 },
    { billed: 1, collected: 0.9 },
];
const BARS = { x: 0.9, y: 11.1, w: 17.8, h: 6 };
const STATUS = [
    { share: 92.6, color: "#22c55e" },
    { share: 5.9, color: "#f59e0b" },
    { share: 1.5, color: "#ef4444" },
];

function AnalyticsScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const count = easeOut(span(t, 300, 1500));
    const ring = easeInOut(span(t, 1500, 1600));
    const kpiLabels = [ui.invoiced, p.collected, ui.pending];
    const statusLabels = [p.collected, ui.pending, p.returned];
    let offset = 0;

    return (
        <>
            <Title
                aside={
                    <Pop show={on(t, 3300)} from="scale">
                        <Chip icon={TrendingUp} className="bg-brand-soft text-brand-ink">
                            +{percent(locale, 8 * easeOut(span(t, 3300, 800)), 0)}
                        </Chip>
                    </Pop>
                }
            >
                {p.collectionsReport}
            </Title>

            {KPIS.map((kpi, index) => (
                <At key={index} x={index * 10.2} y={2.6} w={9.8} h={4.2}>
                    <Pop show={on(t, 120 + index * 90)} from="blur" className={cn("flex h-full flex-col justify-between rounded-[0.8em] p-[0.75em]", kpi.tone)}>
                        <span className="truncate text-[0.44em] font-semibold uppercase tracking-[0.1em]">{kpiLabels[index]}</span>
                        <span className="text-[1.3em] font-light leading-none tabular-nums tracking-[-0.035em]">{money(locale, kpi.value * count)}</span>
                    </Pop>
                </At>
            ))}

            {/* Billed and collected, month by month. */}
            <At x={0} y={7.5} w={19.6} h={13.1}>
                <Pop show={on(t, 400)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.9} y={8.2} w={17.8} className="flex items-center justify-between">
                <span className="text-[0.52em] font-semibold text-ink-2">{p.byMonth}</span>
                <span className="flex items-center gap-[0.6em]">
                    {[ui.invoiced, p.collected].map((label, index) => (
                        <span key={label} className="flex items-center gap-[0.3em]">
                            <span className={cn("size-[0.4em] rounded-full", index === 0 ? "bg-ink/25" : "bg-green-500")} />
                            <span className="text-[0.42em] text-ink-2">{label}</span>
                        </span>
                    ))}
                </span>
            </At>
            <At x={BARS.x} y={BARS.y} w={BARS.w} h={BARS.h} className="flex items-end justify-between">
                {MONTHS.map((month, index) => {
                    const grow = easeOut(span(t, 700 + index * 110, 900));
                    return (
                        <span key={index} className="flex h-full w-[2.3em] items-end justify-center gap-[0.18em]">
                            <span className="w-[0.9em] rounded-t-[0.3em] bg-ink/15" style={{ height: `${month.billed * 100 * grow}%` }} />
                            <span className="w-[0.9em] rounded-t-[0.3em] bg-green-500" style={{ height: `${month.collected * 100 * grow}%` }} />
                        </span>
                    );
                })}
            </At>
            <At x={BARS.x} y={BARS.y + BARS.h + 0.5} w={BARS.w} className="flex justify-between">
                {MONTHS.map((_, index) => (
                    <span key={index} className="w-[2.3em] text-center text-[0.4em] text-ink-3">
                        {capitalize(monthName(locale, index, "short"))}
                    </span>
                ))}
            </At>

            {/* How the month's invoices stand. */}
            <At x={20.2} y={7.5} w={10} h={13.1}>
                <Pop show={on(t, 550)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={21.1} y={8.2} w={8.2}>
                <span className="block truncate text-[0.52em] font-semibold text-ink-2">{p.collectionStatus}</span>
            </At>
            <At x={21.9} y={9.6} w={6.6} h={6.6}>
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--ds-fill)" strokeWidth="13" />
                    {STATUS.map((status) => {
                        const length = status.share * ring;
                        const dash = (
                            <circle
                                key={status.color}
                                cx="50"
                                cy="50"
                                r="38"
                                fill="none"
                                stroke={status.color}
                                strokeWidth="13"
                                pathLength={100}
                                strokeDasharray={`${Math.max(0, length - 0.8)} ${100 - Math.max(0, length - 0.8)}`}
                                strokeDashoffset={-offset * ring}
                            />
                        );
                        offset += status.share;
                        return dash;
                    })}
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[0.8em] font-semibold tabular-nums tracking-[-0.02em]">{percent(locale, 92.6 * ring, 1)}</span>
                </span>
            </At>
            {STATUS.map((status, index) => (
                <At key={status.color} x={21.1} y={16.8 + index * 1.15} w={8.2}>
                    <Pop show={on(t, 2400 + index * 120)} className="flex items-center gap-[0.4em]">
                        <span className="size-[0.45em] shrink-0 rounded-full" style={{ background: status.color }} />
                        <span className="truncate text-[0.44em] text-ink-2">{statusLabels[index]}</span>
                        <span className="ml-auto text-[0.44em] font-semibold tabular-nums">{percent(locale, status.share, 1)}</span>
                    </Pop>
                </At>
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* invoice · composed, registered, sent, paid                                                     */
/* ---------------------------------------------------------------------------------------------- */

const PAPER = { x: 0, y: 0, w: 18.4, h: 22.4 };
const QR_SIZE = 21;
/** A Verifactu QR, drawn rather than encoded: three finder squares and a fixed scatter. */
const QR = Array.from({ length: QR_SIZE * QR_SIZE }, (_, index) => {
    const row = Math.floor(index / QR_SIZE);
    const col = index % QR_SIZE;
    const finder = (r: number, c: number) => {
        const inside = r >= 0 && r < 7 && c >= 0 && c < 7;
        if (!inside) return null;
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        return edge || core;
    };
    const f = finder(row, col) ?? finder(row, col - (QR_SIZE - 7)) ?? finder(row - (QR_SIZE - 7), col);
    if (f !== null) return f;
    if (row === 7 || col === 7 || row === QR_SIZE - 8 || col === QR_SIZE - 8) return false;
    return (row * 31 + col * 17 + row * col * 7) % 11 < 5;
});
const QR_AT = 600;
const LINES_AT = 1200;
const STEP_AT = [2000, 2700, 3400, 4100];

function InvoiceScene({ t, labels, locale }: Props) {
    const { p } = labels;
    const qr = span(t, QR_AT, 900);
    const total = INVOICE_LINES.reduce((sum, amount, index) => sum + (on(t, LINES_AT + index * 200) ? amount : 0), 0);
    const stepIcons: LucideIcon[] = [FileText, ShieldCheck, Mail, CreditCard];

    return (
        <>
            {/* The invoice: paper in both themes, as it is printed and sent. */}
            <At {...PAPER}>
                <Pop show={on(t, 0)} from="blur" className="h-full rounded-[0.6em] bg-white p-[1.1em] text-neutral-900 elev-4 ring-1 ring-black/5">
                    <div className="flex items-start justify-between">
                        <img src={wordmarkSrc} alt="" className="h-[1.05em] w-auto" />
                        <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className="size-[3.6em]" shapeRendering="crispEdges">
                            {QR.map((cell, index) =>
                                cell && Math.floor(index / QR_SIZE) / QR_SIZE < qr ? (
                                    <rect key={index} x={index % QR_SIZE} y={Math.floor(index / QR_SIZE)} width="1" height="1" fill="currentColor" />
                                ) : null,
                            )}
                        </svg>
                    </div>
                    <div className="-mt-[1.6em] flex flex-col gap-[0.35em]">
                        <span className="text-[0.36em] font-semibold uppercase tracking-[0.1em] text-neutral-500">{p.billedTo}</span>
                        <span className="text-[0.5em] font-medium">María García López</span>
                        <Line w={5.4} className="h-[0.24em] bg-neutral-200" />
                        <Line w={4.2} className="h-[0.24em] bg-neutral-200" />
                    </div>
                    <div className="mt-[1em] grid grid-cols-3 gap-[0.5em] border-b border-neutral-200 pb-[0.7em]">
                        {[shortDate(locale, new Date(2026, 5, 1)), p.directDebit, "#F-202606-1278"].map((value, index) => (
                            <span key={index} className="flex min-w-0 flex-col gap-[0.3em]">
                                <span className="truncate text-[0.32em] font-semibold uppercase tracking-[0.1em] text-neutral-500">{p.invoiceMeta[index]}</span>
                                <span className="truncate text-[0.42em] tabular-nums">{value}</span>
                            </span>
                        ))}
                    </div>
                    <div className="mt-[0.8em] flex justify-between">
                        <span className="text-[0.32em] font-semibold uppercase tracking-[0.1em] text-neutral-500">{p.concept}</span>
                        <span className="text-[0.32em] font-semibold uppercase tracking-[0.1em] text-neutral-500">{p.total}</span>
                    </div>
                    <div className="mt-[0.45em] flex flex-col">
                        {p.invoiceLines.map((line, index) => (
                            <Pop key={line} show={on(t, LINES_AT + index * 200)} className="flex items-center justify-between border-b border-neutral-100 py-[0.45em]">
                                <span className="truncate text-[0.44em]">{line}</span>
                                <span className="text-[0.44em] tabular-nums">{money(locale, INVOICE_LINES[index], 2)}</span>
                            </Pop>
                        ))}
                    </div>
                    <div className="mt-[0.8em] flex items-center justify-end gap-[1em]">
                        <span className="text-[0.36em] font-semibold uppercase tracking-[0.1em] text-neutral-500">{p.total}</span>
                        <span className="text-[0.75em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, total, 2)}</span>
                    </div>
                    <div className="mt-[1em] flex flex-col gap-[0.35em] rounded-[0.4em] bg-neutral-100 p-[0.6em]">
                        <Line w={9} className="h-[0.22em] bg-neutral-300" />
                        <Line w={6} className="h-[0.22em] bg-neutral-300" />
                    </div>
                </Pop>
            </At>

            {/* Its way: each step lands in turn. */}
            <At x={19.4} y={0} w={W - 19.4} h={20.6}>
                <Pop show={on(t, 300)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={20.3} y={0.9} w={9}>
                <span className={SECTION}>#F-202606-1278</span>
            </At>
            <At x={20.85} y={3.35} w={0.12} h={STEP_AT.length * 3.4 - 3.4} className="overflow-hidden rounded-full bg-fill-2">
                <span
                    className="block w-full origin-top rounded-full bg-green-500"
                    style={{ height: "100%", transform: `scaleY(${clamp01((t - STEP_AT[0]) / (STEP_AT[3] - STEP_AT[0]))})` }}
                />
            </At>
            {p.invoiceSteps.map((step, index) => {
                const Icon = stepIcons[index];
                const done = on(t, STEP_AT[index]);
                return (
                    <At key={step} x={20.25} y={2.7 + index * 3.4} w={9.4} className="flex items-start gap-[0.55em]">
                        <span
                            className={cn(
                                "relative flex size-[1.3em] shrink-0 items-center justify-center rounded-full transition-colors duration-500",
                                done ? "bg-green-500 text-white" : "bg-fill-2 text-ink-3",
                            )}
                        >
                            {done ? (
                                <span className="size-[0.85em]">
                                    <DrawnCheck p={span(t, STEP_AT[index], 450)} className="size-full" />
                                </span>
                            ) : (
                                <Icon className="size-[0.6em]" />
                            )}
                            <Ripple p={span(t, STEP_AT[index], 900)} className="text-green-500" />
                        </span>
                        <span className="flex min-w-0 flex-col gap-[0.3em] pt-[0.1em]">
                            <span className={cn("text-[0.5em] font-semibold transition-colors duration-500", done ? "text-ink" : "text-ink-3")}>{step}</span>
                            <Line w={4.6 - index * 0.5} className="h-[0.24em]" />
                        </span>
                    </At>
                );
            })}
            <At x={20.3} y={16.6} w={9}>
                <Pop show={on(t, STEP_AT[1])} from="scale" className="w-fit">
                    <Chip icon={ShieldCheck} className="bg-brand-soft text-brand-ink">
                        {labels.verifactu}
                    </Chip>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const { Scene: CycleScene, duration: CYCLE_DURATION } = KEY_FEATURE_SCENES[1];

const SCENES = {
    breakdown: { Scene: BreakdownScene, duration: 4800 },
    pay: { Scene: PayScene, duration: 5000, ...DUO },
    cycle: { Scene: CycleScene, duration: CYCLE_DURATION },
    analytics: { Scene: AnalyticsScene, duration: 4400 },
    invoice: { Scene: InvoiceScene, duration: 4800 },
} satisfies Record<string, SceneSpec<ProductSceneLabels>>;

export type FinanceSceneKey = keyof typeof SCENES;

/** The billing page's scenes, one island each: `scene` picks which. */
export default function FinanceScenes({ scene, labels, locale, max }: { scene: FinanceSceneKey; labels: ProductSceneLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
