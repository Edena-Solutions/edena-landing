import { BookOpenCheck, ClipboardList, FileText, GraduationCap, MessageCircle, Receipt, type LucideIcon } from "lucide-react";

import { PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, capitalize, easeInOut, easeOut, money, number, on, percent, span } from "@/components/wizard/scene-kit";
import { DrawnCheck, Ripple, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Fresh, Lights, Pill, SOLO, SOLO_PHONE, TONES, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type SchoolsLabels = ProductSceneLabels & { sc: Translation["schoolsScenes"] };

/*
 * The schools page's scenes:
 *
 *   year    (hero) a school year, from enrolment to the final report: a light runs September to
 *           June and each milestone lands as it passes — enrolment, the first bills, the reports
 *           of each term — while the year's numbers add up
 *   family  a family's phone: a new mark arrives, attendance and the term's report at a glance
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: SchoolsLabels;
    locale: string;
}

const W = CONTENT.w;

/* ---------------------------------------------------------------------------------------------- */
/* year · from enrolment to the final report                                                      */
/* ---------------------------------------------------------------------------------------------- */

const TRACK = { x: 1, w: W - 2, y: 7.4 };
const RUN = { at: 600, duration: 3800 };
const monthX = (month: number) => TRACK.x + (month / 9) * TRACK.w;
const MILESTONES: { month: number; icon: LucideIcon; tone: keyof typeof TONES; above: boolean }[] = [
    { month: 0, icon: GraduationCap, tone: "blue", above: true },
    { month: 1, icon: Receipt, tone: "green", above: false },
    { month: 3, icon: FileText, tone: "violet", above: true },
    { month: 4, icon: MessageCircle, tone: "orange", above: false },
    { month: 6, icon: FileText, tone: "violet", above: true },
    { month: 9, icon: BookOpenCheck, tone: "green", above: false },
];
const CARD = { w: 6.8, h: 3.9 };

function YearScene({ t, labels, locale }: Props) {
    const { sc } = labels;
    const run = easeInOut(span(t, RUN.at, RUN.duration));
    const head = TRACK.x + run * TRACK.w;
    const reached = (month: number) => run >= month / 9 - 0.001 && on(t, RUN.at);
    const months = Array.from({ length: 10 }, (_, index) => capitalize(new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2025, 8 + index, 1)).replace(".", "")));
    const kpi = (value: number, from: number) => value * easeOut(span(t, from, 1600));

    return (
        <>
            <Title aside={<Pill tone={run >= 1 ? "green" : "blue"}>{run >= 1 ? sc.yearClosed : sc.inProgress}</Pill>}>{sc.year}</Title>

            {/* The year's track, and the light that runs it. */}
            <At x={TRACK.x} y={TRACK.y - 0.08} w={TRACK.w} h={0.16} className="overflow-hidden rounded-full bg-fill-2">
                <span className="block h-full origin-left rounded-full" style={{ transform: `scaleX(${run})`, background: "var(--ds-brand-gradient)" }} />
            </At>
            {months.map((month, index) => (
                <At key={index} x={monthX(index) - 1} y={TRACK.y + 0.45} w={2} className="flex justify-center">
                    <span className={cn("text-[0.36em] font-semibold uppercase tracking-[0.06em] transition-colors duration-500", reached(index) ? "text-ink" : "text-ink-3")}>{month}</span>
                </At>
            ))}
            {months.map((_, index) => (
                <At key={index} x={monthX(index) - 0.14} y={TRACK.y - 0.14} w={0.28} h={0.28} className={cn("rounded-full transition-colors duration-500", reached(index) ? "bg-green-500" : "bg-fill-2")} />
            ))}
            {run > 0 && run < 1 && (
                <At x={head} y={TRACK.y} className="pointer-events-none z-10">
                    <span className="absolute -left-[0.8em] -top-[0.8em] size-[1.6em] rounded-full bg-brand/40 blur-[0.3em]" />
                    <span className="absolute -left-[0.25em] -top-[0.25em] size-[0.5em] rounded-full bg-white shadow-[0_0_0.5em_rgb(34_197_94/0.9)]" />
                </At>
            )}

            {/* The milestones, landing as the light passes. */}
            {MILESTONES.map((milestone, index) => {
                const x = Math.min(W - CARD.w, Math.max(0, monthX(milestone.month) - CARD.w / 2));
                const y = milestone.above ? TRACK.y - 1 - CARD.h : TRACK.y + 1.5;
                const shown = reached(milestone.month);
                const at = RUN.at + (milestone.month / 9) * RUN.duration * 0.85;
                const Icon = milestone.icon;
                return (
                    <div key={index}>
                        <At x={monthX(milestone.month) - 0.03} y={milestone.above ? y + CARD.h : TRACK.y + 0.1} w={0.06} h={milestone.above ? TRACK.y - y - CARD.h : 1.4} className={cn("bg-hairline-strong transition-opacity duration-500", shown ? "opacity-100" : "opacity-0")} />
                        <At x={x} y={y} w={CARD.w} h={CARD.h}>
                            <Pop show={shown} from={milestone.above ? "up" : "down"} className="relative flex h-full flex-col gap-[0.35em] rounded-[0.7em] p-[0.55em] ds-glass-inner">
                                <span className="flex items-center gap-[0.35em] pr-[0.8em]">
                                    <span className={cn("flex size-[1.15em] shrink-0 items-center justify-center rounded-[0.35em]", TONES[milestone.tone])}>
                                        <Icon className="size-[0.6em]" />
                                    </span>
                                    <span className="line-clamp-2 text-[0.42em] font-semibold leading-tight">{sc.milestones[index]}</span>
                                </span>
                                <span className="line-clamp-2 text-[0.38em] leading-snug text-ink-2">{sc.details[index]}</span>
                                <span className="absolute right-[0.45em] top-[0.45em] size-[0.7em] text-green-600 dark:text-green-400">
                                    <DrawnCheck p={span(t, at + 300, 450)} className="size-full" />
                                </span>
                                <Ripple p={span(t, at, 800)} className="rounded-[0.7em] text-green-500" />
                            </Pop>
                        </At>
                    </div>
                );
            })}

            {/* The year in numbers. */}
            {[
                [sc.kpis[0], number(locale, Math.round(kpi(486, 800)))],
                [sc.kpis[1], number(locale, Math.round(kpi(1458, 2200)))],
                [sc.kpis[2], money(locale, kpi(1284300, 1200), 0)],
                [sc.kpis[3], percent(locale, kpi(96.4, 1000), 1)],
            ].map(([label, value], index) => (
                <At key={index} x={index * 7.65} y={14.6} w={7.25} h={3.4}>
                    <Pop show={on(t, 600 + index * 100)} from="up" className="flex h-full flex-col justify-between rounded-[0.7em] bg-fill/70 p-[0.55em]">
                        <span className="truncate text-[0.36em] font-semibold uppercase tracking-[0.08em] text-ink-3">{label}</span>
                        <span className="text-[0.85em] font-light leading-none tabular-nums tracking-[-0.02em]">{value}</span>
                    </Pop>
                </At>
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* family · marks, attendance and the term's report, live                                         */
/* ---------------------------------------------------------------------------------------------- */

const MARKS = [
    { subject: 0, mark: 8.5, at: 1200 },
    { subject: 1, mark: 7.2, at: -1 },
    { subject: 2, mark: 9, at: -1 },
];
const REPORT_AT = 2700;

function FamilyScene({ t, labels, locale }: Props) {
    const { sc } = labels;
    const attendance = 98 * easeOut(span(t, 400, 1400));

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
                        <Pop show={between(t, 800, 2000)} from="down">
                            <PhoneNotification title={sc.newMark} body={`${sc.subjects[0]} | ${number(locale, 8.5, 1)}`} />
                        </Pop>
                    }
                >
                    <div className="flex h-full flex-col gap-[0.6em] px-[0.6em] pt-[0.3em]">
                        <span className="flex items-center gap-[0.45em]">
                            <Avatar initials="HF" hue={45} size={1.6} />
                            <span className="flex flex-col gap-[0.15em]">
                                <span className="text-[0.52em] font-semibold">Hugo Fernández</span>
                                <span className="text-[0.38em] text-ink-3">4.º B | {sc.tutor}</span>
                            </span>
                        </span>

                        {/* Attendance this month. */}
                        <Pop show={on(t, 200)} from="up" className="flex items-center gap-[0.6em] rounded-[0.8em] p-[0.6em] ds-glass-inner">
                            <span className="relative grid size-[2.6em] shrink-0 place-items-center">
                                <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
                                    <circle cx="20" cy="20" r="16" fill="none" stroke="var(--ds-fill-2)" strokeWidth="4" />
                                    <circle cx="20" cy="20" r="16" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset={100 - attendance} />
                                </svg>
                                <span className="text-[0.4em] font-semibold tabular-nums">{percent(locale, attendance, 0)}</span>
                            </span>
                            <span className="flex flex-col gap-[0.2em]">
                                <span className="text-[0.46em] font-semibold">{sc.attendance}</span>
                                <span className="text-[0.38em] text-ink-3">{sc.attendanceDetail}</span>
                            </span>
                        </Pop>

                        {/* Marks: the new one lands on top. */}
                        <Caps tone="text-ink-3">{sc.lastMarks}</Caps>
                        {MARKS.map((mark, index) => {
                            const isNew = mark.at > 0;
                            return (
                                <Pop key={index} show={isNew ? on(t, mark.at) : on(t, 300 + index * 100)} from={isNew ? "down" : "up"} className="relative flex items-center gap-[0.5em] rounded-[0.6em] bg-surface/80 px-[0.55em] py-[0.45em] ring-1 ring-hairline">
                                    {isNew && <Fresh t={t} at={mark.at} className="rounded-[0.6em]" />}
                                    <ClipboardList className="size-[0.6em] text-ink-2" />
                                    <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
                                        <span className="truncate text-[0.44em] font-medium">{sc.subjects[mark.subject]}</span>
                                        <span className="truncate text-[0.36em] text-ink-3">{sc.exams[mark.subject]}</span>
                                    </span>
                                    <span className={cn("text-[0.62em] font-semibold tabular-nums", mark.mark >= 9 ? "text-green-600 dark:text-green-400" : "text-ink")}>{number(locale, mark.mark, 1)}</span>
                                </Pop>
                            );
                        })}

                        {/* The term's report, available. */}
                        <Pop show={on(t, REPORT_AT)} from="up" className="relative flex items-center gap-[0.5em] rounded-[0.7em] bg-violet-50 p-[0.55em] dark:bg-violet-500/15">
                            <Fresh t={t} at={REPORT_AT} className="rounded-[0.7em]" />
                            <span className={cn("flex size-[1.4em] items-center justify-center rounded-[0.45em]", TONES.violet)}>
                                <FileText className="size-[0.65em]" />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.15em]">
                                <span className="truncate text-[0.44em] font-semibold">{sc.reportReady}</span>
                                <span className="truncate text-[0.36em] text-ink-3">{sc.reportDetail}</span>
                            </span>
                        </Pop>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}


/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    year: { Scene: YearScene, duration: 5200 },
    family: { Scene: FamilyScene, duration: 3800, ...SOLO },
} satisfies Record<string, SceneSpec<SchoolsLabels>>;

export type SchoolsSceneKey = keyof typeof SCENES;

export default function SchoolsScenes({ scene, labels, locale, max }: { scene: SchoolsSceneKey; labels: SchoolsLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
