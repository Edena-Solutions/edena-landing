import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * The motion of a `design="premium"` page, wired by attribute so the sections stay plain Astro:
 *
 *   data-reveal / data-reveal-group   rise into place once on screen (CSS does the moving)
 *   data-count                        count up to the number already in the markup
 *   data-parallax="<px>"              drifts by that many px across its section's scroll
 *   data-settle                       arrives a little small and low, settles as the page scrolls
 *   data-converge                     scattered items fly into `data-converge-core`
 *   data-expand                       a dark ground grows from the container to full bleed
 *   .ds-scroll-fade                   a sideways row fading where there is more (data-fade)
 *
 * The markup carries the finished state (the real numbers, every word), so a crawler,
 * a reader without scripting and a reader who asked for reduced motion all get the same page. The
 * scrubbed effects only run with motion allowed.
 *
 * Runs on `astro:page-load` (first load and every client-side navigation) and tears down on
 * `astro:before-swap`, since the ClientRouter keeps this module alive across pages.
 */

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let teardown: (() => void) | null = null;

function initReveal(): () => void {
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
        group.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, index) => {
            if (!el.style.getPropertyValue("--reveal-i")) {
                el.style.setProperty("--reveal-i", String(index));
            }
        });
    });

    const pending = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );
    if (reduceMotion() || !("IntersectionObserver" in window)) {
        pending.forEach((el) => el.setAttribute("data-revealed", ""));
        return () => {};
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.setAttribute("data-revealed", "");
                observer.unobserve(entry.target);
            }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
}

/** The first number in `text`, with the decimals it was written with. */
function parseNumber(text: string) {
    const match = text.match(/\d+(?:[.,]\d+)?/);
    if (!match || match.index === undefined) return null;
    const raw = match[0];
    const separator = raw.includes(",") ? "," : ".";
    const decimals = raw.includes(separator) ? raw.split(separator)[1].length : 0;
    return {
        value: Number.parseFloat(raw.replace(",", ".")),
        decimals,
        separator,
        before: text.slice(0, match.index),
        after: text.slice(match.index + raw.length),
    };
}

function initCountUp(): () => void {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    if (reduceMotion() || targets.length === 0) return () => {};

    const frames = new Set<number>();
    const run = (el: HTMLElement) => {
        const final = el.textContent ?? "";
        const parsed = parseNumber(final);
        if (!parsed) return;
        const duration = 1600;
        const start = performance.now();
        const step = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            // Expo out: most of the count happens early, the last digits settle softly.
            const eased = p === 1 ? 1 : 1 - 2 ** (-10 * p);
            const current = (parsed.value * eased)
                .toFixed(parsed.decimals)
                .replace(".", parsed.separator);
            el.textContent = p === 1 ? final : `${parsed.before}${current}${parsed.after}`;
            if (p < 1) frames.add(requestAnimationFrame(step));
        };
        frames.add(requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                observer.unobserve(entry.target);
                run(entry.target as HTMLElement);
            }
        },
        { threshold: 0.4 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => {
        observer.disconnect();
        frames.forEach((id) => cancelAnimationFrame(id));
    };
}

