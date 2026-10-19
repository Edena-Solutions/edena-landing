import { ArrowLeft, Bot, Crown, Drama, Drum, Footprints, Languages, Mic2, Palette, Plus, Sparkles, Volleyball, type LucideIcon } from "lucide-react";

import { PhoneFrame } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Line, Pop, easeInOut, fill, money, on, span } from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    CAL_COL,
    Caps,
    DUO,
    DUO_PANE_RIGHT,
    DUO_PHONE_LEFT,
    Fresh,
    Lights,
    Morph,
    Pane,
    Pill,
    SOLO,
    SOLO_PHONE,
    SettlePill,
    TONES,
    WeekCalendar,
    between,
    calX,
    calY,
    formatHour,
    type CalendarEvent,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

export type ExtracurricularLabels = ProductSceneLabels & { x: Translation["extracurricularScenes"] };

/*
 * The extracurriculars page's scenes, drawn from `screenshots/extracurricular/*` and
 * `app/app_extracurricular.png`:
 *
 *   catalog   (hero) the school's activities: places filling as families sign up; one full
 *   browse    the activities on the families' app, places counting down live; one asked for
 *   detail    an activity's record: its times set, its teacher assigned, its price and ages
 *   enrol     a family asks for a place from the app; behind it, the school sees it accepted, the
 *             activity full and the charge on the month's invoice
 *   agenda    the week's activities on the calendar; a new one placed where nothing clashes
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ExtracurricularLabels;
    locale: string;
}

const W = CONTENT.w;

/**
 * Each activity's own picture: its icon, white, on its colour — indexed as `activityNames`
 * (chess, athletics, drums, choir, dance, football, robotics, English, drama), then crafts.
 */
const ART: { icon: LucideIcon; from: string; to: string }[] = [
    { icon: Crown, from: "#818cf8", to: "#4f46e5" },
    { icon: Footprints, from: "#fdba74", to: "#f97316" },
    { icon: Drum, from: "#f9a8d4", to: "#ec4899" },
    { icon: Mic2, from: "#5eead4", to: "#0d9488" },
    { icon: Sparkles, from: "#d8b4fe", to: "#a855f7" },
    { icon: Volleyball, from: "#86efac", to: "#16a34a" },
    { icon: Bot, from: "#7dd3fc", to: "#0284c7" },
    { icon: Languages, from: "#93c5fd", to: "#2563eb" },
    { icon: Drama, from: "#fda4af", to: "#e11d48" },
];
const CRAFTS = 9;
const CRAFTS_ART = { icon: Palette, from: "#fde68a", to: "#f59e0b" };

