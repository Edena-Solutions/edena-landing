import { ArrowUp, Bell, CalendarDays, ClipboardCheck, LayoutGrid, List, Mic, Send, Tag, TrendingUp, UserCheck, Users, Wallet, type LucideIcon } from "lucide-react";

import { EnaClover, PhoneFrame } from "@/components/wizard/app-frame";
import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Avatar, Pop, clamp01, easeInOut, easeOut, number, on, percent, span, streamed, typed } from "@/components/wizard/scene-kit";
import { DrawnCheck, Ripple } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Caret, Lights, Pill, SOLO, SOLO_PHONE, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type EnaLabels = ProductSceneLabels & { ena: Translation["enaScenes"] };

/*
 * Ena's page's scenes, drawn from `screenshots/shared/hero_ena.png`:
 *
 *   home       (hero) Ena's home in the web app — its mark, its two modes, the composer and the
 *              quick actions. "Org summary" is picked: the home gives way to the conversation, the
 *              composer settles at the foot, and Ena answers with the centre at a glance
 *   assistant  @Ena on the phone, late at night: a teacher asks, Ena answers from the centre's
 *              own records
 *   tasks      Ena at work: one request, and the steps it takes — attendance taken, the absence
 *              found, the family told — ticked as they land
 *
 * Ena's own mark is Ena's, here: these are Ena's screens, not notifications from the app.
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: EnaLabels;
    locale: string;
}

const W = CONTENT.w;
const H = CONTENT.h;

/** Ena thinking: two lines of light where the answer will be. */
function Thinking({ show, widths = [12, 8] }: { show: boolean; widths?: number[] }) {
    return (
        <span className={cn("absolute inset-x-0 top-[0.3em] flex flex-col gap-[0.45em] transition-opacity duration-300", show ? "opacity-100" : "opacity-0")}>
            {widths.map((w) => (
                <span
                    key={w}
                    className="block h-[0.5em] animate-ds-shimmer rounded-full bg-[linear-gradient(90deg,rgb(52_211_153/0.12),rgb(52_211_153/0.5),rgb(52_211_153/0.12))] bg-[length:200%_100%]"
                    style={{ width: `${w}em` }}
                />
            ))}
        </span>
    );
}

/** Words that arrive one by one, each coming into focus. */
function Streamed({ words, shown, className }: { words: string[]; shown: number; className?: string }) {
    return (
        <span className={cn("block leading-[1.45]", className)}>
            {words.map((word, index) => (
                <span key={index} className={cn("transition-[opacity,filter] duration-500", index < shown ? "opacity-100 blur-none" : "opacity-0 blur-[2px]")}>
                    {word}{" "}
                </span>
            ))}
        </span>
    );
}

