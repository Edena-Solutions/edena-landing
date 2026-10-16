import { ArrowLeft, Cake, CalendarDays, Clock, FileText, LayoutGrid, Plus, Sparkles, type LucideIcon } from "lucide-react";

import { At, Avatar, Line, Pop, easeOut, on, percent, shortDate, span, typed } from "@/components/wizard/scene-kit";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { DrawnCheck, Ripple, Title } from "./KeyFeaturesScenes";

/*
 * A student's record (from `screenshots/students/student_detail.png`), the hero's front pane, in
 * the key features' abstract style: the record settles in, the month's attendance fills day by day,
 * a note about her is written; then attendance is taken and today lands, present.
 *
 * Written in the content box's coordinates (30.2 × 20.6 em, `glass-stage.tsx`). A pure function
 * of `t`; `Infinity` is its finished frame.
 */

const LEFT = { x: 0, w: 19.6 };
const RIGHT = { x: 20.2, w: 10 };
/** The month so far: twenty school days, one missed; the last one is today. */
const DAYS = 20;
const ABSENT = 7;
const FILL_AT = 1300;
const PER_DAY = 55;
const COMMENT_AT = 2300;
const PRESS_AT = 3900;
const MARK_AT = PRESS_AT + 250;
export const STUDENT_DURATION = 5400;

const TOOLS: LucideIcon[] = [CalendarDays, Sparkles, LayoutGrid, FileText];
const SECTION = "block truncate text-[0.42em] font-semibold uppercase tracking-[0.12em] text-ink-2";

interface Props {
    t: number;
    ui: Translation["homeScenes"];
    locale: string;
}

function Card({ x, y, w, h, show }: { x: number; y: number; w: number; h: number; show: boolean }) {
    return (
        <At x={x} y={y} w={w} h={h}>
            <Pop show={show} from="blur" className="h-full rounded-[0.9em] ds-glass-inner" />
        </At>
    );
}

/** Her photo, drawn: a warm ground and a silhouette, as the record's portrait reads from afar. */
function Portrait() {
    return (
        <span className="relative block size-full overflow-hidden rounded-[0.7em]" style={{ background: "linear-gradient(150deg, #fed7aa, #fdba74 45%, #f9a8d4)" }}>
            <svg viewBox="0 0 40 40" className="absolute inset-0 size-full">
                <circle cx="20" cy="16.5" r="7" fill="white" fillOpacity="0.8" />
                <path d="M5.5 40c1.6-8.2 7.2-12.6 14.5-12.6S32.9 31.8 34.5 40z" fill="white" fillOpacity="0.8" />
            </svg>
        </span>
    );
}