function ActivityArt({ activity, className, icon = 0.5 }: { activity: number; className?: string; icon?: number }) {
    const art = activity === CRAFTS ? CRAFTS_ART : ART[activity];
    const Icon = art.icon;
    return (
        <span
            className={cn("relative flex shrink-0 items-center justify-center overflow-hidden text-white", className)}
            style={{ background: `linear-gradient(145deg, ${art.from}, ${art.to})` }}
        >
            <span className="absolute -right-[18%] -top-[18%] aspect-square w-[60%] rounded-full bg-white/15" />
            <Icon className="relative drop-shadow-[0_0.08em_0.2em_rgb(0_0_0/0.18)]" style={{ width: `${icon * 100}%`, height: `${icon * 100}%` }} strokeWidth={1.8} />
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* catalog · places filling                                                                       */
/* ---------------------------------------------------------------------------------------------- */

const ACTIVITIES: { code: string; bar: string; price: number; cap: number; from: number; to: number; name: number }[] = [
    { code: "EXT02", bar: "bg-violet-500", price: 30, cap: 16, from: 9, to: 14, name: 0 },
    { code: "DEP08", bar: "bg-green-500", price: 35, cap: 20, from: 12, to: 18, name: 1 },
    { code: "MUS05", bar: "bg-violet-500", price: 55, cap: 8, from: 5, to: 7, name: 2 },
    { code: "MUS07", bar: "bg-violet-500", price: 25, cap: 30, from: 18, to: 24, name: 3 },
    { code: "EXT04", bar: "bg-sky-500", price: 40, cap: 15, from: 11, to: 15, name: 4 },
    { code: "DEP14", bar: "bg-green-500", price: 38, cap: 22, from: 16, to: 21, name: 5 },
];
const COL = { name: 0.3, code: 9.4, freq: 13.6, price: 17.6, places: 21.4 };
const FILL = { at: 900, duration: 2800 };

function CatalogScene({ t, labels, locale }: Props) {
    const { x } = labels;
    const fill = easeInOut(span(t, FILL.at, FILL.duration));
    const signed = ACTIVITIES.reduce((sum, row) => sum + Math.round((row.to - row.from) * fill), 0);

    return (
        <>
            <Title
                aside={
                    <>
                        <Pop show={on(t, 200)} from="scale">
                            <span className="flex items-center gap-[0.35em] rounded-full bg-fill-2 px-[0.65em] py-[0.25em]">
                                <span className="text-[0.46em] font-medium text-ink-2">{x.requests}</span>
                                <span key={signed} className="flex h-[0.9em] min-w-[0.9em] animate-[ds-pop_300ms_var(--ease-spring-bounce)] items-center justify-center rounded-full bg-violet-500 px-[0.25em] text-white">
                                    <span className="text-[0.4em] font-bold tabular-nums">{signed}</span>
                                </span>
                            </span>
                        </Pop>
                        <Pop show={on(t, 280)} from="scale">
                            <span className="flex h-[1.7em] items-center gap-[0.35em] rounded-full bg-ink px-[0.8em] text-canvas">
                                <Plus className="size-[0.62em]" />
                                <span className="whitespace-nowrap text-[0.5em] font-semibold">{x.newActivity}</span>
                            </span>
                        </Pop>
                    </>
                }
            >
                {x.activities}
            </Title>

            <At x={0} y={2.65} w={W} h={0.8}>
                {[COL.name + 2.1, COL.code, COL.freq, COL.price, COL.places].map((left, index) => (
                    <span key={index} className="absolute top-0" style={{ left: `${left}em` }}>
                        <Caps tone="text-ink-3">{x.columns[index]}</Caps>
                    </span>
                ))}
            </At>

            {ACTIVITIES.map((row, index) => {
                const enrolled = row.from + Math.round((row.to - row.from) * fill);
                const full = enrolled >= row.cap;
                return (
                    <At key={row.code} x={0} y={3.6 + index * 2.4} w={W} h={2.4}>
                        <Pop show={on(t, 250 + index * 80)} from="up" className="relative flex h-full items-center border-b border-hairline">
                            <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-[0.55em]" style={{ left: `${COL.name}em` }}>
                                <ActivityArt activity={row.name} className="size-[1.5em] rounded-[0.42em]" />
                                <span className="text-[0.52em] font-medium">{x.activityNames[row.name]}</span>
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-[0.35em]" style={{ left: `${COL.code}em` }}>
                                <span className={cn("h-[0.85em] w-[0.14em] rounded-full", row.bar)} />
                                <span className="font-mono text-[0.46em] text-ink-2">{row.code}</span>
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2" style={{ left: `${COL.freq}em` }}>
                                <Pill tone="green">{x.monthly}</Pill>
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2" style={{ left: `${COL.price}em` }}>
                                <span className="text-[0.5em] tabular-nums">{money(locale, row.price, 2)}</span>
                            </span>
                            <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-[0.5em]" style={{ left: `${COL.places}em`, right: "0.3em" }}>
                                <span className="h-[0.32em] flex-1 overflow-hidden rounded-full bg-fill-2">
                                    <span
                                        className={cn("block h-full origin-left rounded-full transition-colors duration-500", full ? "bg-green-500" : "bg-ink/70")}
                                        style={{ transform: `scaleX(${enrolled / row.cap})` }}
                                    />
                                </span>
                                <Morph
                                    show={full}
                                    className="w-[3.4em]"
                                    end
                                    from={
                                        <span className="text-[0.46em] tabular-nums text-ink-2">
                                            {enrolled}/{row.cap}
                                        </span>
                                    }
                                    to={<Pill tone="green">{x.full}</Pill>}
                                />
                            </span>
                        </Pop>
                    </At>
                );
            })}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* detail · an activity, set up                                                                   */
/* ---------------------------------------------------------------------------------------------- */

const SLOTS = [0, 2, 4];
const DETAIL = { slots: 700, teacher: 2100 };

function DetailScene({ t, labels, locale }: Props) {
    const { x } = labels;
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "long" });
    const assigned = on(t, DETAIL.teacher);
    const card = "flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.8em] ds-glass-inner";

    return (
        <>
            <At x={0} y={0} w={W} h={1.9} className="flex items-center gap-[0.55em]">
                <span className="flex size-[1.5em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                    <ArrowLeft className="size-[0.68em] text-ink-2" />
                </span>
                <ActivityArt activity={1} className="size-[1.6em] rounded-[0.45em]" />
                <span className="text-[0.82em] font-semibold tracking-[-0.01em]">{x.activityNames[1]}</span>
            </At>
            <At x={0} y={2.45} w={W} h={1.5}>
                <Pop show={on(t, 100)} from="up" className="flex h-full w-fit items-center rounded-full bg-fill p-[0.15em]">
                    {x.tabs.map((tab, index) => (
                        <span key={tab} className={cn("flex h-full items-center gap-[0.35em] rounded-full px-[0.8em]", index === 0 ? "bg-surface text-ink elev-1" : "text-ink-3")}>
                            <span className="text-[0.44em] font-medium">{tab}</span>
                            {index === 1 && <span className="rounded-full bg-fill-2 px-[0.4em] text-[0.36em] font-semibold tabular-nums text-ink-2">18</span>}
                        </span>
                    ))}
                </Pop>
            </At>

            {/* Basic information. */}
            <At x={0} y={4.5} w={19} h={5.3}>
                <Pop show={on(t, 200)} from="up" className={card}>
                    <Caps>{x.basicInfo}</Caps>
                    <span className="flex gap-[0.7em]">
                        <ActivityArt activity={1} icon={0.42} className="h-[3em] w-[4.2em] rounded-[0.5em]" />
                        <span className="flex min-w-0 flex-col gap-[0.4em] pt-[0.1em]">
                            <span className="text-[0.56em] font-semibold">{x.activityNames[1]}</span>
                            <Line w={11} className="h-[0.26em]" />
                            <Line w={8.6} className="h-[0.26em]" />
                        </span>
                    </span>
                </Pop>
            </At>

            {/* When it runs: its times, set one by one. */}
            <At x={0} y={10.3} w={19} h={8.6}>
                <Pop show={on(t, 300)} from="up" className={card}>
                    <Caps>{x.availability}</Caps>
                    {SLOTS.map((day, index) => (
                        <Pop key={day} show={on(t, DETAIL.slots + index * 350)} from="up" className="flex items-center justify-between rounded-[0.5em] bg-fill/70 px-[0.6em] py-[0.45em]">
                            <span className="text-[0.46em] font-medium capitalize">{weekday.format(new Date(2026, 5, 8 + day))}</span>
                            <span className="text-[0.46em] tabular-nums text-ink-2">16:30 – 18:00</span>
                        </Pop>
                    ))}
                </Pop>
            </At>

            {/* Its teacher, assigned. */}
            <At x={19.6} y={4.5} w={W - 19.6} h={4}>
                <Pop show={on(t, 250)} from="up" className={card}>
                    <Caps>{x.teacher}</Caps>
                    <Morph
                        show={assigned}
                        from={<span className="text-[0.44em] text-ink-3">{x.noTeacher}</span>}
                        to={
                            <span className="relative flex items-center gap-[0.45em] rounded-[0.5em]">
                                <Fresh t={t} at={DETAIL.teacher} className="-inset-[0.25em]" />
                                <Avatar initials="MR" hue={160} size={1.5} />
                                <span className="text-[0.5em] font-semibold">Marta Ruiz</span>
                            </span>
                        }
                    />
                </Pop>
            </At>

            {/* Concept, price, frequency, ages. */}
            <At x={19.6} y={9} w={W - 19.6} h={7.4}>
                <Pop show={on(t, 350)} from="up" className={card}>
                    <Caps>{x.conceptAge}</Caps>
                    <span className="grid grid-cols-2 gap-x-[0.6em] gap-y-[0.75em]">
                        {[
                            [x.concept, <span key="c" className="flex items-center gap-[0.3em]"><span className="h-[0.8em] w-[0.14em] rounded-full bg-green-500" /><span className="font-mono text-[0.46em]">DEP08</span></span>],
                            [x.price, <span key="p" className="text-[0.5em] font-semibold tabular-nums">{money(locale, 35, 2)}</span>],
                            [x.frequency, <Pill key="f" tone="green" className="w-fit">{x.monthly}</Pill>],
                            [x.ageRange, <span key="a" className="text-[0.5em] tabular-nums">6 – 16 {x.years}</span>],
                        ].map(([label, value], index) => (
                            <Pop key={index} show={on(t, 500 + index * 120)} className="flex min-w-0 flex-col gap-[0.3em]">
                                <Caps tone="text-ink-3">{label}</Caps>
                                {value}
                            </Pop>
                        ))}
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* enrol · from the app, into the school's lists                                                  */
/* ---------------------------------------------------------------------------------------------- */

const ENROL = { press: 900, busy: 1100, done: 1700, landed: 1950, accepted: 2700, full: 2900, invoice: 3400 };
const CHILDREN = [
    { name: "Lucía García", initials: "LG", hue: 25 },
    { name: "Mateo Ruiz", initials: "MR", hue: 200 },
    { name: "Sofía López", initials: "SL", hue: 300 },
    { name: "Leo Serrano", initials: "LS", hue: 140 },
];

function EnrolScene({ t, labels, locale }: Props) {
    const { x, ui } = labels;
    const landed = on(t, ENROL.landed);
    const rows = landed ? [{ name: "Hugo Fernández", initials: "HF", hue: 45 }, ...CHILDREN] : CHILDREN;
    const enrolled = on(t, ENROL.full) ? 12 : 11;

    return (
        <>
            <Lights />

            {/* The school: the activity's requests, its places, its charge. */}
            <Pane box={DUO_PANE_RIGHT} clear="left">
                <span className="flex items-center gap-[0.5em]">
                    <ActivityArt activity={CRAFTS} className="size-[1.7em] rounded-[0.45em]" />
                    <span className="flex min-w-0 flex-col gap-[0.25em]">
                        <span className="truncate text-[0.56em] font-semibold">{x.crafts}</span>
                        <span className="text-[0.38em] text-ink-3">{x.requests}</span>
                    </span>
                </span>
                <span className="flex items-center gap-[0.5em]">
                    <span className="h-[0.32em] flex-1 overflow-hidden rounded-full bg-fill-2">
                        <span className={cn("block h-full origin-left rounded-full transition-[transform,background-color] duration-700 ease-spring", enrolled === 12 ? "bg-green-500" : "bg-ink/70")} style={{ transform: `scaleX(${enrolled / 12})` }} />
                    </span>
                    <Morph show={enrolled === 12} end from={<span className="text-[0.44em] tabular-nums text-ink-2">11/12</span>} to={<Pill tone="green">{x.full}</Pill>} />
                </span>
                <span className="relative block" style={{ height: `${5 * 2.05}em` }}>
                    {rows.map((child, index) => {
                        const isNew = child.name === "Hugo Fernández";
                        return (
                            <span key={child.name} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2.05}em` }}>
                                <Pop show={isNew ? landed : on(t, 200 + index * 80)} from={isNew ? "down" : "up"} className="relative flex h-[2.05em] items-center gap-[0.45em] border-b border-hairline px-[0.2em]">
                                    {isNew && <Fresh t={t} at={ENROL.landed} />}
                                    <Avatar initials={child.initials} hue={child.hue} size={1.2} />
                                    <span className="flex-1 truncate text-[0.46em] font-medium">{child.name}</span>
                                    {isNew ? <SettlePill t={t} at={ENROL.accepted} from={ui.pending} to={x.accepted} /> : <Pill tone="green">{x.accepted}</Pill>}
                                </Pop>
                            </span>
                        );
                    })}
                </span>
                <Pop show={on(t, ENROL.invoice)} from="up" className="relative flex items-center gap-[0.45em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]">
                    <Fresh t={t} at={ENROL.invoice} className="rounded-[0.6em]" />
                    <span className={cn("size-[0.45em] rounded-full", TONES.green.split(" ")[0])} />
                    <span className="truncate text-[0.42em] text-ink-2">{x.addedToInvoice}</span>
                    <span className="ml-auto text-[0.44em] font-semibold tabular-nums">{money(locale, 4, 2)}</span>
                </Pop>
            </Pane>

            {/* The family: the activity on the app, a place asked for. */}
            <At {...DUO_PHONE_LEFT}>
                <Pop show={on(t, 80)} from="up" className="size-full">
                    <PhoneFrame x={0} y={0} w={DUO_PHONE_LEFT.w} h={DUO_PHONE_LEFT.h} tab={0} cart>
                        <div className="flex h-full flex-col">
                            <ActivityArt activity={CRAFTS} icon={0.3} className="h-[8.4em] w-full" />
                            <div className="flex flex-col gap-[0.5em] px-[0.75em] pt-[0.7em]">
                                <span className="text-[0.5em] font-bold uppercase tracking-[0.08em]">{x.crafts}</span>
                                <span className="text-[0.8em] font-semibold tabular-nums tracking-[-0.02em]">{money(locale, 4, 2)}</span>
                                <span className="text-[0.4em] text-ink-3">{x.single}</span>
                                <span className="text-[0.46em] text-ink-2">{x.craftsDesc}</span>
                                <span className="text-[0.4em] tabular-nums text-ink-3">3 – 4 {x.years}</span>
                                <span className="mt-[0.4em]">
                                    <ActionButton t={t} press={ENROL.press} busy={ENROL.busy} done={ENROL.done} label={x.requestActivity} doneLabel={x.requested} />
                                </span>
                            </div>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* browse · places, live, on the app                                                              */
/* ---------------------------------------------------------------------------------------------- */

const BROWSE = [
    { name: 6, days: [0, 2], price: 45, left: [4, 3, 3, 2] },
    { name: 4, days: [3], price: 40, left: [2, 1, 0, 0] },
    { name: 0, days: [1], price: 30, left: [5, 5, 4, 4] },
    { name: 5, days: [0, 2], price: 38, left: [3, 3, 2, 2] },
];
/** Moments when other families take places: the counts step down at each. */
const TICKS = [900, 1700, 2500];
const SIGN = { press: 3000, busy: 3200, done: 3700 };

function BrowseScene({ t, labels, locale }: Props) {
    const { x } = labels;
    const step = TICKS.filter((at) => on(t, at)).length;
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const dayName = (day: number) => weekday.format(new Date(2026, 5, 8 + day)).replace(".", "");

    return (
        <>
            <Lights />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={0} cart>
                    <div className="flex h-full flex-col gap-[0.55em] px-[0.6em] pt-[0.3em]">
                        <span className="text-[0.46em] font-bold uppercase tracking-[0.1em]">{x.activities}</span>
                        {BROWSE.map((activity, index) => {
                            const signedUp = index === 0 && on(t, SIGN.done);
                            const left = activity.left[step] - (signedUp ? 1 : 0);
                            const full = left <= 0;
                            return (
                                <Pop key={activity.name} show={on(t, 150 + index * 100)} from="up" className="flex flex-col gap-[0.5em] rounded-[0.8em] bg-surface/80 p-[0.5em] ring-1 ring-hairline">
                                    <span className="flex items-center gap-[0.55em]">
                                        <ActivityArt activity={activity.name} className="size-[2.6em] rounded-[0.6em]" />
                                        <span className="flex min-w-0 flex-1 flex-col gap-[0.25em]">
                                            <span className="truncate text-[0.5em] font-semibold">{x.activityNames[activity.name]}</span>
                                            <span className="truncate text-[0.38em] capitalize text-ink-3">
                                                {activity.days.map(dayName).join(" | ")} | 16:30
                                            </span>
                                            <span className="text-[0.44em] font-medium tabular-nums">{money(locale, activity.price, 0)}</span>
                                        </span>
                                        <span key={left} className="animate-[ds-pop_350ms_var(--ease-spring-bounce)]">
                                            <Pill tone={full ? "red" : left <= 2 ? "yellow" : "gray"}>{full ? x.full : fill(x.placesLeft, { n: String(left) })}</Pill>
                                        </span>
                                    </span>
                                    {index === 0 && (
                                        <ActionButton t={t} press={SIGN.press} busy={SIGN.busy} done={SIGN.done} label={x.signUp} doneLabel={x.requested} className="h-[1.6em]" />
                                    )}
                                </Pop>
                            );
                        })}
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* agenda · the week's activities, without clashes                                                */
/* ---------------------------------------------------------------------------------------------- */

const FIRST = 12;
const PLACE = { clash: 2600, move: 3300, clear: 3900 };

function AgendaScene({ t, labels, locale }: Props) {
    const { x } = labels;
    const n = x.activityNames;
    const events: CalendarEvent[] = [
        { day: 0, start: 13, end: 14, title: n[3], tone: "sky", at: 300 },
        { day: 1, start: 13, end: 14, title: n[0], tone: "teal", at: 420 },
        { day: 0, start: 17, end: 18.5, title: n[5], tone: "green", at: 540 },
        { day: 2, start: 17, end: 18.5, title: n[5], tone: "green", at: 660 },
        { day: 1, start: 17, end: 18, title: n[7], tone: "lime", at: 780 },
        { day: 3, start: 16.5, end: 18, title: n[4], tone: "orange", at: 900 },
        { day: 4, start: 16.5, end: 18, title: n[6], tone: "violet", at: 1020 },
        { day: 3, start: 13, end: 14, title: n[2], tone: "sky", at: 1140 },
    ];
    // A new activity, dropped where another is, then moved to where nothing clashes.
    const moved = easeInOut(span(t, PLACE.move, 600));
    const from = { day: 4, start: 16.5 };
    const to = { day: 4, start: 14.5 };
    const clash = between(t, PLACE.clash, PLACE.move + 300);
    const clear = on(t, PLACE.clear);
    const left = calX(from.day) + (calX(to.day) - calX(from.day)) * moved;
    const top = calY(from.start + (to.start - from.start) * moved, FIRST);

    return (
        <WeekCalendar t={t} locale={locale} events={events} views={x.views} todayLabel={x.today} firstHour={FIRST} nowHour={15.4} nowAt={1300}>
            <At x={left + 0.12} y={top + 0.08} w={CAL_COL - 0.24} h={1.5 * 2.05 - 0.16}>
                <Pop
                    show={on(t, PLACE.clash)}
                    from="scale"
                    className={cn(
                        "flex h-full flex-col gap-[0.25em] rounded-[0.35em] border-l-[0.18em] px-[0.4em] py-[0.3em] transition-[background-color,border-color,box-shadow] duration-500",
                        clash ? "border-red-500 bg-red-100 text-red-950 shadow-[0_0_0_0.15em_rgb(239_68_68/0.35)] dark:bg-red-500/20 dark:text-red-100" : "border-pink-500 bg-pink-100 text-pink-950 elev-2 dark:bg-pink-500/20 dark:text-pink-100",
                    )}
                >
                    <span className="text-[0.4em] font-semibold leading-tight">{n[8]}</span>
                    <span className="text-[0.34em] tabular-nums opacity-70">
                        {formatHour(from.start + (to.start - from.start) * moved)} – {formatHour(from.start + 1.5 + (to.start - from.start) * moved)}
                    </span>
                </Pop>
            </At>
            <At x={left + CAL_COL - 9.1} y={top - 1.45} w={9} className="flex justify-end">
                <Pop show={clash} from="down">
                    <Pill tone="red">{x.roomBusy}</Pill>
                </Pop>
            </At>
            <At x={calX(to.day) + CAL_COL - 9.1} y={calY(to.start, FIRST) - 1.45} w={9} className="flex justify-end">
                <Pop show={clear} from="down">
                    <SettlePill t={t} at={PLACE.clear} from={x.roomBusy} to={x.noConflicts} />
                </Pop>
            </At>
        </WeekCalendar>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    catalog: { Scene: CatalogScene, duration: 4400 },
    browse: { Scene: BrowseScene, duration: 4200, ...SOLO },
    detail: { Scene: DetailScene, duration: 3400 },
    enrol: { Scene: EnrolScene, duration: 4400, ...DUO },
    agenda: { Scene: AgendaScene, duration: 4800 },
} satisfies Record<string, SceneSpec<ExtracurricularLabels>>;

export type ExtracurricularSceneKey = keyof typeof SCENES;

export default function ExtracurricularScenes({ scene, labels, locale, max }: { scene: ExtracurricularSceneKey; labels: ExtracurricularLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}

