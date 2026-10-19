import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * What every wizard scene is built from. A scene is a pure function of `t`, the milliseconds its
 * step has been playing (negative while the previous scene leaves, `Infinity` for the finished
 * frame). Nothing in here keeps a timer.
 *
 * Scenes are drawn on a 32 × 24 em artboard that scales with the stage like an image, so positions
 * are written in em and a cursor lands on the same field at any size.
 */

/* ---------------------------------------------------------------------------------------------- */
/* Time                                                                                           */
/* ---------------------------------------------------------------------------------------------- */

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const on = (t: number, at: number) => t >= at;

/** How far through `[at, at + duration]` the clock is, 0 to 1. */
export const span = (t: number, at: number, duration: number) => clamp01((t - at) / duration);

export const easeOut = (p: number) => 1 - (1 - p) ** 3;

export const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);

export const lerp = (from: number, to: number, p: number) => from + (to - from) * p;

/** A value typed out from `at`, one character every `perChar` ms. */
export function typed(value: string, t: number, at: number, perChar = 40) {
    const p = span(t, at, value.length * perChar);
    return { text: value.slice(0, Math.round(p * value.length)), typing: t >= at && p < 1 };
}

/** Words revealed from `at`, one every `perWord` ms: how Ena's answers stream in. */
export function streamed(value: string, t: number, at: number, perWord = 55) {
    const words = value.split(" ");
    const shown = Math.floor(clamp01((t - at) / (words.length * perWord)) * words.length);
    return { words, shown, streaming: t >= at && shown < words.length };
}

export function fill(template: string, values: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

export interface Waypoint {
    at: number;
    x: number;
    y: number;
}

/** Where a cursor (or anything carried) is at `t`, easing in and out between waypoints. */
export function track(t: number, points: Waypoint[]) {
    if (t <= points[0].at) return { x: points[0].x, y: points[0].y };
    for (let i = 1; i < points.length; i += 1) {
        const from = points[i - 1];
        const to = points[i];
        if (t <= to.at) {
            const p = easeInOut((t - from.at) / Math.max(1, to.at - from.at));
            return { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p) };
        }
    }
    const last = points[points.length - 1];
    return { x: last.x, y: last.y };
}

/* ---------------------------------------------------------------------------------------------- */
/* Formatting                                                                                     */
/* ---------------------------------------------------------------------------------------------- */

export const money = (locale: string, value: number, digits = 0) =>
    new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);

/** A date as the app prints it, day/month/year in figures (the one form every locale shares). */
export const shortDate = (locale: string, date: Date) =>
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "numeric", year: "numeric" }).format(date);

export const number = (locale: string, value: number, digits = 0) =>
    new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value);

export const percent = (locale: string, value: number, digits = 0) =>
    new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value / 100);

/** A month of the school year, the year never shown. March: invoices, report cards, enrolment. */
export const monthName = (locale: string, month = 2, style: "long" | "short" = "long") =>
    new Intl.DateTimeFormat(locale, { month: style }).format(new Date(2026, month, 1));

export const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase() + value.slice(1);

/**
 * A stat from the copy ("+35%", "37 h", "%73") counted up to `p` of itself: the first number is
 * scaled, everything around it is kept, so each language keeps its own way of writing it.
 */
export function countIn(text: string, p: number) {
    return text.replace(/\d+(?:[.,]\d+)?/, (raw) => {
        const separator = raw.includes(",") ? "," : ".";
        const decimals = raw.includes(separator) ? raw.split(separator)[1].length : 0;
        return (Number.parseFloat(raw.replace(",", ".")) * p)
            .toFixed(decimals)
            .replace(".", separator);
    });
}

/** A smooth line through `points` (Catmull-Rom as cubic Béziers), for the scenes' charts. */
export function smoothPath(points: [number, number][]) {
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
    }
    return d;
}

/**
 * The point `p` (0–1) of the way along `smoothPath(points)`, on the curve itself: the segment by
 * position, then the same Bézier evaluated inside it. For a light that travels with a line as it
 * draws.
 */
export function smoothPoint(points: [number, number][], p: number): [number, number] {
    const segments = points.length - 1;
    const at = clamp01(p) * segments;
    const i = Math.min(segments - 1, Math.floor(at));
    const u = at - i;
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    const v = 1 - u;
    const bezier = (a: number, b: number, c: number, d: number) =>
        v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
    return [bezier(p1[0], c1[0], c2[0], p2[0]), bezier(p1[1], c1[1], c2[1], p2[1])];
}

