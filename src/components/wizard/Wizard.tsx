import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronRight, Gauge, Pause, Play, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useWizardClock, type DemoSpeed } from "./use-wizard-clock";

/*
 * A showcase that plays itself: the list on the left carries the words, the stage on the right
 * plays the product for the item in hand, and the next one follows when it is done. Not a sequence
 * of steps — no numbers, no ticks for "done" — but one animation through several features, each of
 * which can be picked to play on its own. Shared by the home page's key features and Ena.
 *
 * Every title and description is in the server markup, so the words never wait on scripting. It
 * owes what anything that moves on its own owes (WCAG 2.2.2): a pause, a stop whenever it is off
 * screen, and the controls handed to anyone who picks an item.
 */

export interface WizardStep {
    key: string;
    icon: LucideIcon;
    title: string;
    description: string;
    /** A small line above the title (Ena's "@Ena Agente"). */
    label?: string;
    /** Where the feature lives, shown under the item in hand. */
    href?: string;
}

export interface WizardCopy {
    label: string;
    play: string;
    pause: string;
    speed: string;
    /** The text of `href` links ("Ir a la funcionalidad"). */
    link?: string;
}

interface Props {
    steps: WizardStep[];
    /** Each item's scene length in ms of scene time. Pass a constant. */
    durations: readonly number[];
    renderScene: (index: number, t: number) => ReactNode;
    copy: WizardCopy;
    /** The stage's ground; a tile by default. */
    stageClassName?: string;
    /**
     * Drawn under the scenes and kept across items: the product's window, so moving to the next
     * feature navigates inside one app instead of swapping pictures. Only the scenes change.
     */
    backdrop?: (index: number) => ReactNode;
    /** `slide` moves scenes the way the list went; `fade` dissolves them in place (over a backdrop). */
    sceneMotion?: "slide" | "fade";
}

/** The item's icon: ink when in hand, quiet otherwise. */
function ItemBadge({ icon: Icon, active }: { icon: LucideIcon; active: boolean }) {
    return (
        <span
            className={cn(
                "relative flex size-9 shrink-0 items-center justify-center rounded-[0.75rem] transition-[background-color,color] duration-300 ease-fluid",
                active ? "bg-ink text-canvas" : "bg-fill-2 text-ink-3",
            )}
        >
            <Icon className="size-4" aria-hidden />
        </span>
    );
}

/** How far the item in hand has played: a hairline that fills, as Apple's highlights do. */
function Progress({ amount, live }: { amount: number; live: boolean }) {
    return (
        <span aria-hidden className="relative block h-[2px] overflow-hidden rounded-full bg-fill motion-reduce:hidden">
            <span
                className={cn("absolute inset-0 origin-left bg-brand", !live && "transition-transform duration-500 ease-fluid")}
                style={{ transform: `scaleX(${amount})` }}
            />
        </span>
    );
}

const PILL =
    "flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 type-caption text-ink-2 material elev-1 transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]";

