import { useRef, useState, useEffect } from "react";
import {
    ArrowDownRight,
    ChevronLeft,
    ChevronRight,
    Cog,
    File,
    LayoutDashboard,
    LibraryBig,
    MessageCircle,
    Shapes,
    UserRound,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import gradient from "@/assets/img/gradient_1.png";
import type { Translation } from "@/i18n";

const Features = ({ t }: { t: Translation }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoplayPaused, setAutoplayPaused] = useState(false);
    const autoplayIntervalRef = useRef<number | null>(null);

    const features = [
        {
            title: t.features.studentManagement.title,
            tagline: t.features.studentManagement.tagline,
            icon: <LibraryBig size={50} />,
        },
        {
            title: t.features.classScheduling.title,
            tagline: t.features.classScheduling.tagline,
            icon: <Shapes size={50} />,
        },
        {
            title: t.features.dashboard.title,
            tagline: t.features.dashboard.tagline,
            icon: <LayoutDashboard size={50} />,
        },
        {
            title: t.features.financeManagement.title,
            tagline: t.features.financeManagement.tagline,
            icon: <Wallet size={50} />,
        },
        {
            title: t.features.settingsConfiguration.title,
            tagline: t.features.settingsConfiguration.tagline,
            icon: <Cog size={50} />,
        },
        {
            title: t.features.parentCommunication.title,
            tagline: t.features.parentCommunication.tagline,
            icon: <MessageCircle size={50} />,
        },
        {
            title: t.features.studentAttendance.title,
            tagline: t.features.studentAttendance.tagline,
            icon: <UserRound size={50} />,
        },
        {
            title: t.features.invoices.title,
            tagline: t.features.invoices.tagline,
            icon: <File size={50} />,
        },
    ];

    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

        const itemWidth = clientWidth / (window.innerWidth < 768 ? 1 : 3);
        const newActiveIndex = Math.min(
            Math.floor((scrollLeft + itemWidth / 2) / itemWidth),
            features.length - 1
        );

        if (newActiveIndex !== activeIndex) {
            setActiveIndex(newActiveIndex);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;

        pauseAutoplay();

        const itemWidth =
            scrollContainerRef.current.clientWidth / (window.innerWidth < 768 ? 1 : 3);
        const currentScroll = scrollContainerRef.current.scrollLeft;
        const targetScroll =
            direction === "left" ? currentScroll - itemWidth : currentScroll + itemWidth;

        scrollContainerRef.current.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        });
    };

    const startAutoplay = () => {
        if (autoplayIntervalRef.current) return;

        autoplayIntervalRef.current = window.setInterval(() => {
            if (scrollContainerRef.current && !autoplayPaused) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                const itemWidth = clientWidth / (window.innerWidth < 768 ? 1 : 3);

                if (scrollLeft >= scrollWidth - clientWidth - 10) {
                    scrollContainerRef.current.scrollTo({
                        left: 0,
                        behavior: "smooth",
                    });
                } else {
                    scrollContainerRef.current.scrollTo({
                        left: scrollLeft + itemWidth,
                        behavior: "smooth",
                    });
                }
            }
        }, 3000);
    };

    const pauseAutoplay = () => {
        setAutoplayPaused(true);
        setTimeout(() => {
            setAutoplayPaused(false);
        }, 10000);
    };

    useEffect(() => {
        const handleResize = () => {
            checkScrollPosition();
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
        }

        startAutoplay();

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", checkScrollPosition);
            }
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!autoplayPaused && !autoplayIntervalRef.current) {
            startAutoplay();
        }
    }, [autoplayPaused]);

    return (
        <div className="relative w-full">
            <div className="flex flex-col">
                <div className="text-center px-4">
                    <h2 className="text-3xl font-bold">{t.features.title}</h2>
                    <p className="text-muted-foreground">{t.features.description}</p>
                </div>
                <div ref={containerRef} className="px-[16px]">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pt-16 pb-2 mb-6 scrollbar-hide"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        onMouseEnter={() => setAutoplayPaused(true)}
                        onMouseLeave={() => setAutoplayPaused(false)}
                        onTouchStart={() => setAutoplayPaused(true)}
                        onTouchEnd={() => setTimeout(() => setAutoplayPaused(false), 5000)}
                    >
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`hover:scale-103 rounded cursor-pointer flex-none w-full md:w-1/3 lg:w-1/4 snap-center transition-all duration-300 overflow-hidden transform bg-gray-50 ${
                                    activeIndex === index ? "opacity-100" : "opacity-90"
                                }`}
                            >
                                <div className="h-[450px] relative overflow-hidden">
                                    <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-start">
                                        <div className="text-sm font-medium mb-1">
                                            {feature.title}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold mb-2">
                                            {feature.tagline}
                                        </h3>
                                    </div>
                                    <div
                                        className="absolute w-30 h-30 text-white rounded top-50 left-1/2 transform -translate-x-1/2 transform flex items-center justify-center"
                                        style={{
                                            backgroundImage: `url('${gradient.src}')`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <Button
                                        onClick={() => scroll("left")}
                                        className="absolute bottom-4 right-4"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Ver anterior"
                                    >
                                        <ArrowDownRight size={20} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex gap-2 justify-center">
                        <Button
                            onClick={() => scroll("left")}
                            className={`${!showLeftArrow && "opacity-50 cursor-not-allowed"}`}
                            variant="secondary"
                            size="icon"
                            aria-label="Ver anterior"
                            disabled={!showLeftArrow}
                        >
                            <ChevronLeft size={20} />
                        </Button>

                        <Button
                            onClick={() => scroll("right")}
                            className={`${!showRightArrow && "opacity-50 cursor-not-allowed"}`}
                            variant="secondary"
                            size="icon"
                            aria-label="Ver siguiente"
                            disabled={!showRightArrow}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
