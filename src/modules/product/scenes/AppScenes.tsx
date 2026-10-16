import type { CSSProperties, ReactNode } from "react";
import { CheckCheck, ChevronLeft, FileText, Heart, ImageIcon, MessageCircle, Send, type LucideIcon } from "lucide-react";

import { PhoneFrame, PhoneHome } from "@/components/wizard/app-frame";
import { GlassOrbs } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Glyph, Line, Pop, easeOut, on, span, type Tone } from "@/components/wizard/scene-kit";
import { KEY_FEATURE_SCENES, Ripple } from "@/modules/home/KeyFeaturesScenes";
import { cn } from "@/lib/utils";
import type { ProductSceneLabels } from "./labels";

/*
 * The families' app page's scenes, drawn from `screenshots/app/*` in the home's abstract style,
 * on phones of glass:
 *
 *   trio     (hero) three phones in depth — the students, the home, the timetable — and the
 *            day's notifications arriving on the one in front
 *   chat     a conversation with a family: a message, an answer typed and sent, read
 *   album    a class album filling with photos; one opened, and liked
 *   updates  a post written on the desktop lands on a family's phone (the home's app scene)
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ProductSceneLabels;
    locale: string;
}

const PHONE = { w: 12.4, h: 25.4 };
const SECTION = "block truncate text-[0.36em] font-bold uppercase tracking-[0.1em]";

/** A phone set back: smaller, its screen a step quieter. `x`, `y` in board em. */
function BackPhone({ x, y, scale, children }: { x: number; y: number; scale: number; children: ReactNode }) {
    return (
        <div className="absolute" style={{ left: `${x / scale}em`, top: `${y / scale}em`, width: `${PHONE.w}em`, height: `${PHONE.h}em`, fontSize: `${scale}em` }}>
            {children}
        </div>
    );
}

