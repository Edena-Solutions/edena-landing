import type { CSSProperties, ReactNode } from "react";
import {
    Backpack,
    Bell,
    Calendar,
    CalendarDays,
    ClipboardList,
    FileText,
    House,
    MapPinCheck,
    Menu,
    Package,
    Rows3,
    Send,
    Shapes,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react";

import appIcon from "@/assets/img/logos/app-icon.svg";
import enaLogo from "@/assets/img/logos/ena.png";
import wordmark from "@/assets/img/logos/logo.png";
import { cn } from "@/lib/utils";
import { At, Line } from "./scene-kit";

/*
 * The families' app, drawn: the phone with the app's header and tab bar, and its home as the app
 * opens (the coloured tiles by section, from `screenshots/app/app_hero.png`). The hero, the app tile
 * and the app's wizard scene all draw it from here, so it is one app everywhere on the page.
 *
 * Positions are in the artboard's em.
 */

const orbSrc = typeof enaLogo === "string" ? enaLogo : enaLogo.src;
const appIconSrc = typeof appIcon === "string" ? appIcon : appIcon.src;
export const wordmarkSrc = typeof wordmark === "string" ? wordmark : wordmark.src;

const LOGO_PATH =
    "M26.9688 0C28.2809 0.000118162 29.3447 1.05184 29.3447 2.34863V26.6514C29.3447 27.9482 28.2809 28.9999 26.9688 29H2.37598C1.06375 28.9999 0 27.9482 0 26.6514V2.34863C0 1.0518 1.06375 5.61543e-05 2.37598 0H26.9688ZM4.79199 13.668C4.76544 13.9611 4.75196 14.2585 4.75195 14.5586C4.75195 20.0053 9.22002 24.4208 14.7314 24.4209C20.243 24.4209 24.7109 20.0054 24.7109 14.5586C24.7109 14.2225 24.6944 13.8899 24.6611 13.5625L4.79199 13.668ZM14.7314 4.69629C10.369 4.6964 6.6604 7.46288 5.30371 11.3174L24.124 11.2178C22.7389 7.41532 19.0563 4.69629 14.7314 4.69629Z";

export function LogoMark({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg viewBox="0 0 30 29" className={className} style={style}>
            <path fill="currentColor" d={LOGO_PATH} />
        </svg>
    );
}

/**
 * Ena, `size` em square. `alive`: it breathes, floats, blinks and catches the light (`.ena-alive`
 * in the design system) — for where Ena is the subject; a still image everywhere else. `delay`
 * offsets its loops, so two living Enas on one screen never move in step.
 */
export function EnaClover({
    size,
    className,
    alive = false,
    delay,
    alt = "",
}: {
    size: number;
    className?: string;
    alive?: boolean;
    delay?: string;
    alt?: string;
}) {
    if (alive) {
        return (
            <span
                className={cn("ena-alive", className)}
                style={
                    {
                        width: `${size}em`,
                        height: `${size}em`,
                        "--ena-src": `url(${orbSrc})`,
                        "--ena-delay": delay,
                    } as CSSProperties
                }
            >
                <span className="ena-alive__shadow" aria-hidden />
                <span className="ena-alive__float">
                    <span className="ena-alive__body">
                        <img src={orbSrc} alt={alt} className="ena-alive__img" />
                        <span className="ena-alive__lid ena-alive__lid--left" aria-hidden />
                        <span className="ena-alive__lid ena-alive__lid--right" aria-hidden />
                    </span>
                </span>
            </span>
        );
    }
    return (
        <img
            src={orbSrc}
            alt={alt}
            className={cn("shrink-0 object-contain", className)}
            style={{ width: `${size}em`, height: `${size}em` }}
        />
    );
}

/**
 * Edena's app icon (`logos/app-icon.svg`): the green mark on white, as the phone's notifications
 * and the App Store and Google Play show it, rounded like a home-screen icon. `size` is its width
 * in em.
 */
export function AppIcon({ size, className }: { size: number; className?: string }) {
    return (
        <img
            src={appIconSrc}
            alt=""
            className={cn("shrink-0 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.06)] dark:shadow-[0_0_0_1px_rgb(255_255_255/0.18)]", className)}
            style={{ width: `${size}em`, height: `${size}em`, borderRadius: `${size * 0.225}em` }}
        />
    );
}

/**
 * A notification from Edena, as the phone shows it: the app's icon, its name, a title and either a
 * line of text or a skeleton for it.
 */
export function PhoneNotification({
    title,
    body,
    className,
    style,
}: {
    title: string;
    body?: string;
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <div className={cn("flex items-center gap-[0.5em] rounded-[0.95em] p-[0.5em] material-thick elev-3 ring-1 ring-hairline", className)} style={style}>
            <AppIcon size={1.5} />
            <span className="flex min-w-0 flex-1 flex-col gap-[0.25em]">
                <span className="text-[0.3em] font-semibold uppercase leading-none tracking-[0.1em] text-ink-3">Edena</span>
                <span className="truncate text-[0.44em] font-semibold leading-tight">{title}</span>
                {body ? <span className="truncate text-[0.4em] leading-tight text-ink-2">{body}</span> : <Line w={4.6} className="h-[0.22em] opacity-70" />}
            </span>
        </div>
    );
}

/** The app's section title: small, bold, upper case, tracked. */
export function Label({
    children,
    className,
    size = 0.44,
}: {
    children: ReactNode;
    className?: string;
    size?: number;
}) {
    return (
        <span
            className={cn(
                "block truncate font-bold uppercase leading-tight tracking-[0.08em]",
                className,
            )}
            style={{ fontSize: `${size}em` }}
        >
            {children}
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* The families' app                                                                              */
/* ---------------------------------------------------------------------------------------------- */

/**
 * The families' app as a pane of glass shaped like a phone — no bezel, no notch, no status bar —
 * with the app's header and its tab bar. The screen goes in `children`.
 */
export function PhoneFrame({
    x,
    y,
    w,
    h,
    tab = 0,
    cart = false,
    cartCount,
    children,
    overlay,
    className,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    /** The tab bar's entry in hand: 0 home, 1 backpack, 2 Ena, 3 messages, 4 profile. */
    tab?: number;
    cart?: boolean;
    /** Items in the cart, on a badge over its icon (with `cart`). */
    cartCount?: number;
    children?: ReactNode;
    /** Drawn over the whole screen, above the header: a notification arriving. */
    overlay?: ReactNode;
    className?: string;
}) {
    const tabs: (LucideIcon | "ena" | "me")[] = [House, Backpack, "ena", Send, "me"];
    return (
        <At
            x={x}
            y={y}
            w={w}
            h={h}
            className={cn("ds-glass overflow-hidden", className)}
            style={{ ["--glass-radius" as string]: "1.8em" }}
        >
            <div className="relative h-full">
                <span className="absolute inset-x-[0.75em] top-[0.85em] flex items-center justify-between">
                    <Menu className="size-[0.7em]" />
                    <img src={wordmarkSrc} alt="" className="h-[0.62em] w-auto dark:invert" />
                    <span className="flex items-center gap-[0.35em]">
                        {cart && (
                            <span className="relative">
                                <ShoppingCart className="size-[0.65em]" />
                                {!!cartCount && (
                                    <span
                                        key={cartCount}
                                        className="absolute -right-[0.3em] -top-[0.3em] flex size-[0.6em] animate-[ds-pop_400ms_var(--ease-spring-bounce)] items-center justify-center rounded-full bg-red-500 text-white"
                                    >
                                        <span className="text-[0.4em] font-bold tabular-nums leading-none">{cartCount}</span>
                                    </span>
                                )}
                            </span>
                        )}
                        <span className="relative">
                            <Bell className="size-[0.65em] fill-current" />
                            <span className="absolute -right-[0.1em] -top-[0.1em] size-[0.3em] rounded-full bg-red-500" />
                        </span>
                    </span>
                </span>
                <div className="absolute inset-x-0 bottom-[2.1em] top-[2.4em] overflow-hidden">
                    {children}
                </div>
                {overlay && (
                    <div className="absolute inset-x-[0.35em] top-[0.35em] z-40">{overlay}</div>
                )}
                <span className="absolute inset-x-0 bottom-0 flex h-[2.1em] items-start justify-around border-t border-white/50 bg-white/25 px-[0.4em] pt-[0.5em] dark:border-white/10 dark:bg-white/5">
                    {tabs.map((Tab, index) => (
                        <span
                            key={index}
                            className={cn(
                                "flex size-[1em] items-center justify-center",
                                index === tab ? "text-ink" : "text-ink-3",
                            )}
                        >
                            {Tab === "ena" ? (
                                <EnaClover size={0.85} />
                            ) : Tab === "me" ? (
                                <span
                                    className="size-[0.85em] rounded-full"
                                    style={{
                                        background: "linear-gradient(140deg, #c7b299, #6b5544)",
                                    }}
                                />
                            ) : (
                                <Tab className="size-[0.72em]" />
                            )}
                        </span>
                    ))}
                </span>
            </div>
        </At>
    );
}

const HOME_TILES: { icon: LucideIcon; color: string }[] = [
    { icon: Rows3, color: "#6366f1" },
    { icon: CalendarDays, color: "#0ea5e9" },
    { icon: MapPinCheck, color: "#22c55e" },
    { icon: Shapes, color: "#fb923c" },
    { icon: ClipboardList, color: "#14b8a6" },
    { icon: Calendar, color: "#3b82f6" },
    { icon: FileText, color: "#f59e0b" },
    { icon: Package, color: "#84cc16" },
];

/**
 * Where a home tile sits inside the phone's screen, in em from the screen's top-left. The glass
 * phone has no bezel, so `screenWidth` is the phone's own width.
 */
export const homeTile = (index: number, screenWidth: number) => {
    const gap = 0.3;
    const tileW = (screenWidth - 0.7 - gap) / 2;
    const section = Math.floor(index / 2);
    return {
        x: 0.35 + (index % 2) * (tileW + gap),
        y: 1.45 + section * 4.25 + 0.55,
        w: tileW,
        h: 3.3,
    };
};

/**
 * The app's home: "welcome back", then the coloured tiles by section, as the families' app opens.
 * `pressed` dims the tile a finger is on.
 */
export function PhoneHome({
    welcome,
    sections,
    tiles,
    screenWidth,
    pressed,
}: {
    welcome: string;
    sections: string[];
    tiles: string[];
    screenWidth: number;
    pressed?: number;
}) {
    return (
        <div className="relative h-full">
            <span className="absolute left-[0.35em] top-[0.3em] max-w-[90%]">
                <Label size={0.36}>{welcome}</Label>
            </span>
            {sections.map((section, s) => (
                <span
                    key={section}
                    className="absolute left-[0.35em] text-ink-2"
                    style={{ top: `${1.45 + s * 4.25}em` }}
                >
                    <span
                        className="block uppercase tracking-[0.1em]"
                        style={{ fontSize: "0.3em" }}
                    >
                        {section}
                    </span>
                </span>
            ))}
            {HOME_TILES.map((tile, index) => {
                const box = homeTile(index, screenWidth);
                const Icon = tile.icon;
                return (
                    <span
                        key={index}
                        className={cn(
                            "absolute flex flex-col rounded-[0.35em] p-[0.4em] text-white transition-[scale,filter] duration-200",
                            pressed === index && "scale-95 brightness-90",
                        )}
                        style={{
                            left: `${box.x}em`,
                            top: `${box.y}em`,
                            width: `${box.w}em`,
                            height: `${box.h}em`,
                            background: tile.color,
                        }}
                    >
                        <span className="flex size-[1.15em] items-center justify-center rounded-[0.25em] bg-white/25">
                            <Icon className="size-[0.6em]" />
                        </span>
                        <span
                            className="mt-auto block truncate font-bold uppercase tracking-[0.06em]"
                            style={{ fontSize: "0.3em" }}
                        >
                            {tiles[index]}
                        </span>
                        <span className="mt-[0.25em] block h-[0.18em] w-4/5 rounded-full bg-white/55" />
                    </span>
                );
            })}
        </div>
    );
}
