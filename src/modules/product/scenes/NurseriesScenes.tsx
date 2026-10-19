import { AlertCircle, Baby, Camera, Clock, LogIn, Moon, Sparkles, Utensils, type LucideIcon } from "lucide-react";

import { PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, easeInOut, easeOut, fill, on, span, typed } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Caret, Fresh, Lights, Photo, Pill, SOLO, SOLO_PHONE, SettlePill, TONES, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type NurseriesLabels = ProductSceneLabels & { nu: Translation["nurseriesScenes"] };

/*
 * The nurseries page's scenes:
 *
 *   agenda  (hero) the classroom's day, child by child: arrivals, meals, naps and photos filled in
 *           column by column, then the day's agenda sent to every family
 *   feed    a family's phone through the day: each moment arrives as it happens
 *   child   one child's day, recorded in detail: attendance, meals, nap, nappies, an incident
 *           and a note on how she is growing
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: NurseriesLabels;
    locale: string;
}

const W = CONTENT.w;
const CHILDREN = [
    { name: "Martina", hue: 330, arrival: "08:52", meal: 0, nap: [13.1, 14.7], photos: 3 },
    { name: "Leo", hue: 30, arrival: "09:05", meal: 1, nap: [13, 14.3], photos: 2 },
    { name: "Inés", hue: 140, arrival: "08:40", meal: 0, nap: [13.2, 15], photos: 4 },
    { name: "Hugo", hue: 210, arrival: "09:12", meal: 2, nap: [13.4, 14.4], photos: 1 },
    { name: "Valentina", hue: 280, arrival: "08:58", meal: 0, nap: [13, 14.6], photos: 3 },
    { name: "Daniel", hue: 60, arrival: "09:20", meal: 1, nap: [13.3, 14.8], photos: 2 },
];
const PORTION_TONES: (keyof typeof TONES)[] = ["green", "yellow", "orange"];

/* ---------------------------------------------------------------------------------------------- */
/* agenda · the classroom's day                                                                   */
/* ---------------------------------------------------------------------------------------------- */

const COLUMN_AT = [400, 1300, 2200, 3100];
const ROW_STEP = 110;
const SENT_AT = 4300;
const COLS = { child: 0.3, arrival: 7.4, meal: 11.6, nap: 16, photos: 25.4 };
const ICONS: LucideIcon[] = [LogIn, Utensils, Moon, Camera];

