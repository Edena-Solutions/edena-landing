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

    const expandCleanups: (() => void)[] = [];
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
            const orbits = track.querySelector<HTMLElement>("[data-converge-orbits]");
            const progress = track.querySelector<SVGCircleElement>("[data-converge-progress]");
            const items = Array.from(track.querySelectorAll<HTMLElement>("[data-converge-item]"));
            if (!core) return;

            // Each tool in polar terms around Edena (the stage's centre), from layout positions —
            // items are centred on their `left`/`top`, so a refresh mid-scrub measures the same.
            // `p` is how far it has been drawn in, 0 to 1.
            const bodies = items.map((el) => ({
                el,
                r0: 0,
                a0: 0,
                tilt: Number(el.dataset.r ?? 0),
                depth: Number(el.dataset.s ?? 1),
                p: 0,
                set: {
                    x: gsap.quickSetter(el, "x", "px") as (value: number) => void,
                    y: gsap.quickSetter(el, "y", "px") as (value: number) => void,
                    rotation: gsap.quickSetter(el, "rotation", "deg") as (value: number) => void,
                    scale: gsap.quickSetter(el, "scale") as (value: number) => void,
                    opacity: gsap.quickSetter(el, "opacity") as (value: number) => void,
                },
            }));
            const measure = () => {
                const cx = stage.offsetWidth / 2;
                const cy = stage.offsetHeight / 2;
                bodies.forEach((body) => {
                    const dx = body.el.offsetLeft - cx;
                    const dy = body.el.offsetTop - cy;
                    body.r0 = Math.hypot(dx, dy);
                    body.a0 = Math.atan2(dy, dx);
                });
            };

            // How far each tool turns around Edena on its way in, in radians: a slow drift at first,
            // most of the turn spent close in, where it falls fastest — a vortex, not a carousel.
            const SWIRL = 0.95;
            const smooth = (from: number, to: number, v: number) => {
                const t = Math.min(1, Math.max(0, (v - from) / (to - from)));
                return t * t * (3 - 2 * t);
            };
            const render = (body: (typeof bodies)[number]) => {
                const { p, r0, a0 } = body;
                const pull = p * p * p;
                const r = r0 * (1 - pull);
                const a = a0 + SWIRL * (0.3 * p + 0.7 * pull);
                body.set.x(r * Math.cos(a) - r0 * Math.cos(a0));
                body.set.y(r * Math.sin(a) - r0 * Math.sin(a0));
                body.set.rotation(body.tilt * (1 - smooth(0, 0.8, p)));
                body.set.scale(body.depth * (1 - 0.7 * smooth(0.45, 1, p)));
                body.set.opacity(1 - smooth(0.72, 1, p));
            };

            measure();
            // Centred by the CSS `translate` property; GSAP's transform composes after it.
            bodies.forEach((body) => gsap.set(body.el, { x: 0, y: 0, rotation: body.tilt, scale: body.depth }));

            // Nearest first: the pull reaches the close ones before the far ones.
            const order = [...bodies].sort((a, b) => a.r0 - b.r0);
            const lead = 0.15;
            const inbound = 1;
            const stagger = 0.05;
            const absorbed = (index: number) => lead + index * stagger + inbound * 0.9;
            const done = absorbed(order.length - 1) + inbound * 0.1;

            // Sticky keeps Edena on the viewport centre; the extra track height is the scroll the
            // tools spend coming in. A scrub with a second of catch-up: the scene glides after the
            // wheel instead of ticking with it.
            const timeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: track,
                    start: () => `top+=${stage.offsetHeight / 2} center`,
                    end: () => `+=${Math.max(track.offsetHeight - stage.offsetHeight, 0)}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onRefresh: () => {
                        measure();
                        bodies.forEach(render);
                    },
                },
            });

            timeline.to({}, { duration: lead });
            order.forEach((body, index) => {
                timeline.to(body, { p: 1, duration: inbound, onUpdate: () => render(body) }, lead + index * stagger);
            });
            if (orbits) {
                timeline.fromTo(orbits, { scale: 1, opacity: 1 }, { scale: 0.55, opacity: 0, ease: "power1.in", duration: done - lead }, lead);
            }
            if (progress) {
                timeline.fromTo(progress, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: done - absorbed(0) }, absorbed(0));
            }
            timeline.fromTo(core, { scale: 0.86 }, { scale: 1, ease: "power2.out", duration: done - lead }, lead);
            timeline.to(core, { scale: 1.05, ease: "power2.out", duration: 0.18 }, done);
            timeline.to(core, { scale: 1, ease: "power2.inOut", duration: 0.3 }, done + 0.18);
            if (glow) {
                // A hint of light behind Edena once it holds everything, not a floodlight.
                timeline.fromTo(glow, { opacity: 0, scale: 0.7 }, { opacity: 0.34, scale: 1.15, ease: "power2.out", duration: 0.6, immediateRender: false }, done - 0.3);
            }
            if (bloom) {
                gsap.set(bloom, { xPercent: -50, yPercent: -50, transformOrigin: "50% 50%" });
                timeline.fromTo(bloom, { scale: 1, opacity: 0.6 }, { scale: 2.2, opacity: 0, ease: "power2.out", duration: 0.7, immediateRender: false }, done);
            }
            timeline.to({}, { duration: 0.55 });
        });

        // Not ScrollTrigger. Its start/end use a `100vh` probe and the window scroll position, which
        // on a real iPhone disagree with the visible screen: the address bar changes the viewport,
        // and `overflow-x: clip` on `<html>` makes Safari scroll a different box than Chrome. Device
        // mode in DevTools is still desktop Chrome, so the ground grows there and stays inset on the
        // phone. Measuring the section against the visual viewport matches what the reader sees.
        // Insets, not width: a `translate: -50%` used to centre it, and Safari clips that layer
        // instead of recentering it as the width changes, so the growth never reached the edges.
        document.querySelectorAll<HTMLElement>("[data-expand]").forEach((root) => {
            const ground = root.querySelector<HTMLElement>("[data-expand-ground]");
            if (!ground) return;

            let target = 0;
            let current = 0;
            let primed = false;
            let watching = true;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    watching = entry?.isIntersecting ?? false;
                },
                { rootMargin: "100% 0px" },
            );
            observer.observe(root);

            const apply = (p: number) => {
                const full = root.offsetWidth;
                const startWidth = Math.min(1200, Math.max(0, full - 32));
                const inset = ((full - startWidth) / 2) * (1 - p);
                ground.style.left = `${inset}px`;
                ground.style.right = `${inset}px`;
                ground.style.width = "auto";
                ground.style.marginLeft = "0";
                ground.style.marginRight = "0";
                ground.style.translate = "none";
                ground.style.borderRadius = `${40 * (1 - p)}px`;
            };

            const tick = (_time: number, deltaMs: number) => {
                if (!watching && Math.abs(target - current) < 0.001) return;
                const vh = window.visualViewport?.height ?? window.innerHeight;
                const start = vh * 0.85;
                const end = vh * 0.2;
                const next = (start - root.getBoundingClientRect().top) / (start - end);
                target = Math.min(1, Math.max(0, next));
                if (!primed) {
                    current = target;
                    primed = true;
                } else {
                    const dt = Math.max(0, deltaMs) / 1000;
                    current += (target - current) * (1 - Math.exp(-dt / 0.6));
                    if (Math.abs(target - current) < 0.001) current = target;
                }
                apply(current);
            };

            gsap.ticker.add(tick);
            expandCleanups.push(() => {
                observer.disconnect();
                gsap.ticker.remove(tick);
                ground.style.left = "";
                ground.style.right = "";
                ground.style.width = "";
                ground.style.marginLeft = "";
                ground.style.marginRight = "";
                ground.style.translate = "";
                ground.style.borderRadius = "";
            });
        });
    });

    return () => {
        expandCleanups.forEach((cleanup) => cleanup());
        ctx.revert();
    };
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
