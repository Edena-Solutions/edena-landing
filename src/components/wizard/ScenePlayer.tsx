import { useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";

import { GlassPane, SceneContent, STAGE } from "./glass-stage";

/*
 * A product page's scene on its tile — the screenshot it replaces, drawn and brought to life. The
 * board stands centred, as wide as the tile allows (up to `max` rem), and runs past the tile's
 * foot, which cuts it (`.ds-scene` in the design system).
 *
 * It plays once, the first time it is well in view, and holds its finished frame: a page is read
 * once, and a loop would pull the eye back from the words. The markup is that finished frame, for a
 * crawler and a reader without scripting; with scripting the scene is hidden until it is live, so
 * it never flashes before it plays. Reduced motion: the finished frame, still.
 */

export interface SceneSpec<L> {
    Scene: ComponentType<{ t: number; labels: L; locale: string }>;
    duration: number;
    /** A board of its own, `cols` × `rows` em, for a scene that draws its own glass; else the pane. */
    board?: { cols: number; rows: number };
    /** The stage's height past its top margin, as a fraction of the board's width. */
    k?: number;
}

/** About seven eighths of the pane shows above the tile's foot. */
const PANE_K = 0.6;

export function ScenePlayer<L>({ spec, labels, locale, max = 56 }: { spec: SceneSpec<L>; labels: L; locale: string; max?: number }) {
    const { Scene, duration, board } = spec;
    const ref = useRef<HTMLDivElement>(null);
    const [t, setT] = useState(Number.POSITIVE_INFINITY);
    const [live, setLive] = useState(false);

    useLayoutEffect(() => {
        setLive(true);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        setT(-1);
        let frame = 0;
        let start = 0;
        const tick = (now: number) => {
            const elapsed = now - start;
            if (elapsed >= duration) {
                setT(Number.POSITIVE_INFINITY);
                return;
            }
            setT(elapsed);
            frame = requestAnimationFrame(tick);
        };
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                start = performance.now();
                frame = requestAnimationFrame(tick);
            },
            { threshold: 0.35 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [duration]);

    const cols = board?.cols ?? STAGE.cols;
    const rows = board?.rows ?? STAGE.rows;
    const scene = <Scene t={t} labels={labels} locale={locale} />;

    return (
        <div ref={ref} className="ds-scene" style={{ "--scene-max": `${max}rem`, "--scene-k": spec.k ?? PANE_K } as CSSProperties}>
            <div className="ds-scene__stage">
                <div className="ds-scene__board">
                    <div aria-hidden className="relative select-none text-ink" style={{ fontSize: `calc(100cqw / ${cols})`, aspectRatio: `${cols} / ${rows}` }}>
                        {!board && <GlassPane />}
                        <div className="ds-scene__content" data-live={live ? "" : undefined}>
                            {board ? scene : <SceneContent>{scene}</SceneContent>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
