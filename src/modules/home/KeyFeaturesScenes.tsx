import { useId, type CSSProperties, type ReactNode } from "react";
import {
    AlertTriangle,
    AlignLeft,
    ArrowLeftRight,
    ChevronDown,
    FileText,
    Globe,
    GripVertical,
    Hash,
    Heart,
    Inbox,
    Mail,
    MessageCircle,
    Phone,
    Plus,
    Send,
    ShieldCheck,
    Sigma,
    Smartphone,
    SquareCheck,
    TrendingUp,
    Type,
    type LucideIcon,
} from "lucide-react";

import { EnaClover, PhoneFrame, PhoneHome } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import {
    At,
    Avatar,
    Chip,
    Glyph,
    Line,
    Pop,
    capitalize,
    clamp01,
    countIn,
    easeInOut,
    easeOut,
    money,
    monthName,
    number,
    on,
    percent,
    smoothPath,
    smoothPoint,
    span,
} from "@/components/wizard/scene-kit";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";

/*
 * The six scenes of "Las 6 claves de nuestra plataforma", played on a pane of glass
 * (`glass-stage.tsx`) that stays while they change. Abstract — large shapes, skeleton lines
 * for prose, a few real figures — and each built in three beats: the screen settles in, the product
 * does its work, and the result lands.
 *
 *   1 Panel de control      KPIs count up, a light runs along the chart as it draws, Ena points
 *                           out the peak
 *   2 Gestión financiera    a scan settles the month's families one by one; the Verifactu seal
 *   3 Tareas y evaluaciones grades written in, the distribution grows, the report card flies out
 *   4 CRM escolar           the pipeline fills to "won" under a travelling light; activity stacks
 *   5 Formularios           components arc from the palette onto the canvas; published, answered
 *   6 La app                a post written on the desktop lands on a family's phone
 *
 * No cursor: the product does the work, the way Apple films a feature. Every scene is a pure
 * function of `t`; `Infinity` is its finished frame.
 */

type Ui = Translation["homeScenes"];

export interface KeyFeatureLabels {
    ui: Ui;
    controlPanel: string;
    billing: string;
    verifactu: string;
    reportCards: string;
    assessments: string;
    crm: string;
    forms: string;
    communication: string;
    /** "+35%": enquiries turned into enrolments, from `erpStats`. */
    crmStat: string;
}

export interface SceneProps {
    t: number;
    labels: KeyFeatureLabels;
    locale: string;
}

const W = CONTENT.w;