export function StudentScene({ t, ui, locale }: Props) {
    const pressed = t >= PRESS_AT && t < PRESS_AT + 220;
    const marked = on(t, MARK_AT);
    const comment = typed(ui.studentComment, t, COMMENT_AT, 32);
    const rate = 94.7 * easeOut(span(t, FILL_AT, 1500)) + 0.3 * easeOut(span(t, MARK_AT, 500));

    return (
        <>
            <Title
                aside={
                    <>
                        {TOOLS.map((Icon, index) => (
                            <Pop key={index} show={on(t, 160 + index * 60)} from="scale">
                                <span className="flex size-[1.55em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                                    <Icon className="size-[0.7em] text-ink-2" />
                                </span>
                            </Pop>
                        ))}
                        <Pop show={on(t, 420)} from="scale">
                            <span
                                className={cn(
                                    "flex h-[1.7em] items-center rounded-full bg-ink px-[0.9em] text-canvas transition-[scale,box-shadow] duration-300",
                                    pressed && "scale-95 shadow-[0_0_0_0.3em_rgb(34_197_94/0.3)]",
                                )}
                            >
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{ui.takeAttendance}</span>
                            </span>
                        </Pop>
                    </>
                }
            >
                <span className="flex items-center gap-[0.5em]">
                    <span className="flex size-[1.5em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                        <ArrowLeft className="size-[0.68em] text-ink-2" />
                    </span>
                    Lucía García López
                </span>
            </Title>

            <At x={LEFT.x} y={2.45} w={LEFT.w} h={1.55}>
                <Pop show={on(t, 120)} from="blur" className="flex h-full w-fit max-w-full items-center rounded-full bg-fill p-[0.15em]">
                    {ui.studentTabs.map((tab, index) => (
                        <span
                            key={tab}
                            className={cn(
                                "flex h-full min-w-0 items-center rounded-full px-[0.75em]",
                                index === 0 ? "bg-surface text-ink elev-1" : "text-ink-3",
                            )}
                        >
                            <span className="truncate text-[0.44em] font-medium">{tab}</span>
                        </span>
                    ))}
                </Pop>
            </At>

            {/* Her record: portrait, status, name, birthday. */}
            <Card x={LEFT.x} y={4.6} w={LEFT.w} h={5.6} show={on(t, 200)} />
            <At x={0.9} y={5.5} w={3.8} h={3.8}>
                <Pop show={on(t, 420)} from="scale" className="size-full">
                    <Portrait />
                </Pop>
            </At>
            <At x={5.5} y={5.5} w={13.4} h={1.15} className="flex items-center gap-[0.35em]">
                <Pop show={on(t, 560)} from="scale" className="h-full">
                    <span className="flex h-full items-center rounded-full bg-green-100 px-[0.6em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                        <span className="text-[0.48em] font-semibold">{ui.active}</span>
                    </span>
                </Pop>
                <Pop show={on(t, MARK_AT + 150)} from="scale" className="h-full">
                    <span className="flex h-full items-center gap-[0.25em] rounded-full bg-sky-100 pl-[0.25em] pr-[0.6em] text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                        <span className="size-[0.75em]">
                            <DrawnCheck p={span(t, MARK_AT + 250, 450)} className="size-full" />
                        </span>
                        <span className="text-[0.48em] font-semibold">{ui.presentOne}</span>
                    </span>
                </Pop>
            </At>
            <At x={5.5} y={6.95} w={13.4}>
                <Pop show={on(t, 640)} className="flex flex-col gap-[0.45em]">
                    <span className="truncate text-[0.62em] font-bold uppercase tracking-[0.06em]">Lucía García López</span>
                    <span className="flex items-center gap-[0.35em] text-ink-2">
                        <Cake className="size-[0.62em]" />
                        <span className="text-[0.5em] tabular-nums">{shortDate(locale, new Date(2018, 5, 2))}</span>
                    </span>
                </Pop>
            </At>

            {/* Where she is: level, year, classroom. */}
            <Card x={LEFT.x} y={10.8} w={LEFT.w} h={4.2} show={on(t, 300)} />
            <At x={0.9} y={11.45} w={17.8}>
                <span className={SECTION}>{ui.academicInfo}</span>
            </At>
            {ui.academicFields.map((field, index) => (
                <At key={field} x={0.9 + index * 6.1} y={12.75} w={5.6}>
                    <Pop show={on(t, 900 + index * 110)} className="flex flex-col gap-[0.4em]">
                        <span className="truncate text-[0.38em] font-medium uppercase tracking-[0.1em] text-ink-3">{field}</span>
                        <span className="truncate text-[0.62em] font-medium">{[ui.academicLevel, "I-2", "I-2 B"][index]}</span>
                    </Pop>
                </At>
            ))}

            {/* A note about her, written as the scene plays. */}
            <Card x={LEFT.x} y={15.6} w={LEFT.w} h={5} show={on(t, 400)} />
            <At x={0.9} y={16.25} w={17.8} className="flex items-center justify-between">
                <span className={SECTION}>{ui.comments}</span>
                <span className="flex size-[1.2em] items-center justify-center rounded-[0.35em] bg-fill">
                    <Plus className="size-[0.6em] text-ink-2" />
                </span>
            </At>
            <At x={0.9} y={17.65} w={17.8} h={2.3}>
                <Pop show={on(t, COMMENT_AT - 250)} className="flex h-full flex-col justify-center gap-[0.5em] rounded-[0.6em] bg-fill px-[0.8em]">
                    <span className="text-[0.56em] leading-none">
                        {comment.text}
                        {comment.typing && <span className="ml-[0.1em] inline-block h-[1em] w-[0.1em] translate-y-[0.15em] bg-brand" />}
                    </span>
                    <span className="flex items-center gap-[0.35em] text-ink-3">
                        <Clock className="size-[0.5em]" />
                        <Line w={4.2} className="h-[0.24em]" />
                    </span>
                </Pop>
            </At>

            {/* Her tutor. */}
            <Card x={RIGHT.x} y={4.6} w={RIGHT.w} h={4.4} show={on(t, 260)} />
            <At x={21.1} y={5.25} w={8.2}>
                <span className={SECTION}>{ui.tutor}</span>
            </At>
            <At x={21.1} y={6.5} w={8.2}>
                <Pop show={on(t, 760)} className="flex items-center gap-[0.5em]">
                    <Avatar initials="MG" hue={330} size={1.9} className="text-[0.62em]" />
                    <span className="flex min-w-0 flex-col gap-[0.3em]">
                        <span className="truncate text-[0.5em] font-semibold">María García López</span>
                        <span className="truncate text-[0.46em] text-ink-2">{ui.mother}</span>
                    </span>
                </Pop>
            </At>

            {/* Her month, day by day; today lands when attendance is taken. */}
            <Card x={RIGHT.x} y={9.6} w={RIGHT.w} h={11} show={on(t, 360)} />
            <At x={21.1} y={10.25} w={8.2}>
                <span className={SECTION}>{ui.studentTabs[1]}</span>
            </At>
            <At x={21.1} y={11.3} w={8.2}>
                <span className="block text-[1.25em] font-light leading-none tabular-nums tracking-[-0.03em]">{percent(locale, rate, 1)}</span>
            </At>
            {Array.from({ length: DAYS }, (_, index) => {
                const today = index === DAYS - 1;
                const at = today ? MARK_AT : FILL_AT + index * PER_DAY;
                return (
                    <At key={index} x={21.35 + (index % 5) * 1.62} y={13.9 + Math.floor(index / 5) * 1.5} w={0.95} h={0.95}>
                        <span className="relative block size-full rounded-full bg-fill-2">
                            <Pop
                                show={on(t, at)}
                                from="scale"
                                className={cn(
                                    "absolute inset-0 rounded-full",
                                    index === ABSENT ? "bg-orange-400/80" : "bg-green-500/60",
                                    today && "bg-green-500 shadow-[0_0_0_0.2em_rgb(34_197_94/0.18)]",
                                )}
                            />
                            {today && <Ripple p={span(t, MARK_AT, 900)} className="text-green-500" />}
                        </span>
                    </At>
                );
            })}
        </>
    );
}
