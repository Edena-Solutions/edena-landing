import { useMemo } from "react";
import { ArrowUp, Bot, Building2, CircleCheck, FileText, Receipt, UserPlus, Zap, type LucideIcon } from "lucide-react";

import { EnaClover } from "@/components/wizard/app-frame";
import { GlassOrbs, type Orb } from "@/components/wizard/glass-stage";
import {
    Artboard,
    At,
    Avatar,
    Glyph,
    Line,
    Pop,
    easeOut,
    number,
    on,
    span,
    streamed,
    typed,
} from "@/components/wizard/scene-kit";
import { Wizard, type WizardCopy } from "@/components/wizard/Wizard";
import { cn } from "@/lib/utils";

/*
 * Ena's three cards as one conversation that plays itself: the prompt is typed into the composer
 * and sent, Ena thinks, the answer streams in word by word, and what Ena did lands under it — the
 * month's new students by course, the invoice run, the protocol shared with the team.
 *
 * The words are the cards' own (`enaSection.cards`). The scene times follow their length, so every
 * language types and streams at the same pace.
 */

type CardKey = "agent" | "automate" | "organization";

export interface EnaCard {
    label: string;
    title: string;
    prompt: string;
    response: string;
}

interface Props {
    cards: Record<CardKey, EnaCard>;
    copy: WizardCopy;
    locale: string;
}

const ORDER: CardKey[] = ["agent", "automate", "organization"];
/** Ena's own colours behind the glass: cyan, green, lime. */
const ENA_ORBS: Orb[] = [
    { x: -3, y: 13, size: 13, color: "#22d3ee" },
    { x: 17, y: -3, size: 12, color: "#a3e635" },
    { x: 14, y: 12, size: 10, color: "#22c55e" },
];
const ICONS: Record<CardKey, LucideIcon> = { agent: Bot, automate: Zap, organization: Building2 };

const TYPE_AT = 300;
const PER_CHAR = 32;
const PER_WORD = 60;

/** When each beat of a card's conversation lands, from its words. */
function beats(card: EnaCard) {
    const send = TYPE_AT + card.prompt.length * PER_CHAR + 350;
    const think = send + 250;
    const respond = think + 900;
    const result = respond + card.response.split(" ").length * PER_WORD + 250;
    return { send, think, respond, result, duration: result + 1900 };
}

