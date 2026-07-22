import { useLayoutEffect, useRef, useState } from "react";
import appHero from "@/assets/img/screenshots/app/app_hero.png";
import appCalendar from "@/assets/img/screenshots/app/app_calendar.png";
import appStudents from "@/assets/img/screenshots/app/app_students.png";
import appChat from "@/assets/img/screenshots/app/shop_main.png";
import appExtracurricular from "@/assets/img/screenshots/app/app_extracurricular.png";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";

const resolveSrc = (img: string | { src: string }) => (typeof img === "string" ? img : img.src);

// Cards laid out in a fan, center first on top — mirrors the previous
// spread-out state of the animation.
const cards = [
    { src: resolveSrc(appCalendar), width: 48, alt: "Horarios" },
    { src: resolveSrc(appExtracurricular), width: 52, alt: "Publicaciones" },
    { src: resolveSrc(appHero), width: 54, alt: "Muro" },
    { src: resolveSrc(appStudents), width: 52, alt: "Clases" },
    { src: resolveSrc(appChat), width: 48, alt: "Tienda" },
];

const CENTER = (cards.length - 1) / 2;
const STEP = 88; // base horizontal spread between cards
const BASE_SCALES = [0.98, 0.99, 1, 0.99, 0.98]; // initial graduated scale

// Geometry used to place the title just above the hovered card (same
// coordinate system as the cards, so it scales/aligns with them).
const CONTAINER_WIDTH = 300; // fixed via min/max-w on the stack
const CARD_ASPECT = 19 / 9; // height / width

// On hover, cards scale toward a target visual width (never moving). The
// hovered one grows past the central card's width; the rest step down with
// distance, down to the smallest initial width.
const HOVER_WIDTH = 59; // hovered card target width (bigger than the initial max)
const MAX_WIDTH = Math.max(...cards.map((card) => card.width));
const MIN_WIDTH = Math.min(...cards.map((card) => card.width));
const STEP_WIDTH = 3; // visual width lost per unit of distance from the hovered card
const LIFT = 22; // how much the hovered card rises vertically

// Width of the outermost cards in the 300px coordinate space — they define the
// fan's horizontal footprint (footprint = 4 * step + OUTER_CARD_WIDTH).
const OUTER_CARD_WIDTH = (MIN_WIDTH / 100) * CONTAINER_WIDTH;
const STEP_MIN = 40; // tightest spacing before we start scaling the whole fan down
const FIT_SAFETY = 0.96; // leave a little breathing room on the sides
const TITLE_FONT_PX = 16; // on-screen size of the hover title, kept constant at any scale

// Fit the fan to the available width by first packing the cards closer (smaller
// step, so they stay large) and only scaling the whole stack down once the cards
// are already as tight as STEP_MIN.
function getFanLayout(availWidth: number) {
    const safeWidth = availWidth > 0 ? availWidth * FIT_SAFETY : 4 * STEP + OUTER_CARD_WIDTH;
    const stepFit = (safeWidth - OUTER_CARD_WIDTH) / 4;
    const step = Math.max(STEP_MIN, Math.min(STEP, stepFit));
    const footprint = 4 * step + OUTER_CARD_WIDTH;
    const scale = footprint > safeWidth ? safeWidth / footprint : 1;
    return { step, scale };
}

function getCardStyle(index: number, hovered: number | null, step: number) {
    const x = (index - CENTER) * step;

    // No hover: the original fan layout.
    if (hovered === null) {
        return {
            x,
            y: 0,
            scale: BASE_SCALES[index],
            z: 3 - Math.abs(index - CENTER),
        };
    }

    const distance = Math.abs(index - hovered);
    const targetWidth =
        distance === 0 ? HOVER_WIDTH : Math.max(MIN_WIDTH, MAX_WIDTH - distance * STEP_WIDTH);

    // The hovered card scales up and rises; the rest only scale.
    return {
        x,
        y: distance === 0 ? -LIFT : 0,
        scale: targetWidth / cards[index].width,
        z: distance === 0 ? 50 : 30 - distance,
    };
}

interface Props {
    className?: string;
    knowMoreLabel?: string;
    knowMoreHref?: string;
    screenTitles?: string[];
}

