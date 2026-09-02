import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MODULE_IDS, MODULE_META, moduleSectionsById } from "@/constants/pricing";
import type { PlanFeatureSection } from "@/constants/pricing";
import { cn } from "@/lib/utils";

interface PricingModulesProps {
    sections: PlanFeatureSection[];
}

/**
 * Every Edena module, rendered from the shared `pricing.planFeatureSections`
 * copy. Static by design: it ships no JS on the centres pricing page.
 */
export function PricingModules({ sections }: PricingModulesProps) {
    const byId = moduleSectionsById(sections);

    return (
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULE_IDS.map((moduleId) => {
                const section = byId[moduleId];
                if (!section) return null;
                const meta = MODULE_META[moduleId];
                const Icon = meta?.icon;
                return (
                    <Card key={moduleId} className="flex flex-col gap-4 rounded bg-card p-6">
                        <div className="flex items-center gap-2.5">
                            <span
                                className={cn(
                                    "flex size-8 flex-shrink-0 items-center justify-center rounded-lg",
                                    meta?.iconColor ?? "bg-muted text-foreground",
                                )}
                                aria-hidden
                            >
                                {meta?.iconImage ? (
                                    <img
                                        src={meta.iconImage.src}
                                        alt=""
                                        className={cn("size-4", meta.iconImageClass)}
                                    />
                                ) : (
                                    Icon && <Icon className="size-4" />
                                )}
                            </span>
                            <h3 className="text-[10px] font-semibold uppercase tracking-widest">
                                {section.title}
                            </h3>
                        </div>
                        <ul className="m-0 list-none space-y-2 p-0">
                            {section.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check
                                        className="mt-0.5 size-3.5 flex-shrink-0 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <span className="text-sm leading-snug text-muted-foreground">
                                        {item.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                );
            })}
        </div>
    );
}
