import type { CSSProperties, ReactNode } from "react";

import { GlassOrbs, type Orb } from "@/components/wizard/glass-stage";
import { At, Pop, clamp01, span } from "@/components/wizard/scene-kit";
import { DrawnCheck } from "@/modules/home/KeyFeaturesScenes";
import { cn } from "@/lib/utils";

/*
 * What the product pages' scenes share: their compositions and the small pieces of UI they draw.
 *
 *   SOLO   one phone, centred and large, cut at the card's foot — for what happens on the phone
 *   DUO    the school's web app and a family's phone, one in front of the other: what one does,
 *          the other sees — the cause and its effect in one picture, not a phone and a floating card
 *
 * Boards are in em (`ScenePlayer` scales them); a scene on a DUO board places the pane and the
 * phone with the boxes below and lays its pane out inside `Pane`'s padding.
 */

export interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

export const SOLO = { board: { cols: 28, rows: 27 }, k: 0.74 } as const;
export const SOLO_PHONE: Box = { x: 7.4, y: 1.2, w: 13.2, h: 26.6 };

export const DUO = { board: { cols: 32, rows: 26 }, k: 0.72 } as const;
/** The phone on the left, in front; the pane behind it on the right. */
export const DUO_PHONE_LEFT: Box = { x: 1, y: 0.9, w: 12.4, h: 25.6 };
export const DUO_PANE_RIGHT: Box = { x: 10.2, y: 3.4, w: 21.2, h: 23 };
/** The pane on the left; the phone in front of it on the right. */
export const DUO_PANE_LEFT: Box = { x: 0.6, y: 3.4, w: 21.2, h: 23 };
export const DUO_PHONE_RIGHT: Box = { x: 18.6, y: 0.9, w: 12.4, h: 25.6 };
/** How far the phone covers the pane: the pane's content keeps clear of it. */
export const DUO_OVERLAP = 3.2;

export const ORBS: Record<"green" | "sky" | "warm", Orb[]> = {
    green: [
        { x: -2, y: 4, size: 14, color: "#a3e635" },
        { x: 18, y: 2, size: 15, color: "#14b8a6" },
        { x: 8, y: 15, size: 13, color: "#22c55e" },
    ],
    sky: [
        { x: -1, y: 4, size: 14, color: "#38bdf8" },
        { x: 18, y: 1, size: 15, color: "#a3e635" },
        { x: 9, y: 14, size: 13, color: "#22c55e" },
    ],
    warm: [
        { x: -2, y: 5, size: 14, color: "#fbbf24" },
        { x: 18, y: 2, size: 15, color: "#a3e635" },
        { x: 8, y: 15, size: 13, color: "#22c55e" },
    ],
};

export function Lights({ orbs = ORBS.green }: { orbs?: Orb[] }) {
    return <GlassOrbs orbs={orbs} />;
}

/**
 * The school's web app as a pane of glass, laid out inside by flex. `clear` keeps its content off
 * the side the phone covers.
 */
export function Pane({
    box,
    show = true,
    clear,
    className,
    children,
}: {
    box: Box;
    show?: boolean;
    clear?: "left" | "right";
    className?: string;
    children: ReactNode;
}) {
    const left = clear === "left" ? DUO_OVERLAP + 0.9 : 1;
    const right = clear === "right" ? DUO_OVERLAP + 0.9 : 1;
    return (
        <At {...box}>
            <Pop show={show} from="up" className="size-full">
                <div className="ds-glass relative size-full overflow-hidden" style={{ ["--glass-radius" as string]: "1.3em" }}>
                    <div className={cn("absolute inset-y-0 flex flex-col gap-[0.75em] pt-[1em]", className)} style={{ left: `${left}em`, right: `${right}em` }}>
                        {children}
                    </div>
                </div>
            </Pop>
        </At>
    );
}

/** Small, upper-case, tracked: a section's or a field's name. */
export function Caps({ children, className, tone = "text-ink-2" }: { children: ReactNode; className?: string; tone?: string }) {
    return <span className={cn("block truncate text-[0.4em] font-semibold uppercase tracking-[0.12em]", tone, className)}>{children}</span>;
}

