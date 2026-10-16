import type { ReactNode } from "react";
import { BookOpen, ChevronDown, CircleDot, GitBranch, GitFork, GitMerge, History, Megaphone, Plus, Receipt, Sparkles, UserPlus, X, Zap, type LucideIcon } from "lucide-react";

import { CONTENT } from "@/components/wizard/glass-stage";
import { ScenePlayer, type SceneSpec } from "@/components/wizard/ScenePlayer";
import { At, Pop, clamp01, easeInOut, easeOut, number, on, percent, span } from "@/components/wizard/scene-kit";
import { DrawnCheck, Ripple, Title } from "@/modules/home/KeyFeaturesScenes";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Caps, Fresh, Pill, SettlePill, Toggle, between } from "./kit";
import type { ProductSceneLabels } from "./labels";

export type WorkflowLabels = ProductSceneLabels & { wf: Translation["workflowScenes"] };

/*
 * The automations page's scenes, drawn from `screenshots/workflows/*`:
 *
 *   canvas    (hero) a workflow on its canvas, its trigger set; then it runs: a light goes down
 *             the flow and each step is ticked
 *   insert    a step inserted between two: the kinds of step offered, a condition chosen
 *   triggers  a trigger chosen: a module, then one of its events; the flow it starts follows
 *   parallel  a flow that splits in two and joins again, running
 *   history   the runs as they happen, all completed
 *
 * Each is a pure function of `t`; `Infinity` is its finished frame.
 */

interface Props {
    t: number;
    labels: WorkflowLabels;
    locale: string;
}

const W = CONTENT.w;
const DOTS = { backgroundImage: "radial-gradient(circle, var(--ds-hairline-strong) 0.06em, transparent 0.07em)", backgroundSize: "0.9em 0.9em" };

/** A step on the canvas: its icon, its kind, its name; ringed and ticked once it has run. */
function Node({
    icon: Icon,
    kind,
    name,
    selected = false,
    ran = -1,
    t,
    className,
}: {
    icon: LucideIcon;
    kind: string;
    name?: string;
    selected?: boolean;
    /** When the run reaches it, on the scene's clock. */
    ran?: number;
    t: number;
    className?: string;
}) {
    const done = ran >= 0 && t >= ran;
    return (
        <span
            className={cn(
                "relative flex h-full items-center gap-[0.55em] rounded-[0.6em] bg-surface px-[0.6em] ring-1 transition-[box-shadow] duration-500",
                selected ? "ring-[0.12em] ring-ink" : "ring-hairline",
                done && "ring-[0.12em] ring-green-500",
                "elev-1",
                className,
            )}
        >
            <span className="flex size-[1.5em] shrink-0 items-center justify-center rounded-[0.4em] bg-fill-2">
                <Icon className="size-[0.7em]" />
            </span>
            <span className="flex min-w-0 flex-col gap-[0.2em]">
                <span className="truncate text-[0.34em] font-semibold uppercase tracking-[0.1em] text-ink-3">{kind}</span>
                {name && <span className="truncate text-[0.5em] font-medium">{name}</span>}
            </span>
            {done && (
                <span className="absolute -right-[0.35em] -top-[0.35em] grid size-[0.95em] place-items-center rounded-full bg-green-500 text-white ring-[0.12em] ring-canvas">
                    <span className="size-[0.7em]">
                        <DrawnCheck p={span(t, ran, 450)} className="size-full" />
                    </span>
                    <Ripple p={span(t, ran, 800)} className="text-green-500" />
                </span>
            )}
        </span>
    );
}

/** A vertical link between steps, drawn from the top as `p` goes from 0 to 1. */
function Link({ x, y, h, p }: { x: number; y: number; h: number; p: number }) {
    return (
        <At x={x - 0.04} y={y} w={0.08} h={h} className="overflow-hidden">
            <span className="block size-full origin-top bg-ink-3/60" style={{ transform: `scaleY(${p})` }} />
        </At>
    );
}

/** The run, as a light moving down the flow. */
function Spark({ x, y, show }: { x: number; y: number; show: boolean }) {
    if (!show) return null;
    return (
        <At x={x} y={y} className="pointer-events-none z-20">
            <span className="absolute -left-[0.7em] -top-[0.7em] size-[1.4em] rounded-full bg-brand/40 blur-[0.3em]" />
            <span className="absolute -left-[0.22em] -top-[0.22em] size-[0.44em] rounded-full bg-white shadow-[0_0_0.5em_rgb(34_197_94/0.9)]" />
        </At>
    );
}

