import type { ReactNode } from "react";
import { CheckCheck, ChevronLeft, Heart, ImagePlus, Send } from "lucide-react";

import appStoreIcon from "@/assets/img/logos/apple-small.png";
import playStoreIcon from "@/assets/img/logos/google-small.png";
import { AppIcon, PhoneFrame, PhoneHome, PhoneNotification } from "@/components/wizard/app-frame";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import {
    At,
    Avatar,
    Line,
    Pop,
    easeInOut,
    easeOut,
    number,
    on,
    percent,
    span,
} from "@/components/wizard/scene-kit";
import { KEY_FEATURE_SCENES, Ripple } from "@/modules/home/KeyFeaturesScenes";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    DUO,
    DUO_PANE_LEFT,
    DUO_PHONE_RIGHT,
    Fresh,
    Lights,
    ORBS,
    Pane,
    Photo,
    TRIO,
    TRIO_PHONE,
    TrioFloat,
    TrioStage,
    between,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

/*
 * The families' app page's scenes, drawn from `screenshots/app/*` in the home's abstract style,
 * on phones of glass:
 *
 *   trio     (hero) three phones in depth — the students, the home, the timetable — the day's
 *            notifications floating out between them and today's class out of the timetable
 *   chat     the school writes from the web; the family reads it on the phone and answers; the
 *            school sees it read and answered
 *   album    the school uploads a trip's photos and publishes them; the family gets them and
 *            likes one; the school sees the like
 *   updates  a post written on the desktop lands on a family's phone (the home's app scene)
 *   stores   Edena on the App Store and on Google Play, side by side: got, downloaded, open
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: ProductSceneLabels;
    locale: string;
}

const SECTION = "block truncate text-[0.36em] font-bold uppercase tracking-[0.1em]";

/* ---------------------------------------------------------------------------------------------- */
/* trio · three phones                                                                            */
/* ---------------------------------------------------------------------------------------------- */

const STUDENTS = [
    "Gerard",
    "Sofía",
    "Emma",
    "Lucas",
    "Hugo",
    "Mateo",
    "Lucía",
    "Leo",
    "Daniel",
    "Juan",
    "María",
    "Miguel",
];
const NOTIFICATIONS: { at: number; key: "notifPhotos" | "notifMessage" | "newInvoice" }[] = [
    { at: 900, key: "notifPhotos" },
    { at: 1900, key: "notifMessage" },
    { at: 2900, key: "newInvoice" },
];
const EVENT_AT = 1600;
const P = TRIO_PHONE;