/** A photo, drawn: a soft ground and a white silhouette — a face, or a landscape. */
function Photo({ hue, kind = "face", className, style }: { hue: number; kind?: "face" | "scene"; className?: string; style?: CSSProperties }) {
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

/* ---------------------------------------------------------------------------------------------- */
/* trio · three phones                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const STUDENTS = ["Gerard", "Sofía", "Emma", "Lucas", "Hugo", "Mateo", "Lucía", "Leo", "Daniel", "Juan", "María", "Miguel"];
const NOTIFICATIONS: { at: number; icon: LucideIcon; tone: Tone; key: "notifPhotos" | "notifMessage" | "newInvoice" }[] = [
    { at: 900, icon: ImageIcon, tone: "pink", key: "notifPhotos" },
    { at: 1900, icon: MessageCircle, tone: "blue", key: "notifMessage" },
    { at: 2900, icon: FileText, tone: "orange", key: "newInvoice" },
];
const BACK = 0.88;
const EVENT_AT = 1600;

function Notification({ icon, tone, title, className, style }: { icon: LucideIcon; tone: Tone; title: string; className?: string; style?: CSSProperties }) {
    return (
        <div className={cn("flex items-center gap-[0.45em] rounded-[0.9em] p-[0.5em] material-thick elev-3 ring-1 ring-hairline", className)} style={style}>
            <Glyph icon={icon} tone={tone} size={1.5} />
            <span className="flex min-w-0 flex-col gap-[0.3em]">
                <span className="truncate text-[0.44em] font-semibold">{title}</span>
                <Line w={4.5} className="h-[0.22em] opacity-70" />
            </span>
        </div>
    );
}

function TrioScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const arrived = NOTIFICATIONS.filter((note) => on(t, note.at)).reverse();
    const week = Array.from({ length: 7 }, (_, index) => new Date(2026, 5, 8 + index));
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });

    return (
        <>
            <GlassOrbs
                orbs={[
                    { x: 3, y: 5, size: 16, color: "#a3e635" },
                    { x: 15, y: 13, size: 18, color: "#22c55e" },
                    { x: 25, y: 1, size: 16, color: "#14b8a6" },
                ]}
            />

            {/* Behind, on the left: the students, photo by photo. */}
            <BackPhone x={1.6} y={3.4} scale={BACK}>
                <Pop show={on(t, 150)} from="blur" className="absolute inset-0">
                    <PhoneFrame x={0} y={0} w={PHONE.w} h={PHONE.h} tab={1}>
                        <div className="relative h-full px-[0.35em] opacity-90">
                            <span className="absolute left-[0.35em] top-[0.3em]">
                                <span className={SECTION}>{p.students}</span>
                            </span>
                            <span className="absolute inset-x-[0.35em] top-[1.1em] flex h-[1.15em] items-center rounded-[0.4em] bg-fill px-[0.5em]">
                                <Line w={5} className="h-[0.22em]" />
                            </span>
                            {STUDENTS.map((name, index) => {
                                const w = (PHONE.w - 0.7 - 0.5) / 3;
                                return (
                                    <At key={name} x={0.35 + (index % 3) * (w + 0.25)} y={2.65 + Math.floor(index / 3) * 4.15} w={w} h={3.9}>
                                        <Pop show={on(t, 400 + index * 70)} from="scale" className="relative size-full">
                                            <Photo hue={(index * 47) % 360} className="size-full rounded-[0.35em]" />
                                            <span className="absolute inset-x-[0.25em] bottom-[0.25em] flex h-[0.85em] items-center justify-center rounded-[0.2em] bg-white/90">
                                                <span className="truncate text-[0.32em] font-medium text-neutral-900">{name}</span>
                                            </span>
                                        </Pop>
                                    </At>
                                );
                            })}
                        </div>
                    </PhoneFrame>
                </Pop>
            </BackPhone>

            {/* Behind, on the right: a child's timetable for the week. */}
            <BackPhone x={27.5} y={3.4} scale={BACK}>
                <Pop show={on(t, 250)} from="blur" className="absolute inset-0">
                    <PhoneFrame x={0} y={0} w={PHONE.w} h={PHONE.h} tab={0} cart>
                        <div className="relative h-full opacity-90">
                            <span className="absolute left-[0.5em] top-[0.35em]">
                                <span className={SECTION}>{p.schedule}</span>
                            </span>
                            <span className="absolute inset-x-[0.3em] top-[1.25em] flex justify-between">
                                {week.map((day, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            "flex w-[1.55em] flex-col items-center gap-[0.25em] rounded-[0.35em] py-[0.3em]",
                                            index === 4 ? "bg-ink text-canvas" : "text-ink-2",
                                        )}
                                    >
                                        <span className="text-[0.28em] font-semibold uppercase tracking-[0.06em]">{weekday.format(day).replace(".", "")}</span>
                                        <span className="text-[0.42em] font-semibold tabular-nums">{day.getDate()}</span>
                                    </span>
                                ))}
                            </span>
                            {[8, 9, 10, 11, 12, 13].map((hour, index) => (
                                <span key={hour} className="absolute inset-x-0 flex items-start gap-[0.4em] border-t border-hairline px-[0.4em] pt-[0.2em]" style={{ top: `${4 + index * 2.75}em` }}>
                                    <span className="text-[0.3em] tabular-nums text-ink-3">{String(hour).padStart(2, "0")}:00</span>
                                </span>
                            ))}
                            <At x={1.9} y={6.95} w={PHONE.w - 2.3} h={2.3}>
                                <Pop
                                    show={on(t, EVENT_AT)}
                                    from="scale"
                                    className="flex h-full flex-col justify-center gap-[0.3em] rounded-[0.35em] border-l-[0.15em] border-green-500 bg-green-50 px-[0.5em] dark:bg-green-500/15"
                                >
                                    <span className="truncate text-[0.34em] font-bold uppercase tracking-[0.08em] text-green-700 dark:text-green-400">{p.eventName}</span>
                                    <span className="text-[0.32em] tabular-nums text-green-700/80 dark:text-green-400/80">09:00 – 10:00</span>
                                </Pop>
                            </At>
                        </div>
                    </PhoneFrame>
                </Pop>
            </BackPhone>

            {/* In front: the app's home, and the day arriving on it. */}
            <Pop show={on(t, 0)} from="blur" className="absolute inset-0">
                <PhoneFrame
                    x={(40 - PHONE.w) / 2}
                    y={1}
                    w={PHONE.w}
                    h={PHONE.h}
                    overlay={
                        // Stacked the way the phone stacks them: the newest in front, the ones before
                        // it tucked behind, smaller and fainter.
                        <div className="relative">
                            {NOTIFICATIONS.map((note) => {
                                const index = arrived.indexOf(note);
                                return (
                                    <Notification
                                        key={note.key}
                                        icon={note.icon}
                                        tone={note.tone}
                                        title={p[note.key]}
                                        className="absolute inset-x-0 origin-bottom transition-[translate,opacity,scale] duration-700 ease-spring"
                                        style={{
                                            zIndex: 10 - Math.max(0, index),
                                            translate: index < 0 ? "0 -2.2em" : `0 ${index * 0.5}em`,
                                            scale: index < 0 ? "0.96" : `${1 - index * 0.06}`,
                                            opacity: index < 0 ? 0 : 1 - index * 0.25,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    }
                >
                    <PhoneHome welcome={ui.welcomeBack} sections={ui.appSections} tiles={ui.appTiles} screenWidth={PHONE.w} />
                </PhoneFrame>
            </Pop>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* chat · a conversation with a family                                                            */
/* ---------------------------------------------------------------------------------------------- */

const CHAT_PHONE = { x: 3, y: 1.2 };
const READ_CARD = { x: 17.6, y: 10.2, w: 12 };
const OUT_AT = 500;
const TYPING = { at: 1300, until: 2300 };
const IN_AT = 2300;
const READ_AT = 3000;
const SECOND_AT = 3600;

function Bubble({ mine, lines, time, read, show }: { mine: boolean; lines: number[]; time: string; read?: boolean; show: boolean }) {
    return (
        <Pop
            show={show}
            from={mine ? "down" : "up"}
            className={cn(
                "flex max-w-[78%] flex-col gap-[0.35em] rounded-[0.8em] px-[0.6em] py-[0.55em]",
                mine ? "self-end rounded-br-[0.25em] bg-violet-500 text-white" : "self-start rounded-bl-[0.25em] bg-surface elev-1 ring-1 ring-hairline",
            )}
        >
            {lines.map((w, index) => (
                <Line key={index} w={w} className={cn("h-[0.26em]", mine ? "bg-white/70" : "")} />
            ))}
            <span className={cn("flex items-center gap-[0.2em] self-end", mine ? "text-white/80" : "text-ink-3")}>
                <span className="text-[0.32em] tabular-nums">{time}</span>
                {mine && <CheckCheck className={cn("size-[0.5em] transition-colors duration-500", read ? "text-sky-200" : "")} />}
            </span>
        </Pop>
    );
}

function ChatScene({ t, labels }: Props) {
    const { p } = labels;
    const typing = t >= TYPING.at && t < TYPING.until;
    const read = on(t, READ_AT);

    return (
        <>
            <GlassOrbs
                orbs={[
                    { x: -2, y: 5, size: 14, color: "#a3e635" },
                    { x: 19, y: 3, size: 15, color: "#14b8a6" },
                    { x: 8, y: 15, size: 13, color: "#22c55e" },
                ]}
            />
            <PhoneFrame {...CHAT_PHONE} w={PHONE.w} h={PHONE.h} tab={3}>
                <div className="flex h-full flex-col">
                    <span className="flex items-center gap-[0.4em] border-b border-hairline px-[0.5em] pb-[0.5em] pt-[0.2em]">
                        <ChevronLeft className="size-[0.6em] text-ink-2" />
                        <Avatar initials="PB" hue={200} size={1.5} />
                        <span className="flex min-w-0 flex-col gap-[0.25em]">
                            <span className="truncate text-[0.38em] font-bold uppercase tracking-[0.06em]">Pol Brigneti</span>
                            <span className="w-fit rounded-full bg-green-100 px-[0.5em] py-[0.1em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                                <span className="text-[0.3em] font-semibold">{p.chatTag}</span>
                            </span>
                        </span>
                    </span>
                    <div className="flex flex-1 flex-col gap-[0.5em] bg-fill/50 px-[0.5em] py-[0.6em]">
                        <Bubble mine show={on(t, OUT_AT)} lines={[6.2, 6.8, 4.4]} time="16:36" read={read} />
                        <Pop
                            show={typing}
                            className={cn("flex w-fit items-center gap-[0.2em] self-start rounded-[0.8em] rounded-bl-[0.25em] bg-surface px-[0.6em] py-[0.55em] elev-1", !typing && "absolute")}
                        >
                            {[0, 1, 2].map((dot) => (
                                <span
                                    key={dot}
                                    className="size-[0.32em] rounded-full bg-ink-3"
                                    style={{ transform: `translateY(${Math.sin((t - TYPING.at) / 140 - dot * 0.9) * 0.12}em)` }}
                                />
                            ))}
                        </Pop>
                        <Bubble mine={false} show={on(t, IN_AT)} lines={[6.6, 7, 5.6, 3.2]} time="16:38" />
                        <Bubble mine={false} show={on(t, SECOND_AT)} lines={[4.2]} time="16:38" />
                    </div>
                    <span className="flex items-center gap-[0.35em] px-[0.5em] py-[0.45em]">
                        <span className="flex h-[1.3em] flex-1 items-center rounded-[0.45em] bg-fill px-[0.5em]">
                            <Line w={4.5} className="h-[0.22em]" />
                        </span>
                        <span className="flex size-[1.3em] items-center justify-center rounded-[0.45em] bg-fill">
                            <Send className="size-[0.55em] text-ink-2" />
                        </span>
                    </span>
                </div>
            </PhoneFrame>

            <At x={READ_CARD.x} y={READ_CARD.y} w={READ_CARD.w}>
                <Pop show={read} from="scale" className="flex items-center gap-[0.6em] rounded-[1.1em] p-[0.9em] ds-glass">
                    <span className="relative">
                        <Avatar initials="PB" hue={200} size={2} />
                        <Ripple p={span(t, READ_AT, 900)} className="text-brand" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-[0.35em]">
                        <span className="truncate text-[0.6em] font-semibold">Pol Brigneti</span>
                        <span className="flex items-center gap-[0.3em] text-sky-600 dark:text-sky-400">
                            <CheckCheck className="size-[0.6em]" />
                            <span className="text-[0.46em] font-medium">{p.read} · 16:37</span>
                        </span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* album · a class album                                                                          */
/* ---------------------------------------------------------------------------------------------- */

const ALBUM_PHONE = { x: 3, y: 1.2 };
const ALBUM_CARD = { x: 17.6, y: 8.8, w: 12 };
const PHOTOS = 12;
const PHOTO_AT = (index: number) => 400 + index * 110;
const OPEN = { index: 4, at: 2300, until: 3900 };
const LIKE_AT = 3000;

function AlbumScene({ t, labels }: Props) {
    const { p } = labels;
    const shown = Array.from({ length: PHOTOS }, (_, index) => on(t, PHOTO_AT(index))).filter(Boolean).length;
    const opened = t >= OPEN.at && t < OPEN.until;
    const liked = on(t, LIKE_AT);
    const tileW = (PHONE.w - 0.7 - 0.4) / 3;

    return (
        <>
            <GlassOrbs
                orbs={[
                    { x: -2, y: 4, size: 14, color: "#a3e635" },
                    { x: 19, y: 2, size: 15, color: "#14b8a6" },
                    { x: 9, y: 15, size: 13, color: "#22c55e" },
                ]}
            />
            <PhoneFrame {...ALBUM_PHONE} w={PHONE.w} h={PHONE.h} tab={1}>
                <div className="relative h-full">
                    <span className="absolute inset-x-[0.35em] top-[0.2em] flex items-center gap-[0.4em]">
                        <Avatar initials="H" hue={35} size={1.35} />
                        <span className="flex min-w-0 flex-col gap-[0.2em]">
                            <span className="truncate text-[0.42em] font-semibold">{p.albumName}</span>
                            <span className="text-[0.32em] tabular-nums text-ink-3">
                                {shown} {p.photos}
                            </span>
                        </span>
                    </span>
                    {Array.from({ length: PHOTOS }, (_, index) => (
                        <At key={index} x={0.35 + (index % 3) * (tileW + 0.2)} y={2.1 + Math.floor(index / 3) * (tileW + 0.2)} w={tileW} h={tileW}>
                            <Pop show={on(t, PHOTO_AT(index))} from="scale" className="size-full">
                                <span className="relative block size-full">
                                    <Photo hue={(index * 37 + 90) % 360} kind={index % 3 === 1 ? "face" : "scene"} className="size-full rounded-[0.3em]" />
                                    {index === OPEN.index && (
                                        <Heart
                                            className={cn(
                                                "absolute bottom-[0.25em] right-[0.25em] size-[0.6em] fill-white text-white drop-shadow transition-[opacity,scale] duration-500 ease-spring-bounce",
                                                on(t, OPEN.until) ? "scale-100 opacity-100" : "scale-0 opacity-0",
                                            )}
                                        />
                                    )}
                                </span>
                            </Pop>
                        </At>
                    ))}
                    {/* One photo opened over the album. */}
                    <div
                        className={cn(
                            "absolute inset-0 z-20 flex flex-col bg-black/85 transition-[opacity,scale] duration-500 ease-spring",
                            opened ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0",
                        )}
                    >
                        <Photo hue={(OPEN.index * 37 + 90) % 360} kind="scene" className="mt-[2.5em] aspect-square w-full" />
                        <span className="flex items-center gap-[0.4em] px-[0.6em] pt-[0.7em]">
                            <span className="relative">
                                <Heart
                                    className={cn(
                                        "size-[0.9em] transition-[color,scale,fill] duration-500 ease-spring-bounce",
                                        liked ? "scale-110 fill-sys-pink text-sys-pink" : "text-white",
                                    )}
                                />
                                <Ripple p={span(t, LIKE_AT, 800)} className="text-sys-pink" />
                            </span>
                            <span className="text-[0.4em] tabular-nums text-white/80">{liked ? 24 : 23}</span>
                        </span>
                    </div>
                </div>
            </PhoneFrame>

            <At x={ALBUM_CARD.x} y={ALBUM_CARD.y} w={ALBUM_CARD.w}>
                <Pop show={on(t, 1300)} from="scale" className="flex flex-col gap-[0.7em] rounded-[1.1em] p-[0.9em] ds-glass">
                    <span className="flex items-center gap-[0.5em]">
                        <Glyph icon={ImageIcon} tone="pink" size={1.7} />
                        <span className="flex min-w-0 flex-col gap-[0.3em]">
                            <span className="truncate text-[0.56em] font-semibold">{p.albumName}</span>
                            <span className="text-[0.44em] tabular-nums text-ink-2">
                                {Math.round(PHOTOS * easeOut(span(t, 1300, 1400)))} {p.photos}
                            </span>
                        </span>
                    </span>
                    <span className="flex items-center border-t border-hairline pt-[0.6em]">
                        {[210, 25, 140, 300].map((hue, index) => (
                            <Pop key={hue} show={on(t, 1800 + index * 120)} from="scale" className={cn(index > 0 && "-ml-[0.45em]")}>
                                <Avatar initials={["MG", "JP", "AL", "SR"][index]} hue={hue} size={1.4} className="ring-2 ring-surface" />
                            </Pop>
                        ))}
                        <span className="ml-[0.5em] text-[0.44em] tabular-nums text-ink-2">+21</span>
                        <Heart className={cn("ml-auto size-[0.75em] transition-[color,fill] duration-500", liked ? "fill-sys-pink text-sys-pink" : "text-ink-3")} />
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const { Scene: UpdatesScene, duration: UPDATES_DURATION } = KEY_FEATURE_SCENES[5];

const SCENES = {
    trio: { Scene: TrioScene, duration: 4400, board: { cols: 40, rows: 27 }, k: 0.6 },
    chat: { Scene: ChatScene, duration: 4600, board: { cols: 32, rows: 26 }, k: 0.72 },
    album: { Scene: AlbumScene, duration: 4400, board: { cols: 32, rows: 26 }, k: 0.72 },
    updates: { Scene: UpdatesScene, duration: UPDATES_DURATION },
} satisfies Record<string, SceneSpec<ProductSceneLabels>>;

export type AppSceneKey = keyof typeof SCENES;

/** The app page's scenes, one island each: `scene` picks which. */
export default function AppScenes({ scene, labels, locale, max }: { scene: AppSceneKey; labels: ProductSceneLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
