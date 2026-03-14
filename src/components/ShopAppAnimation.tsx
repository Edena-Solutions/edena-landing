import { useEffect, useRef } from "react";
import gsap from "gsap";
import shopMain from "@/assets/img/screenshots/app/shop_main.png";
import shopItem from "@/assets/img/screenshots/app/shop_item.png";
import shopBuy from "@/assets/img/screenshots/app/shop_buy.png";
import { cn } from "@/lib/utils";

const STEP = 120;
const X_LEFT = -STEP;
const X_RIGHT = STEP;
const SCALE_BEHIND = 0.96;
const SCALE_SIDE = 0.92;

export default function ShopAppAnimation({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                repeat: -1,
                defaults: { ease: "sine.inOut" },
            });

            const sideCards = [leftRef.current, rightRef.current];

            gsap.set(sideCards, { x: 0, scale: SCALE_BEHIND });

            tl.to(
                [leftRef.current, rightRef.current],
                {
                    x: (i) => [X_LEFT, X_RIGHT][i],
                    scale: SCALE_SIDE,
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

    const getSrc = (img: { src?: string } | string) =>
        typeof img === "string" ? img : (img as { src: string }).src;

    const cardClass =
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl object-cover aspect-[9/19] overflow-hidden";

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full min-w-[400px] max-w-[420px] mx-auto h-[380px] sm:h-[520px]",
                "scale-[0.52] origin-center sm:scale-100",
                className
            )}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div ref={leftRef} className={`${cardClass} w-[48%] z-[1]`}>
                    <img
                        src={getSrc(shopBuy)}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                <div ref={rightRef} className={`${cardClass} w-[48%] z-[1]`}>
                    <img
                        src={getSrc(shopItem)}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                <div
                    ref={mainRef}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] w-[54%] rounded-xl overflow-hidden"
                >
                    <img
                        src={getSrc(shopMain)}
                        alt=""
                        className="w-full h-full object-cover aspect-[9/19] rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}