function TrioScene({ t, labels, locale }: Props) {
    const { ui, p } = labels;
    const arrived = NOTIFICATIONS.filter((note) => on(t, note.at)).reverse();
    const week = Array.from({ length: 7 }, (_, index) => new Date(2026, 5, 8 + index));
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const today = week[4];

    return (
        <>
            <Lights
                orbs={[
                    { x: 2, y: 4, size: 16, color: "#a3e635" },
                    { x: 13, y: 12, size: 18, color: "#22c55e" },
                    { x: 25, y: 1, size: 16, color: "#14b8a6" },
                ]}
            />

            <TrioStage
                shown={{ left: on(t, 150), right: on(t, 250), front: on(t, 0) }}
                left={
                    // The students, photo by photo.
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} tab={1}>
                        <div className="relative h-full px-[0.35em]">
                            <span className="absolute left-[0.35em] top-[0.3em]">
                                <span className={SECTION}>{p.students}</span>
                            </span>
                            <span className="absolute inset-x-[0.35em] top-[1.1em] flex h-[1.15em] items-center rounded-[0.4em] bg-fill px-[0.5em]">
                                <Line w={5} className="h-[0.22em]" />
                            </span>
                            {STUDENTS.map((name, index) => {
                                const w = (P.w - 0.7 - 0.5) / 3;
                                return (
                                    <At
                                        key={name}
                                        x={0.35 + (index % 3) * (w + 0.25)}
                                        y={2.65 + Math.floor(index / 3) * 4.25}
                                        w={w}
                                        h={4}
                                    >
                                        <Pop
                                            show={on(t, 400 + index * 70)}
                                            from="scale"
                                            className="relative size-full"
                                        >
                                            <Photo
                                                hue={(index * 47) % 360}
                                                className="size-full rounded-[0.35em]"
                                            />
                                            <span className="absolute inset-x-[0.25em] bottom-[0.25em] flex h-[0.85em] items-center justify-center rounded-[0.2em] bg-white/90">
                                                <span className="truncate text-[0.32em] font-medium text-neutral-900">
                                                    {name}
                                                </span>
                                            </span>
                                        </Pop>
                                    </At>
                                );
                            })}
                        </div>
                    </PhoneFrame>
                }
                right={
                    // A child's week: today picked, the morning's hours.
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} tab={0} cart>
                        <div className="relative h-full">
                            <span className="absolute left-[0.5em] top-[0.35em]">
                                <span className={SECTION}>{p.schedule}</span>
                            </span>
                            <span className="absolute inset-x-[0.3em] top-[1.25em] flex justify-between">
                                {week.map((day, index) => (
                                    <span
                                        key={index}
                                        className={cn(
                                            "flex w-[1.6em] flex-col items-center gap-[0.25em] rounded-[0.35em] py-[0.3em]",
                                            index === 4 ? "bg-ink text-canvas" : "text-ink-2",
                                        )}
                                    >
                                        <span className="text-[0.28em] font-semibold uppercase tracking-[0.06em]">
                                            {weekday.format(day).replace(".", "")}
                                        </span>
                                        <span className="text-[0.42em] font-semibold tabular-nums">
                                            {day.getDate()}
                                        </span>
                                    </span>
                                ))}
                            </span>
                            {[8, 9, 10, 11, 12, 13].map((hour, index) => (
                                <span
                                    key={hour}
                                    className="absolute inset-x-0 flex items-start gap-[0.4em] border-t border-hairline px-[0.4em] pt-[0.2em]"
                                    style={{ top: `${4 + index * 2.75}em` }}
                                >
                                    <span className="text-[0.3em] tabular-nums text-ink-3">
                                        {String(hour).padStart(2, "0")}:00
                                    </span>
                                </span>
                            ))}
                            <At x={1.9} y={6.95} w={P.w - 2.3} h={2.3}>
                                <Pop
                                    show={on(t, EVENT_AT - 300)}
                                    from="scale"
                                    className="flex h-full flex-col justify-center gap-[0.3em] rounded-[0.35em] border-l-[0.15em] border-green-500 bg-green-50 px-[0.5em] dark:bg-green-500/15"
                                >
                                    <span className="truncate text-[0.34em] font-bold uppercase tracking-[0.08em] text-green-700 dark:text-green-400">
                                        {p.eventName}
                                    </span>
                                    <span className="text-[0.32em] tabular-nums text-green-700/80 dark:text-green-400/80">
                                        09:00 – 10:00
                                    </span>
                                </Pop>
                            </At>
                        </div>
                    </PhoneFrame>
                }
                front={
                    <PhoneFrame x={0} y={0} w={P.w} h={P.h} className="trio-front">
                        <PhoneHome
                            welcome={ui.welcomeBack}
                            sections={ui.appSections}
                            tiles={ui.appTiles}
                            screenWidth={P.w}
                        />
                    </PhoneFrame>
                }
            >
                {/* The day's notifications, out of the phone and between the phones: the newest in
                    front, the ones before it tucked behind, smaller and fainter. */}
                <TrioFloat wide={{ x: 3, y: 5 }} narrow={{ x: 0.3, y: 3.5 }} w={13.6} nw={12.8}>
                    <div className="relative">
                        {NOTIFICATIONS.map((note) => {
                            const index = arrived.indexOf(note);
                            return (
                                <PhoneNotification
                                    key={note.key}
                                    title={p[note.key]}
                                    className={cn(
                                        "absolute inset-x-0 top-0 origin-bottom transition-[translate,opacity,scale] duration-700 ease-spring [&>*]:transition-opacity [&>*]:duration-300",
                                        // Tucked behind, only its edge shows: its face would read through the frost.
                                        index > 0 && "[&>*]:opacity-0",
                                    )}
                                    style={{
                                        zIndex: 10 - Math.max(0, index),
                                        translate: index < 0 ? "0 -1.6em" : `0 ${index * 0.55}em`,
                                        scale: index < 0 ? "0.96" : `${1 - index * 0.06}`,
                                        opacity: index < 0 ? 0 : 1 - index * 0.25,
                                    }}
                                />
                            );
                        })}
                    </div>
                </TrioFloat>

                {/* Today's class, out of the timetable: a widget on the screen's edge. */}
                <TrioFloat
                    wide={{ x: 23.2, y: 13.4 }}
                    narrow={{ x: 4.4, y: 15.6 }}
                    w={11.6}
                    nw={11.3}
                >
                    <Pop show={on(t, EVENT_AT)} from="scale">
                        <span className="flex items-center gap-[0.6em] rounded-[1em] p-[0.6em] material-thick elev-3 ring-1 ring-hairline">
                            <span className="flex size-[2.3em] shrink-0 flex-col items-center justify-center rounded-[0.6em] bg-green-500 text-white">
                                <span className="text-[0.32em] font-bold uppercase leading-none tracking-[0.08em]">
                                    {weekday.format(today).replace(".", "")}
                                </span>
                                <span className="mt-[0.15em] text-[0.62em] font-bold leading-none tabular-nums">
                                    {today.getDate()}
                                </span>
                            </span>
                            <span className="flex min-w-0 flex-col gap-[0.3em]">
                                <span className="truncate text-[0.3em] font-semibold uppercase leading-none tracking-[0.1em] text-ink-3">
                                    {p.schedule}
                                </span>
                                <span className="truncate text-[0.46em] font-bold uppercase leading-tight tracking-[0.04em]">
                                    {p.eventName}
                                </span>
                                <span className="text-[0.38em] tabular-nums leading-none text-ink-2">
                                    09:00 – 10:00
                                </span>
                            </span>
                        </span>
                    </Pop>
                </TrioFloat>
            </TrioStage>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* chat · the school writes, the family answers                                                   */