/* ---------------------------------------------------------------------------------------------- */
/* Pieces                                                                                         */
/* ---------------------------------------------------------------------------------------------- */

/**
 * The artboard (32 × 24 em unless a scene asks for another shape), fitted inside the stage below its controls
 * whatever the stage's shape: the frame is measured, the board takes the largest box of its proportions
 * that fits, and its font-size is a `cols`-th of that width.
 *
 * Below `minRem` the board stops shrinking and the stage crops it instead, centred on `focus` (0 is
 * its left edge, 1 its right) — on a phone the product stays legible, the way Apple crops a
 * screenshot to its detail rather than shrinking the whole window to a thumbnail.
 */
export function Artboard({
    children,
    className,
    cols = 32,
    rows = 24,
    focus = 0.5,
    minRem = 0,
}: {
    children: ReactNode;
    className?: string;
    cols?: number;
    rows?: number;
    focus?: number;
    minRem?: number;
}) {
    const frameRef = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState<{ width: number; left: number; top: number } | null>(null);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        // `cqh` is 0 on iOS Safari when the box is only stretched with `top` and `bottom`, so the
        // board never scaled up. Chrome's device mode resolves it, which is why the emulator looked
        // right. The frame's real box is the same number on both.
        const measure = () => {
            const container = frame.clientWidth;
            const height = frame.clientHeight;
            if (container <= 0 || height <= 0) return;
            const fitted = Math.min(container, (height * cols) / rows, 50 * 16);
            const width = Math.max(fitted, minRem * 16);
            const slack = container - width;
            const left = slack >= 0 ? slack / 2 : Math.min(0, Math.max(slack, container / 2 - focus * width));
            const top = (height - (width * rows) / cols) / 2;
            setBox((prev) =>
                prev &&
                Math.abs(prev.width - width) < 0.5 &&
                Math.abs(prev.left - left) < 0.5 &&
                Math.abs(prev.top - top) < 0.5
                    ? prev
                    : { width, left, top },
            );
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(frame);
        return () => observer.disconnect();
    }, [cols, rows, focus, minRem]);

    return (
        <div ref={frameRef} className="absolute inset-x-3 bottom-3 top-14 sm:inset-x-8 sm:bottom-8 sm:top-16">
            <div
                aria-hidden
                className={cn("absolute select-none text-ink", className)}
                style={{
                    width: box?.width ?? 0,
                    left: box?.left ?? 0,
                    top: box?.top ?? 0,
                    fontSize: box ? box.width / cols : 0,
                    aspectRatio: `${cols} / ${rows}`,
                    visibility: box ? "visible" : "hidden",
                }}
            >
                {children}
            </div>
        </div>
    );
}

