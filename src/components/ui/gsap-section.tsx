import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
    animationType?: "default" | "scale-fade" | "opacity";
};

export default function GSAPSection({
    children,
    className = "",
    animationType = "default",
}: Props) {
    const ref = useRef<HTMLElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    if (animationType === "scale-fade") {
                        gsap.fromTo(
                            el,
                            { opacity: 0, scale: 0.92 },
                            { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" }
                        );
                    } else if (animationType === "opacity") {
                        gsap.fromTo(
                            el,
                            { opacity: 0 },
                            { opacity: 1, duration: 1.1, ease: "power2.out" }
                        );
                    } else {
                        gsap.fromTo(
                            el,
                            { opacity: 0, y: 60 },
                            { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" }
                        );
                    }
                    setHasAnimated(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "0px" }
        );
        
        observer.observe(el);
        
        return () => observer.disconnect();
    }, [hasAnimated, animationType]);

    return (
        <section ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </section>
    );
}