/* ---------------------------------------------------------------------------------------------- */

/** A message: skeleton lines in a bubble. `mine` is the side of whoever is looking. */
function Bubble({
    mine,
    lines,
    time,
    children,
}: {
    mine: boolean;
    lines: number[];
    time: string;
    children?: ReactNode;
}) {
    return (
        <span
            className={cn(
                "flex max-w-[82%] flex-col gap-[0.35em] rounded-[0.8em] px-[0.6em] py-[0.55em]",
                mine
                    ? "self-end rounded-br-[0.25em] bg-violet-500 text-white"
                    : "self-start rounded-bl-[0.25em] bg-surface elev-1 ring-1 ring-hairline",
            )}
        >
            {lines.map((w, index) => (
                <Line key={index} w={w} className={cn("h-[0.26em]", mine ? "bg-white/70" : "")} />
            ))}
            <span
                className={cn(
                    "flex items-center gap-[0.25em] self-end",
                    mine ? "text-white/80" : "text-ink-3",
                )}
            >
                <span className="text-[0.32em] tabular-nums">{time}</span>
                {children}
            </span>
        </span>
    );
}

/** A message being written: its lines grow as `p` goes from 0 to 1. */
function Draft({ p, lines }: { p: number; lines: number[] }) {
    const total = lines.reduce((sum, w) => sum + w, 0);
    let left = p * total;
    return (
        <span className="flex flex-col gap-[0.3em]">
            {lines.map((w, index) => {
                const shown = Math.max(0, Math.min(w, left));
                left -= w;
                return <Line key={index} w={shown} className="h-[0.24em]" />;
            })}
        </span>
    );
}

const OUT = [7.4, 8.2, 5.2];
const REPLY = [6.6, 7.2, 4];
const CHAT = {
    write: 300,
    send: 1150,
    notify: 1550,
    open: 2250,
    read: 2450,
    reply: 2700,
    replied: 3550,
    seen: 3850,
};

