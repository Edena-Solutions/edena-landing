import Lottie from "lottie-react";
import { cn } from "@/lib/utils";
import GSAPSection from "@/components/ui/gsap-section";
import notificationAnimation from "@/assets/animations/notification.json";
import touchbarAnimation from "@/assets/animations/touchbar.json";
import chatAnimation from "@/assets/animations/chat.json";
import functionsAnimation from "@/assets/animations/functions.json";
import guardianHero from "@/assets/img/screenshots/guardians/guardian_hero.png";

interface BentoItem {
    animation?: object;
    image?: ImageMetadata;
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
    title,
    description,
    className,
    lottieClassName,
    imageClassName,
    isPaddingCustom = false,
}: BentoItem & { className?: string; isPaddingCustom?: boolean }) {
    return (
        <div
            className={cn(
                "flex flex-col gap-4 overflow-hidden rounded-sm bg-card p-6",
                className
            )}
        >
            <div className={cn("flex flex-col gap-1", isPaddingCustom ? "px-6" : "")}>
                <h3 className="text-xs uppercase tracking-widest font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-1 items-center justify-center min-h-0">
                {image ? (
                    <img
                        src={image.src}
                        alt={title}
                        className={cn("h-full w-full object-cover rounded-sm", imageClassName)}
                    />
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
    const bento = (t as {
        bento?: {
            title?: string;
            description?: string;
            chat?: { title?: string; description?: string };
            app?: { title?: string; description?: string };
            functions?: { title?: string; description?: string };
            touchbar?: { title?: string; description?: string };
            users?: { title?: string; description?: string };
        };
    })?.bento || {};
    const items: BentoItem[] = [
        {
            animation: chatAnimation,
            title: bento.chat?.title || "Comunicación escolar",
            description: bento.chat?.description || "Mensajería segura bidireccional entre profesores y familias.",
            lottieClassName: "mt-15",
        },
        {
            image: guardianHero,
            title: bento.users?.title || "Gestión de usuarios",
            description: bento.users?.description || "Administra familias, estudiantes y personal desde un único panel.",
            imageClassName: "object-contain mt-30 w-full",
        },
        {
            animation: functionsAnimation,
            title: bento.functions?.title || "Suite de funcionalidades",
            description: bento.functions?.description || "Gestión de estudiantes, facturación y portal de familias integrados.",
            lottieClassName: "h-70 w-full",
        },
        {
            animation: touchbarAnimation,
            title: bento.touchbar?.title || "Interfaz intuitiva",
            description: bento.touchbar?.description || "Acceso rápido a funciones y navegación simplificada.",
            lottieClassName: "h-20 w-full",
        },
        {
            animation: notificationAnimation,
            title: bento.app?.title || "Comunicación centro-familias",
            description: bento.app?.description || "Canal directo entre tu centro y las familias. Notificaciones instantáneas y mensajería segura para mantener a padres y tutores informados.",
            lottieClassName: "w-130",
        },
    ];

    return (
        <GSAPSection className={cn("w-full px-4", className)}>
            <div className="mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-xl font-bold">{bento.title || "Todo lo que tu centro necesita"}</h2>
                    <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                        {bento.description || "Plataforma integral con las herramientas que tu centro educativo necesita."}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 auto-rows-[300px]">
                    <BentoCard
                        {...items[0]}
                        className="col-span-1 row-span-2 h-full"
                    />
                    <BentoCard {...items[1]} />
                    <BentoCard {...items[2]} />
                    <BentoCard {...items[3]} />
                    <BentoCard {...items[4]} />
                </div>
            </div>
        </GSAPSection>
    );
}
