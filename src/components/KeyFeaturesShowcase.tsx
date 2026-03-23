import { useState, useRef } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import appHero from "@/assets/img/screenshots/app/app_hero.png";
import dashboard from "@/assets/img/screenshots/finance/invoice_analytics.png";
import finance from "@/assets/img/screenshots/finance/billing_cycle.png";
import assignmentScoreCard from "@/assets/img/screenshots/assignment/assignment_score_card.png";
import crmHero from "@/assets/img/screenshots/crm/crm_hero.png";
import crmForm from "@/assets/img/screenshots/crm/crm_form.png";
import {
    LayoutDashboard,
    Shapes,
    WalletCards,
    SquareUser,
    Rows3,
    BookOpenText,
} from "lucide-react";
import GSAPSection from "@/components/ui/gsap-section";
import AppAnimation from "@/components/AppAnimation";
import { cn } from "@/lib/utils";
import es from "@/i18n/translations/es";

interface Props {
    t?: Record<string, unknown>;
}

function TabItem({
    feature,
    icon: Icon,
    isActive,
    onClick,
    shortDescription,
}: {
    feature: { title: string };
    icon: React.ComponentType<{ size?: number; className?: string }>;
    isActive: boolean;
    onClick: () => void;
    shortDescription: string;
}) {
    return (
        <div
            data-tab-item
            className="rounded-md overflow-hidden bg-background cursor-pointer flex flex-col"
        >
            <button
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 w-full text-left px-4 py-3 cursor-pointer flex-shrink-0",
                    isActive ? "pb-2" : "pb-3",
                )}
            >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon size={20} />
                </div>
                <span
                    className={cn(
                        "text-[10px] font-medium truncate flex-1 uppercase tracking-widest",
                        isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                >
                    {feature.title}
                </span>
            </button>
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out overflow-hidden",
                    isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="min-h-0 overflow-hidden">
                    <p className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed">
                        {shortDescription}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function KeyFeaturesShowcase({ t }: Props) {
    const translations =
        (
            t as {
                features?: {
                    keyFeaturesTabs?: Array<{ title: string; description: string }>;
                    keyFeaturesTabsTitle?: string;
                    keyFeaturesTabsDescription?: string;
                };
            }
        )?.features?.keyFeaturesTabs || es.features.keyFeaturesTabs;
    const title =
        (t as { features?: { keyFeaturesTabsTitle?: string } })?.features?.keyFeaturesTabsTitle ||
        es.features.keyFeaturesTabsTitle;
    const description =
        (t as { features?: { keyFeaturesTabsDescription?: string } })?.features
            ?.keyFeaturesTabsDescription || es.features.keyFeaturesTabsDescription;
    const altTexts = (t as { altText?: Record<string, string> })?.altText || es.altText;

    const [active, setActive] = useState(0);
    const imgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const features = [
        { ...translations[1], img: dashboard, icon: LayoutDashboard, useAppAnimation: false },
        { ...translations[2], img: finance, icon: WalletCards, useAppAnimation: false },
        {
            ...translations[3],
            img: assignmentScoreCard,
            icon: BookOpenText,
            useAppAnimation: false,
        },
        { ...translations[4], img: crmHero, icon: SquareUser, useAppAnimation: false },
        { ...translations[5], img: crmForm, icon: Rows3, useAppAnimation: false },
        { ...translations[0], img: appHero, icon: Shapes, useAppAnimation: true },
    ];

    const getImageAltText = (img: typeof appHero) => {
        if (img === appHero) return altTexts.appDetail;
        if (img === dashboard) return altTexts.dashboardHero;
        if (img === finance) return altTexts.billingCycle;
        if (img === assignmentScoreCard) return altTexts.assignmentSchedule;
        if (img === crmHero) return altTexts.crmHero;
        if (img === crmForm) return altTexts.crmForm;
        return altTexts.heroImage;
    };

    const handleTab = (idx: number) => {
        if (idx === active) return;
        setActive(idx);
    };

    const handlePrev = () => {
        if (active > 0) handleTab(active - 1);
    };

    const handleNext = () => {
        if (active < features.length - 1) handleTab(active + 1);
    };

    return (
        <GSAPSection className="w-full overflow-hidden">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4 text-center max-w-xl mx-auto px-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-muted-foreground text-sm">{description}</p>
                </div>

                <div className="lg:hidden flex flex-col gap-4 p-4 bg-card">
                    <div className="w-full flex justify-center overflow-hidden">
                        <div className="w-full max-w-[400px] h-[200px] flex items-center justify-center">
                            {features[active].useAppAnimation ? (
                                <AppAnimation className="h-full w-auto max-h-[400px] mt-20" />
                            ) : (
                                <img
                                    src={features[active].img.src}
                                    alt={getImageAltText(features[active].img)}
                                    className="max-w-full max-h-full w-auto h-auto mt-15 object-contain object-center"
                                />
                            )}
                        </div>
                    </div>

                    <div
                        className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        <div className="flex gap-2 min-w-max">
                            {features.map((f, i) => {
                                const isActive = active === i;
                                const Icon = f.icon;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleTab(i)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-sm whitespace-nowrap transition-all shrink-0 bg-background",
                                            isActive && "text-foreground",
                                        )}
                                    >
                                        <Icon size={18} />
                                        <span className="text-[10px] font-medium uppercase tracking-widest">
                                            {f.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 rounded-sm px-4 py-3 bg-background">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {features[active].description}
                        </p>
                    </div>
                </div>
                <div
                    ref={containerRef}
                    className="hidden lg:flex bg-card relative w-full min-w-0 min-h-[400px] md:min-h-[500px] lg:min-h-[560px] flex-row justify-end items-center"
                >
                    <div
                        ref={imgRef}
                        className="w-full lg:w-[130%] xl:w-[100%] lg:-mr-[35vw] xl:-mr-[30vw] h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden shrink-0 flex items-center justify-center"
                    >
                        {features[active].useAppAnimation ? (
                            <AppAnimation className="h-full w-auto -translate-x-30" />
                        ) : (
                            <img
                                src={features[active].img.src}
                                alt={getImageAltText(features[active].img)}
                                className="w-full h-full object-contain object-center"
                            />
                        )}
                    </div>

                    <div className="absolute left-0 top-0 z-10 flex flex-col lg:flex-row lg:justify-start lg:items-stretch w-full min-h-[400px] md:min-h-[500px] lg:min-h-[560px] p-6 lg:p-10 lg:pl-16 xl:pl-24 pointer-events-none">
                        <div className="flex flex-col lg:max-w-md gap-4 pointer-events-auto">
                            <div className="flex items-start gap-3 pt-9">
                                <div className="flex flex-col gap-1 flex-shrink-0">
                                    <button
                                        onClick={handlePrev}
                                        disabled={active === 0}
                                        className={cn(
                                            "w-9 h-9 rounded-md flex items-center justify-center transition-all cursor-pointer",
                                            active === 0
                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                : "bg-background hover:bg-muted text-foreground",
                                        )}
                                        aria-label="Anterior"
                                    >
                                        <ChevronUp size={18} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={active === features.length - 1}
                                        className={cn(
                                            "w-9 h-9 rounded-md flex items-center justify-center transition-all cursor-pointer",
                                            active === features.length - 1
                                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                : "bg-background hover:bg-muted text-foreground",
                                        )}
                                        aria-label="Siguiente"
                                    >
                                        <ChevronDown size={18} />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col gap-2 min-w-0">
                                    {features.map((f, i) => {
                                        const isActive = active === i;
                                        return (
                                            <TabItem
                                                key={i}
                                                feature={f}
                                                icon={f.icon}
                                                isActive={isActive}
                                                onClick={() => handleTab(i)}
                                                shortDescription={f.description}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block lg:flex-1" />
                    </div>
                </div>
            </div>
        </GSAPSection>
    );
}