/** Ena's orb: the living mark, a glow that quickens while it thinks. */
function Orb({ size, thinking = false }: { size: number; thinking?: boolean }) {
    return (
        <span className="relative inline-flex shrink-0" style={{ width: `${size}em`, height: `${size}em` }}>
            <span
                className={cn(
                    "absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,rgb(52_211_153/0.5),transparent_65%)] blur-[0.3em] transition-opacity duration-500",
                    thinking ? "animate-pulse opacity-100" : "opacity-50",
                )}
            />
            <EnaClover size={size} alive delay="-2s" className="relative" />
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* home · Ena's home, then the conversation                                                       */
/* ---------------------------------------------------------------------------------------------- */

const QUICK_ICONS: LucideIcon[] = [List, Tag, CalendarDays, LayoutGrid];
const HOME = { press: 1500, ask: 1900, think: 2500, respond: 3300, summary: 4500, chips: 5900 };
const COMPOSER = { home: { x: 4.6, y: 8.5, w: 21, h: 3.4 }, chat: { x: 0.6, y: 14.6, w: W - 1.2, h: 2.4 } };
const SUMMARY: { icon: LucideIcon; value: number; format: "number" | "percent" | "money"; tone: string }[] = [
    { icon: Users, value: 486, format: "number", tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
    { icon: UserCheck, value: 96.4, format: "percent", tone: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
    { icon: Wallet, value: 92, format: "percent", tone: "bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300" },
    { icon: ClipboardCheck, value: 12, format: "number", tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
];
const TREND = [0.42, 0.5, 0.47, 0.6, 0.66, 0.62, 0.78, 0.86];

function HomeScene({ t, labels, locale }: Props) {
    const { ena } = labels;
    const chat = on(t, HOME.ask);
    const move = easeInOut(span(t, HOME.ask, 700));
    const box = {
        x: COMPOSER.home.x + (COMPOSER.chat.x - COMPOSER.home.x) * move,
        y: COMPOSER.home.y + (COMPOSER.chat.y - COMPOSER.home.y) * move,
        w: COMPOSER.home.w + (COMPOSER.chat.w - COMPOSER.home.w) * move,
        h: COMPOSER.home.h + (COMPOSER.chat.h - COMPOSER.home.h) * move,
    };
    const thinking = between(t, HOME.think, HOME.respond);
    const answer = streamed(ena.summaryAnswer, t, HOME.respond, 60);
    const grow = easeOut(span(t, HOME.summary + 300, 1400));
    const format = (item: (typeof SUMMARY)[number], p: number) =>
        item.format === "percent" ? percent(locale, item.value * p, item.value % 1 ? 1 : 0) : number(locale, Math.round(item.value * p));
    const trend = TREND.map((v, i) => `${(i / (TREND.length - 1)) * 100},${40 - v * 36 * grow}`).join(" ");

    return (
        <>
            {/* The light at the top of Ena's home, drifting. */}
            <At x={2} y={-4} w={W - 4} h={9} className="pointer-events-none">
                <span
                    className="absolute inset-0 animate-ds-aurora opacity-70 blur-[1.2em]"
                    style={{ background: "radial-gradient(closest-side at 30% 50%, rgb(20 184 166 / 0.35), transparent), radial-gradient(closest-side at 70% 50%, rgb(163 230 53 / 0.35), transparent)" }}
                />
            </At>

            {/* Home: the mark, the modes, the quick actions. They give way as the conversation starts. */}
            <div className={cn("absolute inset-0 transition-[opacity,translate,filter] duration-700 ease-spring", chat ? "-translate-y-[1.5em] opacity-0 blur-[4px]" : "opacity-100")}>
                <At x={0} y={2} w={W} className="flex items-center justify-center gap-[0.55em]">
                    <Pop show={on(t, 100)} from="scale">
                        <Orb size={2.6} />
                    </Pop>
                    <span className="flex items-end gap-[0.35em]">
                        <span className="text-[1.6em] font-semibold leading-none tracking-[-0.03em]">Ena</span>
                        <span className="mb-[0.6em] text-[0.36em] text-ink-3">{ena.byEdena}</span>
                    </span>
                </At>
                <At x={COMPOSER.home.x} y={6.6} className="flex gap-[0.35em]">
                    {ena.modes.map((mode, index) => (
                        <span key={mode} className={cn("flex h-[1.35em] items-center gap-[0.3em] rounded-[0.4em] px-[0.6em]", index === 0 ? "bg-ink text-canvas" : "bg-fill text-ink-2")}>
                            {index === 0 ? <EnaClover size={0.7} /> : <List className="size-[0.55em]" />}
                            <span className="text-[0.4em] font-semibold uppercase tracking-[0.1em]">{mode}</span>
                        </span>
                    ))}
                </At>
                {ena.quick.map((title, index) => {
                    const Icon = QUICK_ICONS[index];
                    const pressed = index === 3 && between(t, HOME.press, HOME.ask);
                    return (
                        <At key={title} x={COMPOSER.home.x + index * 5.35} y={12.6} w={5} h={3.5}>
                            <Pop
                                show={on(t, 300 + index * 80)}
                                from="up"
                                className={cn(
                                    "flex h-full flex-col justify-end gap-[0.3em] rounded-[0.6em] bg-fill/80 p-[0.55em] ring-1 transition-[scale,box-shadow] duration-200",
                                    index === 3 && on(t, HOME.press - 400) ? "ring-ink/30" : "ring-transparent",
                                    pressed && "scale-95",
                                )}
                            >
                                <Icon className="mb-auto size-[0.65em] text-ink-2" />
                                <span className="line-clamp-2 text-[0.36em] font-bold uppercase leading-tight tracking-[0.06em]">{title}</span>
                                <span className="truncate text-[0.34em] text-ink-3">{ena.quickHints[index]}</span>
                            </Pop>
                        </At>
                    );
                })}
            </div>

            {/* The conversation. */}
            <At x={8} y={0.6} w={W - 8.6} className="flex justify-end">
                <Pop show={on(t, HOME.ask + 300)} from="down" className="rounded-[1em] rounded-br-[0.3em] bg-fill px-[0.8em] py-[0.5em]">
                    <span className="block text-[0.56em]">{ena.summaryPrompt}</span>
                </Pop>
            </At>
            <At x={0.6} y={3.2} w={W - 1.2} className="flex gap-[0.6em]">
                <Pop show={on(t, HOME.think)} from="scale">
                    <Orb size={1.5} thinking={thinking} />
                </Pop>
                <span className="relative min-w-0 flex-1 pt-[0.2em]">
                    <Thinking show={thinking} widths={[15, 10]} />
                    <Streamed words={answer.words} shown={answer.shown} className="text-[0.56em]" />
                </span>
            </At>
            <At x={2.7} y={6.1} w={W - 3.3} h={4.3} className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-[0.45em]">
                {SUMMARY.map((item, index) => {
                    const Icon = item.icon;
                    const p = easeOut(span(t, HOME.summary + index * 120, 1300));
                    return (
                        <Pop key={index} show={on(t, HOME.summary + index * 120)} from="up" className={cn("flex flex-col justify-between rounded-[0.8em] p-[0.65em]", item.tone)}>
                            <span className="flex items-center gap-[0.3em]">
                                <Icon className="size-[0.6em] shrink-0" />
                                <span className="truncate text-[0.36em] font-semibold uppercase tracking-[0.08em]">{ena.summaryLabels[index]}</span>
                            </span>
                            <span className="text-[1.2em] font-light leading-none tabular-nums tracking-[-0.03em]">{format(item, p)}</span>
                        </Pop>
                    );
                })}
            </At>
            <At x={2.7} y={10.9} w={W - 3.3} h={2.6}>
                <Pop show={on(t, HOME.summary + 600)} from="up" className="flex h-full items-center gap-[0.8em] rounded-[0.8em] px-[0.8em] ds-glass-inner">
                    <span className="flex flex-col gap-[0.25em]">
                        <Caps tone="text-ink-3">{ena.enrolmentTrend}</Caps>
                        <span className="flex items-center gap-[0.3em] text-green-600 dark:text-green-400">
                            <TrendingUp className="size-[0.6em]" />
                            <span className="text-[0.5em] font-semibold tabular-nums">+{percent(locale, 18, 0)}</span>
                        </span>
                    </span>
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-[1.8em] flex-1 overflow-visible">
                        <polyline points={trend} fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <span className="flex gap-[0.3em]">
                        {ena.chips.map((chip, index) => (
                            <Pop key={chip} show={on(t, HOME.chips + index * 150)} from="scale">
                                <span className="flex h-[1.4em] items-center rounded-full bg-surface px-[0.6em] ring-1 ring-hairline">
                                    <span className="whitespace-nowrap text-[0.4em] font-medium">{chip}</span>
                                </span>
                            </Pop>
                        ))}
                    </span>
                </Pop>
            </At>

            {/* The composer: in the middle of the home, then at the foot of the conversation. */}
            <At x={box.x} y={box.y} w={box.w} h={box.h}>
                <Pop show={on(t, 200)} from="up" className="flex h-full flex-col justify-between rounded-[0.8em] bg-fill/90 p-[0.55em] ring-1 ring-hairline">
                    <span className={cn("truncate text-[0.46em] text-ink-3 transition-opacity duration-300", chat && "opacity-80")}>{ena.placeholder}</span>
                    <span className={cn("flex justify-end gap-[0.3em] transition-opacity duration-300", move > 0.5 && "-mt-[1.2em]")}>
                        <span className="flex size-[1.2em] items-center justify-center rounded-[0.35em] bg-red-50 text-red-500 dark:bg-red-500/15">
                            <Mic className="size-[0.55em]" />
                        </span>
                        <span className="flex size-[1.2em] items-center justify-center rounded-[0.35em] bg-ink text-canvas">
                            <ArrowUp className="size-[0.6em]" />
                        </span>
                    </span>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* assistant · @Ena on the phone, at any hour                                                     */
/* ---------------------------------------------------------------------------------------------- */

const ASK = { type: 500, send: 1900, think: 2100, respond: 2900, list: 3900 };
const ALLERGIES = [
    { name: "Lucía García", initials: "LG", hue: 25, tone: "yellow" as const, item: 0 },
    { name: "Hugo Fernández", initials: "HF", hue: 45, tone: "red" as const, item: 1 },
    { name: "Mateo Ruiz", initials: "MR", hue: 200, tone: "orange" as const, item: 2 },
];

function AssistantScene({ t, labels }: Props) {
    const { ena } = labels;
    const question = typed(ena.askQuestion, t, ASK.type, 30);
    const sent = on(t, ASK.send);
    const thinking = between(t, ASK.think, ASK.respond);
    const answer = streamed(ena.askAnswer, t, ASK.respond, 70);

    return (
        <>
            <Lights orbs={[{ x: -2, y: 4, size: 14, color: "#22d3ee" }, { x: 18, y: 1, size: 15, color: "#a3e635" }, { x: 8, y: 15, size: 13, color: "#22c55e" }]} />
            <At {...SOLO_PHONE}>
                <PhoneFrame x={0} y={0} w={SOLO_PHONE.w} h={SOLO_PHONE.h} tab={2}>
                    <div className="flex h-full flex-col px-[0.6em]">
                        <span className="flex items-center gap-[0.4em] border-b border-hairline pb-[0.5em] pt-[0.2em]">
                            <Orb size={1.3} thinking={thinking} />
                            <span className="text-[0.56em] font-semibold">Ena</span>
                            <span className="size-[0.35em] rounded-full bg-green-500" />
                            <span className="ml-auto rounded-full bg-fill-2 px-[0.5em] py-[0.1em] text-[0.36em] tabular-nums text-ink-2">{ena.lateHour}</span>
                        </span>
                        <div className="flex flex-1 flex-col gap-[0.6em] pt-[0.7em]">
                            <Pop show={sent} from="down" className="ml-auto max-w-[85%] rounded-[0.9em] rounded-br-[0.25em] bg-violet-500 px-[0.6em] py-[0.45em] text-white">
                                <span className="block text-[0.46em] leading-snug">{ena.askQuestion}</span>
                            </Pop>
                            <span className="flex gap-[0.4em]">
                                <Pop show={on(t, ASK.think)} from="scale">
                                    <Orb size={1.05} thinking={thinking} />
                                </Pop>
                                <span className="relative min-w-0 flex-1">
                                    <Thinking show={thinking} widths={[7.5, 5]} />
                                    <Streamed words={answer.words} shown={answer.shown} className="text-[0.46em]" />
                                </span>
                            </span>
                            <span className="ml-[1.45em] flex flex-col gap-[0.35em]">
                                {ALLERGIES.map((child, index) => (
                                    <Pop key={child.name} show={on(t, ASK.list + index * 160)} from="up" className="flex items-center gap-[0.4em] rounded-[0.55em] bg-surface/80 px-[0.45em] py-[0.35em] ring-1 ring-hairline">
                                        <Avatar initials={child.initials} hue={child.hue} size={1.1} />
                                        <span className="flex-1 truncate text-[0.42em] font-medium">{child.name}</span>
                                        <Pill tone={child.tone}>{ena.allergens[child.item]}</Pill>
                                    </Pop>
                                ))}
                            </span>
                        </div>
                        <span className="mb-[0.5em] flex items-center gap-[0.35em]">
                            <span className="flex min-h-[1.45em] flex-1 items-center rounded-[0.5em] bg-fill px-[0.5em] py-[0.3em]">
                                <span className={cn("text-[0.42em] leading-snug", sent || !question.text ? "text-ink-3" : "text-ink")}>
                                    {sent ? ena.askPlaceholder : question.text || ena.askPlaceholder}
                                    <Caret show={question.typing} />
                                </span>
                            </span>
                            <span className={cn("flex size-[1.45em] shrink-0 items-center justify-center rounded-[0.5em] transition-[scale,background-color] duration-200", question.text && !sent ? "bg-ink text-canvas" : "bg-fill text-ink-3", between(t, ASK.send - 180, ASK.send) && "scale-90")}>
                                <ArrowUp className="size-[0.6em]" />
                            </span>
                        </span>
                    </div>
                </PhoneFrame>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* tasks · one request, the steps Ena takes                                                       */
/* ---------------------------------------------------------------------------------------------- */

const STEP_ICONS: LucideIcon[] = [UserCheck, Bell, Send, ClipboardCheck];
const WORK = { start: 900, step: 750, done: 900 + 4 * 750 + 200 };

function TasksScene({ t, labels }: Props) {
    const { ena } = labels;
    const stepAt = (index: number) => WORK.start + (index + 1) * WORK.step;
    const done = on(t, WORK.done);
    const working = between(t, WORK.start, WORK.done);
    const seconds = clamp01((t - WORK.start) / (WORK.done - WORK.start)) * 4.2;

    return (
        <>
            {/* The request. */}
            <At x={0} y={0} w={W} className="flex items-start gap-[0.6em]">
                <Avatar initials="LT" hue={330} size={1.6} />
                <Pop show={on(t, 150)} from="up" className="rounded-[1em] rounded-tl-[0.3em] bg-fill px-[0.8em] py-[0.5em]">
                    <span className="block text-[0.56em] leading-snug">{ena.taskPrompt}</span>
                </Pop>
            </At>

            {/* Ena, at work. */}
            <At x={0} y={3.4} w={W} h={H - 3.4}>
                <Pop show={on(t, 500)} from="up" className="relative flex h-full flex-col gap-[0.6em] overflow-hidden rounded-[0.9em] p-[0.85em] ds-glass-inner">
                    <span className="flex items-center gap-[0.5em]">
                        <Orb size={1.5} thinking={working} />
                        <span className="flex flex-col gap-[0.2em]">
                            <span className="text-[0.56em] font-semibold">{done ? ena.taskDone : ena.taskWorking}</span>
                            <span className="text-[0.4em] tabular-nums text-ink-3">{(Math.round(seconds * 10) / 10).toFixed(1).replace(".", ena.decimal)} s</span>
                        </span>
                        <span className="ml-auto">
                            <Pill tone={done ? "green" : "blue"}>{done ? ena.completed : ena.inProgress}</Pill>
                        </span>
                    </span>
                    {/* A thin line of progress under the header, filling as the steps land. */}
                    <span className="h-[0.18em] overflow-hidden rounded-full bg-fill-2">
                        <span className="block h-full origin-left rounded-full" style={{ transform: `scaleX(${clamp01((t - WORK.start) / (WORK.done - WORK.start))})`, background: "var(--ds-brand-gradient)" }} />
                    </span>
                    {ena.taskSteps.map((step, index) => {
                        const Icon = STEP_ICONS[index];
                        const begun = on(t, stepAt(index) - WORK.step);
                        const landed = on(t, stepAt(index));
                        return (
                            <Pop key={step} show={begun} from="up" className="flex items-center gap-[0.6em] rounded-[0.6em] bg-surface/70 px-[0.6em] py-[0.5em] ring-1 ring-hairline">
                                <span className={cn("relative flex size-[1.45em] shrink-0 items-center justify-center rounded-full transition-colors duration-500", landed ? "bg-green-500 text-white" : "bg-fill-2 text-ink-2")}>
                                    {landed ? (
                                        <span className="size-[0.95em]">
                                            <DrawnCheck p={span(t, stepAt(index), 450)} className="size-full" />
                                        </span>
                                    ) : (
                                        <svg viewBox="0 0 24 24" className="size-[0.9em]" style={{ transform: `rotate(${(t / 2) % 360}deg)` }}>
                                            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="36 60" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    <Ripple p={span(t, stepAt(index), 800)} className="text-green-500" />
                                </span>
                                <Icon className="size-[0.6em] shrink-0 text-ink-3" />
                                <span className={cn("min-w-0 flex-1 truncate text-[0.5em] transition-colors duration-500", landed ? "text-ink" : "text-ink-2")}>{step}</span>
                                <span className={cn("text-[0.42em] tabular-nums text-ink-3 transition-opacity duration-300", landed ? "opacity-100" : "opacity-0")}>{ena.taskMeta[index]}</span>
                            </Pop>
                        );
                    })}
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    home: { Scene: HomeScene, duration: 7000 },
    assistant: { Scene: AssistantScene, duration: 5000, ...SOLO },
    tasks: { Scene: TasksScene, duration: 4600 },
} satisfies Record<string, SceneSpec<EnaLabels>>;

export type EnaSceneKey = keyof typeof SCENES;

export default function EnaScenes({ scene, labels, locale, max }: { scene: EnaSceneKey; labels: EnaLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}
