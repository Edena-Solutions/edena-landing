import {
    Bold,
    ChevronLeft,
    Hash,
    Italic,
    List,
    Lock,
    MessageSquarePlus,
    Plus,
    Search,
    Send,
    ShieldCheck,
    Underline,
} from "lucide-react";

import { EnaClover, PhoneFrame, PhoneNotification } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import {
    At,
    Avatar,
    Line,
    Pop,
    course,
    easeOut,
    number,
    on,
    percent,
    span,
    streamed,
    typed,
} from "@/components/wizard/scene-kit";
import { Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { formatDate } from "@/lib/intl-locale";
import { cn } from "@/lib/utils";
import {
    ActionButton,
    Caps,
    Caret,
    Fresh,
    GlassPhone,
    Lights,
    ORBS,
    Pill,
    SOLO,
    SOLO_PHONE,
    SettlePill,
    Toggle,
    between,
} from "./kit";
import type { ProductSceneLabels } from "./labels";

export type CommunicationLabels = ProductSceneLabels & { c: Translation["communicationScenes"] };

/*
 * The communication page's scenes, drawn from `screenshots/communication/*`:
 *
 *   channels   (hero) the school's channels on the web: a hurried note is rewritten by Ena, sent,
 *              and the families react
 *   delivered  the families' lock screen: the day's notifications arrive; the circular is opened
 *              and its reading confirmed
 *   secure     a private channel on the phone, no numbers shared: its settings let only its owners
 *              write
 *   inbox      the app's chat, ordered by channel and family: new messages rise to the top
 *   circulars  a circular on the feed and who has read it, class by class; the rest reminded
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: CommunicationLabels;
    locale: string;
}

const W = CONTENT.w;

/* ---------------------------------------------------------------------------------------------- */
/* channels · the school's channels, on the web                                                   */
/* ---------------------------------------------------------------------------------------------- */

const SIDEBAR = 7.4;
const THREAD_X = SIDEBAR + 0.8;
const THREAD_W = W - THREAD_X;
const COMPOSE = { type: 600, improve: 1900, rewrite: 2250, send: 3700, sent: 3900, react: 4400 };
const POSTS = [
    { name: "Eduardo García", initials: "EG", hue: 210, time: "17:09", lines: [9.5] },
    { name: "Pablo G.", initials: "PG", hue: 30, time: "09:05", lines: [7.2, 11.4] },
    { name: "Francisco Pérez", initials: "FP", hue: 150, time: "12:24", lines: [8.6] },
];

function ChannelsScene({ t, labels, locale }: Props) {
    const { c } = labels;
    const rough = typed(c.draftRough, t, COMPOSE.type, 28);
    const polished = streamed(c.draftPolished, t, COMPOSE.rewrite, 70);
    const rewriting = on(t, COMPOSE.rewrite);
    const sent = on(t, COMPOSE.sent);
    const thinking = between(t, COMPOSE.improve + 150, COMPOSE.rewrite + 300);
    const draft = sent
        ? ""
        : rewriting
          ? polished.words.slice(0, polished.shown).join(" ")
          : rough.text;
    const likes = 1 + Math.round(2 * easeOut(span(t, COMPOSE.react, 700)));
    const hearts = Math.round(2 * easeOut(span(t, COMPOSE.react + 200, 700)));

    return (
        <>
            {/* The channels and the direct messages. */}
            <At x={0} y={0} w={SIDEBAR} h={20.6}>
                <Pop
                    show={on(t, 80)}
                    from="up"
                    className="flex h-full flex-col gap-[0.55em] rounded-[0.9em] p-[0.6em] ds-glass-inner"
                >
                    <span className="flex h-[1.35em] items-center gap-[0.35em] rounded-[0.45em] bg-fill px-[0.45em] text-ink-3">
                        <Search className="size-[0.55em]" />
                        <Line w={3} className="h-[0.22em]" />
                    </span>
                    <Caps tone="text-ink-3">{c.channels}</Caps>
                    {c.channelNames.map((name, index) => (
                        <span
                            key={name}
                            className={cn(
                                "flex items-center gap-[0.35em] rounded-[0.4em] px-[0.35em] py-[0.25em]",
                                index === 0 && "bg-fill-2",
                            )}
                        >
                            {index === 3 ? (
                                <Lock className="size-[0.5em] text-ink-3" />
                            ) : (
                                <Hash className="size-[0.5em] text-ink-3" />
                            )}
                            <span
                                className={cn(
                                    "truncate text-[0.44em]",
                                    index === 0 ? "font-semibold" : "text-ink-2",
                                )}
                            >
                                {name}
                            </span>
                        </span>
                    ))}
                    <Caps tone="text-ink-3" className="mt-[0.4em]">
                        {c.directMessages}
                    </Caps>
                    {[
                        ["AG", "Ana García", 330],
                        ["PH", "Pablo Hernández", 200],
                    ].map(([initials, name, hue]) => (
                        <span key={name} className="flex items-center gap-[0.35em] px-[0.35em]">
                            <Avatar initials={initials as string} hue={hue as number} size={1} />
                            <span className="truncate text-[0.44em] text-ink-2">{name}</span>
                        </span>
                    ))}
                </Pop>
            </At>

            {/* The channel. */}
            <At x={THREAD_X} y={0} w={THREAD_W} h={1.9} className="flex items-center gap-[0.45em]">
                <Hash className="size-[0.75em] text-ink-2" />
                <span className="text-[0.82em] font-semibold tracking-[-0.01em]">
                    {c.channelNames[0]}
                </span>
                <span className="ml-auto text-[0.42em] tabular-nums text-ink-3">
                    {number(locale, 21)} {c.members}
                </span>
            </At>
            <At
                x={THREAD_X}
                y={2.4}
                w={THREAD_W}
                h={10.6}
                className="flex flex-col justify-end gap-[0.7em] overflow-hidden"
            >
                {POSTS.map((post, index) => (
                    <Pop
                        key={post.name}
                        show={on(t, 150 + index * 90)}
                        from="up"
                        className="flex gap-[0.55em]"
                    >
                        <Avatar initials={post.initials} hue={post.hue} size={1.55} />
                        <span className="flex min-w-0 flex-col gap-[0.35em]">
                            <span className="flex items-baseline gap-[0.4em]">
                                <span className="text-[0.44em] font-bold uppercase tracking-[0.06em]">
                                    {post.name}
                                </span>
                                <span className="text-[0.38em] tabular-nums text-ink-3">
                                    {post.time}
                                </span>
                            </span>
                            {post.lines.map((w, line) => (
                                <Line key={line} w={w} className="h-[0.28em]" />
                            ))}
                        </span>
                    </Pop>
                ))}
                <Pop show={sent} from="down" className="relative flex gap-[0.55em] rounded-[0.6em]">
                    <Fresh t={t} at={COMPOSE.sent} className="-inset-[0.3em] rounded-[0.6em]" />
                    <Avatar initials="LT" hue={330} size={1.55} />
                    <span className="flex min-w-0 flex-col gap-[0.35em]">
                        <span className="flex items-baseline gap-[0.4em]">
                            <span className="text-[0.44em] font-bold uppercase tracking-[0.06em]">
                                María Torres
                            </span>
                            <span className="text-[0.38em] tabular-nums text-ink-3">16:02</span>
                        </span>
                        <span className="text-[0.5em] leading-snug">{c.draftPolished}</span>
                        <span className="flex gap-[0.3em]">
                            <Pop show={on(t, COMPOSE.react)} from="scale">
                                <span className="flex items-center gap-[0.25em] rounded-full bg-fill-2 px-[0.5em] py-[0.12em]">
                                    <span className="text-[0.48em]">👍</span>
                                    <span className="text-[0.42em] font-semibold tabular-nums">
                                        {likes}
                                    </span>
                                </span>
                            </Pop>
                            <Pop show={on(t, COMPOSE.react + 200)} from="scale">
                                <span className="flex items-center gap-[0.25em] rounded-full bg-fill-2 px-[0.5em] py-[0.12em]">
                                    <span className="text-[0.48em]">❤️</span>
                                    <span className="text-[0.42em] font-semibold tabular-nums">
                                        {hearts}
                                    </span>
                                </span>
                            </Pop>
                        </span>
                    </span>
                </Pop>
            </At>

            {/* Writing to the channel: a hurried note, rewritten by Ena. */}
            <At x={THREAD_X} y={13.5} w={THREAD_W} h={4.4}>
                <Pop
                    show={on(t, 300)}
                    from="up"
                    className="relative flex h-full flex-col overflow-hidden rounded-[0.8em] p-[0.55em] ds-glass-inner"
                >
                    {thinking && (
                        <span
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(105deg, transparent 30%, rgb(52 211 153 / 0.22) 50%, transparent 70%)",
                                transform: `translateX(${-100 + span(t, COMPOSE.improve + 150, 700) * 200}%)`,
                            }}
                        />
                    )}
                    <span className="flex items-center gap-[0.55em] text-ink-3">
                        {[Bold, Italic, Underline, List].map((Icon, index) => (
                            <Icon key={index} className="size-[0.55em]" />
                        ))}
                    </span>
                    <span className="mt-[0.45em] flex-1">
                        <span
                            className={cn(
                                "text-[0.5em] leading-snug",
                                draft ? "text-ink" : "text-ink-3",
                            )}
                        >
                            {draft || `${c.messageIn} #${c.channelNames[0]}`}
                            <Caret show={rough.typing || polished.streaming} />
                        </span>
                    </span>
                    <span className="flex items-center justify-end gap-[0.4em]">
                        <span
                            className={cn(
                                "flex items-center gap-[0.3em] rounded-full bg-surface px-[0.55em] py-[0.25em] ring-1 ring-hairline transition-[scale,box-shadow] duration-300",
                                between(t, COMPOSE.improve, COMPOSE.improve + 250) && "scale-95",
                                thinking && "shadow-[0_0_0_0.25em_rgb(52_211_153/0.25)]",
                            )}
                        >
                            <EnaClover size={0.8} />
                            <span className="text-[0.42em] font-medium">{c.improveWithEna}</span>
                        </span>
                        <span
                            className={cn(
                                "flex size-[1.45em] items-center justify-center rounded-[0.45em] bg-ink text-canvas transition-[scale] duration-200",
                                between(t, COMPOSE.send, COMPOSE.sent) && "scale-90",
                            )}
                        >
                            <Send className="size-[0.6em]" />
                        </span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* delivered · notifications that arrive, a circular confirmed                                    */
/* ---------------------------------------------------------------------------------------------- */

const LOCK = { notes: [700, 1300, 1900], open: 2900, sheet: 3150, confirm: 4100, confirmed: 4350 };

function DeliveredScene({ t, labels, locale }: Props) {
    const { c, p } = labels;
    const notes = [c.circularTitle, p.notifMessage, p.notifPhotos];
    const arrived = LOCK.notes.filter((at) => on(t, at)).length;
    const date = formatDate(locale, new Date(2026, 5, 10), {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const sheet = on(t, LOCK.sheet);

    return (
        <>
            <Lights orbs={ORBS.sky} />
            <GlassPhone box={SOLO_PHONE}>
                {/* The lock screen. */}
                <span className="absolute inset-x-0 top-[2.2em] flex flex-col items-center gap-[0.2em]">
                    <span className="text-[0.5em] font-medium capitalize text-ink-2">{date}</span>
                    <span className="text-[3em] font-light leading-none tabular-nums tracking-[-0.04em]">
                        09:41
                    </span>
                </span>
                {/* The notifications, newest on top, the others sliding down to make room. */}
                {notes.map((title, index) => {
                    const order = arrived - 1 - index;
                    return (
                        <span
                            key={title}
                            className="absolute inset-x-[0.6em] transition-[top] duration-700 ease-spring"
                            style={{ top: `${7.6 + Math.max(0, order) * 2.75}em` }}
                        >
                            <Pop show={on(t, LOCK.notes[index])} from="down">
                                <PhoneNotification
                                    title={title}
                                    className={cn(
                                        "transition-[scale] duration-300",
                                        index === 0 &&
                                            between(t, LOCK.open - 250, LOCK.sheet) &&
                                            "scale-[0.97]",
                                    )}
                                />
                            </Pop>
                        </span>
                    );
                })}

                {/* The circular, opened: a sheet over the lock screen. */}
                <div
                    className={cn(
                        "absolute inset-x-0 bottom-0 top-[1.4em] flex flex-col gap-[0.8em] rounded-t-[1.4em] bg-canvas px-[0.9em] pt-[0.8em] elev-4 transition-transform duration-700 ease-spring",
                        sheet ? "translate-y-0" : "translate-y-full",
                    )}
                >
                    <span className="mx-auto h-[0.22em] w-[2.4em] rounded-full bg-fill-2" />
                    <span className="flex items-center gap-[0.45em]">
                        <ChevronLeft className="size-[0.6em] text-ink-2" />
                        <Caps tone="text-ink-3">{c.circular}</Caps>
                    </span>
                    <span className="text-[0.78em] font-semibold leading-tight tracking-[-0.01em]">
                        {c.circularTitle}
                    </span>
                    <span className="flex items-center gap-[0.4em]">
                        <Avatar initials="DR" hue={160} size={1.3} />
                        <span className="text-[0.42em] text-ink-2">{c.fromDirection}</span>
                    </span>
                    <span className="flex flex-col gap-[0.45em]">
                        {[10.5, 11.2, 9.4, 10.8, 6.2].map((w, index) => (
                            <Line key={index} w={w} className="h-[0.28em]" />
                        ))}
                    </span>
                    <span className="mt-[0.4em]">
                        <ActionButton
                            t={t}
                            press={LOCK.confirm - 200}
                            done={LOCK.confirmed}
                            label={c.confirmRead}
                            doneLabel={c.readConfirmed}
                        />
                    </span>
                    <Pop show={on(t, LOCK.confirmed + 300)} className="text-center">
                        <span className="text-[0.4em] text-ink-3">{c.schoolNotified}</span>
                    </Pop>
                </div>
            </GlassPhone>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* secure · a private channel, its owners only                                                    */
/* ---------------------------------------------------------------------------------------------- */

const SECURE = { open: 1300, toggle: 2100, save: 2900, closed: 3150, locked: 3400 };

function SecureScene({ t, labels }: Props) {
    const { c } = labels;
    const sheet = between(t, SECURE.open, SECURE.closed);
    const allCanWrite = !on(t, SECURE.toggle);
    const locked = on(t, SECURE.locked);

    return (
        <>
            <Lights />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={3}>
                    <div className="relative flex h-full flex-col">
                        <span className="flex items-center gap-[0.45em] border-b border-hairline px-[0.6em] pb-[0.55em] pt-[0.2em]">
                            <ChevronLeft className="size-[0.6em] text-ink-2" />
                            <Lock className="size-[0.55em] text-ink-2" />
                            <span className="flex min-w-0 flex-col gap-[0.25em]">
                                <span className="truncate text-[0.44em] font-bold uppercase tracking-[0.06em]">
                                    {c.privateChannel}
                                </span>
                                <span className="truncate text-[0.36em] text-ink-3">
                                    3 {c.members}
                                </span>
                            </span>
                        </span>
                        <span className="mx-[0.6em] mt-[0.55em] flex w-fit items-center gap-[0.3em] rounded-full bg-green-100 px-[0.55em] py-[0.15em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                            <ShieldCheck className="size-[0.55em]" />
                            <span className="text-[0.38em] font-semibold">{c.noPhoneNumbers}</span>
                        </span>
                        <div className="flex flex-1 flex-col gap-[0.5em] px-[0.6em] py-[0.6em]">
                            {[
                                [false, [6.8, 4.4]],
                                [true, [6.2]],
                                [false, [7.4, 7, 3.2]],
                            ].map(([mine, lines], index) => (
                                <Pop
                                    key={index}
                                    show={on(t, 200 + index * 150)}
                                    from="up"
                                    className={cn(
                                        "flex max-w-[80%] flex-col gap-[0.35em] rounded-[0.8em] px-[0.6em] py-[0.55em]",
                                        mine
                                            ? "self-end rounded-br-[0.25em] bg-violet-500"
                                            : "self-start rounded-bl-[0.25em] bg-surface elev-1 ring-1 ring-hairline",
                                    )}
                                >
                                    {(lines as number[]).map((w, line) => (
                                        <Line
                                            key={line}
                                            w={w}
                                            className={cn("h-[0.26em]", mine ? "bg-white/70" : "")}
                                        />
                                    ))}
                                </Pop>
                            ))}
                        </div>
                        <span className="absolute inset-x-[0.6em] top-[14.4em]">
                            <span className="grid">
                                <span
                                    className={cn(
                                        "[grid-area:1/1] flex h-[1.5em] items-center rounded-[0.45em] bg-fill px-[0.6em] transition-opacity duration-500",
                                        locked && "opacity-0",
                                    )}
                                >
                                    <Line w={4.4} className="h-[0.22em] opacity-60" />
                                </span>
                                <span
                                    className={cn(
                                        "[grid-area:1/1] relative flex h-[1.5em] items-center justify-center gap-[0.35em] rounded-[0.45em] bg-fill-2 text-ink-2 transition-opacity duration-500",
                                        !locked && "opacity-0",
                                    )}
                                >
                                    <Fresh t={t} at={SECURE.locked} className="rounded-[0.45em]" />
                                    <Lock className="size-[0.5em]" />
                                    <span className="truncate text-[0.4em] font-medium">
                                        {c.ownersOnly}
                                    </span>
                                </span>
                            </span>
                        </span>

                        {/* The conversation's settings, over it. */}
                        <div
                            className={cn(
                                "absolute inset-0 z-20 bg-black/25 transition-opacity duration-500",
                                sheet ? "opacity-100" : "pointer-events-none opacity-0",
                            )}
                        />
                        <div
                            className={cn(
                                "absolute inset-x-[0.6em] top-[3.4em] z-30 flex flex-col gap-[0.65em] rounded-[0.9em] bg-surface p-[0.8em] elev-4 transition-[opacity,translate,scale] duration-500 ease-spring",
                                sheet
                                    ? "translate-y-0 scale-100 opacity-100"
                                    : "translate-y-[1em] scale-95 opacity-0",
                            )}
                        >
                            <span className="text-[0.56em] font-semibold">{c.convSettings}</span>
                            <Line w={9} className="h-[0.24em]" />
                            <span className="flex items-center justify-between gap-[0.5em]">
                                <span className="text-[0.38em] font-semibold uppercase leading-snug tracking-[0.08em]">
                                    {c.allCanWrite}
                                </span>
                                <Toggle on={allCanWrite} />
                            </span>
                            <Line w={7.4} className="h-[0.22em] opacity-60" />
                            <span className="grid h-[1.6em] place-items-center rounded-[0.5em] bg-fill">
                                <span className="text-[0.44em]">{c.cancel}</span>
                            </span>
                            <ActionButton
                                t={t}
                                press={SECURE.save - 200}
                                done={SECURE.save}
                                label={c.saveChanges}
                                doneLabel={c.saved}
                                className="!rounded-[0.5em]"
                            />
                        </div>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* inbox · the app's chat, in order                                                               */
/* ---------------------------------------------------------------------------------------------- */

const ROW_H = 1.55;
const INBOX = { message: 1100, channel: 2000, open: 3000 };
const DIRECT = [
    { id: "javier", name: "Javier Rodríguez", initials: "JR", hue: 210, child: "Leo", year: "eso1" },
    { id: "pablo", name: "Pablo Hernández", initials: "PH", hue: 30, child: "Marc", year: "eso2" },
    { id: "sofia", name: "Sofía Gómez", initials: "SG", hue: 300, child: "Emma", year: "eso1" },
] as const;

function InboxScene({ t, labels }: Props) {
    const { c, ui } = labels;
    const risen = on(t, INBOX.message);
    const order = risen ? ["sofia", "javier", "pablo"] : ["javier", "pablo", "sofia"];
    const read = on(t, INBOX.open + 300);
    const channels = [...c.courseChannels, c.channelNames[0]];

    return (
        <>
            <Lights orbs={ORBS.green} />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={3}>
                    <div className="relative flex h-full flex-col px-[0.6em] pt-[0.3em]">
                        <span className="flex items-center gap-[0.5em]">
                            <span className="text-[0.46em] font-bold uppercase tracking-[0.1em]">
                                {c.chat}
                            </span>
                            <MessageSquarePlus className="ml-auto size-[0.65em] text-ink-2" />
                            <Plus className="size-[0.65em] text-ink-2" />
                        </span>
                        <Caps tone="text-ink-3" className="mt-[0.8em]">
                            {c.channels}
                        </Caps>
                        <span className="mt-[0.3em] flex flex-col">
                            {channels.map((name, index) => {
                                const unread = index === 1 && on(t, INBOX.channel);
                                return (
                                    <span
                                        key={name}
                                        className="flex h-[1.4em] items-center gap-[0.4em]"
                                    >
                                        <Hash className="size-[0.55em] text-ink-3" />
                                        <span
                                            className={cn(
                                                "truncate text-[0.46em]",
                                                unread ? "font-semibold" : "text-ink-2",
                                            )}
                                        >
                                            {name}
                                        </span>
                                        {unread && (
                                            <span className="ml-auto flex h-[0.85em] min-w-[0.85em] animate-[ds-pop_400ms_var(--ease-spring-bounce)] items-center justify-center rounded-full bg-violet-500 px-[0.25em] text-white">
                                                <span className="text-[0.4em] font-bold tabular-nums">
                                                    5
                                                </span>
                                            </span>
                                        )}
                                    </span>
                                );
                            })}
                            <span className="flex h-[1.4em] items-center gap-[0.4em]">
                                <Lock className="size-[0.5em] text-ink-3" />
                                <span className="truncate text-[0.46em] text-ink-2">
                                    {c.privateChannel}
                                </span>
                            </span>
                        </span>
                        <Caps tone="text-ink-3" className="mt-[0.7em]">
                            {c.directMessages}
                        </Caps>
                        {/* Placed, not flowed: the conversation with news rises to the top. */}
                        <span
                            className="relative mt-[0.35em] block"
                            style={{ height: `${DIRECT.length * ROW_H * 1.35}em` }}
                        >
                            {DIRECT.map((person) => {
                                const index = order.indexOf(person.id);
                                const isNew = person.id === "sofia" && risen;
                                return (
                                    <span
                                        key={person.id}
                                        className="absolute inset-x-0 flex items-center gap-[0.45em] rounded-[0.5em] transition-[top,background-color] duration-700 ease-spring"
                                        style={{
                                            top: `${index * ROW_H * 1.35}em`,
                                            height: `${ROW_H * 1.25}em`,
                                        }}
                                    >
                                        <Avatar
                                            initials={person.initials}
                                            hue={person.hue}
                                            size={1.4}
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col gap-[0.2em]">
                                            <span
                                                className={cn(
                                                    "truncate text-[0.46em]",
                                                    isNew && !read ? "font-semibold" : "",
                                                )}
                                            >
                                                {person.name}
                                            </span>
                                            <span className="truncate text-[0.36em] text-ink-3">
                                                {person.child} | {course(ui.courses, person.year)}
                                            </span>
                                        </span>
                                        {isNew && !read && (
                                            <span className="flex h-[0.85em] min-w-[0.85em] animate-[ds-pop_400ms_var(--ease-spring-bounce)] items-center justify-center rounded-full bg-violet-500 px-[0.25em] text-white">
                                                <span className="text-[0.4em] font-bold tabular-nums">
                                                    2
                                                </span>
                                            </span>
                                        )}
                                        {person.id === "sofia" && (
                                            <Fresh
                                                t={t}
                                                at={INBOX.open}
                                                className="rounded-[0.5em]"
                                            />
                                        )}
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
/* circulars · sent, and who has read them                                                        */
/* ---------------------------------------------------------------------------------------------- */

const READS = { from: 700, to: 2900, total: 24, read: 22, remind: 3500, reminded: 3750 };
const CLASSES = [
    { year: "p1", group: "A", share: 100 },
    { year: "i3", group: "A", share: 92 },
    { year: "y2", group: "A", share: 88 },
    { year: "y6", group: "B", share: 83 },
] as const;

function CircularsScene({ t, labels, locale }: Props) {
    const { c, ui } = labels;
    const reading = easeOut(span(t, READS.from, READS.to - READS.from));
    const read = Math.round(READS.read * reading);

    return (
        <>
            <Title aside={<Pill tone="gray">{c.pubTabs[0]} | 15</Pill>}>{c.publications}</Title>

            {/* The circular, on the feed. */}
            <At x={0} y={2.5} w={18.8} h={18.1}>
                <Pop
                    show={on(t, 100)}
                    from="up"
                    className="flex h-full flex-col gap-[0.6em] rounded-[0.9em] p-[0.85em] ds-glass-inner"
                >
                    <span className="flex items-center gap-[0.45em]">
                        <Avatar initials="JL" hue={25} size={1.5} />
                        <span className="flex flex-col gap-[0.2em]">
                            <span className="text-[0.42em] font-bold uppercase tracking-[0.06em]">
                                Jaime López
                            </span>
                            <span className="text-[0.38em] text-ink-3">30 jun | 10:06</span>
                        </span>
                    </span>
                    <span className="text-[0.7em] font-semibold leading-tight tracking-[-0.01em]">
                        {c.circularTitle2}
                    </span>
                    <Pill tone="blue" className="w-fit">
                        {c.audience}
                    </Pill>
                    <span className="flex flex-col gap-[0.4em]">
                        <Line w={15.5} className="h-[0.26em]" />
                        <Line w={12} className="h-[0.26em]" />
                    </span>
                    <span className="mt-[0.3em] flex flex-col gap-[0.45em] border-t border-hairline pt-[0.7em]">
                        <span className="flex items-baseline justify-between">
                            <Caps>{c.readBy}</Caps>
                            <span className="text-[0.6em] font-semibold tabular-nums">
                                {read}/{READS.total}
                            </span>
                        </span>
                        <span className="h-[0.35em] overflow-hidden rounded-full bg-fill-2">
                            <span
                                className="block h-full origin-left rounded-full bg-green-500"
                                style={{
                                    transform: `scaleX(${(READS.read / READS.total) * reading})`,
                                }}
                            />
                        </span>
                        <span className="flex items-center">
                            {Array.from({ length: 9 }, (_, index) => (
                                <span key={index} className={cn(index > 0 && "-ml-[0.35em]")}>
                                    <Pop show={on(t, READS.from + index * 200)} from="scale">
                                        <Avatar
                                            initials=""
                                            hue={(index * 41 + 10) % 360}
                                            size={1.2}
                                            className="ring-[0.12em] ring-canvas"
                                        />
                                    </Pop>
                                </span>
                            ))}
                            <span className="ml-[0.45em] text-[0.4em] tabular-nums text-ink-3">
                                +{Math.max(0, read - 9)}
                            </span>
                        </span>
                    </span>
                    <span className="flex items-center justify-between gap-[0.5em] rounded-[0.6em] bg-fill/70 px-[0.6em] py-[0.45em]">
                        <span className="text-[0.42em] text-ink-2">
                            <b className="font-semibold text-ink tabular-nums">
                                {READS.total - read}
                            </b>{" "}
                            {c.unread}
                        </span>
                        <SettlePill
                            t={t}
                            at={READS.reminded}
                            from={c.remind}
                            to={c.reminded}
                            fromTone="gray"
                        />
                    </span>
                </Pop>
            </At>

            {/* Reads, class by class. */}
            <At x={19.4} y={2.5} w={W - 19.4} h={18.1}>
                <Pop
                    show={on(t, 250)}
                    from="up"
                    className="flex h-full flex-col gap-[0.75em] rounded-[0.9em] p-[0.85em] ds-glass-inner"
                >
                    <Caps>{c.readsByClass}</Caps>
                    {CLASSES.map((row, index) => {
                        const grow = easeOut(span(t, 900 + index * 150, 1200));
                        return (
                            <span key={row.year} className="flex flex-col gap-[0.3em]">
                                <span className="flex justify-between">
                                    <span className="text-[0.46em] font-medium">{course(ui.courses, row.year, row.group)}</span>
                                    <span className="text-[0.44em] tabular-nums text-ink-2">
                                        {percent(locale, row.share * grow, 0)}
                                    </span>
                                </span>
                                <span className="h-[0.3em] overflow-hidden rounded-full bg-fill-2">
                                    <span
                                        className="block h-full origin-left rounded-full bg-violet-500"
                                        style={{ transform: `scaleX(${(row.share / 100) * grow})` }}
                                    />
                                </span>
                            </span>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    channels: { Scene: ChannelsScene, duration: 5200 },
    delivered: { Scene: DeliveredScene, duration: 5000, ...SOLO },
    secure: { Scene: SecureScene, duration: 4200, ...SOLO },
    inbox: { Scene: InboxScene, duration: 3800, ...SOLO },
    circulars: { Scene: CircularsScene, duration: 4200 },
} satisfies Record<string, SceneSpec<CommunicationLabels>>;

export type CommunicationSceneKey = keyof typeof SCENES;

export default function CommunicationScenes({
    scene,
    labels,
    locale,
    max,
}: {
    scene: CommunicationSceneKey;
    labels: CommunicationLabels;
    locale: string;
    max?: number;
}) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
