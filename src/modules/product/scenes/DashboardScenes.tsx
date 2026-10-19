import {
    AlertTriangle,
    BadgeEuro,
    Bell,
    BookOpen,
    CalendarDays,
    CalendarPlus,
    CheckCheck,
    GraduationCap,
    MapPinCheck,
    MessageCircle,
    Receipt,
    ShieldPlus,
    UserCheck,
    UserPlus,
    UserRoundCog,
    Users,
    type LucideIcon,
} from "lucide-react";

import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Pop, easeInOut, easeOut, money, number, on, percent, smoothPath, smoothPoint, span } from "@/components/wizard/scene-kit";
import { DrawnCheck, Ripple, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Fresh, Pill, TONES, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type DashboardLabels = ProductSceneLabels & { db: Translation["dashboardScenes"] };

/*
 * The control panel page's scenes, drawn from `screenshots/dashboard/*`:
 *
 *   overview  (hero) the centre's numbers, live: they count in, then keep moving as the day does —
 *             a payment comes in, a pupil arrives — and the alerts that need someone land beside
 *   alerts    the notification centre: the bell counts, the day's notices arrive on top
 *   quick     the quick actions: "create event" pressed, and the event is in everyone's upcoming
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: DashboardLabels;
    locale: string;
}

const W = CONTENT.w;

/* ---------------------------------------------------------------------------------------------- */
/* overview · the centre's numbers, live                                                          */
/* ---------------------------------------------------------------------------------------------- */

const LIVE = { attendance: 2600, payment: 3400 };
const KPIS: { icon: LucideIcon; tone: string }[] = [
    { icon: UserCheck, tone: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
    { icon: BadgeEuro, tone: "bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300" },
    { icon: GraduationCap, tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
    { icon: MessageCircle, tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
];
const CURVE = [0.18, 0.3, 0.27, 0.44, 0.52, 0.5, 0.66, 0.74];
const CHART = { x: 0.9, y: 11.5, w: 17.8, h: 7 };
const ALERTS: { icon: LucideIcon; tone: keyof typeof TONES; at: number }[] = [
    { icon: AlertTriangle, tone: "red", at: 1700 },
    { icon: UserPlus, tone: "violet", at: 2300 },
    { icon: CalendarDays, tone: "yellow", at: 2900 },
];

function OverviewScene({ t, labels, locale }: Props) {
    const { db } = labels;
    const count = easeOut(span(t, 200, 1500));
    const attendance = 96.2 * count + (on(t, LIVE.attendance) ? 0.2 : 0);
    const collected = 48189 * count + 731.5 * easeOut(span(t, LIVE.payment, 700));
    const values = [percent(locale, attendance, 1), money(locale, collected, 0), number(locale, Math.round(486 * count)), percent(locale, 92 * count, 0)];
    const flash = [LIVE.attendance, LIVE.payment, -1, -1];
    const draw = easeInOut(span(t, 700, 1800));
    const points = CURVE.map((v, i) => [i * (178 / (CURVE.length - 1)), 70 - v * 64] as [number, number]);
    const line = smoothPath(points);
    const head = smoothPoint(points, draw);

    return (
        <>
            <Title
                aside={
                    <span className="flex items-center gap-[0.35em] rounded-full bg-fill-2 px-[0.65em] py-[0.25em]">
                        <span className="size-[0.4em] animate-pulse rounded-full bg-green-500" />
                        <span className="text-[0.46em] font-medium text-ink-2">{db.live}</span>
                    </span>
                }
            >
                {db.title}
            </Title>

            {KPIS.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                    <At key={index} x={index * 7.65} y={2.5} w={7.25} h={4.3}>
                        <Pop show={on(t, 100 + index * 90)} from="up" className={cn("relative flex h-full flex-col justify-between overflow-hidden rounded-[0.8em] p-[0.65em]", kpi.tone)}>
                            {flash[index] > 0 && <Fresh t={t} at={flash[index]} className="rounded-[0.8em] bg-white/50" />}
                            <span className="flex items-center gap-[0.3em]">
                                <Icon className="size-[0.6em] shrink-0" />
                                <span className="truncate text-[0.38em] font-semibold uppercase tracking-[0.08em]">{db.kpis[index]}</span>
                            </span>
                            <span className="text-[1.15em] font-light leading-none tabular-nums tracking-[-0.03em]">{values[index]}</span>
                        </Pop>
                    </At>
                );
            })}

            {/* The month's collections, drawn as they come in. */}
            <At x={0} y={7.4} w={19.6} h={13.2}>
                <Pop show={on(t, 400)} from="up" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.9} y={8.1} w={17.8} className="flex items-start justify-between">
                <span className="flex flex-col gap-[0.25em]">
                    <span className="text-[0.5em] font-semibold text-ink-2">{db.collections}</span>
                    <span className="text-[1em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, collected, 2)}</span>
                </span>
                <Pop show={on(t, LIVE.payment)} from="scale">
                    <Pill tone="green">+{money(locale, 731.5, 2)}</Pill>
                </Pop>
            </At>
            <At {...CHART}>
                <svg viewBox="0 0 178 72" className="size-full overflow-visible">
                    <defs>
                        <linearGradient id="db-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#22c55e" stopOpacity="0.35" />
                            <stop offset="1" stopColor="#22c55e" stopOpacity="0.02" />
                        </linearGradient>
                        <clipPath id="db-clip">
                            <rect x="-4" y="-20" height="100" width={4 + 182 * draw} />
                        </clipPath>
                    </defs>
                    {[18, 36, 54, 72].map((y) => (
                        <line key={y} x1="0" x2="178" y1={y} y2={y} stroke="var(--ds-hairline)" strokeWidth="0.6" />
                    ))}
                    <g clipPath="url(#db-clip)">
                        <path d={`${line} L 178 72 L 0 72 Z`} fill="url(#db-fill)" />
                        <path d={line} fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
                    </g>
                    {draw > 0 && (
                        <g>
                            <circle cx={head[0]} cy={head[1]} r="8" fill="#22c55e" opacity={draw < 1 ? 0.2 : 0.12} />
                            <circle cx={head[0]} cy={head[1]} r="2.6" fill="#ffffff" stroke="#16a34a" strokeWidth="1.6" />
                        </g>
                    )}
                </svg>
            </At>

            {/* What needs someone, as it happens. */}
            <At x={20.2} y={7.4} w={W - 20.2} h={13.2}>
                <Pop show={on(t, 500)} from="up" className="flex h-full flex-col gap-[0.45em] rounded-[0.9em] p-[0.7em] ds-glass-inner">
                    <span className="flex items-center justify-between">
                        <Caps>{db.alerts}</Caps>
                        <span key={ALERTS.filter((a) => on(t, a.at)).length} className="grid size-[0.95em] animate-[ds-pop_350ms_var(--ease-spring-bounce)] place-items-center rounded-full bg-red-500 text-white">
                            <span className="text-[0.4em] font-bold tabular-nums">{ALERTS.filter((a) => on(t, a.at)).length}</span>
                        </span>
                    </span>
                    {[...ALERTS].reverse().map((alert, index) => {
                        const Icon = alert.icon;
                        const i = ALERTS.indexOf(alert);
                        return (
                            <Pop key={i} show={on(t, alert.at)} from="down" className="relative flex items-start gap-[0.45em] rounded-[0.55em] bg-surface/70 p-[0.45em] ring-1 ring-hairline">
                                <Fresh t={t} at={alert.at} />
                                <span className={cn("flex size-[1.2em] shrink-0 items-center justify-center rounded-[0.35em]", TONES[alert.tone])}>
                                    <Icon className="size-[0.6em]" />
                                </span>
                                <span className="flex min-w-0 flex-col gap-[0.15em]">
                                    <span className="line-clamp-2 text-[0.4em] font-semibold leading-tight">{db.alertItems[i]}</span>
                                    <span className="text-[0.34em] text-ink-3">{db.times[index]}</span>
                                </span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* alerts · the notification centre                                                               */
/* ---------------------------------------------------------------------------------------------- */

const NOTICES: { icon: LucideIcon; tone: keyof typeof TONES; at: number }[] = [
    { icon: CalendarDays, tone: "yellow", at: -1 },
    { icon: MessageCircle, tone: "blue", at: -1 },
    { icon: Receipt, tone: "green", at: 900 },
    { icon: UserPlus, tone: "violet", at: 1700 },
    { icon: AlertTriangle, tone: "red", at: 2500 },
];
const READ_AT = 3600;

function AlertsScene({ t, labels }: Props) {
    const { db } = labels;
    const arrived = NOTICES.filter((n) => n.at < 0 || on(t, n.at));
    const order = [...arrived].reverse();
    const unread = on(t, READ_AT) ? 0 : arrived.filter((n) => n.at >= 0).length + 1;

    return (
        <>
            <Title
                aside={
                    <span className="relative flex size-[1.7em] items-center justify-center rounded-full ds-glass-inner">
                        <Bell className="size-[0.75em]" />
                        {unread > 0 && (
                            <span key={unread} className="absolute -right-[0.15em] -top-[0.15em] grid size-[0.9em] animate-[ds-pop_350ms_var(--ease-spring-bounce)] place-items-center rounded-full bg-red-500 text-white">
                                <span className="text-[0.4em] font-bold tabular-nums">{unread}</span>
                            </span>
                        )}
                        <Ripple p={span(t, NOTICES[4].at, 800)} className="text-red-500" />
                    </span>
                }
            >
                {db.notifications}
            </Title>
            <At x={0} y={2.5} w={W} h={18.1}>
                <Pop show={on(t, 100)} from="up" className="flex h-full flex-col rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <span className="mb-[0.5em] flex items-center justify-between">
                        <Caps>{db.today}</Caps>
                        <span className={cn("flex items-center gap-[0.3em] rounded-full px-[0.55em] py-[0.15em] transition-colors duration-300", between(t, READ_AT - 250, READ_AT) ? "bg-fill-2" : "")}>
                            <CheckCheck className={cn("size-[0.6em] transition-colors duration-500", on(t, READ_AT) ? "text-sky-500" : "text-ink-3")} />
                            <span className="text-[0.4em] font-medium text-ink-2">{db.markRead}</span>
                        </span>
                    </span>
                    <span className="relative block flex-1">
                        {NOTICES.map((notice) => {
                            const i = NOTICES.indexOf(notice);
                            const index = order.indexOf(notice);
                            const Icon = notice.icon;
                            const fresh = notice.at >= 0;
                            return (
                                <span key={i} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${Math.max(0, index) * 2.6}em` }}>
                                    <Pop show={!fresh || on(t, notice.at)} from={fresh ? "down" : "up"} className="relative flex h-[2.35em] items-center gap-[0.55em] rounded-[0.6em] px-[0.45em]">
                                        {fresh && <Fresh t={t} at={notice.at} />}
                                        <span className={cn("flex size-[1.45em] shrink-0 items-center justify-center rounded-[0.45em]", TONES[notice.tone])}>
                                            <Icon className="size-[0.7em]" />
                                        </span>
                                        <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                            <span className="truncate text-[0.48em] font-semibold">{db.notifItems[i]}</span>
                                            <span className="truncate text-[0.38em] text-ink-3">{db.notifDetails[i]}</span>
                                        </span>
                                        <span className="text-[0.36em] tabular-nums text-ink-3">{db.times[Math.max(0, index)]}</span>
                                        <span className={cn("size-[0.4em] shrink-0 rounded-full bg-sky-500 transition-opacity duration-500", fresh && !on(t, READ_AT) ? "opacity-100" : "opacity-0")} />
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
/* quick · one tap, and it's done                                                                 */
/* ---------------------------------------------------------------------------------------------- */

const ACTIONS: LucideIcon[] = [MapPinCheck, Receipt, GraduationCap, UserRoundCog, ShieldPlus, CalendarPlus, UserPlus, BookOpen];
const QUICK = { press: 1100, created: 1500 };
const PICKED = 5;

function QuickScene({ t, labels, locale }: Props) {
    const { db } = labels;
    const created = on(t, QUICK.created);
    const date = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(new Date(2026, 5, 18));
    const reached = Math.round(486 * easeOut(span(t, QUICK.created + 500, 1400)));

    return (
        <>
            <At x={0} y={0} w={14.6} h={1.9} className="flex items-center">
                <Caps>{db.quickTitle}</Caps>
            </At>
            {db.quickActions.map((action, index) => {
                const Icon = ACTIONS[index];
                const picked = index === PICKED;
                return (
                    <At key={action} x={(index % 2) * 7.4} y={2 + Math.floor(index / 2) * 4.65} w={7.1} h={4.35}>
                        <Pop
                            show={on(t, 100 + index * 60)}
                            from="up"
                            className={cn(
                                "relative flex h-full flex-col items-center justify-center gap-[0.45em] rounded-[0.7em] bg-surface/80 ring-1 ring-hairline transition-[scale,box-shadow] duration-200",
                                picked && between(t, QUICK.press, QUICK.created) && "scale-95 ring-[0.12em] ring-ink",
                            )}
                        >
                            <Icon className="size-[0.95em]" strokeWidth={1.8} />
                            <span className="max-w-[90%] truncate text-[0.46em]">{action}</span>
                            {picked && <Ripple p={span(t, QUICK.press, 800)} className="rounded-[0.7em] text-ink/40" />}
                        </Pop>
                    </At>
                );
            })}

            {/* Upcoming events: empty, then the new one. */}
            <At x={15.4} y={0} w={W - 15.4} h={20.6}>
                <Pop show={on(t, 200)} from="up" className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.8em] ds-glass-inner">
                    <Caps>{db.upcoming}</Caps>
                    <div className="grid flex-1 content-start">
                        <span className={cn("[grid-area:1/1] flex flex-col items-center gap-[0.4em] pt-[1.6em] text-center transition-opacity duration-500", created && "opacity-0")}>
                            <span className="grid size-[1.8em] place-items-center rounded-[0.5em] bg-fill-2">
                                <CalendarDays className="size-[0.8em] text-ink-2" />
                            </span>
                            <span className="text-[0.4em] font-semibold uppercase tracking-[0.1em]">{db.noEvents}</span>
                        </span>
                        <Pop show={created} from="down" className="[grid-area:1/1] relative flex flex-col gap-[0.45em] rounded-[0.7em] border-l-[0.2em] border-green-500 bg-green-50 p-[0.6em] dark:bg-green-500/15">
                            <Fresh t={t} at={QUICK.created} className="rounded-[0.7em]" />
                            <span className="text-[0.5em] font-semibold leading-tight">{db.newEvent}</span>
                            <span className="flex items-center gap-[0.3em] text-ink-2">
                                <CalendarDays className="size-[0.55em]" />
                                <span className="text-[0.42em] capitalize tabular-nums">{date} · 17:30</span>
                            </span>
                            <span className="flex items-center gap-[0.3em] text-green-700 dark:text-green-400">
                                <Users className="size-[0.55em]" />
                                <span className="text-[0.42em] font-semibold tabular-nums">
                                    {number(locale, reached)} {db.notified}
                                </span>
                            </span>
                        </Pop>
                    </div>
                    <Pop show={on(t, QUICK.created + 1900)} from="up" className="flex items-center gap-[0.35em] rounded-[0.55em] bg-green-100 px-[0.55em] py-[0.4em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                        <span className="size-[0.75em]">
                            <DrawnCheck p={span(t, QUICK.created + 2000, 450)} className="size-full" />
                        </span>
                        <span className="text-[0.42em] font-semibold">{db.done}</span>
                    </Pop>
                </Pop>
            </At>
        </>
    );
}


/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    overview: { Scene: OverviewScene, duration: 4400 },
    alerts: { Scene: AlertsScene, duration: 4300 },
    quick: { Scene: QuickScene, duration: 4400 },
} satisfies Record<string, SceneSpec<DashboardLabels>>;

export type DashboardSceneKey = keyof typeof SCENES;

export default function DashboardScenes({ scene, labels, locale, max }: { scene: DashboardSceneKey; labels: DashboardLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