function initScrub(): () => void {
    if (reduceMotion()) return () => {};
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        // The hero's composition arrives a little small and low and settles as the page scrolls.
        // Flat on purpose: a 3D transform (a tilt) on an ancestor of frosted glass cuts the glass
        // off from what lies behind it and rasterises its text soft, so it stays 2D throughout.
        document.querySelectorAll<HTMLElement>("[data-settle]").forEach((stage) => {
            gsap.fromTo(
                stage,
                { scale: 0.94, yPercent: 3, transformOrigin: "50% 0%", force3D: false },
                {
                    scale: 1,
                    yPercent: 0,
                    ease: "none",
                    force3D: false,
                    scrollTrigger: { trigger: stage, start: "top 90%", end: "top 15%", scrub: 0.6 },
                },
            );
        });

        document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
            const distance = Number(el.dataset.parallax ?? 0);
            const trigger = el.closest<HTMLElement>("section") ?? el;
            gsap.fromTo(
                el,
                { y: 0 },
                {
                    y: distance,
                    ease: "none",
                    scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: 0.8 },
                },
            );
        });

        document.querySelectorAll<HTMLElement>("[data-converge]").forEach((track) => {
            const stage = track.querySelector<HTMLElement>(".ds-converge-stage") ?? track;
            const core = track.querySelector<HTMLElement>("[data-converge-core]");
            const glow = track.querySelector<HTMLElement>("[data-converge-glow]");
            const bloom = track.querySelector<HTMLElement>("[data-converge-bloom]");
            const items = Array.from(track.querySelectorAll<HTMLElement>("[data-converge-item]"));
            const threads = Array.from(track.querySelectorAll<SVGLineElement>("[data-converge-thread]"));
            const threadsSvg = track.querySelector<SVGSVGElement>("[data-converge-threads]");
            if (!core) return;

            const center = () => ({
                cx: stage.offsetWidth / 2,
                cy: stage.offsetHeight / 2,
            });

            const threadLength = (item: HTMLElement) => {
                const { cx, cy } = center();
                return Math.hypot(cx - item.offsetLeft, cy - item.offsetTop) || 1;
            };

            const syncThreadGradient = () => {
                if (!threadsSvg) return;
                const { cx, cy } = center();
                const grad = threadsSvg.querySelector("#ds-converge-thread-grad");
                if (!grad) return;
                grad.setAttribute("x1", String(cx));
                grad.setAttribute("y1", String(cy));
                grad.setAttribute("x2", String(cx));
                grad.setAttribute("y2", "0");
            };

            // The distance from each item to the core at the stage's centre, from layout positions
            // (each item is centred on its `left`/`top`), so a refresh mid-scrub, with the items
            // already part way in, measures the same thing.
            const delta = (item: HTMLElement, axis: "x" | "y") =>
                axis === "x"
                    ? stage.offsetWidth / 2 - item.offsetLeft
                    : stage.offsetHeight / 2 - item.offsetTop;

            const inbound = 1;
            const stagger = 0.055;
            const settle = 0.2 + inbound + Math.max(items.length - 1, 0) * stagger;

            // Sticky keeps Edena on the viewport centre. The extra track height is the only
            // scroll the timeline may use, so the last app is in before the scene is allowed to leave.
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: track,
                    start: () => `top+=${stage.offsetHeight / 2} center`,
                    end: () => `+=${Math.max(track.offsetHeight - stage.offsetHeight, 0)}`,
                    scrub: true,
                    invalidateOnRefresh: true,
                    onRefresh: syncThreadGradient,
                },
            });
            if (bloom) {
                gsap.set(bloom, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
            }

            syncThreadGradient();
            items.forEach((item, index) => {
                const line = threads[index];
                if (!line) return;
                const { cx, cy } = center();
                const len = threadLength(item);
                gsap.set(line, {
                    attr: { x1: item.offsetLeft, y1: item.offsetTop, x2: cx, y2: cy },
                    strokeDasharray: len,
                    strokeDashoffset: len * 0.06,
                    opacity: 0,
                });
            });

            timeline.to({}, { duration: 0.2 });
            threads.forEach((line, index) => {
                timeline.to(line, { opacity: 0.3, duration: 0.16, ease: "power1.out" }, 0.04 + index * 0.012);
            });
            items.forEach((item, index) => {
                const at = 0.2 + index * stagger;
                const line = threads[index];

                timeline.to(
                    item,
                    {
                        x: () => delta(item, "x"),
                        y: () => delta(item, "y"),
                        rotate: 0,
                        scale: 0.3,
                        opacity: 0,
                        filter: "blur(6px)",
                        ease: "power2.in",
                        duration: inbound,
                    },
                    at,
                );

                if (!line) return;

                timeline.fromTo(
                    line,
                    {
                        opacity: 0.34,
                        strokeDashoffset: () => threadLength(item) * 0.06,
                        attr: {
                            x1: () => item.offsetLeft,
                            y1: () => item.offsetTop,
                            x2: () => center().cx,
                            y2: () => center().cy,
                        },
                    },
                    {
                        opacity: 0,
                        strokeDashoffset: () => threadLength(item),
                        attr: {
                            x1: () => center().cx,
                            y1: () => center().cy,
                            x2: () => center().cx,
                            y2: () => center().cy,
                        },
                        ease: "power2.in",
                        duration: inbound,
                    },
                    at - 0.04,
                );
            });
            timeline.fromTo(
                core,
                { scale: 0.9 },
                { scale: 1, ease: "power2.out", duration: 0.55 },
                settle - 0.35,
            );
            if (glow) {
                timeline.fromTo(
                    glow,
                    { opacity: 0, scale: 0.7 },
                    // A hint of light behind Edena, not a floodlight.
                    { opacity: 0.32, scale: 1.18, ease: "power2.out", duration: 0.65 },
                    settle - 0.4,
                );
            }
            if (bloom) {
                timeline.fromTo(
                    bloom,
                    { scale: 1, opacity: 0.4 },
                    { scale: 2.15, opacity: 0, ease: "power2.out", duration: 0.7 },
                    settle - 0.05,
                );
            }
            timeline.to({}, { duration: 0.55 });
        });

        document.querySelectorAll<HTMLElement>("[data-expand]").forEach((root) => {
            const ground = root.querySelector<HTMLElement>("[data-expand-ground]");
            if (!ground) return;
            const constrained = () => Math.min(1200, root.offsetWidth - 32);
            gsap.fromTo(
                ground,
                { width: () => constrained(), borderRadius: 40 },
                {
                    width: () => root.offsetWidth,
                    borderRadius: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: root,
                        start: "top 85%",
                        end: "top 20%",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                },
            );
        });
    });

    return () => ctx.revert();
}

/**
 * Rows that scroll sideways fade at the edges where there is more to see (`.ds-scroll-fade` in the
 * design system): each says which on `data-fade`. A row that does not scroll (a grid on a wide
 * screen) says "none".
 */
function initScrollFades(): () => void {
    const rows = Array.from(document.querySelectorAll<HTMLElement>(".ds-scroll-fade"));
    if (!rows.length) return () => {};

    const cleanups: (() => void)[] = [];

    rows.forEach((row) => {
        const update = () => {
            const max = row.scrollWidth - row.clientWidth;
            if (max <= 8) {
                row.dataset.fade = "none";
                return;
            }
            const start = row.scrollLeft <= 8;
            const end = row.scrollLeft >= max - 8;
            row.dataset.fade = start && end ? "none" : start ? "end" : end ? "start" : "both";
        };

        update();
        row.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update, { passive: true });

        let ro: ResizeObserver | null = null;
        if ("ResizeObserver" in window) {
            ro = new ResizeObserver(update);
            ro.observe(row);
        }

        cleanups.push(() => {
            row.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            ro?.disconnect();
        });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
}

function init() {
    teardown?.();
    const cleanups = [initReveal(), initCountUp(), initScrub(), initScrollFades()];
    teardown = () => {
        cleanups.forEach((cleanup) => cleanup());
        teardown = null;
    };
}

document.addEventListener("astro:page-load", init);
document.addEventListener("astro:before-swap", () => teardown?.());