export function Toggle({ on: isOn, className }: { on: boolean; className?: string }) {
    return (
        <span className={cn("relative inline-block h-[1.15em] w-[2.05em] shrink-0 rounded-full transition-colors duration-500", isOn ? "bg-green-500" : "bg-fill-2", className)}>
            <span
                className="absolute left-[0.12em] top-[0.12em] size-[0.91em] rounded-full bg-white elev-1 transition-transform duration-500 ease-spring"
                style={{ transform: `translateX(${isOn ? 0.9 : 0}em)` }}
            />
        </span>
    );
}

/** A pill whose content changes in place: the old leaves upward, the new rises in. */
export function Morph({ show, from, to, className, end = false, center = false }: { show: boolean; from: ReactNode; to: ReactNode; className?: string; end?: boolean; center?: boolean }) {
    // Each layer is a flex row, so small text centres on it rather than sitting on a tall line.
    const layer = cn("[grid-area:1/1] flex items-center transition-[opacity,translate,filter] duration-500 ease-spring", end && "justify-end", center && "justify-center");
    return (
        <span className={cn("inline-grid", className)}>
            <span className={cn(layer, show ? "-translate-y-[0.5em] opacity-0 blur-[3px]" : "opacity-100")}>{from}</span>
            <span className={cn(layer, show ? "opacity-100" : "translate-y-[0.5em] opacity-0 blur-[3px]")}>{to}</span>
        </span>
    );
}

export const TONES = {
    green: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
    red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    gray: "bg-fill-2 text-ink-2",
} as const;

export function Pill({ tone, children, className }: { tone: keyof typeof TONES; children: ReactNode; className?: string }) {
    return (
        <span className={cn("inline-flex items-center gap-[0.3em] whitespace-nowrap rounded-full px-[0.6em] py-[0.18em]", TONES[tone], className)}>
            <span className="text-[0.44em] font-semibold">{children}</span>
        </span>
    );
}

/** A pill that settles: from `from` to a green tick and `to`, at `at`. */
export function SettlePill({ t, at, from, to, fromTone = "yellow" }: { t: number; at: number; from: string; to: string; fromTone?: keyof typeof TONES }) {
    const done = t >= at;
    return (
        <Morph
            show={done}
            from={<Pill tone={fromTone}>{from}</Pill>}
            to={
                <span className={cn("inline-flex items-center gap-[0.25em] whitespace-nowrap rounded-full py-[0.18em] pl-[0.25em] pr-[0.6em]", TONES.green)}>
                    <span className="size-[0.7em]">
                        <DrawnCheck p={span(t, at + 80, 450)} className="size-full" />
                    </span>
                    <span className="text-[0.44em] font-semibold">{to}</span>
                </span>
            }
        />
    );
}

/**
 * The scenes' main button: idle, pressed (it dips), busy (a ring turns) and done (green, ticked).
 * `busy` and `done` are moments on the scene's clock.
 */
export function ActionButton({
    t,
    press,
    busy,
    done,
    label,
    doneLabel,
    className,
    tone = "ink",
}: {
    t: number;
    press: number;
    busy?: number;
    done: number;
    label: ReactNode;
    doneLabel: ReactNode;
    className?: string;
    tone?: "ink" | "green" | "sky";
}) {
    const pressed = t >= press && t < (busy ?? done);
    const isBusy = busy !== undefined && t >= busy && t < done;
    const isDone = t >= done;
    const idle = tone === "green" ? "bg-green-700 text-white dark:bg-green-600" : tone === "sky" ? "bg-sky-500 text-white" : "bg-ink text-canvas";
    return (
        <span
            className={cn(
                "grid h-[1.9em] place-items-center rounded-full transition-[background-color,color,scale] duration-500",
                isDone ? "bg-green-500 text-white" : idle,
                pressed && "scale-95",
                className,
            )}
        >
            <span className={cn("[grid-area:1/1] text-[0.52em] font-semibold transition-opacity duration-300", (isBusy || isDone) && "opacity-0")}>{label}</span>
            <svg
                viewBox="0 0 24 24"
                className={cn("[grid-area:1/1] size-[0.9em] transition-opacity duration-200", isBusy ? "opacity-100" : "opacity-0")}
                style={{ transform: `rotate(${clamp01((t - (busy ?? 0)) / 600) * 540}deg)` }}
            >
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="40 60" strokeLinecap="round" />
            </svg>
            <span className={cn("[grid-area:1/1] flex items-center gap-[0.35em] transition-opacity duration-300", !isDone && "opacity-0")}>
                <span className="size-[0.85em]">
                    <DrawnCheck p={span(t, done + 100, 450)} className="size-full" />
                </span>
                <span className="text-[0.5em] font-semibold">{doneLabel}</span>
            </span>
        </span>
    );
}

