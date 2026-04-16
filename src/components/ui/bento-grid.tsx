import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import GSAPSection from "@/components/ui/gsap-section";
import Icon from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import notificationAnimation from "@/assets/animations/notification.json";
import chatAnimation from "@/assets/animations/chat.json";
import studentDetailImage from "@/assets/img/screenshots/students/student_detail.png";
import studentDetailImageDark from "@/assets/img/screenshots/students/dark/student_detail.png";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
const USER_PORTRAIT_URLS = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
];

interface BentoItem {
    animation?: object;
    image?: ImageMetadata;
    imageDark?: ImageMetadata;
    icons?: { icon: string; label: string }[];
    portraits?: { src: string; label: string }[];
    title: string;
    description: string;
    className?: string;
    lottieClassName?: string;
    imageClassName?: string;
    isPaddingCustom?: boolean;
}

type ImageMetadata = { src: string; width: number; height: number };

interface BentoGridProps {
    t?: Record<string, unknown>;
    className?: string;
}

function BentoCard({
    animation,
    image,
    imageDark,
    icons,
    portraits,
    title,
    description,
    className,
    lottieClassName,
    imageClassName,
    isPaddingCustom = false,
}: BentoItem & { className?: string; isPaddingCustom?: boolean }) {
    const isDarkMode = useIsDarkMode();
    return (
        <div
            className={cn("flex flex-col gap-4 overflow-hidden rounded-sm bg-card p-6", className)}
        >
            <div className={cn("flex flex-col gap-1", isPaddingCustom ? "px-6" : "")}>
                <h3 className="text-xs uppercase tracking-widest font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-1 items-center justify-center min-h-0">
                {image ? (
                    <img
                        src={isDarkMode ? imageDark?.src : image?.src}
                        alt={title}
                        className={cn("h-full w-full object-cover rounded", imageClassName)}
                    />
                ) : icons ? (
                    <div className="grid grid-cols-5 gap-2 justify-center items-center">
                        {icons.map(({ icon, label }) => (
                            <Tooltip key={icon}>
                                <TooltipTrigger asChild>
                                    <div
                                        className="cursor-pointer flex text-primary w-fit p-4 rounded bg-background cursor-default"
                                        tabIndex={0}
                                    >
                                        <Icon name={icon} size={20} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{label}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                ) : portraits ? (
                    <div className="grid grid-cols-5 gap-2 justify-center items-center">
                        {portraits.map(({ src, label }) => (
                            <Tooltip key={label}>
                                <TooltipTrigger asChild>
                                    <img
                                        src={src}
                                        alt={label}
                                        className="cursor-pointer flex w-full h-full rounded-md object-cover"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{label}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                ) : animation ? (
                    <Lottie
                        animationData={animation}
                        loop
                        className={cn("h-full w-full rounded-sm", lottieClassName)}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default function BentoGrid({ t, className }: BentoGridProps) {
    const bento =
        (
            t as {
                bento?: {
                    title?: string;
                    description?: string;
                    chat?: { title?: string; description?: string };
                    app?: { title?: string; description?: string };
                    functions?: { title?: string; description?: string };
                    touchbar?: { title?: string; description?: string };
                    users?: {
                        title?: string;
                        description?: string;
                        portraits?: {
                            family?: string;
                            teacher?: string;
                            student?: string;
                            administration?: string;
                            director?: string;
                        };
                    };
                };
            }
        )?.bento || {};
    const tTyped = t as {
        features?: {
            digitalRecords?: { title?: string };
            mobileApp?: { title?: string };
            studentFeatures?: {
                digitalRecords?: { title?: string };
                attendanceTracking?: { title?: string };
            };
        };
        navigation?: { dashboard?: string; finance?: string };
    };
    const iconLabels = {
        students:
            tTyped?.features?.studentFeatures?.digitalRecords?.title ||
            tTyped?.features?.digitalRecords?.title ||
            "Gestión de estudiantes",
        billing: tTyped?.navigation?.finance || "Facturación",
        attendance:
            tTyped?.features?.studentFeatures?.attendanceTracking?.title || "Control de asistencia",
        records: tTyped?.features?.digitalRecords?.title || "Expedientes digitales",
        portal: tTyped?.features?.mobileApp?.title || "Portal de familias",
        dashboard: tTyped?.navigation?.dashboard || "Dashboard",
    };
    const portraitLabels = [
        bento.users?.portraits?.family || "Familia",
        bento.users?.portraits?.teacher || "Profesor",
        bento.users?.portraits?.student || "Estudiante",
        bento.users?.portraits?.administration || "Administración",
        bento.users?.portraits?.director || "Director",
    ];
    const items: BentoItem[] = [
        {
            animation: chatAnimation,
            title: bento.chat?.title || "Comunicación escolar",
            description:
                bento.chat?.description ||
                "Mensajería segura bidireccional entre profesores y familias.",
            lottieClassName: "mt-15",
        },
        {
            portraits: USER_PORTRAIT_URLS.map((src, i) => ({ src, label: portraitLabels[i] })),
            title: bento.users?.title || "Gestión de usuarios",
            description:
                bento.users?.description ||
                "Administra familias, estudiantes y personal desde un único panel.",
        },
        {
            icons: [
                { icon: "ShieldUser", label: iconLabels.students },
                { icon: "WalletCards", label: iconLabels.billing },
                { icon: "ClipboardCheck", label: iconLabels.attendance },
                { icon: "Rows3", label: iconLabels.records },
                { icon: "Send", label: iconLabels.portal },
            ],
            title: bento.functions?.title || "Suite de funcionalidades",
            description:
                bento.functions?.description ||
                "Gestión de estudiantes, facturación y portal de familias integrados.",
        },
        {
            image: studentDetailImage,
            imageDark: studentDetailImageDark,
            title: bento.touchbar?.title || "Interfaz intuitiva",
            description:
                bento.touchbar?.description ||
                "Acceso rápido a funciones y navegación simplificada.",
            imageClassName: "object-contain w-full h-fit overflow-hidden mt-30",
        },
        {
            animation: notificationAnimation,
            title: bento.app?.title || "Comunicación centro-familias",
            description:
                bento.app?.description ||
                "Canal directo entre tu centro y las familias. Notificaciones instantáneas y mensajería segura para mantener a padres y tutores informados.",
            lottieClassName: "w-130",
        },
    ];

    return (
        <TooltipProvider>
            <GSAPSection className={cn("w-full px-4", className)}>
                <div className="mx-auto">
                    <div className="mb-12 text-center">
                        <h2 className="text-xl font-bold">
                            {bento.title || "Todo lo que tu centro necesita"}
                        </h2>
                        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                            {bento.description ||
                                "Plataforma integral con las herramientas que tu centro educativo necesita."}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
                        <BentoCard {...items[0]} className="col-span-1 row-span-2 h-full" />
                        <BentoCard {...items[1]} />
                        <BentoCard {...items[2]} />
                        <BentoCard {...items[3]} />
                        <BentoCard {...items[4]} />
                    </div>
                </div>
            </GSAPSection>
        </TooltipProvider>
    );
}
