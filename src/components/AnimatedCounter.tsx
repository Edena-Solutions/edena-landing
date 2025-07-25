import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
    value: string;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    duration = 2000,
    className = "",
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    animateCounter();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    const animateCounter = () => {
        const numericMatch = value.match(/\d+(?:\.\d+)?/);
        const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;

        if (isNaN(numericValue)) {
            setDisplayValue(0);
            return;
        }

        const startTime = Date.now();
        const startValue = 0;

        const updateCounter = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (numericValue - startValue) * easeOutQuart;

            setDisplayValue(Math.floor(currentValue));

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                setDisplayValue(numericValue);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const formatDisplayValue = (num: number) => {
        return value.replace(/\d+(?:\.\d+)?/, num.toString());
    };

    return (
        <div ref={elementRef} className={className}>
            {isVisible ? formatDisplayValue(displayValue) : "0"}
        </div>
    );
}
