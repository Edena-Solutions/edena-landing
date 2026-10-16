import { useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";

import { EnaClover } from "@/components/wizard/app-frame";
import { GlassOrbs, GlassPane, SceneContent, STAGE, type Orb } from "@/components/wizard/glass-stage";
import { percent } from "@/components/wizard/scene-kit";
import { KEY_FEATURE_SCENES, type KeyFeatureLabels } from "@/modules/home/KeyFeaturesScenes";
import { STUDENT_DURATION, StudentScene } from "@/modules/home/StudentScene";
import { cn } from "@/lib/utils";

/*
 * The hero's picture, in depth: three panes of glass standing in space, the way visionOS places
 * windows. In front, a student's record comes to life on load (her month fills in, a note is
 * written, attendance is taken and today lands); behind it, turned towards it, enrolments and the
 * control panel rest at their finished frames — the front pane's frost hides what lies behind it,
 * so the depth reads without a filter. Two glass widgets settle over the edges, and faint lights
 * drift behind it all.
 *
 * Two compositions, chosen by the artboard's width (CSS in `HeroScene.astro`): wide, the panes
 * side by side on a 75 × 38 em board; narrow (a phone), the front pane fills the width and the two
 * behind it stack above it, like a pile of cards, on a 36 × 38.5 em board. Each element carries both
 * placements as custom properties (`--x --y --s` wide, `--mx --my --ms` narrow), in board em.
 *
 * One focal point, long expo-out entrances over small distances, no overshoot. The record plays once
 * (under six seconds) and holds. Its markup is the finished frame, for a crawler and for a reader
 * without scripting; with scripting it is hidden until hydrated and then played from the start, so
 * it never flashes. Reduced motion: every pane at its finished frame, still. The scroll settle is on
 * a wrapper outside this island, so nothing but React touches its markup.
 *
 * The front pane's ancestors never keep an opacity, a filter or a 3D transform: any of them would
 * cut its glass off from the panes behind it. What fades, fades on the glass itself.
 */

const [{ Scene: Dashboard }, , , { Scene: Enrolments }] = KEY_FEATURE_SCENES;
/** The record starts once its pane has settled. */
const DELAY = 900;

/** The lights behind the whole composition, in board em: lime, green, teal. */
const ORBS: Orb[] = [
    { x: 1, y: 4, size: 24, color: "#a3e635" },
    { x: 26, y: 16, size: 26, color: "#22c55e" },
    { x: 50, y: 1, size: 24, color: "#14b8a6" },
];
const NARROW_ORBS: Orb[] = [
    { x: -3, y: 1, size: 17, color: "#a3e635" },
    { x: 13, y: 17, size: 19, color: "#22c55e" },
    { x: 21, y: -1, size: 16, color: "#14b8a6" },
];

export interface HeroAppLabels {
    scene: KeyFeatureLabels;
    attendance: string;
    prompt: string;
    response: string;
}

const RINGS = [
    { r: 40, to: 6, color: "#a3e635" },
    { r: 29, to: 18, color: "#22c55e" },
    { r: 18, to: 30, color: "#14b8a6" },
];

/** Where an element stands, in board em, and at what scale: `[x, y, scale]`. */
type Place = [number, number, number];

/** Both placements as custom properties; `.hero-placed` reads the one for the board's width. */
function placed(wide: Place, narrow?: Place): CSSProperties {
    const [mx, my, ms] = narrow ?? wide;
    return { "--x": wide[0], "--y": wide[1], "--s": wide[2], "--mx": mx, "--my": my, "--ms": ms } as CSSProperties;
}

/** A pane: the scenes' board (33 × 23.6 of its own em), placed and scaled. */
function Pane({ wide, narrow, className, children }: { wide: Place; narrow: Place; className: string; children: ReactNode }) {
    return (
        <div className={cn("hero-placed", className)} style={{ ...placed(wide, narrow), width: `${STAGE.cols}em`, height: `${STAGE.rows}em` }}>
            {children}
        </div>
    );
}

/**
 * A widget, `w` × `h` of its own em (`narrowW` wide on a phone); without a `narrow` placement it is
 * left out on a phone.
 */
function Widget({
    wide,
    narrow,
    w,
    narrowW = w,
    h,
    i,
    from,
    className,
    children,
}: {
    wide: Place;
    narrow?: Place;
    w: number;
    narrowW?: number;
    h?: number;
    i: number;
    from: [number, number];
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn("hero-placed hero-widget ds-glass p-[1em]", !narrow && "hero-wide-only", className)}
            style={
                {
                    ...placed(wide, narrow),
                    "--w": w,
                    "--mw": narrowW,
                    height: h === undefined ? undefined : `${h}em`,
                    "--i": i,
                    "--fx": `${from[0]}em`,
                    "--fy": `${from[1]}em`,
                } as CSSProperties
            }
        >
            {children}
        </div>
    );
}