function DemoControls({
    playing,
    onPlayingChange,
    speed,
    onSpeedChange,
    copy,
}: {
    playing: boolean;
    onPlayingChange: (playing: boolean) => void;
    speed: DemoSpeed;
    onSpeedChange: (speed: DemoSpeed) => void;
    copy: WizardCopy;
}) {
    return (
        <div className="pointer-events-auto ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => onPlayingChange(!playing)} aria-pressed={playing} className={PILL}>
                {playing ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
                {playing ? copy.pause : copy.play}
            </button>
            <button
                type="button"
                onClick={() => onSpeedChange(speed === 1 ? 2 : 1)}
                aria-label={`${copy.speed} · ${speed}×`}
                title={copy.speed}
                className={PILL}
            >
                <Gauge className="size-3.5" aria-hidden />
                <span className="tabular-nums">{speed}×</span>
            </button>
        </div>
    );
}

/**
 * The stage's scenes. The one in hand enters, the one leaving goes at its finished frame and is
 * dropped once it has gone: sliding the way the list went, or dissolving in place.
 */
function SceneLayers({
    step,
    direction,
    t,
    renderScene,
    motion,
}: {
    step: number;
    direction: number;
    t: number;
    renderScene: Props["renderScene"];
    motion: NonNullable<Props["sceneMotion"]>;
}) {
    // The item shown last render, kept so a change can be seen while rendering (React's pattern for
    // state derived from a previous prop) rather than an effect after a frame of the wrong scene.
    const [shown, setShown] = useState(step);
    const [leaving, setLeaving] = useState<{ step: number; direction: number } | null>(null);
    const [changed, setChanged] = useState(false);
    if (step !== shown) {
        setShown(step);
        setLeaving({ step: shown, direction });
        setChanged(true);
    }

    useEffect(() => {
        if (!leaving) return;
        const id = window.setTimeout(() => setLeaving(null), 460);
        return () => window.clearTimeout(id);
    }, [leaving]);

    const out = motion === "fade" ? "animate-ds-scene-fade-out" : "animate-ds-scene-out";
    const enter = motion === "fade" ? "animate-ds-scene-fade-in" : "animate-ds-scene-in";

    return (
        <>
            {leaving && leaving.step !== step && (
                <div
                    key={`out-${leaving.step}`}
                    aria-hidden
                    className={cn("pointer-events-none absolute inset-0 motion-reduce:hidden", out)}
                    style={{ ["--dir" as string]: leaving.direction }}
                >
                    {renderScene(leaving.step, Number.POSITIVE_INFINITY)}
                </div>
            )}
            {/* No entrance on the first scene: it is in the server markup and must not flash. */}
            <div
                key={`in-${step}`}
                className={cn("absolute inset-0", changed && enter)}
                style={{ ["--dir" as string]: direction }}
            >
                {renderScene(step, t)}
            </div>
        </>
    );
}

export function Wizard({ steps, durations, renderScene, copy, stageClassName, backdrop, sceneMotion = "slide" }: Props) {
    const uid = useId().replace(/:/g, "");
    const stageId = `${uid}-stage`;
    const { rootRef, reduceMotion, step, direction, sceneTime, playing, speed, setSpeed, pick, takeOver, resume } =
        useWizardClock(durations);

    // The item in hand's progress through its own animation, whether it is touring or was picked.
    const progress = Math.min(1, Math.max(0, sceneTime) / durations[step]);
    const live = playing && progress < 1;

    return (
        <div
            ref={rootRef}
            role="region"
            aria-label={copy.label}
            className="grid w-full gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10"
        >
            {/*
                On a phone the item in hand heads the stage: the icons in a row, and only its words.
                Every item's words are stacked in one cell, so the cell is as tall as the longest and
                the stage under it never jumps, in any language. Without scripting there is no item
                in hand, and the full list is shown instead.
            */}
            <div className="lg:hidden [@media(scripting:none)]:hidden">
                <ul className="flex items-center justify-between gap-2">
                    {steps.map((item, index) => (
                        <li key={item.key}>
                            <button
                                type="button"
                                onClick={() => pick(index)}
                                aria-label={item.title}
                                aria-current={index === step ? "true" : undefined}
                                aria-controls={stageId}
                                className="cursor-pointer rounded-[0.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]"
                            >
                                <ItemBadge icon={item.icon} active={index === step} />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-5 grid">
                    {steps.map((item, index) => {
                        const current = index === step;
                        return (
                            <div
                                key={item.key}
                                aria-hidden={!current}
                                className={cn(
                                    "[grid-area:1/1] transition-[opacity,translate] duration-500 ease-spring motion-reduce:transition-none",
                                    current
                                        ? "translate-x-0 opacity-100"
                                        : cn("pointer-events-none opacity-0", index < step ? "-translate-x-4" : "translate-x-4"),
                                )}
                            >
                                {item.label && <p className="type-caption text-ink-3">{item.label}</p>}
                                <h3 className="mt-1 type-title-3 text-ink">{item.title}</h3>
                                <p className="mt-1 type-callout text-ink-2">{item.description}</p>
                                {item.href && copy.link && (
                                    <a href={item.href} tabIndex={current ? undefined : -1} className="ds-link mt-2 type-callout">
                                        {copy.link}
                                        <ChevronRight aria-hidden />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4">
                    <Progress amount={progress} live={live} />
                </div>
            </div>

            <ul className="hidden self-center lg:block [@media(scripting:none)]:block">
                {steps.map((item, index) => {
                    const active = index === step;
                    return (
                        <li key={item.key} className="relative">
                            <button
                                type="button"
                                onClick={() => pick(index)}
                                aria-current={active ? "true" : undefined}
                                aria-controls={stageId}
                                className={cn(
                                    "flex w-full cursor-pointer items-start gap-3.5 rounded-[1.125rem] p-3 text-start transition-colors duration-300 ease-fluid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ds-focus)]",
                                    !active && "hover:bg-fill-2",
                                )}
                            >
                                <ItemBadge icon={item.icon} active={active} />
                                <span className="min-w-0 flex-1">
                                    {item.label && <span className="block type-caption text-ink-3">{item.label}</span>}
                                    <span
                                        className={cn(
                                            "flex items-center type-title-3 transition-colors duration-300",
                                            item.label ? "min-h-6" : "min-h-9",
                                            active ? "text-ink" : "text-ink-2",
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                    {/* Open for the item in hand; every one is open without scripting. */}
                                    <span
                                        className={cn(
                                            "grid transition-[grid-template-rows] duration-500 ease-fluid motion-reduce:transition-none",
                                            active ? "grid-rows-[1fr]" : "grid-rows-[0fr] [@media(scripting:none)]:grid-rows-[1fr]",
                                        )}
                                    >
                                        <span className="min-h-0 overflow-hidden">
                                            <span className="block pt-1 type-callout text-ink-2">{item.description}</span>
                                            <span className="mt-3 block [@media(scripting:none)]:hidden">
                                                <Progress amount={active ? progress : 0} live={active && live} />
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </button>
                            {item.href && copy.link && (
                                <span
                                    className={cn(
                                        "grid pl-[3.75rem] transition-[grid-template-rows,opacity] duration-500 ease-fluid motion-reduce:transition-none",
                                        active
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0 [@media(scripting:none)]:grid-rows-[1fr] [@media(scripting:none)]:opacity-100",
                                    )}
                                >
                                    <span className="min-h-0 overflow-hidden">
                                        <a href={item.href} tabIndex={active ? undefined : -1} className="ds-link mb-2 type-callout">
                                            {copy.link}
                                            <ChevronRight aria-hidden />
                                        </a>
                                    </span>
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div
                id={stageId}
                className={cn(
                    "relative isolate h-[20rem] overflow-hidden rounded-tile bg-canvas-2 sm:h-[30rem] lg:h-[36rem]",
                    stageClassName,
                )}
            >
                {backdrop?.(step)}
                <SceneLayers step={step} direction={direction} t={sceneTime} renderScene={renderScene} motion={sceneMotion} />
                {!reduceMotion && (
                    <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex items-center gap-2">
                        <DemoControls
                            playing={playing}
                            onPlayingChange={(next) => (next ? resume() : takeOver())}
                            speed={speed}
                            onSpeedChange={setSpeed}
                            copy={copy}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wizard;