export function Title({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
    return (
        <At x={0} y={0} w={W} h={1.9} className="flex items-center gap-[0.6em]">
            <span className="truncate text-[0.95em] font-semibold tracking-[-0.02em]">{children}</span>
            <span className="ml-auto flex items-center gap-[0.45em]">{aside}</span>
        </At>
    );
}

function Badge({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
    return (
        <span
            className={cn("inline-flex items-center whitespace-nowrap rounded-full px-[0.6em] py-[0.2em] text-[0.48em] font-semibold", className)}
            style={style}
        >
            {children}
        </span>
    );
}

/** A tick that draws itself as `p` goes from 0 to 1. */
export function DrawnCheck({ p, className }: { p: number; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
            <circle cx="12" cy="12" r="10.5" fill="currentColor" opacity={0.14 * clamp01(p * 3)} />
            <path
                d="M7 12.5l3.2 3.2L17 9"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - easeOut(p)}
            />
        </svg>
    );
}

/** A ring that leaves something as it lands, once. */
export function Ripple({ p, className }: { p: number; className?: string }) {
    if (p <= 0 || p >= 1) return null;
    return (
        <span
            className={cn("pointer-events-none absolute inset-0 rounded-full border-2 border-current", className)}
            style={{ transform: `scale(${1 + easeOut(p) * 1.4})`, opacity: 1 - p }}
        />
    );
}

/** A sheen that crosses a surface once, from `at`, as it is first lit. */
function Sheen({ t, at, duration = 1100 }: { t: number; at: number; duration?: number }) {
    const p = span(t, at, duration);
    if (p <= 0 || p >= 1) return null;
    return (
        <span
            className="pointer-events-none absolute inset-0"
            style={{
                background: "linear-gradient(105deg, transparent 35%, rgb(255 255 255 / 0.4) 50%, transparent 65%)",
                transform: `translateX(${-100 + easeInOut(p) * 200}%)`,
            }}
        />
    );
}

const PENDING = "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300";
const DONE = "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";

/* ---------------------------------------------------------------------------------------------- */
/* 1 · Panel de control avanzado                                                                  */
/* ---------------------------------------------------------------------------------------------- */

const ATTENDANCE = [
    { key: "present", value: 139, tone: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
    { key: "absent", value: 34, tone: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" },
    { key: "totalStudents", value: 173, tone: "bg-fill-2 text-ink" },
    { key: "rate", value: 80.3, tone: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
] as const;
const SHOP_A = [0.08, 0.26, 0.74, 0.8, 0.16];
const SHOP_B = [0.05, 0.16, 0.58, 0.9, 0.18];
const CHART = { x: 0.9, y: 11.4, w: 17.8, h: 7.2 };
const RADAR = [1, 0.62, 0.55, 0.92, 0.58, 0.74];
const CONCEPTS = [
    { color: "#3b82f6", value: 42 },
    { color: "#8b5cf6", value: 31 },
    { color: "#14b8a6", value: 27 },
];
const INSIGHT_AT = 3300;

function DashboardScene({ t, labels, locale }: SceneProps) {
    const id = useId().replace(/:/g, "");
    const { ui } = labels;
    const draw = easeInOut(span(t, 1200, 1900));
    const grow = easeOut(span(t, 1800, 1300));
    const toPoints = (values: number[]) => values.map((v, i) => [i * 44.5, 70 - v * 64] as [number, number]);
    const pointsA = toPoints(SHOP_A);
    const pointsB = toPoints(SHOP_B);
    const lineA = smoothPath(pointsA);
    const lineB = smoothPath(pointsB);
    const head = smoothPoint(pointsB, draw);
    const peak = { x: CHART.x + pointsB[3][0] / 10, y: CHART.y + pointsB[3][1] / 10 };
    const insight = on(t, INSIGHT_AT);
    const radar = RADAR.map((r, i) => {
        const angle = -Math.PI / 2 + (i * Math.PI) / 3;
        return `${50 + Math.cos(angle) * 34 * r * grow},${44 + Math.sin(angle) * 34 * r * grow}`;
    }).join(" ");

    return (
        <>
            <Title aside={<Chip>{capitalize(monthName(locale, 5))}</Chip>}>{labels.controlPanel}</Title>

            {ATTENDANCE.map((tile, index) => {
                const count = easeOut(span(t, 300 + index * 90, 1400));
                return (
                    <At key={tile.key} x={index * 7.7} y={2.6} w={7.1} h={4.3}>
                        <Pop show={on(t, 120 + index * 90)} from="blur" className={cn("flex h-full flex-col justify-between rounded-[0.8em] p-[0.7em]", tile.tone)}>
                            <span className="truncate text-[0.44em] font-semibold uppercase tracking-[0.1em]">{ui[tile.key]}</span>
                            <span className="text-[1.55em] font-light leading-none tabular-nums tracking-[-0.035em]">
                                {tile.key === "rate" ? percent(locale, tile.value * count, 1) : number(locale, tile.value * count)}
                            </span>
                        </Pop>
                    </At>
                );
            })}

            <At x={0} y={7.5} w={19.6} h={13.1}>
                <Pop show={on(t, 500)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.9} y={8.2} className="flex flex-col gap-[0.3em]">
                <span className="text-[0.52em] font-semibold text-ink-2">{ui.shopByMonth}</span>
                <span className="text-[1.05em] font-semibold tabular-nums tracking-[-0.02em]">
                    {money(locale, 3099.1 * easeOut(span(t, 900, 1500)), 2)}
                </span>
            </At>
            <At x={CHART.x} y={CHART.y} w={CHART.w} h={CHART.h}>
                <svg viewBox="0 0 178 72" className="size-full overflow-visible">
                    <defs>
                        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#f472b6" stopOpacity="0.4" />
                            <stop offset="1" stopColor="#f472b6" stopOpacity="0.05" />
                        </linearGradient>
                        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#818cf8" stopOpacity="0.55" />
                            <stop offset="1" stopColor="#a78bfa" stopOpacity="0.06" />
                        </linearGradient>
                        <clipPath id={`${id}-clip`}>
                            <rect x="-4" y="-20" height="100" width={4 + 182 * draw} />
                        </clipPath>
                    </defs>
                    {[18, 36, 54, 72].map((y) => (
                        <line key={y} x1="0" x2="178" y1={y} y2={y} stroke="var(--ds-hairline)" strokeWidth="0.6" opacity={clamp01(draw * 4)} />
                    ))}
                    <g clipPath={`url(#${id}-clip)`}>
                        <path d={`${lineA} L 178 72 L 0 72 Z`} fill={`url(#${id}-a)`} />
                        <path d={lineA} fill="none" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" />
                        <path d={`${lineB} L 178 72 L 0 72 Z`} fill={`url(#${id}-b)`} />
                        <path d={lineB} fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" />
                    </g>
                    {draw > 0 && draw < 1 && (
                        <g>
                            <circle cx={head[0]} cy={head[1]} r="9" fill="#818cf8" opacity="0.18" />
                            <circle cx={head[0]} cy={head[1]} r="2.6" fill="#ffffff" stroke="#6366f1" strokeWidth="1.6" />
                        </g>
                    )}
                    {insight && (
                        <line
                            x1={pointsB[3][0]}
                            x2={pointsB[3][0]}
                            y1={pointsB[3][1]}
                            y2={72}
                            stroke="#6366f1"
                            strokeWidth="0.9"
                            strokeDasharray="2 2.5"
                            opacity={easeOut(span(t, INSIGHT_AT, 500))}
                        />
                    )}
                </svg>
            </At>
            <At x={CHART.x - 0.4} y={19.1} w={CHART.w + 0.8} className="flex justify-between">
                {[1, 2, 3, 4, 5].map((month) => (
                    <span key={month} className="text-[0.4em] text-ink-3">
                        {capitalize(monthName(locale, month, "short"))}
                    </span>
                ))}
            </At>
            <At x={peak.x} y={peak.y}>
                <Pop show={insight} from="scale">
                    <span className="absolute -left-[0.38em] -top-[0.38em] size-[0.76em] rounded-full border-[0.15em] border-surface bg-[#6366f1] elev-2" />
                </Pop>
            </At>
            <At x={peak.x - 7.6} y={peak.y - 2.7} w={7}>
                <Pop show={insight} from="blur" className="ml-auto flex w-fit items-center gap-[0.4em] rounded-full py-[0.3em] pl-[0.3em] pr-[0.7em] material elev-3 ring-1 ring-hairline">
                    <EnaClover size={1.05} />
                    <span className="text-[0.58em] font-semibold tabular-nums text-brand-ink">+{percent(locale, 12, 0)}</span>
                    <TrendingUp className="size-[0.6em] text-brand-ink" />
                </Pop>
            </At>

            <At x={20.2} y={7.5} w={10} h={13.1}>
                <Pop show={on(t, 650)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={21.1} y={8.2} w={8.2}>
                <span className="block truncate text-[0.52em] font-semibold text-ink-2">{ui.concepts}</span>
            </At>
            <At x={21.0} y={9.5} w={8.4} h={6.6}>
                <svg
                    viewBox="0 0 100 88"
                    className="size-full overflow-visible"
                    style={{ transform: `rotate(${(1 - grow) * -40}deg)`, transformOrigin: "50% 50%" }}
                >
                    {[34, 23, 12].map((r) => (
                        <circle key={r} cx="50" cy="44" r={r} fill="#60a5fa" fillOpacity="0.09" />
                    ))}
                    <polygon points={radar} fill="#60a5fa" fillOpacity="0.42" stroke="#3b82f6" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
            </At>
            {CONCEPTS.map((concept, index) => (
                <At key={index} x={21.1} y={16.6 + index * 1.2} w={8.2} className="flex items-center gap-[0.45em]">
                    <Pop show={on(t, 2300 + index * 120)} className="flex w-full items-center gap-[0.45em]">
                        <span className="size-[0.45em] shrink-0 rounded-full" style={{ background: concept.color }} />
                        <Line w={3.4 - index * 0.5} className="h-[0.26em]" />
                        <span className="ml-auto text-[0.46em] font-semibold tabular-nums">
                            {percent(locale, concept.value * easeOut(span(t, 2300 + index * 120, 900)), 0)}
                        </span>
                    </Pop>
                </At>
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* 2 · Gestión financiera                                                                         */
/* ---------------------------------------------------------------------------------------------- */

const FAMILIES = [
    { name: "Ana Cano", initials: "AC", hue: 210, amount: 570.23 },
    { name: "Pedro Castro", initials: "PC", hue: 150, amount: 731.46 },
    { name: "Ane Etxeberria", initials: "AE", hue: 28, amount: 439.11 },
    { name: "Marc Puig", initials: "MP", hue: 275, amount: 744.95 },
    { name: "Mónica Delgado", initials: "MD", hue: 335, amount: 621.07 },
];
const ROW_Y = (index: number) => 5.8 + index * 2.75;
const SCAN = { at: 1300, duration: 2500, from: 5.8, to: 5.8 + 5 * 2.75 };
const settledAt = (index: number) => SCAN.at + (SCAN.duration * (ROW_Y(index) + 1.15 - SCAN.from)) / (SCAN.to - SCAN.from);
const SEAL_AT = 4100;

function FinanceScene({ t, labels, locale }: SceneProps) {
    const { ui } = labels;
    const scan = span(t, SCAN.at, SCAN.duration);
    const scanY = SCAN.from + easeInOut(scan) * (SCAN.to - SCAN.from);
    const settled = FAMILIES.map((_, index) => on(t, settledAt(index)));
    const billed = 6502.23 + FAMILIES.reduce((sum, family, index) => sum + (settled[index] ? family.amount : 0), 0);
    const pending = 22 - settled.filter(Boolean).length;
    const seal = span(t, SEAL_AT, 700);

    return (
        <>
            <Title
                aside={
                    <Pop show={on(t, SEAL_AT)} from="scale" className="relative text-brand-ink">
                        <Ripple p={seal} />
                        <Chip icon={ShieldCheck} className="bg-brand-soft text-brand-ink">
                            {labels.verifactu}
                        </Chip>
                    </Pop>
                }
            >
                {labels.billing}
            </Title>

            <At x={0} y={2.4} w={W} h={2.6}>
                <Pop show={on(t, 100)} from="blur" className="flex h-full items-end justify-between">
                    <span className="mb-[0.15em] flex items-center gap-[0.4em] rounded-full px-[0.65em] py-[0.3em] ds-glass-inner">
                        <span className="size-[0.35em] rounded-full bg-orange-400" />
                        <span className="text-[0.5em]">
                            <b className="font-bold tabular-nums">{pending}</b> {ui.toInvoice}
                        </span>
                    </span>
                    <span className="flex flex-col items-end">
                        <span className="text-[0.4em] font-semibold uppercase tracking-[0.12em] text-ink-3">{ui.invoiced}</span>
                        <span className="text-[1.35em] font-semibold leading-none tabular-nums tracking-[-0.03em]">{money(locale, billed, 2)}</span>
                    </span>
                </Pop>
            </At>

            {scan > 0 && scan < 1 && (
                <At
                    x={0}
                    y={scanY - 1}
                    w={W}
                    h={2}
                    className="pointer-events-none"
                    style={{ background: "linear-gradient(to bottom, transparent, rgb(34 197 94 / 0.16), transparent)" }}
                />
            )}
            {scan > 0 && scan < 1 && (
                <At x={0} y={scanY} w={W} h={0.08} className="pointer-events-none bg-brand/60 shadow-[0_0_0.6em_rgb(34_197_94/0.6)]" />
            )}

            {FAMILIES.map((family, index) => {
                const at = settledAt(index);
                const check = span(t, at, 450);
                return (
                    <At key={family.name} x={0} y={ROW_Y(index)} w={W} h={2.3}>
                        <Pop show={on(t, 300 + index * 80)} from="blur" className="flex h-full items-center gap-[0.65em] border-b border-hairline px-[0.35em]">
                            <Avatar initials={family.initials} hue={family.hue} size={1.5} />
                            <span className="w-[9em] truncate text-[0.62em] font-semibold">{family.name}</span>
                            <Line w={5.5} className="h-[0.32em] opacity-60" />
                            <span className="ml-auto text-[0.62em] font-medium tabular-nums">{money(locale, family.amount, 2)}</span>
                            <span className="flex w-[5.6em] items-center justify-end gap-[0.3em]">
                                <span className={cn("size-[1em] text-green-600 transition-opacity duration-300 dark:text-green-400", settled[index] ? "opacity-100" : "opacity-0")}>
                                    <DrawnCheck p={check} className="size-full" />
                                </span>
                                <Badge className={cn("transition-colors duration-500", settled[index] ? DONE : PENDING)}>
                                    {settled[index] ? ui.invoicedBadge : ui.pending}
                                </Badge>
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* 3 · Tareas y evaluaciones                                                                      */
/* ---------------------------------------------------------------------------------------------- */

const SUBJECTS = [
    { color: "#ef4444", w: 7.2, grade: 8.5 },
    { color: "#22c55e", w: 8.4, grade: 9 },
    { color: "#f97316", w: 5.2, grade: 7.25 },
    { color: "#ec4899", w: 6.6, grade: 9.5 },
    { color: "#8b5cf6", w: 4.4, grade: 6.75 },
];
const GRADE_AT = (index: number) => 600 + index * 430;
const CREATE_AT = 3200;
const FLY_AT = 4300;

function GradesScene({ t, labels, locale }: SceneProps) {
    const { ui } = labels;
    const done = SUBJECTS.map((_, index) => on(t, GRADE_AT(index) + 260));
    const graded = SUBJECTS.filter((_, index) => done[index]);
    const average = graded.length ? graded.reduce((sum, subject) => sum + subject.grade, 0) / graded.length : 0;
    const pressed = t >= CREATE_AT && t < CREATE_AT + 220;
    const flown = on(t, FLY_AT);
    const sent = on(t, FLY_AT + 350);

    return (
        <>
            <Title
                aside={
                    <span className="flex items-center gap-[0.45em]">
                        <Avatar initials="EF" hue={270} size={1.45} />
                        <span className="text-[0.56em] font-semibold">Emma Fernández</span>
                    </span>
                }
            >
                {labels.assessments}
            </Title>

            <At x={0} y={2.5} w={W} h={2.2}>
                <Pop show={on(t, 100)} from="blur" className="flex h-full items-center justify-between">
                    <span className="flex items-center gap-[0.4em] rounded-full px-[0.65em] py-[0.3em] ds-glass-inner">
                        <span className="size-[0.35em] rounded-full bg-orange-400" />
                        <span className="text-[0.5em]">
                            <b className="font-bold tabular-nums">{40 - graded.length}</b> {ui.pendingShort}
                        </span>
                    </span>
                    <span
                        className={cn(
                            "flex h-[1.7em] items-center rounded-full bg-ink px-[0.9em] text-canvas transition-[scale,box-shadow] duration-300",
                            pressed && "scale-95 shadow-[0_0_0_0.3em_rgb(34_197_94/0.3)]",
                        )}
                    >
                        {/* Once the report cards have flown, the button says they arrived: 24 of 24. */}
                        <span className="grid text-[0.5em] font-semibold">
                            <span
                                className={cn(
                                    "col-start-1 row-start-1 transition-[opacity,translate,filter] duration-500 ease-out-expo",
                                    sent && "-translate-y-[0.6em] opacity-0 blur-[2px]",
                                )}
                            >
                                {ui.createReportCard}
                            </span>
                            <span
                                className={cn(
                                    "col-start-1 row-start-1 flex items-center justify-center gap-[0.45em] transition-[opacity,translate,filter] duration-500 ease-out-expo",
                                    !sent && "translate-y-[0.6em] opacity-0 blur-[2px]",
                                )}
                            >
                                <Smartphone className="size-[1.1em]" />
                                <span className="tabular-nums">{Math.round(24 * easeOut(span(t, FLY_AT + 350, 800)))}/24</span>
                                <span className="size-[1.2em] text-green-400">
                                    <DrawnCheck p={span(t, FLY_AT + 900, 450)} className="size-full" />
                                </span>
                            </span>
                        </span>
                    </span>
                </Pop>
            </At>

            {SUBJECTS.map((subject, index) => {
                const at = GRADE_AT(index);
                const writing = t >= at && t < at + 430;
                const value = subject.grade * easeOut(span(t, at, 300));
                return (
                    <At key={index} x={0} y={5.6 + index * 2.6} w={19.2} h={2.3}>
                        <Pop show={on(t, 300 + index * 80)} from="blur" className="flex h-full items-center gap-[0.7em] border-b border-hairline px-[0.35em]">
                            <span className="h-[1.15em] w-[0.2em] rounded-full" style={{ background: subject.color }} />
                            <Line w={subject.w} className="h-[0.34em]" />
                            <span
                                className={cn(
                                    "ml-auto flex h-[1.45em] items-center gap-[0.3em] rounded-[0.45em] px-[0.55em] transition-[box-shadow,background-color] duration-300",
                                    writing ? "bg-surface ring-2 ring-brand" : "ds-glass-inner",
                                )}
                            >
                                <span className="text-[0.62em] font-semibold tabular-nums">{number(locale, done[index] ? subject.grade : value, 2)}</span>
                                {!on(t, at) && <AlertTriangle className="size-[0.6em] text-amber-500" />}
                            </span>
                        </Pop>
                    </At>
                );
            })}

            <At x={19.9} y={5.6} w={10.3} h={14.6}>
                <Pop show={on(t, 450)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={20.8} y={6.3} className="flex items-center gap-[0.3em] text-ink-2">
                <Sigma className="size-[0.6em]" />
                <span className="text-[1.5em] font-light tabular-nums tracking-[-0.03em] text-ink">{number(locale, average, 2)}</span>
            </At>
            <At x={20.8} y={9.6} w={8.5} h={9.8} className="flex items-end justify-between gap-[0.35em]">
                {SUBJECTS.map((subject, index) => (
                    <span key={index} className="flex h-full flex-1 items-end rounded-[0.35em] bg-fill-2">
                        <span
                            className="block w-full rounded-[0.35em] transition-[height] duration-700 ease-spring"
                            style={{ height: done[index] ? `${subject.grade * 10}%` : "6%", background: subject.color }}
                        />
                    </span>
                ))}
            </At>

            <At x={20.6} y={6.2} w={8.9} h={12.2} className="z-20">
                <div
                    className={cn(
                        "h-full transition-[translate,scale,opacity] duration-700 ease-spring",
                        flown ? "-translate-y-[7em] translate-x-[5em] scale-[0.35] opacity-0" : "",
                    )}
                >
                    <Pop show={on(t, CREATE_AT + 250)} from="blur" className="flex h-full flex-col gap-[0.55em] rounded-[0.8em] bg-surface p-[0.9em] elev-4 ring-1 ring-hairline">
                        <span className="flex items-center gap-[0.45em]">
                            <Glyph icon={FileText} tone="indigo" size={1.5} />
                            <span className="truncate text-[0.55em] font-semibold">{labels.reportCards}</span>
                        </span>
                        <Line w={6.4} className="h-[0.32em] bg-ink/70" />
                        {SUBJECTS.map((subject, index) => (
                            <span key={index} className="flex items-center gap-[0.4em]">
                                <span className="size-[0.4em] rounded-full" style={{ background: subject.color }} />
                                <Line w={3.6} className="h-[0.26em]" />
                                <span className="ml-auto text-[0.44em] font-semibold tabular-nums">{number(locale, subject.grade, 2)}</span>
                            </span>
                        ))}
                    </Pop>
                </div>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* 4 · CRM escolar                                                                                */
/* ---------------------------------------------------------------------------------------------- */

const SEGMENT = (index: number) => ({ x: 0.9 + index * 4.75, w: 4.35 });
const FILL = { at: 700, duration: 2600 };
const WON_AT = FILL.at + FILL.duration;

function CrmScene({ t, labels }: SceneProps) {
    const { ui } = labels;
    // How many segments are full, continuously: from "contacted" (2) to "won" (6).
    const filled = 2 + 4 * easeInOut(span(t, FILL.at, FILL.duration));
    const stage = Math.min(5, Math.max(1, Math.ceil(filled - 0.001) - 1));
    const won = on(t, WON_AT);
    const headSegment = Math.min(5, Math.floor(filled));
    const head = SEGMENT(headSegment);
    const headX = head.x + head.w * clamp01(filled - headSegment);
    const shine = span(t, WON_AT, 900);
    // One activity entry per stage the enquiry has reached, newest first.
    const entries = Array.from({ length: stage + 1 }, (_, index) => index).reverse().slice(0, 4);

    return (
        <>
            <Title
                aside={
                    <Pop show={on(t, WON_AT + 500)} from="scale">
                        <Chip icon={TrendingUp} className="bg-brand-soft text-brand-ink">
                            {countIn(labels.crmStat, easeOut(span(t, WON_AT + 500, 900)))}
                        </Chip>
                    </Pop>
                }
            >
                {labels.crm}
            </Title>

            <At x={0} y={2.5} w={W} h={7.9}>
                <Pop show={on(t, 100)} from="blur" className="relative h-full overflow-hidden rounded-[0.9em] ds-glass-inner">
                    {shine > 0 && shine < 1 && (
                        <span
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: "linear-gradient(105deg, transparent 35%, rgb(34 197 94 / 0.22) 50%, transparent 65%)",
                                transform: `translateX(${-100 + easeInOut(shine) * 200}%)`,
                            }}
                        />
                    )}
                </Pop>
            </At>
            <At x={0.9} y={3.3} className="flex items-center gap-[0.65em]">
                <Avatar initials="ÁR" hue={205} size={2.2} />
                <span className="flex flex-col gap-[0.3em]">
                    <span className="text-[0.82em] font-semibold tracking-[-0.01em]">Álvaro Rubio</span>
                    <span className="flex items-center gap-[0.35em] text-ink-3">
                        <Globe className="size-[0.55em]" />
                        <Line w={5} className="h-[0.3em]" />
                    </span>
                </span>
            </At>
            <At x={18} y={3.75} w={11.3} className="flex justify-end">
                <span className="relative inline-grid">
                    {ui.stages.map((name, index) => (
                        <span
                            key={name}
                            className={cn(
                                "[grid-area:1/1] flex justify-end transition-[opacity,translate,filter] duration-500 ease-spring",
                                index === stage ? "translate-y-0 opacity-100 blur-0" : index < stage ? "-translate-y-[0.5em] opacity-0 blur-[3px]" : "translate-y-[0.5em] opacity-0 blur-[3px]",
                            )}
                        >
                            <Badge
                                className={
                                    index === 5 && won
                                        ? DONE
                                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                                }
                            >
                                {name}
                            </Badge>
                        </span>
                    ))}
                </span>
            </At>

            {ui.stages.map((name, index) => {
                const segment = SEGMENT(index);
                const amount = clamp01(filled - index);
                return (
                    <div key={name}>
                        <At x={segment.x} y={7.15} w={segment.w} h={0.5} className="overflow-hidden rounded-full bg-fill">
                            <span
                                className={cn("block h-full origin-left rounded-full transition-colors duration-700", won ? "bg-green-500" : "bg-ink")}
                                style={{ transform: `scaleX(${amount})` }}
                            />
                        </At>
                        <At x={segment.x} y={8.05} w={segment.w}>
                            <span
                                className={cn(
                                    "block truncate text-[0.38em] uppercase tracking-[0.1em] transition-colors duration-300",
                                    index === stage ? "font-bold text-ink" : "text-ink-3",
                                )}
                            >
                                {name}
                            </span>
                        </At>
                    </div>
                );
            })}
            {!won && on(t, FILL.at) && (
                <At x={headX} y={7.4} className="pointer-events-none">
                    <span className="absolute -left-[0.55em] -top-[0.55em] size-[1.1em] rounded-full bg-brand/35 blur-[0.25em]" />
                    <span className="absolute -left-[0.2em] -top-[0.2em] size-[0.4em] rounded-full bg-white shadow-[0_0_0.4em_rgb(34_197_94/0.9)]" />
                </At>
            )}

            <At x={0} y={11.25} w={W}>
                <span className="block text-[0.52em] font-semibold text-ink-2">{ui.activity}</span>
            </At>
            {entries.map((entry, index) => (
                <At key={entry} x={0} y={12.5 + index * 2.0} w={W} h={1.75} className="transition-[top] duration-700 ease-spring">
                    <div className="flex h-full animate-ds-scene-fade-in items-center gap-[0.65em] border-b border-hairline px-[0.2em]">
                        <Glyph icon={entry === 0 ? Plus : ArrowLeftRight} tone={entry === 0 ? "green" : entry === 5 ? "green" : "orange"} size={1.15} />
                        <span className="text-[0.5em] font-semibold text-ink-2">{ui.stages[entry]}</span>
                        <Line w={7 - (entry % 3)} className="h-[0.3em]" />
                        <Line w={2.4} className="ml-auto h-[0.26em] opacity-50" />
                    </div>
                </At>
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* 5 · Formularios dinámicos                                                                      */
/* ---------------------------------------------------------------------------------------------- */

const COMPONENTS: LucideIcon[] = [Type, Mail, Phone, Hash, ChevronDown, AlignLeft, SquareCheck];
const tileBox = (index: number) => ({ x: 0.6 + (index % 2) * 4.2, y: 3.9 + Math.floor(index / 2) * 3.5, w: 3.9, h: 3.1 });
/** The form, in the order it is built: short text, email, dropdown, checkbox. */
const BUILD = [0, 1, 4, 6];
const flyAt = (field: number) => 450 + field * 900;
const FLIGHT = 720;
const fieldBox = (field: number) => ({ x: 12, y: 6.1 + field * 3.35, w: 16.2, h: 2.9 });
const PUBLISH_AT = 4300;
const ANSWERS_AT = 4700;

function FormsScene({ t, labels }: SceneProps) {
    const { ui } = labels;
    const flights = BUILD.map((from, field) => {
        const u = span(t, flyAt(field), FLIGHT);
        const tile = tileBox(from);
        const box = fieldBox(field);
        const start = { x: tile.x + tile.w / 2, y: tile.y + tile.h / 2 };
        const end = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
        // An arc: up and over, the way a thing thrown lands.
        const e = easeInOut(u);
        const control = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 4 };
        const x = (1 - e) ** 2 * start.x + 2 * (1 - e) * e * control.x + e ** 2 * end.x;
        const y = (1 - e) ** 2 * start.y + 2 * (1 - e) * e * control.y + e ** 2 * end.y;
        return { from, u, x, y };
    });
    const landed = (field: number) => on(t, flyAt(field) + FLIGHT);
    const published = on(t, PUBLISH_AT);
    const answers = Math.round(3 * easeOut(span(t, ANSWERS_AT, 900)));

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, ANSWERS_AT)} from="scale">
                            <Chip icon={Inbox} className="bg-brand-soft text-brand-ink">
                                +{answers}
                            </Chip>
                        </Pop>
                        <span className={cn("relative inline-block h-[1.15em] w-[2em] rounded-full transition-colors duration-300", published ? "bg-sys-green" : "bg-fill")}>
                            <span
                                className={cn(
                                    "absolute top-[0.12em] size-[0.9em] rounded-full bg-white elev-1 transition-[left] duration-500 ease-spring",
                                    published ? "left-[0.98em]" : "left-[0.12em]",
                                )}
                            />
                        </span>
                        <Globe className={cn("size-[0.85em] transition-colors duration-300", published ? "text-brand-ink" : "text-ink-3")} />
                    </>
                }
            >
                {labels.forms}
            </Title>

            <At x={0} y={2.5} w={9.4} h={18.1}>
                <Pop show={on(t, 100)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.7} y={2.95} w={8}>
                <span className="block truncate text-[0.42em] font-semibold uppercase tracking-[0.12em] text-ink-2">{ui.components}</span>
            </At>
            {COMPONENTS.map((Icon, index) => {
                const box = tileBox(index);
                const lifting = flights.some((flight) => flight.from === index && flight.u > 0 && flight.u < 0.25);
                return (
                    <At key={index} x={box.x} y={box.y} w={box.w} h={box.h}>
                        <Pop
                            show={on(t, 200 + index * 50)}
                            from="blur"
                            className={cn(
                                "flex h-full flex-col items-center justify-center gap-[0.4em] rounded-[0.6em] bg-surface px-[0.3em] elev-1 transition-[box-shadow] duration-300",
                                lifting && "ring-2 ring-brand",
                            )}
                        >
                            <Icon className="size-[0.85em] text-ink-2" />
                            <span className="w-full truncate text-center text-[0.34em] font-semibold uppercase tracking-[0.08em]">{ui.fieldTypes[index]}</span>
                        </Pop>
                    </At>
                );
            })}

            <At
                x={10}
                y={2.5}
                w={20.2}
                h={18.1}
                className="rounded-[0.9em] ds-glass-inner"
                style={{
                    backgroundImage: "radial-gradient(var(--ds-hairline-strong) 0.06em, transparent 0.07em)",
                    backgroundSize: "0.9em 0.9em",
                }}
            />
            <At x={11.1} y={3.5} w={18} h={16.1}>
                <Pop show={on(t, 250)} from="blur" className="relative h-full rounded-[0.8em] bg-surface elev-2">
                    {published && <Sheen t={t} at={PUBLISH_AT} duration={900} />}
                </Pop>
            </At>
            <At x={12} y={4.3} className="flex flex-col gap-[0.4em]">
                <Line w={7} className="h-[0.42em] bg-ink/70" />
                <Line w={10} className="h-[0.3em] opacity-60" />
            </At>
            {BUILD.map((from, field) => {
                const Icon = COMPONENTS[from];
                const box = fieldBox(field);
                return (
                    <At key={field} x={box.x} y={box.y} w={box.w} h={box.h}>
                        <Pop
                            show={landed(field)}
                            from="scale"
                            className="flex h-full flex-col justify-center gap-[0.4em] rounded-[0.55em] bg-fill-2 px-[0.6em] ring-1 ring-hairline"
                        >
                            <span className="flex items-center gap-[0.35em] text-ink-2">
                                <GripVertical className="size-[0.55em] text-ink-3" />
                                <Icon className="size-[0.55em]" />
                                <Line w={4 + (field % 2) * 1.4} className="h-[0.3em]" />
                                <span className="text-[0.5em] text-red-500">*</span>
                            </span>
                            {from === 6 ? (
                                <span className="flex items-center gap-[1em]">
                                    {[0, 1].map((option) => (
                                        <span key={option} className="flex items-center gap-[0.35em]">
                                            <span className={cn("size-[0.8em] rounded-[0.2em] border border-hairline-strong", option === 0 && "border-transparent bg-ink")} />
                                            <Line w={2.6} className="h-[0.28em] opacity-60" />
                                        </span>
                                    ))}
                                </span>
                            ) : (
                                <span className="flex h-[1.1em] items-center justify-between rounded-[0.35em] bg-surface px-[0.4em] text-ink-3">
                                    <Line w={from === 4 ? 4 : 6} className="h-[0.28em] opacity-50" />
                                    {from === 4 && <ChevronDown className="size-[0.5em]" />}
                                </span>
                            )}
                        </Pop>
                    </At>
                );
            })}

            {flights.map((flight, field) =>
                flight.u > 0 && flight.u < 1 ? (
                    <At
                        key={field}
                        x={flight.x - 1.95}
                        y={flight.y - 1.55}
                        w={3.9}
                        h={3.1}
                        className="z-40 flex flex-col items-center justify-center gap-[0.4em] rounded-[0.6em] bg-surface ring-1 ring-hairline"
                        style={{
                            transform: `rotate(${(1 - flight.u) * -10 + Math.sin(flight.u * Math.PI) * 4}deg) scale(${1 + Math.sin(flight.u * Math.PI) * 0.08})`,
                            boxShadow: `0 ${0.6 + Math.sin(flight.u * Math.PI)}em ${1.4 + Math.sin(flight.u * Math.PI) * 1.4}em -0.4em rgb(0 0 0 / 0.28)`,
                        }}
                    >
                        {(() => {
                            const Icon = COMPONENTS[flight.from];
                            return <Icon className="size-[0.85em] text-sys-purple" />;
                        })()}
                        <span className="text-[0.34em] font-semibold uppercase tracking-[0.08em]">{ui.fieldTypes[flight.from]}</span>
                    </At>
                ) : null,
            )}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* 6 · Gestión integral de la app                                                                 */
/* ---------------------------------------------------------------------------------------------- */

const POST = [10.5, 12.5, 8];
const SEND_AT = 2350;
const ARRIVE_AT = 2950;
const OPEN_AT = 3700;
const PHONE = { x: 19.6, y: 0.2, w: 9.8, h: 20.2 };
const PHOTOS = [
    "linear-gradient(160deg, #ffd29d, #ff8a65)",
    "linear-gradient(160deg, #9be7ff, #4a90e2)",
    "linear-gradient(160deg, #b9f6ca, #2ecc71)",
];

function AppScene({ t, labels }: SceneProps) {
    const { ui } = labels;
    const sent = on(t, SEND_AT);
    const flight = span(t, SEND_AT, ARRIVE_AT - SEND_AT);
    const from = { x: 16.4, y: 18.4 };
    const to = { x: PHONE.x + PHONE.w / 2, y: 2.4 };
    const e = easeInOut(flight);
    const control = { x: (from.x + to.x) / 2, y: 1 };
    const bubble = {
        x: (1 - e) ** 2 * from.x + 2 * (1 - e) * e * control.x + e ** 2 * to.x,
        y: (1 - e) ** 2 * from.y + 2 * (1 - e) * e * control.y + e ** 2 * to.y,
    };
    const opened = on(t, OPEN_AT);

    return (
        <>
            <Title>{labels.communication}</Title>

            <At x={0} y={2.5} w={18.4} h={18.1}>
                <Pop show={on(t, 100)} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.9} y={3.3} className="flex items-center gap-[0.55em]">
                <Glyph icon={MessageCircle} tone="blue" size={1.6} />
                <span className="flex flex-col gap-[0.3em]">
                    <Line w={5.5} className="h-[0.34em] bg-ink/70" />
                    <Line w={3.4} className="h-[0.26em] opacity-60" />
                </span>
            </At>
            <At x={0.9} y={6.3} w={16.6} h={9.6}>
                <div className={cn("h-full rounded-[0.7em] bg-surface p-[0.8em] ring-1 ring-hairline transition-opacity duration-500", sent && "opacity-40")}>
                    <span className="flex flex-col gap-[0.5em]">
                        {POST.map((width, index) => (
                            <span
                                key={index}
                                className="ds-bar h-[0.36em]"
                                style={{ width: `${width * easeOut(span(t, 350 + index * 380, 520))}em` }}
                            />
                        ))}
                    </span>
                    <span className="mt-[0.9em] grid grid-cols-3 gap-[0.4em]">
                        {PHOTOS.map((photo, index) => (
                            <Pop key={photo} show={on(t, 1600 + index * 120)} from="scale">
                                <span className="block h-[3.3em] rounded-[0.5em]" style={{ background: photo }} />
                            </Pop>
                        ))}
                    </span>
                </div>
            </At>
            <At x={0.9} y={16.6} w={16.6} className="flex items-center gap-[0.4em]">
                {[0, 1].map((chip) => (
                    <span key={chip} className="flex h-[1.4em] items-center gap-[0.3em] rounded-full bg-surface px-[0.5em] ring-1 ring-hairline">
                        <span className="size-[0.7em] rounded-full" style={{ background: chip ? "#f97316" : "#3b82f6" }} />
                        <Line w={2 + chip} className="h-[0.26em]" />
                    </span>
                ))}
                <span
                    className={cn(
                        "ml-auto flex h-[1.6em] items-center gap-[0.35em] rounded-full px-[0.8em] text-black transition-[scale,box-shadow] duration-300",
                        t >= SEND_AT - 200 && t < SEND_AT + 100 ? "scale-95 shadow-[0_0_0_0.35em_rgb(34_197_94/0.25)]" : "",
                    )}
                    style={{ background: "var(--ds-brand-gradient)" }}
                >
                    <Send className="size-[0.65em]" />
                </span>
            </At>

            {flight > 0 && flight < 1 && (
                <At x={bubble.x - 0.8} y={bubble.y - 0.8} w={1.6} h={1.6} className="z-40 flex items-center justify-center rounded-full text-black elev-3" style={{ background: "var(--ds-brand-gradient)", transform: `scale(${1 - e * 0.35})` }}>
                    <Send className="size-[0.7em]" />
                </At>
            )}

            <PhoneFrame
                x={PHONE.x}
                y={PHONE.y}
                w={PHONE.w}
                h={PHONE.h}
                overlay={
                    <Pop show={on(t, ARRIVE_AT) && !opened} from="down" className="flex items-center gap-[0.4em] rounded-[0.8em] p-[0.45em] material-thick elev-2 ring-1 ring-hairline">
                        <span className="ds-app-icon size-[1.3em] bg-white">
                            <EnaClover size={0.8} />
                        </span>
                        <span className="flex min-w-0 flex-col gap-[0.25em]">
                            <span className="text-[0.4em] font-semibold leading-none">Edena</span>
                            <span className="ds-bar h-[0.22em] w-[4.2em]" />
                        </span>
                    </Pop>
                }
            >
                <div className={cn("absolute inset-0 transition-opacity duration-500", opened ? "opacity-0" : "opacity-100")}>
                    <PhoneHome welcome={ui.welcomeBack} sections={ui.appSections} tiles={ui.appTiles} screenWidth={PHONE.w} />
                </div>
                <div className={cn("absolute inset-0 px-[0.45em] pt-[0.4em] transition-opacity duration-500", opened ? "opacity-100" : "opacity-0")}>
                    <Pop show={opened} from="blur" className="flex flex-col gap-[0.45em]">
                        <span className="flex items-center gap-[0.4em]">
                            <Glyph icon={MessageCircle} tone="blue" size={1.2} />
                            <span className="flex flex-col gap-[0.25em]">
                                <span className="ds-bar h-[0.26em] w-[3.6em]" />
                                <span className="ds-bar h-[0.2em] w-[2.4em] opacity-60" />
                            </span>
                        </span>
                        {POST.map((width, index) => (
                            <span key={index} className="ds-bar h-[0.26em]" style={{ width: `${width * 0.62}em` }} />
                        ))}
                        <span className="grid grid-cols-3 gap-[0.25em]">
                            {PHOTOS.map((photo) => (
                                <span key={photo} className="block h-[2.4em] rounded-[0.35em]" style={{ background: photo }} />
                            ))}
                        </span>
                        <span className="flex items-center gap-[0.5em] pt-[0.1em]">
                            <Heart
                                className={cn(
                                    "size-[0.8em] transition-[color,scale,fill] duration-500 ease-spring-bounce",
                                    on(t, OPEN_AT + 800) ? "scale-110 fill-sys-pink text-sys-pink" : "text-ink-2",
                                )}
                            />
                            <MessageCircle className="size-[0.8em] text-ink-2" />
                        </span>
                    </Pop>
                </div>
            </PhoneFrame>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * In the order they play, matched to `features.keyFeaturesTabs` by `tab`: the app last, as the
 * section has always shown it. `module` is the sidebar's row the scene belongs to.
 */
export const KEY_FEATURE_SCENES = [
    { tab: 1, duration: 5200, Scene: DashboardScene },
    { tab: 2, duration: 5200, Scene: FinanceScene },
    { tab: 3, duration: 5600, Scene: GradesScene },
    { tab: 4, duration: 5000, Scene: CrmScene },
    { tab: 5, duration: 5800, Scene: FormsScene },
    { tab: 0, duration: 5400, Scene: AppScene },
] as const;