function Result({ card, t, at, locale }: { card: CardKey; t: number; at: number; locale: string }) {
    const p = easeOut(span(t, at + 200, card === "automate" ? 1400 : 1000));

    if (card === "agent") {
        const courses = [3, 2, 4, 1, 2];
        return (
            <div className="flex h-full items-center gap-[1em] rounded-[0.9em] ds-glass-inner px-[1em]">
                <Glyph icon={UserPlus} tone="brand" size={2.2} />
                <span className="text-[2em] font-semibold leading-none tracking-[-0.03em] tabular-nums">
                    +{Math.round(12 * p)}
                </span>
                <span className="ml-auto flex h-[3.2em] items-end gap-[0.45em]">
                    {courses.map((value, index) => (
                        <span key={index} className="flex flex-col items-center gap-[0.25em]">
                            <span className="text-[0.5em] tabular-nums text-ink-2">{value}</span>
                            <span
                                className="w-[1.1em] rounded-[0.3em]"
                                style={{
                                    height: `${value * 0.55 * p + 0.15}em`,
                                    background: "var(--ds-brand-gradient)",
                                }}
                            />
                        </span>
                    ))}
                </span>
            </div>
        );
    }

    if (card === "automate") {
        const done = p >= 1;
        return (
            <div className="flex h-full items-center gap-[0.9em] rounded-[0.9em] ds-glass-inner px-[1em]">
                <Glyph icon={Receipt} tone="green" size={2.2} />
                <span className="flex min-w-0 flex-1 flex-col gap-[0.5em]">
                    <span className="flex items-center gap-[0.4em]">
                        <span className="text-[1.25em] font-semibold tabular-nums tracking-[-0.02em]">
                            {number(locale, Math.round(847 * p))}
                        </span>
                        <span
                            className={cn(
                                "transition-[opacity,scale] duration-500 ease-spring-bounce",
                                done ? "scale-100 opacity-100" : "scale-50 opacity-0",
                            )}
                        >
                            <CircleCheck className="size-[1em] text-sys-green" />
                        </span>
                    </span>
                    <span className="block h-[0.4em] overflow-hidden rounded-full bg-fill">
                        <span
                            className="block h-full rounded-full"
                            style={{ width: `${p * 100}%`, background: "var(--ds-brand-gradient)" }}
                        />
                    </span>
                </span>
                <span className="relative h-[3.2em] w-[3.6em]">
                    {[0, 1, 2].map((sheet) => (
                        <span
                            key={sheet}
                            className="absolute inset-y-0 left-[0.6em] flex w-[2.4em] flex-col gap-[0.3em] rounded-[0.35em] bg-white p-[0.4em] shadow-[0_2px_6px_rgb(0_0_0/0.25)] transition-[rotate,translate] duration-700 ease-spring"
                            style={{
                                rotate: `${(sheet - 1) * 9 * p}deg`,
                                translate: `${(sheet - 1) * 0.5 * p}em 0`,
                            }}
                        >
                            <span className="block h-[0.3em] w-3/4 rounded-full bg-black/25" />
                            <span className="block h-[0.3em] w-1/2 rounded-full bg-black/15" />
                            <span className="mt-auto block h-[0.3em] w-2/3 rounded-full bg-emerald-500/60" />
                        </span>
                    ))}
                </span>
            </div>
        );
    }

    const shared = on(t, at + 1200);
    return (
        <div className="flex h-full items-center gap-[0.9em] rounded-[0.9em] ds-glass-inner px-[1em]">
            <Glyph icon={FileText} tone="orange" size={2.2} />
            <span className="flex min-w-0 flex-1 flex-col gap-[0.4em]">
                <Line w={6.5} className="h-[0.6em] bg-ink/70" />
                <Line w={8.5} className="opacity-70" />
                <Line w={7} className="opacity-50" />
            </span>
            <span className="flex items-center">
                {[200, 30, 130, 300].map((hue, index) => (
                    <span
                        key={hue}
                        className={cn(
                            "-ml-[0.45em] rounded-full ring-[0.12em] ring-white/20 transition-[opacity,translate] duration-500 ease-spring",
                            shared ? "translate-x-0 opacity-100" : "translate-x-[0.6em] opacity-0",
                        )}
                        style={{ transitionDelay: `${index * 70}ms` }}
                    >
                        <Avatar initials={["AM", "JL", "MR", "SP"][index]} hue={hue} size={1.5} />
                    </span>
                ))}
                <span
                    className={cn(
                        "ml-[0.4em] transition-[opacity,scale] duration-500 ease-spring-bounce",
                        shared ? "scale-100 opacity-100" : "scale-50 opacity-0",
                    )}
                >
                    <CircleCheck className="size-[1.1em] text-sys-green" />
                </span>
            </span>
        </div>
    );
}

function Orb({ size, thinking = false }: { size: number; thinking?: boolean }) {
    return (
        <span className="relative inline-flex shrink-0" style={{ width: `${size}em`, height: `${size}em` }}>
            <span
                className={cn(
                    "absolute inset-[-25%] rounded-full bg-[radial-gradient(circle,rgb(52_211_153/0.55),transparent_65%)] blur-[0.3em] transition-opacity duration-500",
                    thinking ? "animate-pulse opacity-100" : "opacity-70",
                )}
            />
            <EnaClover size={size} alive delay="-1.2s" className="relative" />
        </span>
    );
}

