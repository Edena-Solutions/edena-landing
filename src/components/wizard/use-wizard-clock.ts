import { useCallback, useEffect, useRef, useState } from "react";

/*
 * The clock of a wizard that plays itself, on the contract avern-landing's "How it works" keeps:
 *
 *   - one scene time `t` per step, in ms, advanced on requestAnimationFrame and scaled by the speed;
 *   - the next step a beat (HOLD) after this one has finished;
 *   - nothing ticking while the wizard is off screen;
 *   - choosing a step plays that step and stays there (the visitor took over);
 *   - reduced motion gets no autoplay and every scene at its finished frame (`Infinity`).
 *
 * Scenes are pure functions of `t`, so pausing freezes a scene mid-frame and ×2 plays it faster
 * without any scene keeping a timer of its own.
 */

/** How long the finished frame stays before the next step, in scene time. */
export const HOLD = 1100;
/** The clock starts this far below zero, so the outgoing scene has left before the new one plays. */
const ENTER = 250;

export type StepState = "completed" | "active" | "pending";
export type DemoSpeed = 1 | 2;

/** Read on the client only: the server cannot know it, and hydrating over it would mismatch. */
function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReduced(query.matches);
        sync();
        query.addEventListener("change", sync);
        return () => query.removeEventListener("change", sync);
    }, []);
    return reduced;
}

export function useWizardClock(durations: readonly number[]) {
    const reduceMotion = useReducedMotion();
    const [step, setStep] = useState(0);
    const [t, setT] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [speed, setSpeed] = useState<DemoSpeed>(1);
    const [inView, setInView] = useState(false);
    /** +1 when moving forward through the steps, -1 backward: scenes slide the way the step went. */
    const [direction, setDirection] = useState(1);
    const rootRef = useRef<HTMLDivElement>(null);
    const clock = useRef(0);

    const count = durations.length;
    const duration = durations[step];
    const playingRef = useRef(playing);
    const speedRef = useRef(speed);
    const stepRef = useRef(step);
    const durationRef = useRef(duration);
    playingRef.current = playing;
    speedRef.current = speed;
    stepRef.current = step;
    durationRef.current = duration;

    useEffect(() => {
        if (!reduceMotion) return;
        clock.current = Number.POSITIVE_INFINITY;
        setPlaying(false);
    }, [reduceMotion]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
            rootMargin: "120px 0px",
        });
        observer.observe(root);
        return () => observer.disconnect();
    }, []);

    // It runs while the demo plays, and after a step is picked by hand until that step has finished;
    // then it rests, and so does the page. On a phone React hears about it ~30 times a second, which
    // is all a scene of transforms and opacities needs.
    const resting = !playing && t >= duration;
    useEffect(() => {
        if (reduceMotion || !inView || resting) return;
        const publishGap = window.matchMedia("(pointer: coarse)").matches ? 32 : 0;
        let frame = 0;
        let last = performance.now();
        let lastPublish = 0;
        const tick = (now: number) => {
            // A frame's timestamp can precede the `performance.now()` this loop started from, and a
            // backgrounded tab can return after seconds: both are clamped, so time only moves forward
            // and never in a leap.
            const elapsed = Math.min(100, Math.max(0, now - last)) * speedRef.current;
            last = now;
            const dur = durationRef.current;
            const playingNow = playingRef.current;
            if (!playingNow && clock.current >= dur) {
                setT(clock.current);
                return;
            }
            clock.current = playingNow
                ? clock.current + elapsed
                : Math.min(dur, clock.current + elapsed);
            if (playingNow && clock.current >= dur + HOLD) {
                const next = (stepRef.current + 1) % count;
                clock.current = -ENTER;
                stepRef.current = next;
                setDirection(1);
                setStep(next);
                setT(-ENTER);
                frame = requestAnimationFrame(tick);
                return;
            }
            if (publishGap === 0 || now - lastPublish >= publishGap) {
                lastPublish = now;
                setT(clock.current);
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [reduceMotion, inView, resting, playing, count]);

    const go = useCallback((next: number, towards: number) => {
        clock.current = -ENTER;
        stepRef.current = next;
        setDirection(towards);
        setStep(next);
        setT(-ENTER);
    }, []);

    const takeOver = useCallback(() => setPlaying(false), []);

    const pick = (index: number) => {
        takeOver();
        go(index, index >= step ? 1 : -1);
    };

    const resume = () => {
        if (t >= duration) go((step + 1) % count, 1);
        setPlaying(true);
    };

    /** How far the step in hand has played, for the connector leaving it. */
    const progress = playing ? Math.min(1, Math.max(0, t) / (duration + HOLD)) : 0;
    const stateOf = (index: number): StepState =>
        index < step ? "completed" : index === step ? "active" : "pending";
    const fillOf = (index: number) => (index < step ? 1 : index === step ? progress : 0);

    return {
        rootRef,
        inView,
        reduceMotion,
        step,
        direction,
        /** Scene time: `Infinity` (the finished frame) under reduced motion. */
        sceneTime: reduceMotion ? Number.POSITIVE_INFINITY : t,
        playing,
        speed,
        setSpeed,
        pick,
        takeOver,
        resume,
        stateOf,
        fillOf,
    };
}
