import type { ReactNode } from "react";
import { ArrowLeft, CalendarDays, ChevronDown, ChevronRight, Coffee, Download, Utensils, X } from "lucide-react";

import { EnaClover, PhoneFrame } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, capitalize, clamp01, easeInOut, on, shortDate, span, typed } from "@/components/wizard/scene-kit";
import { DrawnCheck, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    CAL_COL,
    Caps,
    Caret,
    Fresh,
    Lights,
    Morph,
    Pill,
    SOLO,
    SOLO_PHONE,
    SettlePill,
    WeekCalendar,
    between,
    calX,
    calY,
    formatHour,
    type CalendarEvent,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

export type TrackingLabels = ProductSceneLabels & { tr: Translation["trackingScenes"] };

/*
 * The tracking page's scenes, drawn from `screenshots/tracking/*` and `dashboard/dashboard_calendar`:
 *
 *   reports    (hero) the day's report for a pupil: attendance, mood, a note — sent; the next one
 *   clockin    clocking in on the phone in a tap: the shift runs, a break is taken
 *   today      the team's day, hour by hour: a meeting added for everyone, live
 *   timesheet  the working-time record, a day opened to its breaks, exported for an inspection
 *   week       the team's week on the calendar: a staff meeting, on everyone's
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: TrackingLabels;
    locale: string;
}

const W = CONTENT.w;

function Choice({ options, chosen, className }: { options: string[]; chosen: number; className?: string }) {
    return (
        <span className={cn("flex flex-wrap gap-[0.35em]", className)}>
            {options.map((option, index) => (
                <span
                    key={option}
                    className={cn(
                        "flex h-[1.45em] items-center rounded-[0.45em] px-[0.6em] transition-[background-color,color] duration-300",
                        index === chosen ? "bg-ink text-canvas" : "bg-fill text-ink-2",
                    )}
                >
                    <span className="whitespace-nowrap text-[0.44em] font-medium">{option}</span>
                </span>
            ))}
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* reports · the day's report, pupil by pupil                                                     */
/* ---------------------------------------------------------------------------------------------- */

const PUPILS = [
    { name: "Irene Aguilar", initials: "IA", hue: 25 },
    { name: "Daniel Navarro", initials: "DN", hue: 210 },
    { name: "Valeria Vargas", initials: "VV", hue: 290 },
];
const REPORT = { present: 800, mood: 1500, note: 2000, send: 3500, sent: 3750 };

function ReportsScene({ t, labels, locale }: Props) {
    const { tr } = labels;
    const note = typed(tr.observationText, t, REPORT.note, 26);
    const sent = on(t, REPORT.sent);
    const filled = (on(t, REPORT.present) ? 1 : 0) + (on(t, REPORT.mood) ? 1 : 0) + (on(t, REPORT.note + 300) ? 1 : 0);

    return (
        <>
            <Title
                aside={
                    <span className="flex h-[1.7em] items-center rounded-full bg-fill px-[0.8em]">
                        <span className="whitespace-nowrap text-[0.48em] font-medium text-ink-2">{tr.sendPending}</span>
                    </span>
                }
            >
                <span className="flex items-center gap-[0.5em]">
                    <span className="flex size-[1.5em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                        <ArrowLeft className="size-[0.68em] text-ink-2" />
                    </span>
                    {tr.dailyReports}
                </span>
            </Title>

            {/* The day, the template, the classes. */}
            <At x={0} y={2.5} w={W} className="flex items-end gap-[0.6em]">
                {[
                    [tr.day, <span key="d" className="flex items-center gap-[0.35em]"><span className="text-[0.46em] tabular-nums">{shortDate(locale, new Date(2026, 6, 22))}</span><CalendarDays className="size-[0.55em] text-ink-3" /></span>, "w-[6.2em]"],
                    [tr.template, <span key="p" className="flex w-full items-center justify-between"><span className="truncate text-[0.46em]">{tr.templateName}</span><ChevronDown className="size-[0.55em] text-ink-3" /></span>, "w-[9.6em]"],
                    [tr.classes, <span key="c" className="flex gap-[0.25em]">{["6.º B", "6.º A"].map((name) => <span key={name} className="flex items-center gap-[0.2em] rounded-[0.3em] bg-ink px-[0.35em] py-[0.1em] text-canvas"><span className="text-[0.38em] font-semibold">{name}</span><X className="size-[0.4em]" /></span>)}</span>, "w-[7.6em]"],
                ].map(([label, value, width], index) => (
                    <Pop key={index} show={on(t, 100 + index * 80)} from="up" className={cn("flex flex-col gap-[0.3em]", width as string)}>
                        <Caps tone="text-ink-3">{label}</Caps>
                        <span className="flex h-[1.5em] items-center rounded-[0.45em] bg-fill px-[0.5em]">{value}</span>
                    </Pop>
                ))}
            </At>

            {/* The pupils: one in hand, its count of what's filled in. */}
            <At x={0} y={5.3} w={W} className="flex gap-[0.5em]">
                {PUPILS.map((pupil, index) => {
                    const done = index === 0 ? filled : 0;
                    const current = index === (sent ? 1 : 0);
                    return (
                        <Pop
                            key={pupil.name}
                            show={on(t, 300 + index * 90)}
                            from="up"
                            className={cn("flex h-[2.2em] items-center gap-[0.45em] rounded-[0.6em] px-[0.5em] ring-1 transition-colors duration-500", current ? "bg-fill-2 ring-transparent" : "ring-hairline")}
                        >
                            <span className="relative">
                                <Avatar initials={pupil.initials} hue={pupil.hue} size={1.4} />
                                {index === 0 && sent && (
                                    <span className="absolute -bottom-[0.15em] -right-[0.15em] grid size-[0.7em] place-items-center rounded-full bg-green-500 text-white ring-[0.1em] ring-canvas">
                                        <span className="size-[0.55em]">
                                            <DrawnCheck p={span(t, REPORT.sent, 450)} className="size-full" />
                                        </span>
                                    </span>
                                )}
                            </span>
                            <span className="text-[0.44em] font-semibold">{pupil.name.split(" ")[0]}</span>
                            <span className="text-[0.38em] tabular-nums text-ink-3">{done}/3</span>
                        </Pop>
                    );
                })}
            </At>

            {/* Her report. */}
            <At x={0} y={8} w={W} className="flex items-center gap-[0.5em] border-t border-hairline pt-[0.6em]">
                <Avatar initials="IA" hue={25} size={1.5} />
                <span className="flex flex-col gap-[0.25em]">
                    <span className="text-[0.36em] font-semibold uppercase tracking-[0.08em] text-ink-3">Irene Aguilar Méndez</span>
                    <Morph show={sent} from={<span className="text-[0.5em] font-medium">{tr.pendingSend}</span>} to={<span className="text-[0.5em] font-medium text-green-600 dark:text-green-400">{tr.sent}</span>} />
                </span>
                <span className="ml-auto w-[5.4em]">
                    <ActionButton t={t} press={REPORT.send} done={REPORT.sent} label={tr.send} doneLabel={tr.sent} />
                </span>
            </At>
            <At x={0} y={11.2} w={W} className="flex flex-col gap-[0.4em]">
                <Caps tone="text-ink-3">{tr.attendance}</Caps>
                <Choice options={tr.attendanceOpts} chosen={on(t, REPORT.present) ? 0 : -1} />
            </At>
            <At x={0} y={13.95} w={W} className="flex flex-col gap-[0.4em]">
                <Caps tone="text-ink-3">{tr.mood}</Caps>
                <Choice options={tr.moodOpts} chosen={on(t, REPORT.mood) ? 0 : -1} />
            </At>
            <At x={0} y={16.7} w={W} className="flex flex-col gap-[0.4em]">
                <Caps tone="text-ink-3">{tr.observations}</Caps>
                <span className="flex h-[2.6em] items-start justify-between gap-[0.5em] rounded-[0.55em] bg-fill px-[0.6em] py-[0.5em]">
                    <span className="text-[0.46em] leading-snug">
                        {note.text}
                        <Caret show={note.typing} />
                    </span>
                    <span className="flex shrink-0 items-center gap-[0.25em] rounded-full bg-surface px-[0.5em] py-[0.15em] ring-1 ring-hairline">
                        <EnaClover size={0.7} />
                        <span className="text-[0.36em] font-medium">{tr.correctWithEna}</span>
                    </span>
                </span>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* clockin · a tap, and the shift runs                                                            */
/* ---------------------------------------------------------------------------------------------- */

const SHIFT = { press: 900, start: 1150, pause: 2600, resume: 3300 };
/** The shift runs faster than life: a second of the scene is twelve minutes of work. */
const SPEED = 720;
const CLOCKIN_END = 4200;

function ClockinScene({ t: clockT, labels }: Props) {
    const { tr } = labels;
    // The finished frame is the scene's last moment: the timer shows where it stopped.
    const t = Math.min(clockT, CLOCKIN_END);
    const running = on(t, SHIFT.start);
    const paused = between(t, SHIFT.pause, SHIFT.resume);
    const worked = running ? (Math.max(0, Math.min(t, SHIFT.pause) - SHIFT.start) + Math.max(0, t - SHIFT.resume)) * SPEED : 0;
    const clock = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
    };
    const ring = clamp01(worked / (8 * 3600000));

    return (
        <>
            <Lights />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={0}>
                    <div className="flex h-full flex-col items-center gap-[0.8em] px-[0.8em] pt-[0.5em]">
                        <span className="flex flex-col items-center gap-[0.25em]">
                            <span className="text-[0.62em] font-semibold">{tr.greeting}</span>
                            <span className="text-[0.4em] text-ink-3">{tr.entry} | 08:02</span>
                        </span>
                        {/* The shift: a ring that fills toward the day's eight hours. */}
                        <span className="relative mt-[0.4em] grid size-[8em] place-items-center">
                            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
                                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--ds-fill-2)" strokeWidth="6" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    fill="none"
                                    className={cn("transition-[stroke] duration-500", paused ? "stroke-amber-400" : "stroke-green-500")}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    pathLength={100}
                                    strokeDasharray="100"
                                    strokeDashoffset={100 - Math.max(0.5, ring * 100)}
                                    opacity={running ? 1 : 0}
                                />
                            </svg>
                            {/* Two layers on the ring's centre: the button, then the running shift. */}
                            <span className={cn("absolute inset-0 grid place-items-center transition-[opacity,scale,filter] duration-500 ease-spring", running ? "scale-90 opacity-0 blur-[3px]" : "opacity-100")}>
                                <span
                                    className={cn(
                                        "grid size-[6em] place-items-center rounded-full bg-ink text-canvas elev-3 transition-[scale] duration-200",
                                        between(t, SHIFT.press, SHIFT.start) && "scale-95",
                                    )}
                                >
                                    <span className="max-w-[80%] text-center text-[0.5em] font-semibold leading-tight">{tr.clockIn}</span>
                                </span>
                            </span>
                            <span className={cn("absolute inset-0 flex flex-col items-center justify-center gap-[0.35em] transition-[opacity,scale,filter] duration-500 ease-spring", running ? "opacity-100" : "scale-110 opacity-0 blur-[3px]")}>
                                <Morph center show={paused} from={<Pill tone="green">{tr.onShift}</Pill>} to={<Pill tone="yellow">{tr.onBreak}</Pill>} />
                                <span className="text-center text-[1.05em] font-semibold tabular-nums leading-none tracking-[-0.02em]">{clock(worked)}</span>
                            </span>
                        </span>
                        <span className="grid w-full grid-cols-2 gap-[0.5em]">
                            <span className="flex flex-col gap-[0.25em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]">
                                <Caps tone="text-ink-3">{tr.entry}</Caps>
                                <span className="text-[0.5em] font-semibold tabular-nums">{running ? "08:02" : "—"}</span>
                            </span>
                            <span className="relative flex flex-col gap-[0.25em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]">
                                <Fresh t={t} at={SHIFT.pause} className="rounded-[0.6em] bg-amber-400/20" />
                                <Caps tone="text-ink-3">{tr.breaks}</Caps>
                                <span className="flex items-center gap-[0.3em]">
                                    <Coffee className="size-[0.55em] text-ink-2" />
                                    <span className="text-[0.5em] font-semibold tabular-nums">{on(t, SHIFT.pause) ? "00:12" : "00:00"}</span>
                                </span>
                            </span>
                        </span>
                        <span className="flex h-[1.8em] w-full items-center justify-center rounded-full ring-1 ring-hairline">
                            <span className="text-[0.48em] font-medium text-ink-2">{tr.clockOut}</span>
                        </span>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* today · the team's day                                                                         */
/* ---------------------------------------------------------------------------------------------- */

const DAY = { from: 8, rows: 7, h: 2.15, top: 2.6, gutter: 2.2 };
const dayY = (hour: number) => DAY.top + (hour - DAY.from) * DAY.h;
const TODAY = { now: 1100, added: 2300 };
const AGENDA = [
    { start: 8.5, end: 9.5, tone: "border-sky-500 bg-sky-100/80 dark:bg-sky-500/15", people: [210, 30, 150], at: 300 },
    { start: 10, end: 10.75, tone: "border-orange-500 bg-orange-100/80 dark:bg-orange-500/15", people: [330], at: 420 },
    { start: 13, end: 14, tone: "border-teal-500 bg-teal-100/80 dark:bg-teal-500/15", people: [90, 260], at: 540 },
    { start: 14.25, end: 15, tone: "border-violet-500 bg-violet-100/80 dark:bg-violet-500/15", people: [10, 200, 120, 300], at: 660 },
];

function TodayScene({ t, labels, locale }: Props) {
    const { tr } = labels;
    const date = capitalize(new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(2026, 5, 10)));
    const now = clamp01((t - TODAY.now) / 700);
    const event = (start: number, end: number, title: string, tone: string, people: number[], extra?: ReactNode) => (
        <span className={cn("flex h-full items-center gap-[0.6em] rounded-[0.5em] border-l-[0.2em] px-[0.6em] text-ink", tone)}>
            <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                <span className="truncate text-[0.48em] font-semibold">{title}</span>
                <span className="text-[0.38em] tabular-nums text-ink-2">
                    {formatHour(start)} – {formatHour(end)}
                </span>
            </span>
            {extra}
            <span className="flex">
                {people.map((hue, index) => (
                    <span key={hue} className={cn(index > 0 && "-ml-[0.35em]")}>
                        <Avatar initials="" hue={hue} size={1.15} className="ring-[0.1em] ring-canvas" />
                    </span>
                ))}
            </span>
        </span>
    );

    return (
        <>
            <Title aside={<span className="text-[0.46em] text-ink-2">{date}</span>}>{tr.todayAgenda}</Title>

            {Array.from({ length: DAY.rows }, (_, index) => DAY.from + index).map((hour) => (
                <At key={hour} x={0} y={dayY(hour)} w={W} className="flex items-start border-t border-hairline">
                    <span className="-translate-y-[0.55em] text-[0.36em] tabular-nums text-ink-3">{String(hour).padStart(2, "0")}:00</span>
                </At>
            ))}

            {AGENDA.map((item, index) => (
                <At key={index} x={DAY.gutter} y={dayY(item.start) + 0.08} w={W - DAY.gutter} h={(item.end - item.start) * DAY.h - 0.16}>
                    <Pop show={on(t, item.at)} from="up" className="h-full">
                        {event(item.start, item.end, tr.agendaEvents[index], item.tone, item.people)}
                    </Pop>
                </At>
            ))}

            {/* Added by the school's management, for everyone, as the day goes. */}
            <At x={DAY.gutter} y={dayY(11.5) + 0.08} w={W - DAY.gutter} h={1 * DAY.h - 0.16}>
                <Pop show={on(t, TODAY.added)} from="down" className="relative h-full">
                    <Fresh t={t} at={TODAY.added} className="rounded-[0.5em]" />
                    {event(
                        11.5,
                        12.5,
                        tr.newEvent,
                        "border-pink-500 bg-pink-100/80 dark:bg-pink-500/15",
                        [45, 330],
                        <Pill tone="violet" className="shrink-0">
                            {tr.addedBy}
                        </Pill>,
                    )}
                </Pop>
            </At>

            {/* Now. */}
            <At x={DAY.gutter - 0.25} y={dayY(11.15) - 0.25} w={0.5} h={0.5} className={cn("z-10 rounded-full bg-red-500 transition-opacity duration-300", now > 0 ? "opacity-100" : "opacity-0")} />
            <At x={DAY.gutter} y={dayY(11.15) - 0.04} w={(W - DAY.gutter) * now} h={0.08} className="z-10 bg-red-500" />
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* timesheet · the record, opened and exported                                                    */
/* ---------------------------------------------------------------------------------------------- */

const SHEET = [
    { date: new Date(2026, 6, 21), in: "08:07", out: "18:15", breaks: "00:45:00", worked: "09:22:33" },
    { date: new Date(2026, 6, 20), in: "08:53", out: "17:41", breaks: "00:49:00", worked: "07:58:14" },
    { date: new Date(2026, 6, 19), in: "07:55", out: "18:39", breaks: "00:49:00", worked: "09:54:20" },
    { date: new Date(2026, 6, 18), in: "07:59", out: "18:22", breaks: "00:57:00", worked: "09:26:06" },
    { date: new Date(2026, 6, 17), in: "07:53", out: "18:31", breaks: "01:14:00", worked: "09:24:34" },
];
const COLS = [1.3, 6.4, 9.6, 21.4, 25.8];
const TIMESHEET = { open: 1100, export: 3000, busy: 3200, done: 3700 };
const ROW = 2.05;
const BREAKS_H = 4.6;

function TimesheetScene({ t, labels, locale }: Props) {
    const { tr } = labels;
    const open = easeInOut(span(t, TIMESHEET.open, 600));

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, TIMESHEET.done + 200)} from="scale">
                            <Pill tone="green">{tr.inspectionReady}</Pill>
                        </Pop>
                        <span className="w-[6.4em]">
                            <ActionButton
                                t={t}
                                press={TIMESHEET.export}
                                busy={TIMESHEET.busy}
                                done={TIMESHEET.done}
                                label={
                                    <span className="flex items-center gap-[0.35em]">
                                        <Download className="size-[1.1em]" />
                                        {tr.export}
                                    </span>
                                }
                                doneLabel="PDF"
                            />
                        </span>
                    </>
                }
            >
                {tr.timesheet}
            </Title>

            <At x={0} y={2.6} w={W} h={0.8}>
                {tr.columns.map((column, index) => (
                    <span key={column} className="absolute top-0" style={{ left: `${COLS[index]}em` }}>
                        <Caps tone="text-ink-3">{column}</Caps>
                    </span>
                ))}
            </At>

            {SHEET.map((day, index) => {
                const first = index === 0;
                const top = 3.5 + index * ROW + (index > 0 ? BREAKS_H * open : 0);
                return (
                    <At key={index} x={0} y={top} w={W} h={ROW}>
                        <Pop show={on(t, 200 + index * 80)} from="up" className={cn("flex h-full items-center border-b border-hairline", first && open > 0 && "bg-fill/60")}>
                            <span className="absolute left-[0.2em] text-ink-3">{first ? <ChevronDown className="size-[0.6em]" style={{ rotate: `${(1 - open) * -90}deg` }} /> : <ChevronRight className="size-[0.6em]" />}</span>
                            {[shortDate(locale, day.date), day.in, day.out, day.breaks, day.worked].map((value, column) => (
                                <span key={column} className={cn("absolute text-[0.48em] tabular-nums", column === 4 && "font-semibold")} style={{ left: `${COLS[column] / 0.48}em` }}>
                                    {value}
                                </span>
                            ))}
                        </Pop>
                    </At>
                );
            })}

            {/* The first day, opened: its breaks. */}
            <At x={1.3} y={3.5 + ROW} w={W - 1.3} h={BREAKS_H * open} className="overflow-hidden">
                <span className="flex flex-col gap-[0.4em] pt-[0.5em]">
                    <Caps>{tr.breaks}</Caps>
                    {[
                        [Coffee, tr.coffee, "10:34", "10:46", "00:12:00"],
                        [Utensils, tr.lunch, "13:26", "13:59", "00:33:00"],
                    ].map(([Icon, reason, start, end, duration], index) => {
                        const Glyph = Icon as typeof Coffee;
                        return (
                            <span key={index} className="relative flex h-[1.35em] items-center">
                                <span className="flex items-center gap-[0.3em]">
                                    <Glyph className="size-[0.55em] text-ink-2" />
                                    <span className="text-[0.44em]">{reason as string}</span>
                                </span>
                                <span className="absolute text-[0.44em] tabular-nums text-ink-2" style={{ left: `${(COLS[1] - 1.3) / 0.44}em` }}>
                                    {start as string}
                                </span>
                                <span className="absolute text-[0.44em] tabular-nums text-ink-2" style={{ left: `${(COLS[2] - 1.3) / 0.44}em` }}>
                                    {end as string}
                                </span>
                                <span className="absolute right-[0.3em] text-[0.44em] tabular-nums">{duration as string}</span>
                            </span>
                        );
                    })}
                </span>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* week · the team's calendar                                                                     */
/* ---------------------------------------------------------------------------------------------- */

const STAFF = { at: 2600 };

function WeekScene({ t, labels, locale }: Props) {
    const { tr } = labels;
    const n = tr.teamEvents;
    const events: CalendarEvent[] = [
        { day: 0, start: 9, end: 10, title: n[0], tone: "teal", at: 300 },
        { day: 0, start: 11, end: 12, title: n[1], tone: "green", at: 400 },
        { day: 1, start: 13.5, end: 14.5, title: n[2], tone: "orange", at: 500 },
        { day: 3, start: 11, end: 13, title: n[3], tone: "orange", at: 600 },
        { day: 4, start: 9, end: 10, title: n[4], tone: "lime", at: 700 },
        { day: 4, start: 10, end: 11, title: n[5], tone: "green", at: 800 },
        { day: 4, start: 12, end: 14, title: n[6], tone: "green", at: 900 },
        { day: 3, start: 15, end: 16, title: n[7], tone: "teal", at: 1000 },
    ];
    const staff = { day: 2, start: 15, end: 16.5 };

    return (
        <WeekCalendar t={t} locale={locale} events={events} views={tr.views} todayLabel={tr.today}>
            <At x={calX(staff.day) + 0.12} y={calY(staff.start) + 0.08} w={CAL_COL - 0.24} h={(staff.end - staff.start) * 2.05 - 0.16}>
                <Pop show={on(t, STAFF.at)} from="scale" className="relative flex h-full flex-col gap-[0.3em] overflow-hidden rounded-[0.35em] border-l-[0.18em] border-violet-500 bg-violet-100 px-[0.4em] py-[0.3em] text-violet-950 elev-2 dark:bg-violet-500/20 dark:text-violet-100">
                    <Fresh t={t} at={STAFF.at} className="rounded-[0.35em]" />
                    <span className="text-[0.4em] font-semibold leading-tight">{tr.staffMeeting}</span>
                    <span className="text-[0.34em] tabular-nums opacity-70">
                        {formatHour(staff.start)} – {formatHour(staff.end)}
                    </span>
                    <span className="flex items-center">
                        {[10, 200, 120].map((hue, index) => (
                            <span key={hue} className={cn(index > 0 && "-ml-[0.3em]")}>
                                <Avatar initials="" hue={hue} size={0.9} className="ring-[0.08em] ring-violet-100 dark:ring-violet-900" />
                            </span>
                        ))}
                        <span className="ml-[0.3em] text-[0.32em] font-semibold tabular-nums">+18</span>
                    </span>
                </Pop>
            </At>
            <At x={calX(staff.day) - 2} y={calY(staff.start) - 1.5} w={CAL_COL + 4} className="flex justify-center">
                <Pop show={on(t, STAFF.at + 500)} from="down">
                    <SettlePill t={t} at={STAFF.at + 500} from="" to={tr.everyone} />
                </Pop>
            </At>
        </WeekCalendar>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    reports: { Scene: ReportsScene, duration: 4300 },
    clockin: { Scene: ClockinScene, duration: 4200, ...SOLO },
    today: { Scene: TodayScene, duration: 3600 },
    timesheet: { Scene: TimesheetScene, duration: 4300 },
    week: { Scene: WeekScene, duration: 3800 },
} satisfies Record<string, SceneSpec<TrackingLabels>>;

export type TrackingSceneKey = keyof typeof SCENES;

export default function TrackingScenes({ scene, labels, locale, max }: { scene: TrackingSceneKey; labels: TrackingLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}