export default function AppAnimation({
    className,
    knowMoreLabel,
    knowMoreHref,
    screenTitles,
}: Props) {
    const [hovered, setHovered] = useState<number | null>(null);

    // Measure the width actually available to the fan so it can pack its cards
    // closer / scale down only on narrow sections. The immediate parent often
    // shrink-wraps to the stack's min-width, so we measure the nearest ancestor
    // that actually bounds the fan (the closest one that clips overflow, e.g. the
    // Card), falling back to the viewport.
    const stackRef = useRef<HTMLDivElement>(null);
    const [availWidth, setAvailWidth] = useState(0);
    const [isCompact, setIsCompact] = useState(false);
    useLayoutEffect(() => {
        const node = stackRef.current;
        if (!node) return;
        const findBound = (): HTMLElement | null => {
            let el = node.parentElement;
            while (el) {
                if (getComputedStyle(el).overflowX !== "visible") return el;
                el = el.parentElement;
            }
            return null;
        };
        const measure = () => {
            const bound = findBound();
            setAvailWidth(bound ? bound.clientWidth : window.innerWidth);
            setIsCompact(window.innerWidth < 768);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);
        const bound = findBound();
        if (bound) observer.observe(bound);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);
    const { step, scale: fit } = getFanLayout(availWidth);

    // On compact viewports the taller cards would ride up over the "Saber más"
    // button, so push the whole fan down to keep the button's row clear.
    const hasButton = Boolean(knowMoreLabel && knowMoreHref);
    const fanOffsetY = hasButton && isCompact ? 56 : 0;

    // Translated screen names when provided, otherwise the hardcoded fallback.
    const titleFor = (index: number) => screenTitles?.[index] ?? cards[index].alt;

    const stack = (
        <div
            ref={stackRef}
            className={cn(
                "relative w-full min-w-[300px] max-w-[300px] mx-auto h-[300px] md:h-[680px] -mt-10",
                className,
            )}
            onPointerLeave={() => setHovered(null)}
        >
            <div
                className="absolute inset-0"
                style={{
                    transform: `translateY(${fanOffsetY}px) scale(${fit})`,
                    transformOrigin: "center",
                }}
            >
                {hovered !== null &&
                    (() => {
                        const hoveredX = (hovered - CENTER) * step;
                        const cardHeight = (HOVER_WIDTH / 100) * CONTAINER_WIDTH * CARD_ASPECT;
                        const titleY = -(cardHeight / 2) - 16 - LIFT;
                        return (
                            <div
                                className="pointer-events-none absolute left-1/2 top-1/2 z-[60] whitespace-nowrap font-semibold text-white uppercase tracking-widest text-[10px]"
                                style={{
                                    transform: `translate(-50%, -50%) translateX(${hoveredX}px) translateY(${titleY}px)`,
                                    // Counter the stack scale so the title stays a
                                    // constant, readable on-screen size on mobile.
                                }}
                            >
                                {titleFor(hovered)}
                            </div>
                        );
                    })()}
                {cards.map((card, index) => {
                    const { x, y, scale, z } = getCardStyle(index, hovered, step);
                    return (
                        <div
                            key={index}
                            onPointerEnter={() => setHovered(index)}
                            className="absolute left-1/2 top-1/2 rounded overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] aspect-[9/19]"
                            style={{
                                width: `${card.width}%`,
                                zIndex: z,
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                            }}
                        >
                            <img
                                src={card.src}
                                alt={titleFor(index)}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // Without a button, behave exactly as before: just the card stack.
    if (!knowMoreLabel || !knowMoreHref) return stack;

    return (
        <div className="relative flex w-full flex-col items-center gap-4">
            {/* "Saber más" button by default; the hovered card's title on hover. */}
            <div className="pointer-events-none relative z-[60] flex h-9 items-center justify-center">
                <Link
                    href={knowMoreHref}
                    className={cn(
                        "absolute transition-opacity duration-200",
                        hovered === null ? "pointer-events-auto opacity-100" : "opacity-0",
                    )}
                >
                    <Button variant="white">{knowMoreLabel}</Button>
                </Link>
            </div>

            {stack}
        </div>
    );
}
