import { ArrowLeft, Bell, FileText, Plus } from "lucide-react";

import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, easeInOut, easeOut, fill, number, on, percent, smoothPath, span } from "@/components/wizard/scene-kit";
import { DrawnCheck, KEY_FEATURE_SCENES, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { ActionButton, Caps, Fresh, Morph, Pill, SettlePill, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type AssignmentLabels = ProductSceneLabels & { as: Translation["assignmentScenes"] };

/*
 * The assessments page's scenes, drawn from `screenshots/assignment/*`:
 *
 *   gradebook  (hero) a subject's marks: the third exam written in row by row, each final mark
 *              recomputed as it lands; then the report cards, generated and sent
 *   planner    the week's tasks by subject; a new one set, its reminder scheduled
 *   grades     a pupil's grades written in and her report card sent (the home's scene)
 *   cycles     the evaluation cycle: three terms weighted to a hundred, and a final mark worked out
 *   progress   a pupil's progress through the year, subject by subject, and her rubric
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: AssignmentLabels;
    locale: string;
}

const W = CONTENT.w;

/* ---------------------------------------------------------------------------------------------- */
/* gradebook · marks in, report cards out                                                         */
/* ---------------------------------------------------------------------------------------------- */

const PUPILS = [
    { name: "Sofía Almeida", hue: 330, marks: [7.3, 6.6, 8.4, 8.12] },
    { name: "Emma Brown", hue: 200, marks: [3.4, 4.7, 5.9, 10] },
    { name: "Lucas Dubois", hue: 30, marks: [5.8, 8.9, 7.2, 7.7] },
    { name: "Hugo Fernández", hue: 45, marks: [9.3, 9.3, 8.8, 9.1] },
    { name: "Sara García", hue: 280, marks: [5.8, 4.55, 6.1, 7] },
    { name: "Marta González", hue: 140, marks: [4.6, 9.94, 8.3, 8.5] },
];
const WRITE_AT = (row: number) => 700 + row * 330;
const REPORTS = { press: 3300, busy: 3500, done: 4100 };
const COLS = [9.6, 13.6, 17.6, 21.6];

function GradebookScene({ t, labels, locale }: Props) {
    const { as } = labels;
    const sent = Math.round(24 * easeOut(span(t, REPORTS.done, 900)));

    return (
        <>
            <Title
                aside={
                    <span className="w-[8.2em]">
                        <ActionButton
                            t={t}
                            press={REPORTS.press}
                            busy={REPORTS.busy}
                            done={REPORTS.done}
                            label={
                                <span className="flex items-center gap-[0.35em]">
                                    <FileText className="size-[1.05em]" />
                                    {as.generate}
                                </span>
                            }
                            doneLabel={fill(as.generated, { n: String(sent) })}
                        />
                    </span>
                }
            >
                <span className="flex items-center gap-[0.5em]">
                    <span className="flex size-[1.5em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                        <ArrowLeft className="size-[0.68em] text-ink-2" />
                    </span>
                    <span className="h-[1.1em] w-[0.16em] rounded-full bg-violet-500" />
                    {as.subject}
                </span>
            </Title>

            <At x={0} y={2.5} w={W} h={0.9}>
                {as.columns.map((column, index) => (
                    <span key={column} className="absolute flex flex-col" style={{ left: `${COLS[index]}em` }}>
                        <Caps tone="text-ink-3">{column}</Caps>
                        <span className="text-[0.34em] tabular-nums text-ink-3">{percent(locale, 25, 0)}</span>
                    </span>
                ))}
                <span className="absolute right-[0.4em] flex flex-col items-end">
                    <Caps tone="text-ink-3">{as.finalGrade}</Caps>
                    <span className="text-[0.34em] text-ink-3">{as.calculated}</span>
                </span>
            </At>

            {PUPILS.map((pupil, row) => {
                const written = on(t, WRITE_AT(row));
                const marks = written ? pupil.marks : pupil.marks.map((m, i) => (i === 2 ? -1 : m));
                const counted = marks.filter((m) => m >= 0);
                const final = counted.reduce((sum, m) => sum + m, 0) / 4;
                return (
                    <At key={pupil.name} x={0} y={3.9 + row * 2.75} w={W} h={2.75}>
                        <Pop show={on(t, 150 + row * 70)} from="up" className="relative flex h-full items-center border-b border-hairline">
                            <span className="absolute left-[0.2em] flex items-center gap-[0.45em]">
                                <Avatar initials={pupil.name.split(" ").map((w) => w[0]).join("")} hue={pupil.hue} size={1.4} />
                                <span className="w-[13em] truncate text-[0.48em] font-medium">{pupil.name}</span>
                            </span>
                            {marks.map((mark, col) => {
                                const active = col === 2 && between(t, WRITE_AT(row) - 300, WRITE_AT(row) + 50);
                                return (
                                    <span
                                        key={col}
                                        className={cn(
                                            "absolute flex h-[1.5em] w-[3.4em] items-center rounded-[0.4em] bg-fill px-[0.5em] transition-shadow duration-300",
                                            active && "ring-[0.1em] ring-violet-500/70",
                                        )}
                                        style={{ left: `${COLS[col]}em` }}
                                    >
                                        <span key={mark} className={cn("text-[0.5em] tabular-nums", mark < 0 ? "text-ink-3" : col === 2 ? "animate-[ds-pop_350ms_var(--ease-spring-bounce)] font-semibold" : "")}>
                                            {mark < 0 ? "—" : number(locale, mark, 2)}
                                        </span>
                                    </span>
                                );
                            })}
                            <span className="absolute right-[0.4em] flex h-[1.5em] w-[3.2em] items-center justify-end rounded-[0.4em] px-[0.5em]">
                                {written && <Fresh t={t} at={WRITE_AT(row)} className="rounded-[0.4em]" />}
                                <span key={final} className={cn("text-[0.55em] font-semibold tabular-nums", final >= 5 ? "text-ink" : "text-red-500")}>
                                    {number(locale, final, 2)}
                                </span>
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}


/* ---------------------------------------------------------------------------------------------- */
/* planner · the week's tasks                                                                     */
/* ---------------------------------------------------------------------------------------------- */

const SUBJECT_TONES = ["border-sky-500 bg-sky-50 dark:bg-sky-500/15", "border-violet-500 bg-violet-50 dark:bg-violet-500/15", "border-green-500 bg-green-50 dark:bg-green-500/15", "border-orange-500 bg-orange-50 dark:bg-orange-500/15", "border-rose-500 bg-rose-50 dark:bg-rose-500/15"];
const TASKS = [
    { day: 0, subject: 0, slot: 0 },
    { day: 0, subject: 1, slot: 1 },
    { day: 1, subject: 3, slot: 0 },
    { day: 2, subject: 0, slot: 0 },
    { day: 2, subject: 4, slot: 1 },
    { day: 4, subject: 1, slot: 0 },
];
const NEW = { day: 3, subject: 2, press: 1600, at: 1900, reminder: 2700, notified: 3300 };
const DAY_W = W / 5;

function PlannerScene({ t, labels, locale }: Props) {
    const { as } = labels;
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });

    return (
        <>
            <Title
                aside={
                    <span className={cn("flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas transition-[scale] duration-200", between(t, NEW.press, NEW.at) && "scale-95")}>
                        <Plus className="size-[0.62em]" />
                        <span className="whitespace-nowrap text-[0.5em] font-semibold">{as.newTask}</span>
                    </span>
                }
            >
                {as.weekTasks}
            </Title>
            {Array.from({ length: 5 }, (_, day) => (
                <At key={day} x={day * DAY_W} y={2.5} w={DAY_W - 0.3} h={18.1}>
                    <Pop show={on(t, 100 + day * 60)} from="up" className="flex h-full flex-col gap-[0.45em] rounded-[0.7em] bg-fill/60 p-[0.45em]">
                        <span className="flex items-baseline justify-between px-[0.15em]">
                            <span className="text-[0.4em] font-semibold uppercase tracking-[0.08em] text-ink-3">{weekday.format(new Date(2026, 5, 8 + day)).replace(".", "")}</span>
                            <span className={cn("text-[0.5em] font-semibold tabular-nums", day === 3 ? "text-ink" : "text-ink-2")}>{8 + day}</span>
                        </span>
                    </Pop>
                </At>
            ))}
            {TASKS.map((task, index) => (
                <At key={index} x={task.day * DAY_W + 0.45} y={4 + task.slot * 3.8} w={DAY_W - 1.2} h={3.4}>
                    <Pop show={on(t, 400 + index * 90)} from="up" className={cn("flex h-full flex-col justify-between rounded-[0.5em] border-l-[0.18em] p-[0.45em]", SUBJECT_TONES[task.subject])}>
                        <span className="text-[0.36em] font-semibold uppercase tracking-[0.08em] text-ink-2">{as.subjects[task.subject]}</span>
                        <span className="line-clamp-2 text-[0.42em] font-medium leading-tight">{as.tasks[index]}</span>
                    </Pop>
                </At>
            ))}

            {/* The new task, set on Thursday, and what follows on its own. */}
            <At x={NEW.day * DAY_W + 0.45} y={4} w={DAY_W - 1.2} h={6.6}>
                <Pop show={on(t, NEW.at)} from="down" className={cn("relative flex h-full flex-col gap-[0.45em] rounded-[0.5em] border-l-[0.18em] p-[0.45em] elev-2", SUBJECT_TONES[NEW.subject])}>
                    <Fresh t={t} at={NEW.at} className="rounded-[0.5em]" />
                    <span className="text-[0.36em] font-semibold uppercase tracking-[0.08em] text-ink-2">{as.subjects[NEW.subject]}</span>
                    <span className="text-[0.44em] font-semibold leading-tight">{as.newTaskTitle}</span>
                    <span className="text-[0.36em] text-ink-2">
                        {as.due} | 23:59
                    </span>
                    <Pop show={on(t, NEW.reminder)} from="scale" className="mt-auto flex w-fit items-center gap-[0.25em] rounded-full bg-surface/80 px-[0.45em] py-[0.15em]">
                        <Bell className="size-[0.45em] text-ink-2" />
                        <span className="text-[0.32em] font-medium">{as.reminder}</span>
                    </Pop>
                </Pop>
            </At>
            <At x={NEW.day * DAY_W - 3} y={11.2} w={DAY_W + 6} className="flex justify-center">
                <Pop show={on(t, NEW.notified)} from="down">
                    <SettlePill t={t} at={NEW.notified} from="" to={as.familiesNotified} />
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* cycles · three terms, one final mark                                                           */
/* ---------------------------------------------------------------------------------------------- */

const WEIGHTS = [35, 35, 30];
const TERM_MARKS = [7.2, 6.8, 8.1];
const CYCLE = { weights: 900, final: 2600 };

function CyclesScene({ t, labels, locale }: Props) {
    const { as } = labels;
    const pending = Math.round(33 - 33 * easeOut(span(t, 400, 3200)));
    const total = WEIGHTS.reduce((sum, w, i) => sum + w * easeOut(span(t, CYCLE.weights + i * 300, 700)), 0);
    const final = TERM_MARKS.reduce((sum, m, i) => sum + (m * WEIGHTS[i]) / 100, 0);

    return (
        <>
            {/* The active cycle. */}
            <At x={0} y={0} w={W} h={3.4}>
                <Pop show={on(t, 100)} from="up" className="flex h-full items-center justify-between rounded-[0.9em] px-[0.9em] text-white" style={{ background: "linear-gradient(90deg, #84cc16, #22c55e 50%, #14b8a6)" }}>
                    <span className="flex flex-col gap-[0.35em]">
                        <span className="text-[0.42em] font-bold uppercase tracking-[0.12em]">{as.activeCycle}</span>
                        <span className="text-[0.55em] font-medium">{as.schoolYear}</span>
                    </span>
                    <Morph
                        show={pending === 0}
                        from={
                            <span className="flex items-center gap-[0.35em] rounded-full bg-white/25 px-[0.65em] py-[0.25em]">
                                <span className="size-[0.35em] rounded-full bg-amber-300" />
                                <span className="text-[0.46em] font-semibold tabular-nums">
                                    {pending} {as.pending}
                                </span>
                            </span>
                        }
                        to={
                            <span className="flex items-center gap-[0.3em] rounded-full bg-white px-[0.65em] py-[0.25em] text-green-700">
                                <span className="size-[0.75em]">
                                    <DrawnCheck p={span(t, 3600, 450)} className="size-full" />
                                </span>
                                <span className="text-[0.46em] font-semibold">{as.allGraded}</span>
                            </span>
                        }
                    />
                </Pop>
            </At>

            {/* The terms and their weights. */}
            {as.terms.map((term, index) => {
                const grow = easeOut(span(t, CYCLE.weights + index * 300, 700));
                return (
                    <At key={term} x={0} y={4.1 + index * 3} w={18.6} h={2.6}>
                        <Pop show={on(t, 300 + index * 120)} from="up" className="flex h-full items-center gap-[0.6em] rounded-[0.7em] px-[0.7em] ds-glass-inner">
                            <Pill tone="green">{as.active}</Pill>
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
                                <span className="truncate text-[0.5em] font-semibold">{term}</span>
                                <span className="h-[0.28em] overflow-hidden rounded-full bg-fill-2">
                                    <span className="block h-full origin-left rounded-full bg-green-500" style={{ transform: `scaleX(${(WEIGHTS[index] / 40) * grow})` }} />
                                </span>
                            </span>
                            <span className="w-[2.6em] text-right text-[0.6em] font-semibold tabular-nums">{percent(locale, WEIGHTS[index] * grow, 0)}</span>
                        </Pop>
                    </At>
                );
            })}
            <At x={0} y={13.2} w={18.6} className="flex items-center justify-between px-[0.7em]">
                <Caps tone="text-ink-3">{as.totalWeight}</Caps>
                <span className={cn("text-[0.6em] font-semibold tabular-nums transition-colors duration-500", total >= 99.5 ? "text-green-600 dark:text-green-400" : "text-ink")}>{percent(locale, total, 0)}</span>
            </At>

            {/* A pupil's final mark, worked out. */}
            <At x={19.2} y={4.1} w={W - 19.2} h={16.5}>
                <Pop show={on(t, 600)} from="up" className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.8em] ds-glass-inner">
                    <span className="flex items-center gap-[0.45em]">
                        <Avatar initials="HF" hue={45} size={1.4} />
                        <span className="truncate text-[0.48em] font-semibold">Hugo Fernández</span>
                    </span>
                    {TERM_MARKS.map((mark, index) => (
                        <Pop key={index} show={on(t, CYCLE.final - 600 + index * 180)} className="flex items-center justify-between border-b border-hairline pb-[0.35em]">
                            <span className="text-[0.42em] text-ink-2">
                                {as.termsShort[index]} | {percent(locale, WEIGHTS[index], 0)}
                            </span>
                            <span className="text-[0.48em] font-medium tabular-nums">{number(locale, mark, 1)}</span>
                        </Pop>
                    ))}
                    <span className="mt-[0.3em] flex flex-col items-center gap-[0.25em] rounded-[0.6em] bg-fill/70 py-[0.6em]">
                        <Caps tone="text-ink-3">{as.finalGrade}</Caps>
                        <span className="text-[1.5em] font-light leading-none tabular-nums tracking-[-0.03em]">{number(locale, final * easeOut(span(t, CYCLE.final, 1000)), 2)}</span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* progress · a pupil's year                                                                      */
/* ---------------------------------------------------------------------------------------------- */

const LINES = [
    { color: "#6366f1", values: [6.2, 7.1, 7.9] },
    { color: "#22c55e", values: [7.4, 7.2, 8.3] },
    { color: "#f97316", values: [5.6, 6.4, 7.1] },
];
const PLOT = { x: 0.9, y: 6.3, w: 17.6, h: 11 };
const RUBRIC = { at: 2600 };

function ProgressScene({ t, labels, locale }: Props) {
    const { as } = labels;
    const draw = easeInOut(span(t, 600, 1800));
    const average = 7.38 * easeOut(span(t, 700, 1600));
    const toPoint = (value: number, index: number) => [index * 89, 100 - ((value - 4) / 6) * 100] as [number, number];

    return (
        <>
            <Title aside={<Pill tone="violet">{as.reportCard}</Pill>}>
                <span className="flex items-center gap-[0.5em]">
                    <Avatar initials="LG" hue={25} size={1.5} />
                    Lucía García
                </span>
            </Title>

            <At x={0} y={2.5} w={19.4} h={18.1}>
                <Pop show={on(t, 150)} from="up" className="h-full rounded-[0.9em] ds-glass-inner" />
            </At>
            <At x={0.9} y={3.2} w={17.6} className="flex items-start justify-between">
                <span className="flex flex-col gap-[0.3em]">
                    <Caps>{as.weightedAverage}</Caps>
                    <span className="text-[1.4em] font-light leading-none tabular-nums tracking-[-0.03em]">{number(locale, average, 2)}</span>
                </span>
                <span className="flex flex-col items-end gap-[0.3em]">
                    {as.subjects.slice(0, 3).map((subject, index) => (
                        <span key={subject} className="flex items-center gap-[0.3em]">
                            <span className="size-[0.4em] rounded-full" style={{ background: LINES[index].color }} />
                            <span className="text-[0.4em] text-ink-2">{subject}</span>
                        </span>
                    ))}
                </span>
            </At>
            <At {...PLOT}>
                <svg viewBox="0 0 178 100" className="size-full overflow-visible">
                    <defs>
                        <clipPath id="as-clip">
                            <rect x="-6" y="-20" height="140" width={6 + 190 * draw} />
                        </clipPath>
                    </defs>
                    {[0, 33, 66, 100].map((y) => (
                        <line key={y} x1="0" x2="178" y1={y} y2={y} stroke="var(--ds-hairline)" strokeWidth="0.6" />
                    ))}
                    <g clipPath="url(#as-clip)">
                        {LINES.map((line) => {
                            const points = line.values.map(toPoint);
                            return (
                                <g key={line.color}>
                                    <path d={smoothPath(points)} fill="none" stroke={line.color} strokeWidth="1.8" strokeLinecap="round" />
                                    {points.map(([x, y], index) => (
                                        <circle key={index} cx={x} cy={y} r="2.6" fill="var(--ds-surface)" stroke={line.color} strokeWidth="1.5" />
                                    ))}
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </At>
            <At x={PLOT.x - 0.4} y={PLOT.y + PLOT.h + 0.5} w={PLOT.w + 0.8} className="flex justify-between">
                {as.termsShort.map((term) => (
                    <span key={term} className="text-[0.4em] text-ink-3">
                        {term}
                    </span>
                ))}
            </At>

            {/* Her rubric. */}
            <At x={20} y={2.5} w={W - 20} h={18.1}>
                <Pop show={on(t, 300)} from="up" className="flex h-full flex-col gap-[0.55em] rounded-[0.9em] p-[0.75em] ds-glass-inner">
                    <Caps>{as.rubric}</Caps>
                    {as.rubricItems.map((item, index) => {
                        const level = [2, 1, 3][index];
                        return (
                            <Pop key={item} show={on(t, RUBRIC.at + index * 200)} from="up" className="flex flex-col gap-[0.35em] rounded-[0.55em] bg-surface/70 p-[0.5em] ring-1 ring-hairline">
                                <span className="truncate text-[0.44em] font-medium">{item}</span>
                                <span className="flex gap-[0.2em]">
                                    {[0, 1, 2, 3].map((step) => (
                                        <span key={step} className={cn("h-[0.3em] flex-1 rounded-full", step <= level ? "bg-violet-500" : "bg-fill-2")} />
                                    ))}
                                </span>
                                <span className="text-[0.36em] font-semibold text-violet-700 dark:text-violet-300">{as.levels[level]}</span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}


/* ---------------------------------------------------------------------------------------------- */

const { Scene: GradesScene, duration: GRADES_DURATION } = KEY_FEATURE_SCENES[2];

const SCENES = {
    gradebook: { Scene: GradebookScene, duration: 5200 },
    planner: { Scene: PlannerScene, duration: 4000 },
    grades: { Scene: GradesScene, duration: GRADES_DURATION },
    cycles: { Scene: CyclesScene, duration: 4200 },
    progress: { Scene: ProgressScene, duration: 3800 },
} satisfies Record<string, SceneSpec<AssignmentLabels>>;

export type AssignmentSceneKey = keyof typeof SCENES;

export default function AssignmentScenes({ scene, labels, locale, max }: { scene: AssignmentSceneKey; labels: AssignmentLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
