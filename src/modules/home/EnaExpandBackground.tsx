import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
    children: ReactNode;
};

const CONSTRAINED_MAX = 80 * 16;
const GUTTER = 32;

export default function EnaExpandBackground({ children }: Props) {
    const rootRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const bg = bgRef.current;
        if (!root || !bg) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const constrainedWidth = () => Math.min(CONSTRAINED_MAX, root.offsetWidth - GUTTER);

        const ctx = gsap.context(() => {
            gsap.fromTo(
                bg,
                {
                    width: () => constrainedWidth(),
                    borderRadius: "12px 12px 3px 3px",
                },
                {
                    width: () => root.offsetWidth,
                    borderRadius: "0px",
                    ease: "none",
                    scrollTrigger: {
                        trigger: root,
                        start: "top 80%",
                        end: "top 22%",
                        scrub: 0.55,
                        invalidateOnRefresh: true,
                    },
                },
            );
        }, root);

        const refresh = () => ScrollTrigger.refresh();
        document.addEventListener("astro:page-load", refresh);

        return () => {
            document.removeEventListener("astro:page-load", refresh);
            ctx.revert();
        };
    }, []);

    return (
        <div ref={rootRef} className="relative w-full min-w-0">
            <div
                ref={bgRef}
                className="pointer-events-none absolute inset-y-0 left-1/2 bg-black dark:bg-zinc-900"
                style={{
                    width: "min(80rem, calc(100% - 2rem))",
                    translate: "-50% 0",
                    borderRadius: "0.75rem 0.75rem 3px 3px",
                }}
                aria-hidden="true"
            />
            <div className="relative z-10 mx-auto min-w-0 w-[min(80rem,calc(100%-2rem))] px-6 py-14 text-white md:px-12 md:py-20">
                {children}
            </div>
        </div>
    );
}