/** A row that has just arrived: lit, then fading to rest. */
export function Fresh({ t, at, className }: { t: number; at: number; className?: string }) {
    const p = span(t, at + 300, 1600);
    if (t < at || p >= 1) return null;
    return <span className={cn("pointer-events-none absolute inset-0 rounded-[0.5em] bg-brand/15", className)} style={{ opacity: 1 - p }} />;
}

/** A blinking caret at the end of typed text. */
export function Caret({ show }: { show: boolean }) {
    return show ? <span className="ml-[0.08em] inline-block h-[1em] w-[0.1em] translate-y-[0.15em] bg-brand" /> : null;
}

/** A photo, drawn: a soft ground and a white silhouette — a face, or a landscape. */
export function Photo({ hue, kind = "face", className, style }: { hue: number; kind?: "face" | "scene"; className?: string; style?: CSSProperties }) {
    return (
        <span
            className={cn("relative block overflow-hidden", className)}
            style={{ background: `linear-gradient(150deg, hsl(${hue} 80% 82%), hsl(${hue + 30} 70% 64%))`, ...style }}
        >
            <svg viewBox="0 0 40 40" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
                {kind === "face" ? (
                    <>
                        <circle cx="20" cy="17" r="7.5" fill="white" fillOpacity="0.75" />
                        <path d="M5 42c1.6-9 7.4-13.5 15-13.5S33.4 33 35 42z" fill="white" fillOpacity="0.75" />
                    </>
                ) : (
                    <>
                        <circle cx="29" cy="12" r="4.5" fill="white" fillOpacity="0.8" />
                        <path d="M-2 42 13 22l8 9 6-6 15 17z" fill="white" fillOpacity="0.7" />
                    </>
                )}
            </svg>
        </span>
    );
}

export type ProductKind = "paper" | "hoodie" | "trousers" | "books" | "scissors" | "backpack";

