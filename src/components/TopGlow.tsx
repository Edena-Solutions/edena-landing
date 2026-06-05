import { topGlowHeightClass, topGlowMaskClass } from "@/constants/top-glow-backgrounds";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

export default function TopGlow({ className }: Props) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-0 bg-gradient-primary",
                topGlowHeightClass,
                topGlowMaskClass,
                className,
            )}
            aria-hidden
        />
    );
}
