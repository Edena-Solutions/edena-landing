import { useEffect, useRef } from "react";
import gsap from "gsap";
import appHero from "@/assets/img/screenshots/app/app_hero.png";
import appFeed from "@/assets/img/screenshots/app/app_feed.png";
import appDetail from "@/assets/img/screenshots/app/app_detail.png";
import appNotifications from "@/assets/img/screenshots/app/app_notifications.png";
import { cn } from "@/lib/utils";

const STEP = 135;
const X_LEFT_OUTER = -STEP * 2;
const X_LEFT_INNER = -STEP;
const X_RIGHT_INNER = STEP;
const X_RIGHT_OUTER = STEP * 2;
const SCALE_BEHIND = 0.99;
const SCALE_OUTER = 0.98;
const SCALE_INNER = 0.99;

export default function AppAnimation({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftOuterRef = useRef<HTMLDivElement>(null);
    const leftInnerRef = useRef<HTMLDivElement>(null);
    const rightInnerRef = useRef<HTMLDivElement>(null);
    const rightOuterRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                repeat: -1,
                defaults: { ease: "sine.inOut" },
            });

            const sideCards = [
                leftOuterRef.current,
                leftInnerRef.current,
                rightInnerRef.current,
                rightOuterRef.current,
            ];

            gsap.set(sideCards, { x: 0, scale: SCALE_BEHIND });

            tl.to(
                [
                    leftOuterRef.current,
                    leftInnerRef.current,
                    rightInnerRef.current,
                    rightOuterRef.current,
                ],
                {
                    x: (i) =>
                        [X_LEFT_OUTER, X_LEFT_INNER, X_RIGHT_INNER, X_RIGHT_OUTER][i],
                    scale: (i) =>
                        [SCALE_OUTER, SCALE_INNER, SCALE_INNER, SCALE_OUTER][i],
                    duration: 1.4,
                    ease: "sine.inOut",
                },
                0
            )
                .to({}, { duration: 1.2 })
                .to(
                    sideCards,
                    {
                        x: 0,
                        scale: SCALE_BEHIND,
                        duration: 1.4,
                        ease: "sine.inOut",
                    },
                    "-=0.1"
                )
                .to({}, { duration: 0.8 });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const cardClass =
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm object-cover aspect-[9/19] overflow-hidden";

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full min-w-[500px] max-w-[520px] mx-auto h-[380px] sm:h-[680px] -mt-10",
                "scale-[0.52] origin-center sm:scale-100",
                className
            )}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    ref={leftOuterRef}
                    className={`${cardClass} w-[48%] z-[1]`}
                >
                    <img
                        src={typeof appDetail === "string" ? appDetail : appDetail.src}
                        alt=""
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
                <div
                    ref={leftInnerRef}
                    className={`${cardClass} w-[52%] z-[2]`}
                >
                    <img
                        src={typeof appFeed === "string" ? appFeed : appFeed.src}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    ref={rightInnerRef}
                    className={`${cardClass} w-[52%] z-[2]`}
                >
                    <img
                        src={typeof appNotifications === "string" ? appNotifications : appNotifications.src}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    ref={rightOuterRef}
                    className={`${cardClass} w-[48%] z-[1]`}
                >
                    <img
                        src={typeof appFeed === "string" ? appFeed : appFeed.src}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div
                    ref={mainRef}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[54%] rounded-xl overflow-hidden"
                >
                    <img
                        src={typeof appHero === "string" ? appHero : appHero.src}
                        alt=""
                        className="w-full h-full object-cover aspect-[9/19]"
                    />
                </div>
            </div>
        </div>
    );
}