/** A shop's product, drawn flat on a soft ground: what each of the app's photos shows. */
export function ProductArt({ kind, className }: { kind: ProductKind; className?: string }) {
    const ground: Record<ProductKind, string> = {
        paper: "#f5f3ef",
        hoodie: "#eef1f4",
        trousers: "#f3efe9",
        books: "#eaf2fb",
        scissors: "#fbf3ec",
        backpack: "#eef5ef",
    };
    return (
        <span className={cn("relative block overflow-hidden", className)} style={{ background: ground[kind] }}>
            <svg viewBox="0 0 40 40" className="absolute inset-0 size-full">
                {kind === "paper" &&
                    ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"].map((color, index) => (
                        <rect key={color} x="10" y="11" width="18" height="22" rx="1" fill={color} transform={`rotate(${-36 + index * 9} 20 30)`} />
                    ))}
                {kind === "hoodie" && (
                    <path d="M14 9c1.5 2.5 3.5 3.5 6 3.5S24.5 11.5 26 9l7 4 -2.5 7-3-1.2V33H12.5V18.8l-3 1.2L7 13z" fill="#9ca3af" />
                )}
                {kind === "trousers" && (
                    <>
                        <path d="M14 8c1.5 2 3.5 3 6 3s4.5-1 6-3l6 3.5-2 5.5-2.5-1V21h-15v-5l-2.5 1-2-5.5z" fill="#a8896c" />
                        <path d="M12.5 21h15l1 13h-6l-2.5-9-2.5 9h-6z" fill="#957659" />
                    </>
                )}
                {kind === "books" && (
                    <>
                        <rect x="9" y="11" width="10" height="20" rx="1" fill="#3b82f6" />
                        <rect x="20" y="9" width="10" height="22" rx="1" fill="#f59e0b" />
                        <rect x="11.5" y="14" width="5" height="1.4" rx="0.7" fill="white" fillOpacity="0.7" />
                        <rect x="22.5" y="12" width="5" height="1.4" rx="0.7" fill="white" fillOpacity="0.7" />
                    </>
                )}
                {kind === "scissors" && (
                    <>
                        <circle cx="14" cy="28" r="4" fill="none" stroke="#f97316" strokeWidth="2.4" />
                        <circle cx="23" cy="30" r="4" fill="none" stroke="#f97316" strokeWidth="2.4" />
                        <path d="M16.5 25 26 8M20.5 26.5 21 8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                    </>
                )}
                {kind === "backpack" && (
                    <>
                        <rect x="11" y="12" width="18" height="21" rx="5" fill="#16a34a" />
                        <rect x="14" y="21" width="12" height="8" rx="2" fill="#15803d" />
                        <path d="M16 12c0-3 1.8-4.5 4-4.5s4 1.5 4 4.5" fill="none" stroke="#15803d" strokeWidth="1.8" />
                    </>
                )}
            </svg>
        </span>
    );
}

/** `true` from `at` until `until`. */
export const between = (t: number, at: number, until: number) => t >= at && t < until;