/** Placed on the artboard, in em. */
export function At({
    x,
    y,
    w,
    h,
    className,
    style,
    children,
}: {
    x: number;
    y: number;
    w?: number;
    h?: number;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}) {
    return (
        <div
            className={cn("absolute", className)}
            style={{
                left: `${x}em`,
                top: `${y}em`,
                width: w === undefined ? undefined : `${w}em`,
                height: h === undefined ? undefined : `${h}em`,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

/**
 * Arrives on the scene clock, rising in on the spring, and leaves the same way it came. A CSS
 * transition, so a scene paused or scrubbed mid-way retargets from where it is.
 */
export function Pop({
    show,
    children,
    className,
    style,
    from = "up",
}: {
    show: boolean;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    /** `blur` materialises: rises a little, grows a little and comes into focus. */
    from?: "up" | "down" | "scale" | "blur";
}) {
    const hidden =
        from === "scale"
            ? "scale-90 opacity-0"
            : from === "down"
              ? "-translate-y-[0.6em] opacity-0"
              : from === "blur"
                ? "translate-y-[0.5em] scale-[0.97] opacity-0 blur-[6px]"
                : "translate-y-[0.6em] opacity-0";
    return (
        <div
            className={cn(
                "transition-[opacity,translate,scale,filter] duration-700 ease-spring motion-reduce:transition-none",
                // At rest no filter at all (not `blur(0)`): a filter on an ancestor would cut the
                // glass inside it off from what lies behind.
                show ? "translate-y-0 scale-100 opacity-100 blur-none" : hidden,
                className,
            )}
            style={style}
        >
            {children}
        </div>
    );
}

/** A window of the product: a surface card with an optional title row. */
export function Panel({
    className,
    style,
    children,
}: {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}) {
    return (
        <div
            className={cn("absolute overflow-hidden rounded-[1em] bg-surface elev-3", className)}
            style={style}
        >
            {children}
        </div>
    );
}

export type Tone =
    | "brand"
    | "blue"
    | "green"
    | "indigo"
    | "orange"
    | "pink"
    | "purple"
    | "teal"
    | "mint"
    | "yellow"
    | "red";

const TONE_BG: Record<Exclude<Tone, "brand">, string> = {
    blue: "bg-sys-blue",
    green: "bg-sys-green",
    indigo: "bg-sys-indigo",
    orange: "bg-sys-orange",
    pink: "bg-sys-pink",
    purple: "bg-sys-purple",
    teal: "bg-sys-teal",
    mint: "bg-sys-mint",
    yellow: "bg-sys-yellow",
    red: "bg-sys-red",
};

/** An app-icon squircle with a glyph. */
export function Glyph({
    icon: Icon,
    tone,
    size = 2,
    className,
}: {
    icon: LucideIcon;
    tone: Tone;
    size?: number;
    className?: string;
}) {
    return (
        <span
            className={cn("ds-app-icon", tone !== "brand" && TONE_BG[tone], className)}
            style={{
                width: `${size}em`,
                height: `${size}em`,
                background: tone === "brand" ? "var(--ds-brand-gradient)" : undefined,
            }}
        >
            <Icon style={{ width: `${size * 0.5}em`, height: `${size * 0.5}em` }} strokeWidth={2.2} />
        </span>
    );
}

/** A person: their initials on a soft gradient. `hue` picks the gradient. */
export function Avatar({
    initials,
    hue,
    size = 1.75,
    className,
}: {
    initials: string;
    hue: number;
    size?: number;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
                className,
            )}
            style={{
                width: `${size}em`,
                height: `${size}em`,
                background: `linear-gradient(135deg, hsl(${hue} 85% 68%), hsl(${hue + 35} 80% 52%))`,
            }}
        >
            <span style={{ fontSize: `${size * 0.4}em` }}>{initials}</span>
        </span>
    );
}

/** A skeleton line of text, `w` em long. */
export function Line({ w, className }: { w: number; className?: string }) {
    return <span className={cn("ds-bar", className)} style={{ width: `${w}em` }} />;
}

/** A pointer that moves on its own. `pressed` dips it and rings the spot it presses. */
export function Cursor({
    x,
    y,
    pressed = false,
    show = true,
}: {
    x: number;
    y: number;
    pressed?: boolean;
    show?: boolean;
}) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute z-50 transition-opacity duration-300",
                show ? "opacity-100" : "opacity-0",
            )}
            style={{ left: `${x}em`, top: `${y}em` }}
        >
            <span
                className={cn(
                    "absolute -left-[0.9em] -top-[0.9em] size-[1.8em] rounded-full bg-sys-blue/25 transition-[opacity,scale] duration-300 ease-out",
                    pressed ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
            />
            <svg
                viewBox="0 0 20 20"
                className="relative -left-[0.15em] -top-[0.1em] block size-[1.35em] drop-shadow-[0_2px_3px_rgb(0_0_0/0.3)] transition-[scale] duration-150"
                style={{ scale: pressed ? "0.86" : "1" }}
            >
                <path
                    d="M3 2.2v13.6l3.7-3.4 2.4 5.4 2.5-1.1-2.4-5.3 5-.3z"
                    fill="#1d1d1f"
                    stroke="#fff"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

/** A small rounded tag. */
export function Chip({
    children,
    className,
    icon: Icon,
}: {
    children?: ReactNode;
    className?: string;
    icon?: LucideIcon;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-[0.35em] whitespace-nowrap rounded-full bg-fill-2 px-[0.6em] py-[0.2em] text-[0.62em] font-medium text-ink-2",
                className,
            )}
        >
            {Icon && <Icon className="size-[1.1em] shrink-0" strokeWidth={2.4} />}
            {children}
        </span>
    );
}
