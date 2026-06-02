import GSAPSection from "@/components/ui/gsap-section";
import type { Translation } from "@/i18n";
import { useTranslatedPath } from "@/i18n";
import {
    CalendarCheck,
    Star,
    FileText,
    UserPlus,
    CheckSquare,
    MessageCircle,
    MessageSquare,
    Bell,
    PenLine,
    Receipt,
    CreditCard,
    Banknote,
    BarChart2,
    ShieldCheck,
    LayoutDashboard,
    PieChart,
    Calendar,
    Clock,
    Users,
    Building2,
    Folder,
    Archive,
    Image,
    Heart,
    ClipboardCheck,
    Lock,
    GraduationCap,
    Target,
    ListChecks,
    Flag,
    Shield,
    Code2,
    Headphones,
    Rocket,
    Upload,
    Download,
    Smartphone,
    BellRing,
    Monitor,
    UserCog,
    History,
    ShoppingBag,
    Globe,
    AlertCircle,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

interface Props {
    t: Translation;
    lang: string;
}

type MainFeatureKey = keyof Translation["wallOfFeatures"]["main"];
type SmallFeatureKey = keyof Translation["wallOfFeatures"]["items"];

interface MainFeatureConfig {
    key: MainFeatureKey;
    icon: LucideIcon;
    path: string;
    gridRow: string;
    gridColumn: string;
    roundedClass: string;
}

const mainFeatureConfig: MainFeatureConfig[] = [
    {
        key: "students",
        icon: GraduationCap,
        path: "/students",
        gridRow: "2 / 4",
        gridColumn: "4 / 6",
        roundedClass: "rounded-br-[0.5rem]",
    },
    {
        key: "guardians",
        icon: Users,
        path: "/guardians",
        gridRow: "2 / 4",
        gridColumn: "6 / 8",
        roundedClass: "rounded-bl-[0.5rem]",
    },
    {
        key: "ai",
        icon: Sparkles,
        path: "/dashboard",
        gridRow: "4 / 6",
        gridColumn: "4 / 6",
        roundedClass: "rounded-tr-[0.5rem]",
    },
    {
        key: "finance",
        icon: Receipt,
        path: "/finance",
        gridRow: "4 / 6",
        gridColumn: "6 / 8",
        roundedClass: "rounded-tl-[0.5rem]",
    },
];

interface SmallFeatureConfig {
    key: SmallFeatureKey;
    icon: LucideIcon;
    path: string;
}

const smallFeatureConfig: SmallFeatureConfig[] = [
    { key: "attendance", icon: CalendarCheck, path: "/students" },
    { key: "grades", icon: Star, path: "/assignment" },
    { key: "reportCards", icon: FileText, path: "/assignment" },
    { key: "crm", icon: UserPlus, path: "/crm" },
    { key: "tasks", icon: CheckSquare, path: "/assignment" },
    { key: "communication", icon: MessageCircle, path: "/app" },
    { key: "messaging", icon: MessageSquare, path: "/app" },
    { key: "notifications", icon: Bell, path: "/app" },
    { key: "digitalSignature", icon: PenLine, path: "/students" },
    { key: "billing", icon: Receipt, path: "/finance" },
    { key: "payments", icon: CreditCard, path: "/finance" },
    { key: "directDebit", icon: Banknote, path: "/finance" },
    { key: "reports", icon: BarChart2, path: "/dashboard" },
    { key: "verifactu", icon: ShieldCheck, path: "/finance" },
    { key: "controlPanel", icon: LayoutDashboard, path: "/dashboard" },
    { key: "analytics", icon: PieChart, path: "/dashboard" },
    { key: "calendar", icon: Calendar, path: "/assignment" },
    { key: "schedules", icon: Clock, path: "/assignment" },
    { key: "groups", icon: Users, path: "/groups" },
    { key: "multiCenter", icon: Building2, path: "/groups" },
    { key: "documents", icon: Folder, path: "/students" },
    { key: "files", icon: Archive, path: "/students" },
    { key: "securePhotos", icon: Image, path: "/app" },
    { key: "health", icon: Heart, path: "/students" },
    { key: "authorizations", icon: ClipboardCheck, path: "/students" },
    { key: "permissions", icon: Lock, path: "/students" },
    { key: "teacherPortal", icon: GraduationCap, path: "/assignment" },
    { key: "assessments", icon: Target, path: "/assignment" },
    { key: "rubrics", icon: ListChecks, path: "/assignment" },
    { key: "goals", icon: Flag, path: "/assignment" },
    { key: "gdpr", icon: Shield, path: "/students" },
    { key: "api", icon: Code2, path: "/students" },
    { key: "support", icon: Headphones, path: "/contact" },
    { key: "onboarding", icon: Rocket, path: "/contact" },
    { key: "import", icon: Upload, path: "/students" },
    { key: "export", icon: Download, path: "/students" },
    { key: "familyApp", icon: Smartphone, path: "/app" },
    { key: "pushAlerts", icon: BellRing, path: "/app" },
    { key: "multiDevice", icon: Monitor, path: "/app" },
    { key: "roles", icon: UserCog, path: "/students" },
    { key: "history", icon: History, path: "/students" },
    { key: "schoolShop", icon: ShoppingBag, path: "/app" },
    { key: "languages", icon: Globe, path: "/students" },
    { key: "allergies", icon: AlertCircle, path: "/students" },
];

function getSmallFeaturePosition(index: number): { gridRow: string; gridColumn: string } {
    if (index < 10) return { gridRow: "1", gridColumn: `${index + 1}` };
    if (index === 10) return { gridRow: "2", gridColumn: "1" };
    if (index === 11) return { gridRow: "2", gridColumn: "2" };
    if (index === 12) return { gridRow: "2", gridColumn: "3" };
    if (index === 13) return { gridRow: "2", gridColumn: "8" };
    if (index === 14) return { gridRow: "2", gridColumn: "9" };
    if (index === 15) return { gridRow: "2", gridColumn: "10" };
    if (index === 16) return { gridRow: "3", gridColumn: "1" };
    if (index === 17) return { gridRow: "3", gridColumn: "2" };
    if (index === 18) return { gridRow: "3", gridColumn: "3" };
    if (index === 19) return { gridRow: "3", gridColumn: "8" };
    if (index === 20) return { gridRow: "3", gridColumn: "9" };
    if (index === 21) return { gridRow: "3", gridColumn: "10" };
    if (index === 22) return { gridRow: "4", gridColumn: "1" };
    if (index === 23) return { gridRow: "4", gridColumn: "2" };
    if (index === 24) return { gridRow: "4", gridColumn: "3" };
    if (index === 25) return { gridRow: "4", gridColumn: "8" };
    if (index === 26) return { gridRow: "4", gridColumn: "9" };
    if (index === 27) return { gridRow: "4", gridColumn: "10" };
    if (index === 28) return { gridRow: "5", gridColumn: "1" };
    if (index === 29) return { gridRow: "5", gridColumn: "2" };
    if (index === 30) return { gridRow: "5", gridColumn: "3" };
    if (index === 31) return { gridRow: "5", gridColumn: "8" };
    if (index === 32) return { gridRow: "5", gridColumn: "9" };
    if (index === 33) return { gridRow: "5", gridColumn: "10" };
    return { gridRow: "6", gridColumn: `${index - 33}` };
}

const WALL_FADE_MASK: CSSProperties = {
    maskImage: [
        "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
    ].join(", "),
    WebkitMaskComposite: "destination-in",
    maskComposite: "intersect",
};

function MobileFeatureChip({
    href,
    icon: Icon,
    name,
}: {
    href: string;
    icon: LucideIcon;
    name: string;
}) {
    return (
        <a
            href={href}
            className="bg-background flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors duration-150 group min-h-[72px] px-1 py-2.5 active:bg-muted/50"
        >
            <Icon
                size={18}
                className="text-zinc-400 group-active:text-primary transition-colors duration-150 shrink-0"
            />
            <span className="text-[10px] text-zinc-400 group-active:text-foreground text-center font-medium leading-tight transition-colors duration-150 line-clamp-2">
                {name}
            </span>
        </a>
    );
}

function WallOfFeaturesMobile({
    wallOfFeatures,
    translatePath,
}: {
    wallOfFeatures: Translation["wallOfFeatures"];
    translatePath: (path: string) => string;
}) {
    return (
        <div className="w-full overflow-hidden px-4 lg:hidden">
            <div className="mx-auto max-w-md">
                <div
                    className="grid grid-cols-4 gap-px bg-zinc-200 dark:bg-zinc-800"
                    style={WALL_FADE_MASK}
                >
                    {mainFeatureConfig.map((feature) => (
                        <MobileFeatureChip
                            key={feature.key}
                            href={translatePath(feature.path)}
                            icon={feature.icon}
                            name={wallOfFeatures.main[feature.key].name}
                        />
                    ))}

                    {smallFeatureConfig.map((feature) => (
                        <MobileFeatureChip
                            key={feature.key}
                            href={translatePath(feature.path)}
                            icon={feature.icon}
                            name={wallOfFeatures.items[feature.key]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function WallOfFeatures({ t, lang }: Props) {
    const translatePath = useTranslatedPath(lang);
    const { wallOfFeatures } = t;

    return (
        <GSAPSection className="flex flex-col gap-10 items-center w-full">
            <div className="flex flex-col gap-4 text-center max-w-xl mx-auto px-4">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
                    {wallOfFeatures.title}
                </h2>
                <p className="text-sm text-muted-foreground">{wallOfFeatures.description}</p>
            </div>

            <WallOfFeaturesMobile wallOfFeatures={wallOfFeatures} translatePath={translatePath} />

            <div className="w-full overflow-hidden hidden lg:block">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(10, 1fr)",
                        gridTemplateRows: "repeat(6, 120px)",
                        gap: "1px",
                        background: "#e4e4e7",
                        maxWidth: "1400px",
                        margin: "0 auto",
                        ...WALL_FADE_MASK,
                    }}
                >
                    {mainFeatureConfig.map((feature) => {
                        const content = wallOfFeatures.main[feature.key];
                        const Icon = feature.icon;

                        return (
                            <a
                                key={feature.key}
                                href={translatePath(feature.path)}
                                style={{
                                    gridRow: feature.gridRow,
                                    gridColumn: feature.gridColumn,
                                }}
                                className={`relative overflow-hidden group cursor-pointer bg-background transition-all duration-200 hover:scale-[1.01] hover:z-10 ${feature.roundedClass}`}
                            >
                                <div className="absolute inset-0 pointer-events-none" />

                                <div className="absolute inset-x-0 top-0 bottom-[3.25rem] overflow-hidden pointer-events-none">
                                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-center">
                                        <div className="rounded p-6 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
                                            <Icon
                                                size={56}
                                                strokeWidth={1.5}
                                                className="text-muted-foreground"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-card via-card/90 to-transparent" />
                                </div>

                                <div className="absolute inset-x-0 bottom-0 z-10 bg-card px-5 pb-8 pt-8">
                                    <h3 className="text-foreground font-bold text-[10px] uppercase tracking-widest leading-tight text-center">
                                        {content.name}
                                    </h3>
                                </div>
                            </a>
                        );
                    })}

                    {smallFeatureConfig.map((feature, index) => {
                        const { gridRow, gridColumn } = getSmallFeaturePosition(index);
                        const Icon = feature.icon;
                        const name = wallOfFeatures.items[feature.key];

                        return (
                            <a
                                key={feature.key}
                                href={translatePath(feature.path)}
                                style={{ gridRow, gridColumn }}
                                className="bg-background flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-150 group hover:z-10 hover:scale-[1.01]"
                            >
                                <Icon
                                    size={20}
                                    className="text-zinc-400 group-hover:text-zinc-700 transition-colors duration-150"
                                />
                                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-600 text-center font-medium leading-tight px-1 transition-colors duration-150 max-w-[90px]">
                                    {name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </GSAPSection>
    );
}
