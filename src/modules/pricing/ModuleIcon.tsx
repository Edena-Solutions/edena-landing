import { MODULE_META } from "@/constants/pricing";
import { cn } from "@/lib/utils";

/**
 * A module's app icon, in the colours the Products menu gives it: a squircle (`.ds-app-icon`)
 * sized by the caller, its glyph at half its size. Server-rendered from Astro or inside an island.
 */
export function ModuleIcon({ moduleId, className }: { moduleId: string; className?: string }) {
    const meta = MODULE_META[moduleId];
    const Icon = meta?.icon;
    return (
        <span
            className={cn(
                "ds-app-icon shrink-0 rounded-full",
                meta?.iconColor ?? "bg-fill text-ink",
                className,
            )}
            aria-hidden
        >
            {meta?.iconImage ? (
                <img
                    src={meta.iconImage.src}
                    alt=""
                    className={cn("size-[58%] object-contain", meta.iconImageClass)}
                />
            ) : (
                Icon && <Icon className="size-1/2" />
            )}
        </span>
    );
}