function AgendaScene({ t, labels, locale }: Props) {
    const { nu } = labels;
    const cell = (column: number, row: number) => on(t, COLUMN_AT[column] + row * ROW_STEP);
    const date = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date(2026, 5, 10));

    return (
        <>
            <Title
                aside={
                    <span className="w-[10em]">
                        <SettlePill t={t} at={SENT_AT} from={date} to={fill(nu.sentTo, { n: String(CHILDREN.length) })} fromTone="gray" />
                    </span>
                }
            >
                <span className="flex items-center gap-[0.5em]">
                    <span className="flex size-[1.5em] items-center justify-center rounded-[0.45em] bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                        <Baby className="size-[0.75em]" />
                    </span>
                    {nu.group}
                </span>
            </Title>

            <At x={0} y={2.55} w={W} h={0.8}>
                {[COLS.arrival, COLS.meal, COLS.nap, COLS.photos].map((left, index) => {
                    const Icon = ICONS[index];
                    return (
                        <span key={index} className="absolute flex items-center gap-[0.3em] text-ink-3" style={{ left: `${left}em` }}>
                            <Icon className="size-[0.5em]" />
                            <Caps tone="text-ink-3">{nu.columns[index]}</Caps>
                        </span>
                    );
                })}
            </At>

            {CHILDREN.map((child, row) => (
                <At key={child.name} x={0} y={3.6 + row * 2.75} w={W} h={2.75}>
                    <Pop show={on(t, 120 + row * 70)} from="up" className="relative flex h-full items-center border-b border-hairline">
                        <span className="absolute flex items-center gap-[0.45em]" style={{ left: `${COLS.child}em` }}>
                            <Photo hue={child.hue} className="size-[1.6em] rounded-full" />
                            <span className="text-[0.5em] font-medium">{child.name}</span>
                        </span>
                        <span className="absolute" style={{ left: `${COLS.arrival}em` }}>
                            <Pop show={cell(0, row)} from="scale">
                                <span className="text-[0.5em] font-medium tabular-nums">{child.arrival}</span>
                            </Pop>
                        </span>
                        <span className="absolute" style={{ left: `${COLS.meal}em` }}>
                            <Pop show={cell(1, row)} from="scale">
                                <Pill tone={PORTION_TONES[child.meal]}>{nu.portions[child.meal]}</Pill>
                            </Pop>
                        </span>
                        {/* The nap, as a bar on a 12:30–15:30 scale. */}
                        <span className="absolute flex h-[0.9em] items-center" style={{ left: `${COLS.nap}em`, width: "8.4em" }}>
                            <span className="absolute inset-x-0 h-[0.3em] rounded-full bg-fill-2" />
                            <span
                                className="absolute h-[0.55em] origin-left rounded-full bg-indigo-400/80"
                                style={{
                                    left: `${((child.nap[0] - 12.5) / 3) * 100}%`,
                                    width: `${((child.nap[1] - child.nap[0]) / 3) * 100}%`,
                                    transform: `scaleX(${easeOut(span(t, COLUMN_AT[2] + row * ROW_STEP, 600))})`,
                                }}
                            />
                        </span>
                        <span className="absolute flex items-center gap-[0.15em]" style={{ left: `${COLS.photos}em` }}>
                            {Array.from({ length: Math.min(3, child.photos) }, (_, index) => (
                                <span key={index} className={cn(index > 0 && "-ml-[0.45em]")}>
                                    <Pop show={on(t, COLUMN_AT[3] + row * ROW_STEP + index * 60)} from="scale">
                                        <Photo hue={(child.hue + index * 50) % 360} kind="scene" className="size-[1.2em] rounded-[0.3em] ring-[0.08em] ring-canvas" />
                                    </Pop>
                                </span>
                            ))}
                        </span>
                    </Pop>
                </At>
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* feed · a family's phone through the day                                                        */
/* ---------------------------------------------------------------------------------------------- */

const MOMENTS: { icon: LucideIcon; tone: string; time: string; at: number }[] = [
    { icon: LogIn, tone: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300", time: "08:52", at: 400 },
    { icon: Utensils, tone: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300", time: "11:45", at: 1300 },
    { icon: Moon, tone: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300", time: "13:05", at: 2200 },
    { icon: Camera, tone: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300", time: "15:20", at: 3100 },
];

function FeedScene({ t, labels }: Props) {
    const { nu } = labels;
    const arrived = MOMENTS.filter((moment) => on(t, moment.at));
    const latest = arrived[arrived.length - 1];

    return (
        <>
            <Lights orbs={[{ x: -2, y: 4, size: 14, color: "#f9a8d4" }, { x: 18, y: 2, size: 15, color: "#a3e635" }, { x: 8, y: 15, size: 13, color: "#22c55e" }]} />
            <At {...SOLO_PHONE}>
                <PhoneFrame
                    x={0}
                    y={0}
                    w={SOLO_PHONE.w}
                    h={SOLO_PHONE.h}
                    tab={0}
                    overlay={
                        <div className="relative">
                            {MOMENTS.map((moment, index) => (
                                <Pop key={moment.time} show={between(t, moment.at - 150, moment.at + 700)} from="down" className="absolute inset-x-0">
                                    <PhoneNotification title={nu.feedItems[index]} body={nu.feedDetails[index]} />
                                </Pop>
                            ))}
                        </div>
                    }
                >
                    <div className="flex h-full flex-col gap-[0.55em] px-[0.6em] pt-[0.3em]">
                        <span className="flex items-center gap-[0.45em]">
                            <Photo hue={330} className="size-[1.7em] rounded-full" />
                            <span className="flex flex-col gap-[0.15em]">
                                <span className="text-[0.52em] font-semibold">Martina</span>
                                <span className="text-[0.38em] text-ink-3">{nu.group}</span>
                            </span>
                        </span>
                        <Caps tone="text-ink-3">{nu.today}</Caps>
                        {/* The day, newest on top; the line down the left is the day itself. */}
                        <span className="relative block flex-1">
                            {MOMENTS.map((moment, index) => {
                                // Newest on top: each sits under the ones that came after it.
                                const top = arrived.filter((other) => other.at > moment.at).reduce((sum, other) => sum + (other === MOMENTS[3] ? 4.5 : 2.75), 0);
                                const Icon = moment.icon;
                                return (
                                    <span key={moment.time} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${top}em` }}>
                                        <Pop show={on(t, moment.at)} from="down" className="relative flex gap-[0.5em] rounded-[0.7em] bg-surface/80 p-[0.5em] ring-1 ring-hairline">
                                            {moment === latest && <Fresh t={t} at={moment.at} className="rounded-[0.7em]" />}
                                            <span className={cn("flex size-[1.4em] shrink-0 items-center justify-center rounded-[0.45em]", moment.tone)}>
                                                <Icon className="size-[0.65em]" />
                                            </span>
                                            <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                                <span className="flex items-baseline justify-between gap-[0.3em]">
                                                    <span className="truncate text-[0.46em] font-semibold">{nu.feedItems[index]}</span>
                                                    <span className="text-[0.36em] tabular-nums text-ink-3">{moment.time}</span>
                                                </span>
                                                <span className="truncate text-[0.4em] text-ink-2">{nu.feedDetails[index]}</span>
                                                {index === 3 && (
                                                    <span className="mt-[0.2em] flex gap-[0.2em]">
                                                        {[300, 20, 160].map((hue) => (
                                                            <Photo key={hue} hue={hue} kind="scene" className="h-[1.6em] flex-1 rounded-[0.3em]" />
                                                        ))}
                                                    </span>
                                                )}
                                            </span>
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
/* child · one child's day, in detail                                                             */
/* ---------------------------------------------------------------------------------------------- */

const NOTE_AT = 2600;

function ChildScene({ t, labels }: Props) {
    const { nu } = labels;
    const note = typed(nu.note, t, NOTE_AT, 28);
    const card = "flex h-full flex-col gap-[0.45em] rounded-[0.8em] p-[0.65em] ds-glass-inner [&>*]:shrink-0";

    return (
        <>
            <Title aside={<Pill tone="green">{nu.present}</Pill>}>
                <span className="flex items-center gap-[0.5em]">
                    <Photo hue={330} className="size-[1.6em] rounded-full" />
                    Martina
                    <span className="text-[0.5em] font-medium text-ink-3">{nu.age}</span>
                </span>
            </Title>

            {/* Attendance. */}
            <At x={0} y={2.6} w={9.6} h={6.2}>
                <Pop show={on(t, 150)} from="up" className={card}>
                    <Caps>{nu.sections[0]}</Caps>
                    <span className="flex items-center gap-[0.35em]">
                        <Clock className="size-[0.55em] text-ink-2" />
                        <span className="text-[0.62em] font-semibold tabular-nums">08:52</span>
                        <span className="text-[0.44em] text-ink-3">–</span>
                        <span className="text-[0.62em] font-semibold tabular-nums">16:30</span>
                    </span>
                    <span className="text-[0.4em] text-ink-3">{nu.pickedUpBy}</span>
                </Pop>
            </At>

            {/* Meals. */}
            <At x={10.1} y={2.6} w={10} h={6.2}>
                <Pop show={on(t, 300)} from="up" className={card}>
                    <Caps>{nu.sections[1]}</Caps>
                    {nu.meals.map((meal, index) => (
                        <Pop key={meal} show={on(t, 600 + index * 200)} className="flex items-center justify-between">
                            <span className="text-[0.44em] text-ink-2">{meal}</span>
                            <Pill tone={PORTION_TONES[[0, 0, 1][index]]}>{nu.portions[[0, 0, 1][index]]}</Pill>
                        </Pop>
                    ))}
                </Pop>
            </At>

            {/* Nap and nappies. */}
            <At x={20.6} y={2.6} w={W - 20.6} h={6.2}>
                <Pop show={on(t, 450)} from="up" className={card}>
                    <Caps>{nu.sections[2]}</Caps>
                    <span className="text-[0.62em] font-semibold tabular-nums">1 h 35 min</span>
                    <span className="relative h-[0.5em] overflow-hidden rounded-full bg-fill-2">
                        <span className="absolute inset-y-0 left-[15%] w-[55%] origin-left rounded-full bg-indigo-400" style={{ transform: `scaleX(${easeInOut(span(t, 900, 1100))})` }} />
                    </span>
                    <span className="flex justify-between text-[0.36em] tabular-nums text-ink-3">
                        <span>13:05</span>
                        <span>14:40</span>
                    </span>
                </Pop>
            </At>

            {/* An incident, and the family told. */}
            <At x={0} y={9.4} w={W} h={3.3}>
                <Pop show={on(t, 1800)} from="up" className="flex h-full items-center gap-[0.6em] rounded-[0.8em] p-[0.65em] ds-glass-inner">
                    <span className={cn("flex size-[1.6em] shrink-0 items-center justify-center rounded-[0.5em]", TONES.yellow)}>
                        <AlertCircle className="size-[0.8em]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-[0.25em]">
                        <Caps>{nu.sections[3]}</Caps>
                        <span className="truncate text-[0.48em]">{nu.incident}</span>
                    </span>
                    <SettlePill t={t} at={2200} from={nu.notifying} to={nu.familyNotified} fromTone="yellow" />
                </Pop>
            </At>

            {/* How she is growing. */}
            <At x={0} y={13.3} w={W} h={5.6}>
                <Pop show={on(t, NOTE_AT - 300)} from="up" className="flex h-full flex-col gap-[0.5em] rounded-[0.8em] p-[0.65em] ds-glass-inner">
                    <span className="flex items-center gap-[0.4em]">
                        <Sparkles className="size-[0.6em] text-violet-500" />
                        <Caps>{nu.sections[4]}</Caps>
                    </span>
                    <span className="text-[0.56em] leading-snug">
                        {note.text}
                        <Caret show={note.typing} />
                    </span>
                    <span className="mt-auto flex items-center gap-[0.4em]">
                        <Avatar initials="SG" hue={330} size={1.1} />
                        <span className="text-[0.4em] text-ink-3">Sara García | 15:40</span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    agenda: { Scene: AgendaScene, duration: 4800 },
    feed: { Scene: FeedScene, duration: 4300, ...SOLO },
    child: { Scene: ChildScene, duration: 4400 },
} satisfies Record<string, SceneSpec<NurseriesLabels>>;

export type NurseriesSceneKey = keyof typeof SCENES;

export default function NurseriesScenes({ scene, labels, locale, max }: { scene: NurseriesSceneKey; labels: NurseriesLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