const BACK = 1.02;
const FRONT = 1.5;

export default function HeroApp({ labels, locale }: { labels: HeroAppLabels; locale: string }) {
    const { scene } = labels;
    const [t, setT] = useState(Number.POSITIVE_INFINITY);
    const [live, setLive] = useState(false);

    // Before the first paint after hydration: start the record from its first frame and play it
    // once. The clock is local — the hero has nothing to pause or pick.
    useLayoutEffect(() => {
        setLive(true);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setT(-DELAY);
        const start = performance.now();
        let frame = 0;
        const tick = (now: number) => {
            const elapsed = now - start - DELAY;
            if (elapsed >= STUDENT_DURATION) {
                setT(Number.POSITIVE_INFINITY);
                return;
            }
            setT(elapsed);
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <>
            <GlassOrbs orbs={ORBS} className="hero-wide-only" />
            <GlassOrbs orbs={NARROW_ORBS} className="hero-narrow-only" />

            {/* Behind, turned towards the front pane: they show only past its sides (on a phone, above it). */}
            <Pane wide={[1.5, 7.5, BACK]} narrow={[4.14, 0.9, 0.84]} className="hero-back hero-back--left">
                <GlassPane orbs={false} />
                <SceneContent>
                    <Enrolments t={Number.POSITIVE_INFINITY} labels={scene} locale={locale} />
                </SceneContent>
            </Pane>
            <Pane wide={[75 - 1.5 - STAGE.cols * BACK, 7.5, BACK]} narrow={[2.82, 3.1, 0.92]} className="hero-back hero-back--right">
                <GlassPane orbs={false} />
                <SceneContent>
                    <Dashboard t={Number.POSITIVE_INFINITY} labels={scene} locale={locale} />
                </SceneContent>
            </Pane>

            <Pane wide={[(75 - STAGE.cols * FRONT) / 2, 1.2, FRONT]} narrow={[1.5, 5.6, 1]} className="hero-front">
                <GlassPane orbs={false} className="hero-front-glass" />
                <div className="hero-content" data-live={live ? "" : undefined}>
                    <SceneContent>
                        <StudentScene t={t} ui={scene.ui} locale={locale} />
                    </SceneContent>
                </div>
            </Pane>

            <Widget wide={[0.9, 26.4, 1]} narrow={[1.5, 27.2, 1]} w={14} narrowW={18} i={0} from={[-2, 1.5]} className="flex flex-col gap-[0.75em]">
                <span className="flex items-center gap-[0.5em]">
                    <EnaClover size={1.6} alive delay="-3s" />
                    <span className="text-[0.82em] font-semibold">Ena</span>
                    <span className="size-[0.45em] rounded-full bg-sys-green" />
                </span>
                <span className="self-end max-w-[92%] rounded-[1em] rounded-br-[0.3em] bg-fill px-[0.8em] py-[0.5em]">
                    <span className="block text-[0.72em] leading-[1.4]">{labels.prompt}</span>
                </span>
                <span className="flex gap-[0.5em]">
                    <EnaClover size={1.15} className="mt-[0.1em]" />
                    <span className="text-[0.72em] leading-[1.45]">
                        {labels.response}
                        <span className="hero-caret ml-[0.15em] inline-block h-[1em] w-[0.12em] translate-y-[0.15em] bg-brand" />
                    </span>
                </span>
            </Widget>

            <Widget wide={[61.8, 2.4, 1]} narrow={[36 - 1.5 - 12.8, 28.4, 1]} w={12.8} h={7.6} i={1} from={[2, -1.5]} className="flex items-center gap-[0.8em]">
                <svg viewBox="0 0 100 100" className="size-[4.2em] shrink-0 -rotate-90">
                    {RINGS.map((ring, index) => (
                        <g key={ring.r}>
                            <circle cx="50" cy="50" r={ring.r} fill="none" stroke={ring.color} strokeOpacity="0.2" strokeWidth="10" />
                            <circle
                                className="hero-ring"
                                cx="50"
                                cy="50"
                                r={ring.r}
                                fill="none"
                                stroke={ring.color}
                                strokeWidth="10"
                                strokeLinecap="round"
                                pathLength={100}
                                style={{ ["--to" as string]: ring.to, ["--k" as string]: index }}
                            />
                        </g>
                    ))}
                </svg>
                <span className="min-w-0">
                    <span className="block truncate text-[0.7em] font-semibold text-ink-2">{labels.attendance}</span>
                    <span className="block text-[1.3em] font-bold leading-tight tracking-[-0.03em] tabular-nums">{percent(locale, 96.4, 1)}</span>
                </span>
            </Widget>
        </>
    );
}