function PlusButton({ x, y, show, pressed = false }: { x: number; y: number; show: boolean; pressed?: boolean }) {
    return (
        <At x={x - 0.45} y={y - 0.45} w={0.9} h={0.9}>
            <Pop show={show} from="scale" className="size-full">
                <span className={cn("grid size-full place-items-center rounded-[0.25em] bg-ink text-canvas transition-[scale,box-shadow] duration-200", pressed && "scale-90 shadow-[0_0_0_0.3em_rgb(34_197_94/0.3)]")}>
                    <Plus className="size-[0.6em]" />
                </span>
            </Pop>
        </At>
    );
}

function Select({ icon: Icon, value, open = false }: { icon?: LucideIcon; value: ReactNode; open?: boolean }) {
    return (
        <span className={cn("flex h-[1.55em] items-center gap-[0.4em] rounded-[0.45em] bg-fill px-[0.55em] transition-shadow duration-300", open && "ring-[0.1em] ring-ink/40")}>
            {Icon && <Icon className="size-[0.6em] text-ink-2" />}
            <span className="min-w-0 flex-1 truncate text-[0.46em]">{value}</span>
            <ChevronDown className="size-[0.55em] text-ink-3" />
        </span>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* canvas · a workflow, and its run                                                               */
/* ---------------------------------------------------------------------------------------------- */

const CANVAS = { x: 0, y: 2.5, w: 19.4, h: 18.1 };
const CX = CANVAS.x + CANVAS.w / 2;
const NODE_W = 11;
const STEPS = [
    { y: 3.5, at: 200 },
    { y: 9.1, at: 600 },
    { y: 14.7, at: 1000 },
];
const NODE_H = 2.6;
const RUN = { from: 2000, step: 650 };

function CanvasScene({ t, labels }: Props) {
    const { wf } = labels;
    const run = (index: number) => RUN.from + index * RUN.step;
    const runP = span(t, RUN.from, RUN.step * 2);
    const sparkY = STEPS[0].y + NODE_H / 2 + (STEPS[2].y - STEPS[0].y) * easeInOut(runP);
    const ran = on(t, run(2) + 200);

    return (
        <>
            <Title
                aside={
                    <>
                        <Pill tone="green">{wf.active}</Pill>
                        <span className="flex size-[1.55em] items-center justify-center rounded-[0.45em] ds-glass-inner">
                            <History className="size-[0.68em] text-ink-2" />
                        </span>
                    </>
                }
            >
                {wf.workflowNames[0]}
            </Title>

            <At {...CANVAS} className="rounded-[0.9em] bg-fill/50" style={DOTS} />

            {[0, 1].map((index) => {
                const from = STEPS[index].y + NODE_H;
                const h = STEPS[index + 1].y - from;
                return (
                    <div key={index}>
                        <Link x={CX} y={from} h={h} p={easeOut(span(t, STEPS[index].at + 200, 400))} />
                        <PlusButton x={CX} y={from + h / 2} show={on(t, STEPS[index].at + 400)} />
                    </div>
                );
            })}
            {[
                [Zap, wf.eventTrigger, wf.extraEvent],
                [Zap, wf.action, wf.sendNotification],
                [CircleDot, wf.output, undefined],
            ].map(([icon, kind, name], index) => (
                <At key={index} x={CX - NODE_W / 2} y={STEPS[index].y} w={NODE_W} h={NODE_H}>
                    <Pop show={on(t, STEPS[index].at)} from="up" className="h-full">
                        <Node t={t} icon={icon as LucideIcon} kind={kind as string} name={name as string | undefined} selected={index === 0 && !on(t, RUN.from)} ran={run(index)} />
                    </Pop>
                </At>
            ))}
            <Spark x={CX} y={sparkY} show={between(t, RUN.from, run(2))} />

            {/* The trigger's settings. */}
            <At x={20} y={2.5} w={W - 20} h={18.1}>
                <Pop show={on(t, 400)} from="up" className="flex h-full flex-col gap-[0.65em] rounded-[0.9em] p-[0.8em] ds-glass-inner">
                    <span className="flex items-center gap-[0.45em]">
                        <span className="flex size-[1.4em] items-center justify-center rounded-[0.4em] bg-surface ring-1 ring-hairline">
                            <Zap className="size-[0.65em]" />
                        </span>
                        <span className="min-w-0 flex-1 text-[0.4em] font-semibold uppercase leading-tight tracking-[0.1em] text-ink-2">{wf.eventTrigger}</span>
                        <X className="size-[0.55em] shrink-0 text-ink-3" />
                    </span>
                    <span className="flex flex-col gap-[0.3em]">
                        <Caps tone="text-ink-3">{wf.scope}</Caps>
                        <Select icon={Sparkles} value={wf.scopes[0]} />
                    </span>
                    <span className="flex flex-col gap-[0.3em]">
                        <Caps tone="text-ink-3">{wf.event}</Caps>
                        <Select value={wf.extraEvent} />
                    </span>
                    <Pop show={ran} from="up" className="mt-[0.4em] flex items-center gap-[0.35em] rounded-[0.5em] bg-green-100 px-[0.55em] py-[0.4em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                        <span className="size-[0.75em]">
                            <DrawnCheck p={span(t, run(2) + 300, 450)} className="size-full" />
                        </span>
                        <span className="text-[0.42em] font-semibold">{wf.ranIn}</span>
                    </Pop>
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* insert · a step between two                                                                    */
/* ---------------------------------------------------------------------------------------------- */

const INSERT = { press: 900, sheet: 1050, pick: 1800, confirm: 2500, closed: 2750, placed: 2950 };
const STEP_ICONS: LucideIcon[] = [Zap, GitBranch, GitFork, GitMerge];
const ASIDE = 7.4;
const I_W = 11.4;

function InsertScene({ t, labels }: Props) {
    const { wf } = labels;
    // Centred on the canvas; it steps aside while the menu is open, and comes back.
    const aside = easeInOut(span(t, INSERT.press - 100, 500)) * (1 - easeInOut(span(t, INSERT.closed - 100, 600)));
    const ICX = W / 2 - (W / 2 - ASIDE) * aside;
    const sheet = between(t, INSERT.sheet, INSERT.closed);
    const placed = easeInOut(span(t, INSERT.placed, 600));
    const pick = on(t, INSERT.pick) ? 1 : 0;
    const outputY = 6.6 + 5.1 * placed;

    return (
        <>
            <At x={0} y={0} w={W} h={20.6} className="rounded-[0.9em] bg-fill/50" style={DOTS} />

            <At x={ICX - I_W / 2} y={1} w={I_W} h={NODE_H}>
                <Pop show={on(t, 100)} from="up" className="h-full">
                    <Node t={t} icon={Zap} kind={wf.eventTrigger} name={wf.billingEvents[0]} />
                </Pop>
            </At>
            <Link x={ICX} y={1 + NODE_H} h={outputY - 1 - NODE_H} p={1} />
            <PlusButton x={ICX} y={1 + NODE_H + (6.6 - 1 - NODE_H) / 2} show={!on(t, INSERT.placed)} pressed={between(t, INSERT.press - 200, INSERT.sheet)} />

            {/* The new step, slid into the gap. */}
            <At x={ICX - I_W / 2} y={6.6} w={I_W} h={NODE_H} className="z-10">
                <Pop show={on(t, INSERT.placed + 150)} from="scale" className="relative h-full">
                    <Fresh t={t} at={INSERT.placed + 150} className="rounded-[0.6em]" />
                    <Node t={t} icon={GitBranch} kind={wf.stepTypes[1]} name={wf.conditionRule} selected />
                </Pop>
            </At>
            <At x={ICX - I_W / 2} y={outputY} w={I_W} h={NODE_H}>
                <Pop show={on(t, 200)} from="up" className="h-full">
                    <Node t={t} icon={CircleDot} kind={wf.output} />
                </Pop>
            </At>
            <PlusButton x={ICX} y={6.6 + NODE_H + 1.25} show={on(t, INSERT.placed + 400)} />

            {/* The kinds of step on offer. */}
            <At x={14.6} y={0.6} w={W - 15} h={19.4}>
                <div
                    className={cn(
                        "flex h-full flex-col gap-[0.5em] rounded-[0.9em] bg-surface p-[0.8em] elev-4 ring-1 ring-hairline transition-[opacity,translate,scale] duration-500 ease-spring",
                        sheet ? "translate-y-0 scale-100 opacity-100" : "translate-y-[0.8em] scale-[0.97] opacity-0",
                    )}
                >
                    <span className="flex items-center justify-between">
                        <span className="text-[0.5em] font-bold uppercase tracking-[0.08em]">{wf.insertStep}</span>
                        <X className="size-[0.55em] text-ink-3" />
                    </span>
                    <span className="relative flex flex-col gap-[0.35em]">
                        <span className="absolute inset-x-0 top-0 h-[2.5em] rounded-[0.55em] ring-[0.1em] ring-ink transition-transform duration-500 ease-spring" style={{ transform: `translateY(${pick * 2.85}em)` }} />
                        {wf.stepTypes.map((type, index) => {
                            const Icon = STEP_ICONS[index];
                            return (
                                <span key={type} className="flex h-[2.5em] items-center gap-[0.5em] rounded-[0.55em] bg-fill/70 px-[0.55em]">
                                    <span className="flex size-[1.35em] shrink-0 items-center justify-center rounded-[0.35em] bg-surface">
                                        <Icon className="size-[0.6em]" />
                                    </span>
                                    <span className="flex min-w-0 flex-col gap-[0.2em]">
                                        <span className="text-[0.4em] font-bold uppercase tracking-[0.08em]">{type}</span>
                                        <span className="truncate text-[0.38em] text-ink-2">{wf.stepDescs[index]}</span>
                                    </span>
                                </span>
                            );
                        })}
                    </span>
                    <span className={cn("mt-[0.3em] grid h-[1.7em] place-items-center rounded-[0.5em] bg-ink text-canvas transition-[scale] duration-200", between(t, INSERT.confirm - 200, INSERT.confirm) && "scale-95")}>
                        <span className="text-[0.46em] font-semibold">{wf.insertStep}</span>
                    </span>
                </div>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* triggers · a module, then one of its events                                                    */
/* ---------------------------------------------------------------------------------------------- */

const SCOPE_ICONS: LucideIcon[] = [Sparkles, Receipt, BookOpen, UserPlus, Megaphone];
const TRIGGER = { scopeOpen: 700, scopePick: 1300, scopeClose: 1600, eventOpen: 2100, eventPick: 2600, eventClose: 2900, done: 3200 };
const PANEL_W = 16.6;

function TriggersScene({ t, labels }: Props) {
    const { wf } = labels;
    const scopeOpen = between(t, TRIGGER.scopeOpen, TRIGGER.scopeClose);
    const eventOpen = between(t, TRIGGER.eventOpen, TRIGGER.eventClose);
    const scope = on(t, TRIGGER.scopeClose) ? 1 : 0;
    const event = on(t, TRIGGER.eventClose) ? 1 : -1;
    const scopeHighlight = on(t, TRIGGER.scopePick) ? 1 : 0;
    const eventHighlight = on(t, TRIGGER.eventPick) ? 1 : 0;
    const menu = "absolute inset-x-0 top-[1.75em] z-30 flex flex-col rounded-[0.6em] bg-surface p-[0.25em] elev-4 ring-1 ring-hairline transition-[opacity,translate,scale] duration-300 ease-spring";

    return (
        <>
            {/* The trigger's settings. */}
            <At x={0} y={0} w={PANEL_W} h={20.6} className="flex flex-col gap-[0.75em]">
                <span className="flex items-center gap-[0.5em] rounded-[0.7em] p-[0.55em] ds-glass-inner">
                    <span className="flex size-[1.6em] items-center justify-center rounded-[0.45em] bg-surface ring-1 ring-hairline">
                        <Zap className="size-[0.7em]" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-[0.25em]">
                        <span className="text-[0.42em] font-bold uppercase tracking-[0.08em]">{wf.eventTrigger}</span>
                        <span className="truncate text-[0.4em] text-ink-2">{wf.triggerHint}</span>
                    </span>
                </span>
                <span className="text-[0.46em] font-bold uppercase tracking-[0.1em]">{wf.configuration}</span>
                <span className="relative z-20 flex flex-col gap-[0.3em]">
                    <Caps tone="text-ink-3">{wf.scope}</Caps>
                    <span className="relative">
                        <Select icon={SCOPE_ICONS[scope]} value={wf.scopes[scope]} open={scopeOpen} />
                        <span className={cn(menu, scopeOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-[0.4em] scale-95 opacity-0")}>
                            <span className="absolute inset-x-[0.25em] top-[0.25em] h-[1.45em] rounded-[0.4em] bg-fill-2 transition-transform duration-300 ease-spring" style={{ transform: `translateY(${scopeHighlight * 1.45}em)` }} />
                            {wf.scopes.map((name, index) => {
                                const Icon = SCOPE_ICONS[index];
                                return (
                                    <span key={name} className="relative flex h-[1.45em] items-center gap-[0.4em] px-[0.45em]">
                                        <Icon className="size-[0.55em] text-ink-2" />
                                        <span className="text-[0.44em]">{name}</span>
                                    </span>
                                );
                            })}
                        </span>
                    </span>
                </span>
                <span className="relative z-10 flex flex-col gap-[0.3em]">
                    <Caps tone="text-ink-3">{wf.event}</Caps>
                    <span className="relative">
                        <Select value={event < 0 ? <span className="text-ink-3">{wf.chooseEvent}</span> : wf.billingEvents[event]} open={eventOpen} />
                        <span className={cn(menu, eventOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-[0.4em] scale-95 opacity-0")}>
                            <span className="absolute inset-x-[0.25em] top-[0.25em] h-[1.45em] rounded-[0.4em] bg-fill-2 transition-transform duration-300 ease-spring" style={{ transform: `translateY(${eventHighlight * 1.45}em)` }} />
                            {wf.billingEvents.map((name) => (
                                <span key={name} className="relative flex h-[1.45em] items-center px-[0.45em]">
                                    <span className="text-[0.44em]">{name}</span>
                                </span>
                            ))}
                        </span>
                    </span>
                </span>
                <Pop show={on(t, TRIGGER.done)} from="up" className="flex items-center gap-[0.35em] rounded-[0.5em] bg-green-100 px-[0.55em] py-[0.45em] text-green-700 dark:bg-green-500/15 dark:text-green-400">
                    <span className="size-[0.75em]">
                        <DrawnCheck p={span(t, TRIGGER.done + 100, 450)} className="size-full" />
                    </span>
                    <span className="text-[0.42em] font-semibold">{wf.willRun}</span>
                </Pop>
            </At>

            {/* The flow it starts, following the choice. */}
            <At x={PANEL_W + 0.8} y={0} w={W - PANEL_W - 0.8} h={20.6} className="rounded-[0.9em] bg-fill/50" style={DOTS} />
            <At x={PANEL_W + 1.6} y={2.4} w={W - PANEL_W - 2.4} h={NODE_H}>
                <Pop show={on(t, 200)} from="up" className="h-full">
                    <Node
                        t={t}
                        icon={Zap}
                        kind={wf.eventTrigger}
                        name={event < 0 ? wf.scopes[scope] : wf.billingEvents[event]}
                        selected
                    />
                </Pop>
            </At>
            <Link x={PANEL_W + 0.8 + (W - PANEL_W - 0.8) / 2} y={2.4 + NODE_H} h={3} p={easeOut(span(t, 400, 400))} />
            <At x={PANEL_W + 1.6} y={8} w={W - PANEL_W - 2.4} h={NODE_H}>
                <Pop show={on(t, 500)} from="up" className="h-full">
                    <Node t={t} icon={Zap} kind={wf.action} name={wf.sendReceipt} ran={TRIGGER.done + 200} />
                </Pop>
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* parallel · two branches at once                                                                */
/* ---------------------------------------------------------------------------------------------- */

const P = { cx: W / 2, trigger: 1.2, split: 5.4, branch: 10.4, join: 15.6, branchX: 7.4, nodeW: 10.4 };
const PRUN = { from: 1700, split: 2300, branches: 3000, join: 3600 };

function ParallelScene({ t, labels, locale }: Props) {
    const { wf } = labels;
    const left = P.cx - P.branchX;
    const right = P.cx + P.branchX;
    const draw = easeOut(span(t, 700, 700));
    // The light: down to the split, out to both branches at once, back to the join.
    const p1 = easeInOut(span(t, PRUN.from, PRUN.split - PRUN.from));
    const p2 = easeInOut(span(t, PRUN.split, PRUN.branches - PRUN.split));
    const p3 = easeInOut(span(t, PRUN.branches, PRUN.join - PRUN.branches));
    const sparks: { x: number; y: number }[] = [];
    if (between(t, PRUN.from, PRUN.split)) sparks.push({ x: P.cx, y: P.trigger + NODE_H + (P.split - P.trigger - NODE_H) * p1 });
    if (between(t, PRUN.split, PRUN.branches)) {
        const y = P.split + NODE_H + (P.branch - P.split - NODE_H) * p2;
        sparks.push({ x: P.cx - P.branchX * p2, y }, { x: P.cx + P.branchX * p2, y });
    }
    if (between(t, PRUN.branches, PRUN.join)) {
        const y = P.branch + NODE_H + (P.join - P.branch - NODE_H) * p3;
        sparks.push({ x: left + P.branchX * p3, y }, { x: right - P.branchX * p3, y });
    }
    const runs = 128 + (on(t, PRUN.join + 200) ? 1 : 0);
    const line = "absolute bg-ink-3/60";

    return (
        <>
            <At x={0} y={0} w={W} h={20.6} className="rounded-[0.9em] bg-fill/50" style={DOTS} />
            <At x={W - 8.2} y={0.6} w={7.6} className="flex justify-end">
                <span className="flex items-center gap-[0.35em] rounded-full bg-surface px-[0.65em] py-[0.25em] ring-1 ring-hairline">
                    <span className="text-[0.42em] text-ink-2">{wf.runsToday}</span>
                    <span key={runs} className="animate-[ds-pop_350ms_var(--ease-spring-bounce)] text-[0.46em] font-semibold tabular-nums">
                        {number(locale, runs)}
                    </span>
                </span>
            </At>

            {/* The links, drawn as the flow appears. */}
            <div className="absolute inset-0" style={{ opacity: draw }}>
                <At x={P.cx - 0.04} y={P.trigger + NODE_H} w={0.08} h={P.split - P.trigger - NODE_H} className="bg-ink-3/60" />
                <At x={left} y={(P.split + NODE_H + P.branch) / 2} w={right - left} h={0.08} className="bg-ink-3/60" />
                <At x={P.cx - 0.04} y={P.split + NODE_H} w={0.08} h={(P.branch - P.split - NODE_H) / 2} className="bg-ink-3/60" />
                {[left, right].map((x) => (
                    <div key={x}>
                        <At x={x - 0.04} y={(P.split + NODE_H + P.branch) / 2} w={0.08} h={(P.branch - P.split - NODE_H) / 2} className={line} />
                        <At x={x - 0.04} y={P.branch + NODE_H} w={0.08} h={(P.join - P.branch - NODE_H) / 2} className={line} />
                    </div>
                ))}
                <At x={left} y={(P.branch + NODE_H + P.join) / 2} w={right - left} h={0.08} className="bg-ink-3/60" />
                <At x={P.cx - 0.04} y={(P.branch + NODE_H + P.join) / 2} w={0.08} h={(P.join - P.branch - NODE_H) / 2} className="bg-ink-3/60" />
            </div>

            {[
                { x: P.cx, y: P.trigger, icon: Zap, kind: wf.eventTrigger, name: wf.billingEvents[0], ran: PRUN.from, at: 100 },
                { x: P.cx, y: P.split, icon: GitFork, kind: wf.stepTypes[2], name: wf.stepTypes[2], ran: PRUN.split, at: 300 },
                { x: left, y: P.branch, icon: Zap, kind: wf.action, name: wf.sendNotification, ran: PRUN.branches, at: 500 },
                { x: right, y: P.branch, icon: Zap, kind: wf.action, name: wf.sendInternal, ran: PRUN.branches, at: 500 },
                { x: P.cx, y: P.join, icon: CircleDot, kind: wf.output, name: undefined, ran: PRUN.join, at: 700 },
            ].map((node, index) => (
                <At key={index} x={node.x - P.nodeW / 2} y={node.y} w={P.nodeW} h={NODE_H}>
                    <Pop show={on(t, node.at)} from="up" className="h-full">
                        <Node t={t} icon={node.icon} kind={node.kind} name={node.name} ran={node.ran} />
                    </Pop>
                </At>
            ))}
            {sparks.map((spark, index) => (
                <Spark key={index} x={spark.x} y={spark.y} show />
            ))}
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */
/* history · the runs, as they happen                                                             */
/* ---------------------------------------------------------------------------------------------- */

const LANDS = [1000, 1900, 2800];
const DONE_AFTER = 500;
const PAST = [
    { workflow: 1, time: "10:41", ms: 380 },
    { workflow: 2, time: "10:12", ms: 420 },
    { workflow: 0, time: "09:58", ms: 350 },
    { workflow: 3, time: "09:30", ms: 460 },
];
const NEW = [
    { workflow: 0, time: "11:02", ms: 360 },
    { workflow: 3, time: "11:04", ms: 410 },
    { workflow: 1, time: "11:05", ms: 390 },
];

function HistoryScene({ t, labels, locale }: Props) {
    const { wf } = labels;
    const landed = LANDS.filter((at) => on(t, at)).length;
    const rows = [...NEW.slice(0, landed).map((run, index) => ({ ...run, at: LANDS[index] })).reverse(), ...PAST.map((run) => ({ ...run, at: -1 }))];
    const count = 1284 + landed;

    return (
        <>
            <Title aside={<Toggle on />}>{wf.runHistory}</Title>

            {[
                [wf.runs, <span key="r" className="text-[1.15em] font-light tabular-nums tracking-[-0.03em]">{number(locale, count)}</span>, "bg-fill-2 text-ink"],
                [wf.success, <span key="s" className="text-[1.15em] font-light tabular-nums tracking-[-0.03em]">{percent(locale, 100 * easeOut(span(t, 200, 1200)), 0)}</span>, "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"],
                [wf.avgTime, <span key="a" className="text-[1.15em] font-light tabular-nums tracking-[-0.03em]">{number(locale, 0.4, 1)} s</span>, "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"],
            ].map(([label, value, tone], index) => (
                <At key={index} x={index * 10.2} y={2.5} w={9.8} h={3.6}>
                    <Pop show={on(t, 100 + index * 90)} from="up" className={cn("flex h-full flex-col justify-between rounded-[0.8em] p-[0.7em]", tone as string)}>
                        <span className="truncate text-[0.42em] font-semibold uppercase tracking-[0.1em]">{label as string}</span>
                        {value}
                    </Pop>
                </At>
            ))}

            <At x={0} y={6.8} w={W} h={13.8} className="overflow-hidden">
                {rows.map((run, index) => {
                    const isNew = run.at >= 0;
                    const done = !isNew || on(t, run.at + DONE_AFTER);
                    return (
                        <span key={`${run.workflow}-${run.time}`} className="absolute inset-x-0 transition-[top] duration-700 ease-spring" style={{ top: `${index * 2.15}em` }}>
                            <Pop show={isNew ? true : on(t, 300 + index * 70)} from={isNew ? "down" : "up"} className="relative flex h-[2.15em] items-center gap-[0.55em] border-b border-hairline px-[0.3em]">
                                {isNew && <Fresh t={t} at={run.at} />}
                                <span className="flex size-[1.3em] items-center justify-center rounded-[0.4em] bg-fill-2">
                                    <Zap className="size-[0.6em] text-ink-2" />
                                </span>
                                <span className="flex-1 truncate text-[0.48em] font-medium">{wf.workflowNames[run.workflow]}</span>
                                <span className="w-[3em] text-[0.44em] tabular-nums text-ink-3">{run.time}</span>
                                <span className="w-[3.4em] text-right text-[0.44em] tabular-nums text-ink-3">{number(locale, run.ms / 1000, 2)} s</span>
                                <span className="flex w-[6.2em] justify-end">
                                    {isNew ? <SettlePill t={t} at={run.at + DONE_AFTER} from={wf.running} to={wf.completed} fromTone="blue" /> : <Pill tone="green">{wf.completed}</Pill>}
                                </span>
                                {!done && <span className="absolute bottom-0 left-0 h-[0.1em] bg-sky-500" style={{ width: `${clamp01((t - run.at) / DONE_AFTER) * 100}%` }} />}
                            </Pop>
                        </span>
                    );
                })}
            </At>
        </>
    );
}

/* ---------------------------------------------------------------------------------------------- */

const SCENES = {
    canvas: { Scene: CanvasScene, duration: 3900 },
    insert: { Scene: InsertScene, duration: 3800 },
    triggers: { Scene: TriggersScene, duration: 3800 },
    parallel: { Scene: ParallelScene, duration: 4100 },
    history: { Scene: HistoryScene, duration: 3700 },
} satisfies Record<string, SceneSpec<WorkflowLabels>>;

export type WorkflowSceneKey = keyof typeof SCENES;

export default function WorkflowScenes({ scene, labels, locale, max }: { scene: WorkflowSceneKey; labels: WorkflowLabels; locale: string; max?: number }) {
    return <ScenePlayer spec={SCENES[scene]} labels={labels} locale={locale} max={max} />;
}