function EnaScene({ card, data, t, locale }: { card: CardKey; data: EnaCard; t: number; locale: string }) {
    const beat = beats(data);
    const prompt = typed(data.prompt, t, TYPE_AT, PER_CHAR);
    const sent = on(t, beat.send);
    const thinking = on(t, beat.think) && !on(t, beat.respond);
    const answer = streamed(data.response, t, beat.respond, PER_WORD);
    const draft = sent ? "" : prompt.text;

    return (
        <>
            <Artboard cols={28}>
                <At x={1.6} y={1.5} w={24.8} h={2} className="flex items-center gap-[0.6em]">
                    <Orb size={1.9} thinking={thinking} />
                    <span className="text-[0.9em] font-semibold">Ena</span>
                    <span className="size-[0.45em] rounded-full bg-sys-green" />
                </At>
                <At x={0.5} y={4.3} w={27} h={0.06} className="bg-hairline" />

                <At x={4.5} y={5.2} w={21.9} className="flex justify-end">
                    <Pop show={sent} className="max-w-full rounded-[1em] rounded-br-[0.3em] bg-fill px-[0.85em] py-[0.55em]">
                        <span className="block text-[0.82em] leading-[1.4]">{data.prompt}</span>
                    </Pop>
                </At>

                <At x={1.6} y={8.7} w={24.8} className="flex gap-[0.6em]">
                    <Pop show={on(t, beat.think)} from="scale">
                        <Orb size={1.5} thinking={thinking} />
                    </Pop>
                    <span className="relative min-w-0 flex-1 pt-[0.15em]">
                        <span
                            className={cn(
                                "absolute inset-x-0 top-[0.3em] flex flex-col gap-[0.45em] transition-opacity duration-300",
                                thinking ? "opacity-100" : "opacity-0",
                            )}
                        >
                            {[14, 9.5].map((w) => (
                                <span
                                    key={w}
                                    className="block h-[0.55em] animate-ds-shimmer rounded-full bg-[linear-gradient(90deg,rgb(255_255_255/0.08),rgb(110_231_183/0.45),rgb(255_255_255/0.08))] bg-[length:200%_100%]"
                                    style={{ width: `${w}em` }}
                                />
                            ))}
                        </span>
                        <span className="block text-[0.82em] leading-[1.45]">
                            {answer.words.map((word, index) => (
                                <span
                                    key={index}
                                    className={cn(
                                        "transition-[opacity,filter] duration-500",
                                        index < answer.shown ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
                                    )}
                                >
                                    {word}{" "}
                                </span>
                            ))}
                        </span>
                    </span>
                </At>

                <At x={3.6} y={13} w={22.8} h={4.8}>
                    <Pop show={on(t, beat.result)} className="h-full">
                        <Result card={card} t={t} at={beat.result} locale={locale} />
                    </Pop>
                </At>

                <At
                    x={1.6}
                    y={19.7}
                    w={24.8}
                    h={2.5}
                    className="flex items-center gap-[0.6em] rounded-full bg-fill-2 pl-[1em] pr-[0.35em] ring-1 ring-hairline"
                >
                    <span className="min-w-0 flex-1 truncate text-[0.8em]">
                        {draft}
                        {prompt.typing && !sent && (
                            <span className="ml-[0.1em] inline-block h-[1em] w-[0.12em] translate-y-[0.15em] animate-ds-caret bg-brand" />
                        )}
                    </span>
                    <span
                        className={cn(
                            "flex size-[1.6em] items-center justify-center rounded-full transition-colors duration-300",
                            draft ? "bg-brand text-black" : "bg-fill text-ink-3",
                        )}
                    >
                        <ArrowUp className="size-[0.9em]" strokeWidth={2.6} />
                    </span>
                </At>
            </Artboard>
        </>
    );
}

export default function EnaWizard({ cards, copy, locale }: Props) {
    const durations = useMemo(() => ORDER.map((key) => beats(cards[key]).duration), [cards]);
    const steps = ORDER.map((key) => ({
        key,
        icon: ICONS[key],
        title: cards[key].label,
        description: cards[key].title,
    }));

    return (
        <Wizard
            steps={steps}
            durations={durations}
            copy={copy}
            stageClassName="ena-device h-[22.5rem] bg-[#0b0b0d] ring-1 ring-white/10"
            sceneMotion="fade"
            backdrop={() => (
                <Artboard cols={28}>
                    <GlassOrbs orbs={ENA_ORBS} />
                    <div className="ds-glass absolute left-[0.5em] top-[0.6em] h-[22.8em] w-[27em]" />
                </Artboard>
            )}
            renderScene={(index, t) => (
                <EnaScene card={ORDER[index]} data={cards[ORDER[index]]} t={t} locale={locale} />
            )}
        />
    );
}