function ChatScene({ t, labels }: Props) {
    const { p } = labels;
    const writing = span(t, CHAT.write, CHAT.send - CHAT.write - 150);
    const replying = span(t, CHAT.reply, CHAT.replied - CHAT.reply - 150);
    const read = on(t, CHAT.read);

    return (
        <>
            <Lights />

            {/* The school, on the web. */}
            <Pane box={DUO_PANE_LEFT} clear="right">
                <span className="flex items-center gap-[0.5em]">
                    <Avatar initials="PB" hue={200} size={1.7} />
                    <span className="flex min-w-0 flex-col gap-[0.3em]">
                        <span className="truncate text-[0.56em] font-semibold">Pol Brigneti</span>
                        <span className="flex w-fit items-center rounded-full bg-green-100 px-[0.5em] py-[0.18em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                            <span className="text-[0.36em] font-semibold leading-tight">
                                {p.chatTag}
                            </span>
                        </span>
                    </span>
                </span>
                <span className="flex h-[10.4em] flex-col gap-[0.5em] rounded-[0.8em] bg-fill/60 p-[0.6em]">
                    <Pop show={on(t, CHAT.send)} from="down" className="flex flex-col">
                        <Bubble mine lines={OUT} time="16:36">
                            <CheckCheck
                                className={cn(
                                    "size-[0.55em] transition-colors duration-500",
                                    read ? "text-sky-200" : "",
                                )}
                            />
                        </Bubble>
                    </Pop>
                    <Pop show={read} className="-mt-[0.25em] self-end">
                        <span className="text-[0.34em] font-medium text-sky-600 dark:text-sky-400">
                            {p.read} | 16:37
                        </span>
                    </Pop>
                    <Pop show={on(t, CHAT.seen)} className="relative flex flex-col">
                        <Bubble mine={false} lines={REPLY} time="16:38" />
                        <Fresh t={t} at={CHAT.seen} className="rounded-[0.8em]" />
                    </Pop>
                </span>
                <span className="flex items-center gap-[0.4em]">
                    <span className="flex min-h-[1.6em] flex-1 items-center rounded-[0.55em] bg-fill px-[0.6em] py-[0.35em]">
                        {on(t, CHAT.send) ? (
                            <Line w={4.4} className="h-[0.24em] opacity-50" />
                        ) : (
                            <Draft p={writing} lines={OUT.map((w) => w * 0.9)} />
                        )}
                    </span>
                    <span
                        className={cn(
                            "flex size-[1.6em] items-center justify-center rounded-[0.55em] bg-violet-500 text-white transition-[scale] duration-200",
                            between(t, CHAT.send - 180, CHAT.send) && "scale-90",
                        )}
                    >
                        <Send className="size-[0.7em]" />
                    </span>
                </span>
            </Pane>

            {/* The family, on the phone. */}
            <At {...DUO_PHONE_RIGHT}>
                <Pop show={on(t, 120)} from="up" className="size-full">
                    <PhoneFrame
                        x={0}
                        y={0}
                        w={DUO_PHONE_RIGHT.w}
                        h={DUO_PHONE_RIGHT.h}
                        tab={3}
                        overlay={
                            <Pop show={between(t, CHAT.notify, CHAT.open)} from="down">
                                <PhoneNotification title="María Torres" />
                            </Pop>
                        }
                    >
                        <div className="flex h-full flex-col">
                            <span className="flex items-center gap-[0.4em] border-b border-hairline px-[0.5em] pb-[0.5em] pt-[0.2em]">
                                <ChevronLeft className="size-[0.6em] text-ink-2" />
                                <Avatar initials="LT" hue={330} size={1.5} />
                                <span className="flex min-w-0 flex-col gap-[0.25em]">
                                    <span className="truncate text-[0.42em] font-semibold">
                                        María Torres
                                    </span>
                                    <span className="truncate text-[0.34em] text-ink-3">I-3 A</span>
                                </span>
                            </span>
                            <div className="flex flex-1 flex-col gap-[0.5em] bg-fill/50 px-[0.5em] py-[0.6em]">
                                <Pop show={on(t, CHAT.open)} from="up" className="flex flex-col">
                                    <Bubble
                                        mine={false}
                                        lines={OUT.map((w) => w * 0.85)}
                                        time="16:36"
                                    />
                                </Pop>
                                <Pop
                                    show={on(t, CHAT.replied)}
                                    from="down"
                                    className="flex flex-col"
                                >
                                    <Bubble mine lines={REPLY.map((w) => w * 0.85)} time="16:38">
                                        <CheckCheck className="size-[0.55em]" />
                                    </Bubble>
                                </Pop>
                            </div>
                            <span className="flex items-center gap-[0.35em] px-[0.5em] py-[0.45em]">
                                <span className="flex min-h-[1.3em] flex-1 items-center rounded-[0.45em] bg-fill px-[0.5em] py-[0.3em]">
                                    {on(t, CHAT.replied) || !on(t, CHAT.reply) ? (
                                        <Line w={3.6} className="h-[0.22em] opacity-50" />
                                    ) : (
                                        <Draft p={replying} lines={REPLY.map((w) => w * 0.7)} />
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "flex size-[1.3em] items-center justify-center rounded-[0.45em] bg-fill transition-[scale] duration-200",
                                        between(t, CHAT.replied - 180, CHAT.replied) && "scale-90",
                                    )}
                                >
                                    <Send className="size-[0.55em] text-ink-2" />
                                </span>
                            </span>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* album · the school publishes, the family likes                                                 */
/* ---------------------------------------------------------------------------------------------- */

const UPLOADS = 6;
const UPLOAD_AT = (index: number) => 300 + index * 210;
const UPLOAD_MS = 520;
const ALBUM = { publish: 1950, published: 2250, notify: 2500, open: 3150, like: 3900, liked: 4200 };
const hueOf = (index: number) => (index * 47 + 90) % 360;

function AlbumScene({ t, labels }: Props) {
    const { p } = labels;
    const uploaded = Array.from({ length: UPLOADS }, (_, index) =>
        on(t, UPLOAD_AT(index) + UPLOAD_MS),
    ).filter(Boolean).length;
    const tileW = (DUO_PHONE_RIGHT.w - 0.7 - 0.4) / 3;

    return (
        <>
            <Lights orbs={ORBS.warm} />

            {/* The school uploads the trip's photos and publishes them. */}
            <Pane box={DUO_PANE_LEFT} clear="right">
                <span className="flex items-center justify-between gap-[0.6em]">
                    <span className="flex min-w-0 flex-col gap-[0.3em]">
                        <span className="truncate text-[0.6em] font-semibold">{p.albumName}</span>
                        <span className="text-[0.4em] tabular-nums text-ink-3">
                            {uploaded} {p.photos}
                        </span>
                    </span>
                    <span className="w-[5.6em] shrink-0">
                        <ActionButton
                            t={t}
                            press={ALBUM.publish - 200}
                            done={ALBUM.published}
                            label={p.publish}
                            doneLabel={p.published}
                        />
                    </span>
                </span>
                <span className="grid grid-cols-3 gap-[0.4em]">
                    {Array.from({ length: UPLOADS }, (_, index) => {
                        const progress = span(t, UPLOAD_AT(index), UPLOAD_MS);
                        return (
                            <span
                                key={index}
                                className="relative aspect-square overflow-hidden rounded-[0.55em] border border-dashed border-hairline-strong bg-fill/60"
                            >
                                <ImagePlus
                                    className={cn(
                                        "absolute left-1/2 top-1/2 size-[0.9em] -translate-x-1/2 -translate-y-1/2 text-ink-3 transition-opacity duration-300",
                                        progress > 0 && "opacity-0",
                                    )}
                                />
                                <Photo
                                    hue={hueOf(index)}
                                    kind={index % 3 === 1 ? "face" : "scene"}
                                    className="absolute inset-0 transition-[opacity,scale] duration-500"
                                    style={{
                                        opacity: easeOut(progress),
                                        scale: `${0.94 + 0.06 * easeOut(progress)}`,
                                    }}
                                />
                                {progress > 0 && progress < 1 && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="absolute left-1/2 top-1/2 size-[1.4em] -translate-x-1/2 -translate-y-1/2 -rotate-90"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            fill="none"
                                            stroke="white"
                                            strokeOpacity="0.45"
                                            strokeWidth="3"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            pathLength={100}
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - progress * 100}
                                        />
                                    </svg>
                                )}
                            </span>
                        );
                    })}
                </span>
                <Pop
                    show={on(t, ALBUM.liked)}
                    className="relative flex items-center gap-[0.45em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]"
                >
                    <Fresh t={t} at={ALBUM.liked} className="rounded-[0.6em]" />
                    <Avatar initials="MG" hue={330} size={1.2} />
                    <span className="truncate text-[0.44em] text-ink-2">
                        <b className="font-semibold text-ink">María García</b>
                    </span>
                    <Heart className="ml-auto size-[0.7em] fill-sys-pink text-sys-pink" />
                </Pop>
            </Pane>

            {/* The family gets them. */}
            <At {...DUO_PHONE_RIGHT}>
                <Pop show={on(t, 120)} from="up" className="size-full">
                    <PhoneFrame
                        x={0}
                        y={0}
                        w={DUO_PHONE_RIGHT.w}
                        h={DUO_PHONE_RIGHT.h}
                        tab={1}
                        overlay={
                            <Pop show={between(t, ALBUM.notify, ALBUM.open)} from="down">
                                <PhoneNotification title={p.notifPhotos} body={p.albumName} />
                            </Pop>
                        }
                    >
                        <div
                            className={cn(
                                "relative h-full transition-opacity duration-500",
                                on(t, ALBUM.open) ? "opacity-100" : "opacity-0",
                            )}
                        >
                            <span className="absolute inset-x-[0.35em] top-[0.2em] flex items-center gap-[0.4em]">
                                <Avatar initials="LT" hue={330} size={1.35} />
                                <span className="flex min-w-0 flex-col gap-[0.2em]">
                                    <span className="truncate text-[0.42em] font-semibold">
                                        {p.albumName}
                                    </span>
                                    <span className="text-[0.32em] tabular-nums text-ink-3">
                                        {UPLOADS} {p.photos}
                                    </span>
                                </span>
                            </span>
                            {Array.from({ length: UPLOADS }, (_, index) => (
                                <At
                                    key={index}
                                    x={0.35 + (index % 3) * (tileW + 0.2)}
                                    y={2.1 + Math.floor(index / 3) * (tileW + 0.2)}
                                    w={tileW}
                                    h={tileW}
                                >
                                    <Pop
                                        show={on(t, ALBUM.open + index * 70)}
                                        from="scale"
                                        className="relative size-full"
                                    >
                                        <Photo
                                            hue={hueOf(index)}
                                            kind={index % 3 === 1 ? "face" : "scene"}
                                            className="size-full rounded-[0.3em]"
                                        />
                                    </Pop>
                                </At>
                            ))}
                            <span
                                className="absolute inset-x-[0.35em] flex items-center gap-[0.45em]"
                                style={{ top: `${2.4 + 2 * (tileW + 0.2)}em` }}
                            >
                                <span className="relative">
                                    <Heart
                                        className={cn(
                                            "size-[0.85em] transition-[color,scale,fill] duration-500 ease-spring-bounce",
                                            on(t, ALBUM.like)
                                                ? "scale-110 fill-sys-pink text-sys-pink"
                                                : "text-ink-2",
                                        )}
                                    />
                                    <Ripple
                                        p={span(t, ALBUM.like, 800)}
                                        className="text-sys-pink"
                                    />
                                </span>
                                <Line w={3.4} className="h-[0.22em]" />
                            </span>
                        </div>
                    </PhoneFrame>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* stores · on the App Store and on Google Play                                                   */
/* ---------------------------------------------------------------------------------------------- */

const srcOf = (image: string | { src: string }) => (typeof image === "string" ? image : image.src);
/** Both phones the same size, at the same height; their sections line up across them. */
const STORE_PHONE = { y: 1.2, w: 12.8, h: 25.4 };
const STORE_X = { ios: 2.3, android: 16.9 };
/** Each store's own gesture: the App Store's pill turns into a ring that fills; Google Play's
    button into a bar. They start half a second apart, so the eye goes from one to the other. */
const IOS = { press: 900, from: 1100, to: 2500 };
const ANDROID = { press: 1400, from: 1600, to: 3000 };
const TILE_COLORS = ["#6366f1", "#0ea5e9", "#22c55e", "#fb923c", "#14b8a6", "#3b82f6"];
const ROW = { header: "h-[1.2em]", app: "h-[3.4em]", info: "h-[3em]", shots: "h-[7.6em]" };

/** A store's screenshot of the app, in miniature: its home, a conversation, an album. */
function MiniScreen({ kind }: { kind: number }) {
    return (
        <span className="flex h-full flex-col gap-[0.2em] overflow-hidden rounded-[0.45em] bg-surface p-[0.3em] elev-1 ring-1 ring-hairline">
            <span className="mx-auto mb-[0.1em] h-[0.18em] w-[40%] rounded-full bg-fill-2" />
            {kind === 0 && (
                <span className="grid flex-1 grid-cols-2 gap-[0.15em]">
                    {TILE_COLORS.map((color) => (
                        <span
                            key={color}
                            className="rounded-[0.15em]"
                            style={{ background: color }}
                        />
                    ))}
                </span>
            )}
            {kind === 1 && (
                <span className="flex flex-1 flex-col gap-[0.2em] pt-[0.2em]">
                    <span className="h-[0.7em] w-[70%] self-end rounded-[0.25em] bg-violet-500" />
                    <span className="h-[0.9em] w-[75%] rounded-[0.25em] bg-fill-2" />
                    <span className="h-[0.5em] w-[50%] self-end rounded-[0.25em] bg-violet-500" />
                    <span className="h-[0.7em] w-[60%] rounded-[0.25em] bg-fill-2" />
                </span>
            )}
            {kind === 2 && (
                <span className="grid flex-1 grid-cols-2 gap-[0.15em]">
                    {[200, 30, 140, 320, 90, 260].map((hue) => (
                        <span
                            key={hue}
                            className="rounded-[0.15em]"
                            style={{
                                background: `linear-gradient(150deg, hsl(${hue} 80% 82%), hsl(${hue + 30} 70% 64%))`,
                            }}
                        />
                    ))}
                </span>
            )}
        </span>
    );
}

/** A store's listing: its header, the app, a row of its own (`info`), the screenshots, prose. */
function Listing({
    x,
    t,
    at,
    store,
    icon,
    info,
    shots,
}: {
    x: number;
    t: number;
    at: number;
    store: string;
    icon: ReactNode;
    info: ReactNode;
    shots: number[];
}) {
    return (
        <At x={x} y={STORE_PHONE.y} w={STORE_PHONE.w} h={STORE_PHONE.h}>
            <Pop show={on(t, at)} from="up" className="size-full">
                <div
                    className="ds-glass flex size-full flex-col gap-[0.85em] overflow-hidden px-[0.85em] pt-[0.85em]"
                    style={{ ["--glass-radius" as string]: "1.9em" }}
                >
                    <span className={cn("flex items-center gap-[0.4em]", ROW.header)}>
                        {icon}
                        <span className="text-[0.5em] font-semibold">{store}</span>
                    </span>
                    {info}
                    <span className={cn("grid grid-cols-3 gap-[0.4em]", ROW.shots)}>
                        {shots.map((kind, index) => (
                            <Pop
                                key={kind}
                                show={on(t, at + 300 + index * 110)}
                                from="up"
                                className="h-full"
                            >
                                <MiniScreen kind={kind} />
                            </Pop>
                        ))}
                    </span>
                    <span className="flex flex-col gap-[0.4em]">
                        <Line w={10} className="h-[0.26em]" />
                        <Line w={8.4} className="h-[0.26em]" />
                    </span>
                </div>
            </Pop>
        </At>
    );
}

function StoresScene({ t, labels, locale }: Props) {
    const { p } = labels;
    const ios = {
        pressed: between(t, IOS.press, IOS.from),
        loading: between(t, IOS.from, IOS.to),
        done: on(t, IOS.to),
        p: easeInOut(span(t, IOS.from, IOS.to - IOS.from)),
    };
    const android = {
        pressed: between(t, ANDROID.press, ANDROID.from),
        loading: between(t, ANDROID.from, ANDROID.to),
        done: on(t, ANDROID.to),
        p: easeInOut(span(t, ANDROID.from, ANDROID.to - ANDROID.from)),
    };
    // The listings show only what the stores really say about Edena: free, rated 4+, Education.
    // No star rating or chart position: the stores publish none for it yet.
    const price = <span className="truncate text-[0.42em] text-ink-3">{p.free}</span>;

    return (
        <>
            <Lights orbs={ORBS.sky} />

            <Listing
                x={STORE_X.ios}
                t={t}
                at={0}
                store="App Store"
                icon={
                    <img
                        src={srcOf(appStoreIcon)}
                        alt=""
                        className="size-[1.15em] rounded-[0.28em]"
                    />
                }
                shots={[0, 1, 2]}
                info={
                    <>
                        <span className={cn("flex items-center gap-[0.6em]", ROW.app)}>
                            <span className="relative">
                                <AppIcon size={3.3} />
                                <Ripple
                                    p={span(t, IOS.to, 900)}
                                    className="rounded-[0.74em] text-sky-500"
                                />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
                                <span className="text-[0.8em] font-semibold tracking-[-0.01em]">
                                    Edena
                                </span>
                                <span className="truncate text-[0.42em] text-ink-2">
                                    {p.category}
                                </span>
                                {/* Get → a ring that fills → Open. */}
                                <span className="mt-[0.1em] grid h-[1.35em] w-[3.6em] place-items-start">
                                    <span
                                        className={cn(
                                            "[grid-area:1/1] grid h-full place-items-center rounded-full bg-sky-500 text-white transition-[width,opacity,scale] duration-300 ease-spring",
                                            ios.loading
                                                ? "w-[1.35em] opacity-0"
                                                : "w-full opacity-100",
                                            ios.pressed && "scale-90",
                                        )}
                                    >
                                        <span className="text-[0.5em] font-semibold">
                                            {ios.done ? p.open : p.get}
                                        </span>
                                    </span>
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={cn(
                                            "[grid-area:1/1] size-[1.35em] -rotate-90 transition-opacity duration-300",
                                            ios.loading ? "opacity-100" : "opacity-0",
                                        )}
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            fill="none"
                                            stroke="var(--ds-fill-2)"
                                            strokeWidth="2.4"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            fill="none"
                                            stroke="#0ea5e9"
                                            strokeWidth="2.4"
                                            strokeLinecap="round"
                                            pathLength={100}
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - ios.p * 100}
                                        />
                                        <rect
                                            x="9"
                                            y="9"
                                            width="6"
                                            height="6"
                                            rx="1.2"
                                            fill="#0ea5e9"
                                        />
                                    </svg>
                                </span>
                            </span>
                        </span>
                        {/* The App Store's strip: age and category. */}
                        <span
                            className={cn(
                                "grid grid-cols-2 items-center border-y border-hairline",
                                ROW.info,
                            )}
                        >
                            {[
                                [
                                    "4+",
                                    <span key="age" className="text-[0.36em] text-ink-3">
                                        {p.age}
                                    </span>,
                                ],
                                [
                                    p.category,
                                    <span key="price" className="text-[0.36em] text-ink-3">
                                        {p.free}
                                    </span>,
                                ],
                            ].map(([value, sub], index) => (
                                <span
                                    key={index}
                                    className={cn(
                                        "flex min-w-0 flex-col items-center gap-[0.3em]",
                                        index > 0 && "border-l border-hairline",
                                    )}
                                >
                                    <span className="max-w-full truncate text-[0.52em] font-semibold tabular-nums">
                                        {value}
                                    </span>
                                    {sub}
                                </span>
                            ))}
                        </span>
                    </>
                }
            />

            <Listing
                x={STORE_X.android}
                t={t}
                at={150}
                store="Google Play"
                icon={<img src={srcOf(playStoreIcon)} alt="" className="size-[1.15em]" />}
                shots={[2, 0, 1]}
                info={
                    <>
                        <span className={cn("flex items-center gap-[0.6em]", ROW.app)}>
                            <span className="relative">
                                <AppIcon size={3.3} />
                                <Ripple
                                    p={span(t, ANDROID.to, 900)}
                                    className="rounded-[0.74em] text-green-500"
                                />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-[0.3em]">
                                <span className="text-[0.8em] font-semibold tracking-[-0.01em]">
                                    Edena
                                </span>
                                <span className="truncate text-[0.42em] font-medium text-green-700 dark:text-green-400">
                                    Edena Organization
                                </span>
                                {price}
                            </span>
                        </span>
                        {/* Install → a bar that fills → Open. */}
                        <span className={cn("grid items-center", ROW.info)}>
                            <span
                                className={cn(
                                    "[grid-area:1/1] grid h-[1.7em] place-items-center rounded-full bg-green-700 text-white transition-[opacity,scale] duration-300 ease-spring dark:bg-green-600",
                                    android.loading ? "opacity-0" : "opacity-100",
                                    android.pressed && "scale-[0.97]",
                                )}
                            >
                                <span className="text-[0.5em] font-semibold">
                                    {android.done ? p.open : p.install}
                                </span>
                            </span>
                            <span
                                className={cn(
                                    "[grid-area:1/1] flex flex-col justify-center gap-[0.35em] transition-opacity duration-300",
                                    android.loading ? "opacity-100" : "opacity-0",
                                )}
                            >
                                <span className="flex justify-between text-ink-2">
                                    <span className="text-[0.4em]">
                                        {percent(locale, android.p * 100, 0)}
                                    </span>
                                    <span className="text-[0.4em] tabular-nums">
                                        {number(locale, 24 * android.p, 1)} MB
                                    </span>
                                </span>
                                <span className="h-[0.28em] overflow-hidden rounded-full bg-fill-2">
                                    <span
                                        className="block h-full origin-left rounded-full bg-green-600"
                                        style={{ transform: `scaleX(${android.p})` }}
                                    />
                                </span>
                            </span>
                        </span>
                    </>
                }
            />
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const { Scene: UpdatesScene, duration: UPDATES_DURATION } = KEY_FEATURE_SCENES[5];

const SCENES = {
    trio: { Scene: TrioScene, duration: 4400, ...TRIO },
    chat: { Scene: ChatScene, duration: 4600, ...DUO },
    album: { Scene: AlbumScene, duration: 4800, ...DUO },
    updates: { Scene: UpdatesScene, duration: UPDATES_DURATION },
    stores: { Scene: StoresScene, duration: 3800, board: { cols: 32, rows: 26 }, k: 0.64 },
} satisfies Record<string, SceneSpec<ProductSceneLabels>>;

export type AppSceneKey = keyof typeof SCENES;

/** The app page's scenes, one island each: `scene` picks which. */
export default function AppScenes({
    scene,
    labels,
    locale,
    max,
}: {
    scene: AppSceneKey;
    labels: ProductSceneLabels;
    locale: string;
    max?: number;
}) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