/** A phone with none of the app's chrome: a lock screen, a public web page. */
export function GlassPhone({ box, className, children }: { box: Box; className?: string; children?: ReactNode }) {
    return (
        <At {...box} className={cn("ds-glass overflow-hidden", className)} style={{ ["--glass-radius" as string]: "1.9em" }}>
            {children}
        </At>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* A week, on the school's calendar                                                               */
/* ---------------------------------------------------------------------------------------------- */

export interface CalendarEvent {
    /** Monday 0 to Friday 4. */
    day: number;
    start: number;
    end: number;
    title: string;
    tone: keyof typeof EVENT_TONES;
    /** When it arrives on the scene's clock. */
    at: number;
}

const EVENT_TONES = {
    green: "border-green-500 bg-green-100/80 text-green-950 dark:bg-green-500/15 dark:text-green-100",
    teal: "border-teal-500 bg-teal-100/80 text-teal-950 dark:bg-teal-500/15 dark:text-teal-100",
    orange: "border-orange-500 bg-orange-100/80 text-orange-950 dark:bg-orange-500/15 dark:text-orange-100",
    lime: "border-lime-500 bg-lime-100/80 text-lime-950 dark:bg-lime-500/15 dark:text-lime-100",
    sky: "border-sky-500 bg-sky-100/80 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100",
    violet: "border-violet-500 bg-violet-100/80 text-violet-950 dark:bg-violet-500/15 dark:text-violet-100",
} as const;

export const CAL = { rows: 8, hourH: 2.05, top: 3.5, gutter: 1.9, days: 5, w: 30.2 };
export const calX = (day: number) => CAL.gutter + day * ((CAL.w - CAL.gutter) / CAL.days);
/** Where `hour` falls on a calendar whose first row is `first`. */
export const calY = (hour: number, first = 9) => CAL.top + (hour - first) * CAL.hourH;
export const CAL_COL = (CAL.w - CAL.gutter) / CAL.days;

/**
 * A working week on the school's calendar, drawn in a pane's content box (30.2 em wide): the view
 * picker, the days, the hours, a line for now, and `events` arriving each at its own moment.
 * `children` draws over it (an event being placed, a chip).
 */
export function WeekCalendar({
    t,
    locale,
    events,
    views,
    todayLabel,
    nowAt = 900,
    firstHour = 9,
    nowHour = 11.33,
    children,
}: {
    t: number;
    locale: string;
    events: CalendarEvent[];
    views: string[];
    todayLabel: string;
    nowAt?: number;
    /** The first hour on the grid; it shows eight. */
    firstHour?: number;
    nowHour?: number;
    children?: ReactNode;
}) {
    const hours = Array.from({ length: CAL.rows }, (_, index) => firstHour + index);
    const y = (hour: number) => calY(hour, firstHour);
    const days = Array.from({ length: CAL.days }, (_, index) => new Date(2026, 5, 8 + index));
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const month = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(days[0]);
    const now = clamp01((t - nowAt) / 700);

    return (
        <>
            <At x={0} y={0} w={CAL.w} h={1.9} className="flex items-center gap-[0.5em]">
                <span className="flex h-[1.5em] items-center rounded-full bg-fill p-[0.15em]">
                    {views.map((view, index) => (
                        <span key={view} className={cn("flex h-full items-center rounded-full px-[0.7em]", index === 1 ? "bg-ink text-canvas" : "text-ink-2")}>
                            <span className="text-[0.46em] font-medium">{view}</span>
                        </span>
                    ))}
                </span>
                <span className="ml-auto text-[0.42em] font-semibold uppercase tracking-[0.1em] text-ink-2">{month}</span>
                <span className="flex h-[1.5em] items-center rounded-full bg-fill px-[0.7em]">
                    <span className="text-[0.46em] font-medium">{todayLabel}</span>
                </span>
            </At>

            {days.map((day, index) => (
                <At key={index} x={calX(index)} y={2.25} w={CAL_COL} className="flex items-baseline justify-center gap-[0.35em]">
                    <span className="text-[0.38em] font-semibold uppercase tracking-[0.08em] text-ink-3">{weekday.format(day).replace(".", "")}</span>
                    <span
                        className={cn(
                            "rounded-full px-[0.4em] text-[0.5em] font-semibold tabular-nums",
                            index === 2 ? "bg-red-500 text-white" : "text-ink-2",
                        )}
                    >
                        {day.getDate()}
                    </span>
                </At>
            ))}

            {hours.map((hour) => (
                <At key={hour} x={0} y={y(hour)} w={CAL.w} className="flex items-start gap-[0.3em] border-t border-hairline">
                    <span className="-translate-y-[0.55em] bg-transparent text-[0.36em] tabular-nums text-ink-3">{String(hour).padStart(2, "0")}:00</span>
                </At>
            ))}
            {days.map((_, index) => (
                <At key={index} x={calX(index)} y={CAL.top} w={0.05} h={CAL.rows * CAL.hourH} className="bg-hairline" />
            ))}

            {/* Now: a red line drawn across. */}
            <At x={CAL.gutter - 0.25} y={y(nowHour) - 0.25} w={0.5} h={0.5} className={cn("rounded-full bg-red-500 transition-opacity duration-300", now > 0 ? "opacity-100" : "opacity-0")} />
            <At x={CAL.gutter} y={y(nowHour) - 0.04} w={(CAL.w - CAL.gutter) * now} h={0.08} className="bg-red-500" />

            {events.map((event) => (
                <At
                    key={`${event.title}-${event.day}`}
                    x={calX(event.day) + 0.12}
                    y={y(event.start) + 0.08}
                    w={CAL_COL - 0.24}
                    h={(event.end - event.start) * CAL.hourH - 0.16}
                >
                    <Pop
                        show={t >= event.at}
                        from="scale"
                        className={cn("flex h-full flex-col gap-[0.25em] overflow-hidden rounded-[0.35em] border-l-[0.18em] px-[0.4em] py-[0.3em]", EVENT_TONES[event.tone])}
                    >
                        <span className={cn("text-[0.4em] font-semibold leading-tight", event.end - event.start < 1.5 ? "truncate" : "line-clamp-2")}>{event.title}</span>
                        <span className="text-[0.34em] tabular-nums opacity-70">
                            {formatHour(event.start)} – {formatHour(event.end)}
                        </span>
                    </Pop>
                </At>
            ))}
            {children}
        </>
    );
}

export const formatHour = (hour: number) => `${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`;
export { EVENT_TONES };
