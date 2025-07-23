import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import app from "@/assets/img/screenshots/app/app_detail.png";
import dashboard from "@/assets/img/screenshots/dashboard/dashboard_hero.png";
import finance from "@/assets/img/screenshots/invoice/invoice_detail.png";
import guardians from "@/assets/img/screenshots/guardians/guardian_hero.png";
import students from "@/assets/img/screenshots/students/student_classroom.png";
import { LayoutDashboard, Shapes, Wallet, Users, GraduationCap } from "lucide-react";
import GSAPSection from "@/components/ui/gsap-section";
import { cn } from "@/lib/utils";
import es from "@/i18n/translations/es";
import gsap from "gsap";

interface Props {
    t?: any;
}

const SQUARE_SIZE = 40;
const SQUARE_RADIUS = 4;
const SQUARE_LENGTH = 4 * (SQUARE_SIZE - 2 - SQUARE_RADIUS * 2) + 2 * Math.PI * SQUARE_RADIUS;
const AUTO_ADVANCE_MS = 4000;

export default function KeyFeaturesTabs({ t }: Props) {
    const translations = t?.features?.keyFeaturesTabs || es.features.keyFeaturesTabs;
    const [active, setActive] = useState(0);
    const [displayed, setDisplayed] = useState(0);
    const [lastChange, setLastChange] = useState(Date.now());
    const [progress, setProgress] = useState(0);
    const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
    const prevActive = useRef(active);
    const cardRef = useRef<HTMLDivElement>(null);
    const animating = useRef(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const cardInnerRef = useRef<HTMLDivElement>(null);

    const features = [
        {
            ...translations[0],
            img: app,
            icon: <Shapes size={20} />,
            customClass: "w-2/5 sm:w-2/5 m-auto",
        },
        {
            ...translations[1],
            img: dashboard,
            icon: <LayoutDashboard size={20} />,
        },
        {
            ...translations[2],
            img: finance,
            icon: <Wallet size={20} />,
        },
        {
            ...translations[3],
            img: guardians,
            icon: <Users size={20} />,
        },
        {
            ...translations[4],
            img: students,
            icon: <GraduationCap size={20} />,
        },
    ];

    useEffect(() => {
        if (autoTimer.current) clearTimeout(autoTimer.current);
        autoTimer.current = setTimeout(() => {
            setActive((prev) => (prev + 1) % features.length);
            setLastChange(Date.now());
        }, AUTO_ADVANCE_MS);
        return () => {
            if (autoTimer.current) clearTimeout(autoTimer.current);
        };
    }, [lastChange]);

    useEffect(() => {
        if (progressTimer.current) clearInterval(progressTimer.current);
        progressTimer.current = setInterval(() => {
            setProgress(Math.min((Date.now() - lastChange) / AUTO_ADVANCE_MS, 1));
        }, 16);
        return () => {
            if (progressTimer.current) clearInterval(progressTimer.current);
        };
    }, [lastChange]);

    useEffect(() => {
        prevActive.current = active;
    }, [active]);

    useEffect(() => {
        if (displayed === active) return;
        if (!cardRef.current || animating.current) return;
        animating.current = true;
        const tl = gsap.timeline({
            defaults: { duration: 0.8, ease: "power2.inOut" },
            onComplete: () => {
                setDisplayed(active);
                gsap.fromTo(
                    cardInnerRef.current,
                    { opacity: 0, x: 100 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power2.out",
                        onComplete: () => {
                            animating.current = false;
                        },
                    }
                );
            },
        });
        tl.to(cardInnerRef.current, { opacity: 0, x: -100 }, 0);
    }, [active]);

    const handleTab = (idx: number) => {
        if (idx === active) return;
        setActive(idx);
        setLastChange(Date.now());
    };

    return (
        <GSAPSection className="flex flex-col items-center w-full gap-16">
            <div className="flex flex-col gap-3 text-center px-4 max-w-xl">
                <h2 className="text-3xl font-bold">Las 5 claves de nuestra plataforma</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Descubre las funcionalidades más potentes que te ayudarán a gestionar y escalar
                    tu organización educativa.
                </p>
            </div>
            <div className="w-full max-w-7xl px-4 self-center hidden lg:grid lg:grid-cols-5 gap-x-4">
                {features.map((f, i) => {
                    const isActive = active === i;
                    return (
                        <button
                            key={i}
                            className={`bg-gray-50 flex w-full gap-2 flex-row items-center py-2 px-2 rounded transition-all cursor-pointer duration-200 ${
                                isActive ? "bg-gray-100" : "hover:bg-gray-100"
                            }`}
                            onClick={() => handleTab(i)}
                            aria-selected={isActive}
                            tabIndex={0}
                        >
                            <div className="relative flex h-14 w-14 items-center justify-center">
                                <svg
                                    width={SQUARE_SIZE}
                                    height={SQUARE_SIZE}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                                >
                                    <rect
                                        x={1}
                                        y={1}
                                        width={SQUARE_SIZE - 2}
                                        height={SQUARE_SIZE - 2}
                                        rx={SQUARE_RADIUS}
                                        ry={SQUARE_RADIUS}
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth={1}
                                    />
                                    <rect
                                        x={1}
                                        y={1}
                                        width={SQUARE_SIZE - 2}
                                        height={SQUARE_SIZE - 2}
                                        rx={SQUARE_RADIUS}
                                        ry={SQUARE_RADIUS}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeDasharray={SQUARE_LENGTH}
                                        strokeDashoffset={
                                            isActive
                                                ? SQUARE_LENGTH * (1 - progress)
                                                : SQUARE_LENGTH
                                        }
                                        style={{
                                            transition:
                                                prevActive.current !== active && isActive
                                                    ? "stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)"
                                                    : "none",
                                            transform: "rotate(0deg)",
                                            transformOrigin: "center center",
                                        }}
                                    />
                                </svg>
                                <div className="relative z-10 flex items-center justify-center w-10 h-10">
                                    {f.icon}
                                </div>
                            </div>
                            <div className="flex flex-col text-left">
                                <p className="text-sm font-medium leading-tight">{f.title}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
            <div className="w-full flex justify-center sm:max-w-7xl sm:px-4">
                <Card
                    ref={cardRef}
                    className="flex flex-col sm:flex-row bg-gray-50 w-full overflow-hidden sm:h-100"
                >
                    <div ref={cardInnerRef} className="flex flex-col sm:flex-row w-full h-full">
                        <img
                            src={features[displayed].img.src}
                            alt={features[displayed].title}
                            className={cn(
                                "w-full sm:w-2/3 object-cover object-top pt-5 h-50 sm:h-full",
                                features[displayed].customClass
                            )}
                            loading="lazy"
                        />
                        <div className="w-full sm:w-1/3">
                            <CardHeader className="p-8 pb-2 sm:pb-8">
                                <CardTitle className="text-2xl font-semibold">
                                    {features[displayed].title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 max-w-sm">
                                <CardDescription>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: features[displayed].description,
                                        }}
                                    />
                                </CardDescription>
                            </CardContent>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center sm:hidden pb-6">
                        {features.map((_, i) => (
                            <button
                                key={i}
                                className={`rounded-full transition-all duration-200 ${
                                    active === i ? "bg-primary w-2 h-2" : "bg-gray-200 w-2 h-2"
                                }`}
                                onClick={() => handleTab(i)}
                                aria-label={`Ir a la funcionalidad ${i + 1}`}
                            />
                        ))}
                    </div>
                </Card>
            </div>
        </GSAPSection>
    );
}
