import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    MODULE_IDS,
    MODULE_META,
    PACKS,
    moduleSectionsById,
    type ModuleId,
    type PlanFeatureSection,
} from "@/constants/pricing";
import type { Translation } from "@/i18n";
import { cn } from "@/lib/utils";

interface AcademyModulesTableProps {
    t: Translation;
}

/** Modules sold in at least one academy pack, in the shared display order. */
function academyModuleIds(): ModuleId[] {
    const included = new Set(PACKS.flatMap((pack) => pack.modules));
    return MODULE_IDS.filter((id) => included.has(id));
}

function ModuleTile({ moduleId }: { moduleId: string }) {
    const meta = MODULE_META[moduleId];
    const Icon = meta?.icon;
    return (
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
    );
}

function FeatureList({ labels }: { labels: string[] }) {
    return (
        <ul className="m-0 list-none space-y-2 p-0">
            {labels.map((label) => (
                <li key={label} className="flex items-start gap-2">
                    <Check
                        className="mt-0.5 size-3.5 flex-shrink-0 text-muted-foreground"
                        aria-hidden
                    />
                    <span className="text-sm leading-snug text-muted-foreground">{label}</span>
                </li>
            ))}
        </ul>
    );
}

function PackBadges({
    moduleId,
    items,
}: {
    moduleId: ModuleId;
    items: Translation["pricing"]["packs"]["items"];
}) {
    return (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {PACKS.filter((pack) => pack.modules.includes(moduleId)).map((pack) => (
                <li key={pack.id}>
                    <Badge variant="secondary" className="text-[10px]">
                        {items[pack.id].name}
                    </Badge>
                </li>
            ))}
        </ul>
    );
}

/**
 * What each academy module includes, and which pack it sits in.
 * A real table from md up; stacked cards on small screens so nothing has to scroll sideways.
 */
export function AcademyModulesTable({ t }: AcademyModulesTableProps) {
    const packsT = t.pricing.packs;
    const byId = moduleSectionsById(
        (t.pricing as { planFeatureSections?: PlanFeatureSection[] }).planFeatureSections ?? [],
    );
    const moduleIds = academyModuleIds().filter((id) => byId[id]);

    return (
        <>
            {/* Mobile: one card per module. A 3-column table will not fit. */}
            <div className="grid gap-4 md:hidden">
                {moduleIds.map((moduleId) => {
                    const section = byId[moduleId];
                    return (
                        <Card key={moduleId} className="flex flex-col gap-4 rounded bg-card p-6">
                            <div className="flex items-center gap-2.5">
                                <ModuleTile moduleId={moduleId} />
                                <h3 className="text-[10px] font-semibold uppercase tracking-widest">
                                    {section.title}
                                </h3>
                            </div>
                            <FeatureList labels={section.items.map((item) => item.label)} />
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    {packsT.packsColumn}
                                </p>
                                <PackBadges moduleId={moduleId} items={packsT.items} />
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="hidden overflow-hidden rounded bg-card md:block">
                <table className="w-full border-collapse text-left">
                    <caption className="sr-only">{packsT.comparisonTitle}</caption>
                    <thead>
                        <tr className="border-b">
                            <th
                                scope="col"
                                className="w-48 px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                            >
                                {packsT.moduleColumn}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                            >
                                {packsT.includes}
                            </th>
                            <th
                                scope="col"
                                className="w-52 px-6 py-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                            >
                                {packsT.packsColumn}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleIds.map((moduleId) => {
                            const section = byId[moduleId];
                            return (
                                <tr key={moduleId} className="border-b last:border-b-0">
                                    <th scope="row" className="px-6 py-5 align-top font-normal">
                                        <div className="flex items-center gap-2.5">
                                            <ModuleTile moduleId={moduleId} />
                                            <span className="text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap">
                                                {section.title}
                                            </span>
                                        </div>
                                    </th>
                                    <td className="px-6 py-5 align-top">
                                        <FeatureList
                                            labels={section.items.map((item) => item.label)}
                                        />
                                    </td>
                                    <td className="px-6 py-5 align-top">
                                        <PackBadges moduleId={moduleId} items={packsT.items} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
        </>
    );
}
