import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
    Baby,
    BookOpenText,
    ChevronRight,
    Clock,
    GraduationCap,
    HeartHandshake,
    Landmark,
    LayoutDashboard,
    LayoutGrid,
    MessagesSquare,
    Sparkles,
    School,
    Shapes,
    SquareUser,
    Store,
    Wallet,
    WalletCards,
    Zap,
} from "lucide-react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import logo from "@/assets/img/logos/logo.png";
import enaLogo from "@/assets/img/logos/ena.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { translations, localePath } from "@/i18n/index.ts";
import { Button } from "./ui/button";
import Link from "./ui/link";
import DownloadAppIcons from "./DownloadAppIcons";

type Tone = "blue" | "green" | "orange" | "pink" | "purple" | "teal" | "indigo" | "red" | "mint";

const toneClass: Record<Tone, string> = {
    blue: "bg-sys-blue",
    green: "bg-sys-green",
    orange: "bg-sys-orange",
    pink: "bg-sys-pink",
    purple: "bg-sys-purple",
    teal: "bg-sys-teal",
    indigo: "bg-sys-indigo",
    red: "bg-sys-red",
    mint: "bg-sys-mint",
};

type ItemLayout = "row" | "featured" | "choice";
type ItemGroup = "platform" | "modules" | "audience" | "center";

interface MenuItem {
    title: string;
    href: string;
    description: string;
    icon?: LucideIcon;
    iconImage?: { src: string };
    iconColor?: string;
    tone?: Tone;
    featured?: boolean;
    group?: ItemGroup;
    price?: string;
    priceHint?: string;
    eyebrow?: string;
}

interface MenuGroup {
    label?: string;
    items: MenuItem[];
}

const MenuItemIcon = ({
    icon: Icon,
    iconImage,
}: {
    icon?: LucideIcon;
    iconImage?: { src: string };
}) => {
    if (iconImage) {
        return (
            <img src={iconImage.src} alt="" aria-hidden="true" className="size-5 object-contain" />
        );
    }

    if (!Icon) return null;

    return <Icon size={20} className="text-current" />;
};

const ItemGlyph = ({
    item,
    layout = "row",
}: {
    item: Pick<MenuItem, "icon" | "iconImage" | "tone" | "featured">;
    layout?: ItemLayout;
}) => {
    const size = layout === "featured" ? "size-14" : layout === "choice" ? "size-12" : "size-10";

    if (item.iconImage && (item.featured || layout === "featured")) {
        return (
            <img
                src={item.iconImage.src}
                alt=""
                aria-hidden="true"
                className={cn("object-contain", layout === "featured" ? "size-14" : "size-12")}
            />
        );
    }

    if (item.tone) {
        return (
            <span className={cn("ds-app-icon", size, toneClass[item.tone])}>
                <MenuItemIcon icon={item.icon} iconImage={item.iconImage} />
            </span>
        );
    }

    return (
        <span className={cn("ds-nav-icon", size)}>
            <MenuItemIcon icon={item.icon} iconImage={item.iconImage} />
        </span>
    );
};

const iconBoxBase =
    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors";
const iconBoxDefault =
    "bg-muted text-foreground group-hover:bg-background group-hover:text-foreground group-focus-within:bg-primary group-focus-within:text-primary-foreground";

interface Props {
    className?: string;
    lang: string;
    premium?: boolean;
}

const Logo = ({ lang, className }: { lang: string; className?: string }) => {
    const t = translations[lang as keyof typeof translations];
    const url = lang === "es" ? "/" : `/${lang}/`;
    return (
        <a href={url} className={cn("block shrink-0", className)}>
            <img
                src={logo.src}
                alt={t.altText.logo}
                className="ds-nav-logo h-5 w-auto dark:invert"
            />
        </a>
    );
};

const MenuButton = ({
    isOpen,
    onClick,
    premium,
}: {
    isOpen: boolean;
    onClick: () => void;
    premium?: boolean;
}) => {
    if (premium) {
        return (
            <button
                type="button"
                className="ds-nav-burger lg:hidden flex size-10 flex-col items-center justify-center gap-[5px] focus:outline-none"
                onClick={onClick}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-menu"
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                <span />
                <span />
                <span />
            </button>
        );
    }

    return (
        <button
            type="button"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
            onClick={onClick}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <span
                className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all",
                    isOpen && "rotate-45 translate-y-2",
                )}
            />
            <span
                className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all",
                    isOpen && "opacity-0",
                )}
            />
            <span
                className={cn(
                    "block w-6 h-0.5 bg-foreground transition-all",
                    isOpen && "-rotate-45 -translate-y-2",
                )}
            />
        </button>
    );
};

const ListItem = ({
    className,
    title,
    href,
    children,
    icon,
    iconImage,
    iconColor,
    tone,
    featured,
    premium,
    layout = "row",
    more,
    price,
    priceHint,
    eyebrow,
}: {
    className?: string;
    title: string;
    href: string;
    children: React.ReactNode;
    icon?: LucideIcon;
    iconImage?: { src: string };
    iconColor?: string;
    tone?: Tone;
    featured?: boolean;
    premium?: boolean;
    layout?: ItemLayout;
    more?: string;
    price?: string;
    priceHint?: string;
    eyebrow?: string;
}) => {
    if (premium) {
        const tile = layout === "featured" || layout === "choice";

        return (
            <div
                className={cn(
                    layout === "featured" && "ds-nav-featured",
                    layout === "choice" && "ds-nav-choice",
                )}
            >
                <NavigationMenuLink asChild className="hover:bg-transparent focus:bg-transparent">
                    <a
                        className={cn(
                            "ds-nav-item",
                            tile ? "!flex-col" : "!flex-row",
                            layout === "featured" && "ds-nav-item--featured",
                            layout === "choice" && "ds-nav-item--choice",
                            className,
                        )}
                        href={href}
                        data-tone={layout === "choice" ? tone : undefined}
                    >
                        {layout === "choice" ? (
                            <>
                                <div className="ds-nav-choice-head">
                                    <div className="ds-nav-choice-copy">
                                        <div className="ds-nav-item-title">{title}</div>
                                        <p className="ds-nav-item-desc">{children}</p>
                                    </div>
                                    <ItemGlyph
                                        item={{ icon, iconImage, tone, featured }}
                                        layout={layout}
                                    />
                                </div>
                                {price && (
                                    <span className="ds-nav-item-price">
                                        <span className="ds-nav-item-price-value">{price}</span>
                                        {priceHint && (
                                            <span className="ds-nav-item-price-unit">
                                                {priceHint}
                                            </span>
                                        )}
                                        <ChevronRight
                                            className="ds-nav-item-chevron"
                                            aria-hidden="true"
                                        />
                                    </span>
                                )}
                            </>
                        ) : layout === "featured" ? (
                            <>
                                <div className="ds-nav-featured-visual">
                                    <ItemGlyph
                                        item={{ icon, iconImage, tone, featured }}
                                        layout={layout}
                                    />
                                </div>
                                <div className="ds-nav-featured-copy">
                                    {eyebrow && <p className="ds-nav-item-eyebrow">{eyebrow}</p>}
                                    <div className="ds-nav-item-title">{title}</div>
                                    <p className="ds-nav-item-desc">{children}</p>
                                </div>
                                {more && (
                                    <span className="ds-nav-item-more">
                                        {more}
                                        <ChevronRight aria-hidden="true" />
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                <ItemGlyph
                                    item={{ icon, iconImage, tone, featured }}
                                    layout={layout}
                                />
                                <div className="ds-nav-item-copy">
                                    <div className="ds-nav-item-title">{title}</div>
                                    <p className="ds-nav-item-desc">{children}</p>
                                </div>
                                <ChevronRight className="ds-nav-item-chevron" aria-hidden="true" />
                            </>
                        )}
                    </a>
                </NavigationMenuLink>
            </div>
        );
    }

    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    className={cn(
                        "group flex flex-row gap-3 select-none rounded p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                        className,
                    )}
                    href={href}
                >
                    <div className={cn(iconBoxBase, iconColor ?? iconBoxDefault)}>
                        <MenuItemIcon icon={icon} iconImage={iconImage} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="text-[10px] font-semibold uppercase tracking-widest">
                            {title}
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </div>
                </a>
            </NavigationMenuLink>
        </li>
    );
};

const MobileMenuItemLink = ({ item, premium }: { item: MenuItem; premium?: boolean }) => {
    if (premium) {
        return (
            <li>
                <a
                    href={item.href}
                    className={cn(
                        "ds-nav-item !flex-row",
                        item.featured && "ds-nav-item--spotlight",
                    )}
                >
                    <ItemGlyph item={item} layout={item.featured ? "choice" : "row"} />
                    <div className="ds-nav-item-copy">
                        {item.eyebrow && item.featured && (
                            <p className="ds-nav-item-eyebrow">{item.eyebrow}</p>
                        )}
                        <div className="ds-nav-item-title">{item.title}</div>
                        <p className="ds-nav-item-desc">{item.description}</p>
                        {item.price && (
                            <p className="ds-nav-item-price ds-nav-item-price--inline">
                                <span className="ds-nav-item-price-value">{item.price}</span>
                                {item.priceHint && (
                                    <span className="ds-nav-item-price-unit">{item.priceHint}</span>
                                )}
                            </p>
                        )}
                    </div>
                </a>
            </li>
        );
    }

    return (
        <li>
            <a
                href={item.href}
                className="group flex flex-row items-start gap-3 rounded-md px-2 py-2.5 -mx-2 text-foreground no-underline transition-colors hover:bg-muted focus-visible:bg-muted"
            >
                <div className={cn("mt-0.5", iconBoxBase, item.iconColor ?? iconBoxDefault)}>
                    <MenuItemIcon icon={item.icon} iconImage={item.iconImage} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="text-[10px] font-semibold uppercase tracking-widest">
                        {item.title}
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {item.description}
                    </p>
                </div>
            </a>
        </li>
    );
};

const NavColumn = ({ label, items }: { label?: string; items: MenuItem[] }) => (
    <section className="ds-nav-col" aria-label={label}>
        {label && (
            <p className="ds-nav-col-label" aria-hidden="true">
                {label}
            </p>
        )}
        <div className="ds-nav-col-list">
            {items.map((item) => (
                <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    iconImage={item.iconImage}
                    iconColor={item.iconColor}
                    tone={item.tone}
                    featured={item.featured}
                    premium
                >
                    {item.description}
                </ListItem>
            ))}
        </div>
    </section>
);

const MobileMenuSection = ({
    value,
    title,
    items,
    groups,
    premium,
}: {
    value: string;
    title: string;
    items?: MenuItem[];
    groups?: MenuGroup[];
    premium?: boolean;
}) => {
    const blocks = groups ?? (items ? [{ items }] : []);

    return (
        <AccordionItem value={value} className={premium ? undefined : "border-0"}>
            <AccordionTrigger
                className={cn(
                    "py-2 text-sm font-medium hover:no-underline hover:text-primary",
                    premium && "hover:text-ink",
                )}
            >
                {title}
            </AccordionTrigger>
            <AccordionContent className={premium ? "px-0.5 pb-1.5" : "pb-2"}>
                {premium ? (
                    blocks.map((group, index) => (
                        <div key={group.label ?? index} className="ds-nav-col">
                            {group.label && <p className="ds-nav-col-label">{group.label}</p>}
                            <ul className="ds-nav-col-list">
                                {group.items.map((item) => (
                                    <MobileMenuItemLink key={item.title} item={item} premium />
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <ul>
                        {(items ?? []).map((item) => (
                            <MobileMenuItemLink key={item.title} item={item} />
                        ))}
                    </ul>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

const MainNavigationMenu = ({ lang, className, premium }: Props) => {
    const headerRef = useRef<HTMLElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileSection, setOpenMobileSection] = useState("");
    const t = translations[lang as keyof typeof translations];

    const pm = t.productModules;
    // Canonical locale paths: Spanish lives unprefixed at the root.
    const p = (path: string) => localePath(lang, path);

    const products: MenuItem[] = [
        {
            title: t.navigation.crm,
            href: p("/crm"),
            description: t.navigation.crmDescription,
            icon: SquareUser,
            iconColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
            tone: "blue",
            group: "platform",
        },
        {
            title: t.navigation.app,
            href: p("/app"),
            description: t.navigation.appDescription,
            icon: Shapes,
            iconColor: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
            tone: "pink",
            group: "platform",
        },
        {
            title: t.navigation.finance,
            href: p("/finance"),
            description: t.navigation.financeDescription,
            icon: WalletCards,
            iconColor:
                "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
            tone: "green",
            group: "platform",
        },
        {
            title: pm.extracurricular.navTitle,
            href: p("/extracurricular"),
            description: pm.extracurricular.navDescription,
            icon: Sparkles,
            iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
            tone: "orange",
            group: "modules",
        },
        {
            title: pm.communication.navTitle,
            href: p("/communication"),
            description: pm.communication.navDescription,
            icon: MessagesSquare,
            iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
            tone: "teal",
            group: "modules",
        },
        {
            title: pm.internalPayments.navTitle,
            href: p("/internal-payments"),
            description: pm.internalPayments.navDescription,
            icon: Wallet,
            iconColor: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
            tone: "purple",
            group: "modules",
        },
        {
            title: pm.shop.navTitle,
            href: p("/shop"),
            description: pm.shop.navDescription,
            icon: Store,
            iconColor:
                "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
            tone: "indigo",
            group: "modules",
        },
        {
            title: pm.tracking.navTitle,
            href: p("/tracking"),
            description: pm.tracking.navDescription,
            icon: Clock,
            iconColor: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
            tone: "mint",
            group: "modules",
        },
        {
            title: pm.workflows.navTitle,
            href: p("/workflows"),
            description: pm.workflows.navDescription,
            icon: Zap,
            iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
            tone: "red",
            group: "modules",
        },
        {
            title: pm.ena.navTitle,
            href: p("/ena"),
            description: pm.ena.navDescription,
            iconImage: enaLogo,
            iconColor: "bg-muted text-black dark:text-white",
            featured: true,
            eyebrow: pm.ena.navEyebrow,
        },
    ];

    const segments: MenuItem[] = [
        {
            title: t.navigation.students,
            href: p("/students"),
            description: t.navigation.studentsDescription,
            icon: GraduationCap,
            tone: "indigo",
            group: "center",
        },
        {
            title: t.navigation.dashboard,
            href: p("/dashboard"),
            description: t.navigation.dashboardDescription,
            icon: LayoutDashboard,
            tone: "teal",
            group: "center",
        },
        {
            title: t.navigation.assignment,
            href: p("/assignment"),
            description: t.navigation.assignmentDescription,
            icon: BookOpenText,
            tone: "orange",
            group: "center",
        },
        {
            title: t.navigation.nurseries,
            href: p("/nurseries"),
            description: t.navigation.nurseriesDescription,
            icon: Baby,
            tone: "pink",
            group: "audience",
        },
        {
            title: t.navigation.schools,
            href: p("/schools"),
            description: t.navigation.schoolsDescription,
            icon: School,
            tone: "blue",
            group: "audience",
        },
        {
            title: t.navigation.academies,
            href: p("/academies"),
            description: t.navigation.academiesDescription,
            icon: Landmark,
            tone: "orange",
            group: "audience",
        },
        {
            title: t.navigation.groups,
            href: p("/groups"),
            description: t.navigation.groupsDescription,
            icon: LayoutGrid,
            tone: "purple",
            group: "audience",
        },
        {
            title: t.navigation.forFamilies,
            href: p("/families"),
            description: t.features.appFeatures.tagline,
            icon: HeartHandshake,
            tone: "green",
            group: "audience",
        },
    ];

    const pricingAudiences: MenuItem[] = [
        {
            title: t.navigation.pricingAcademies,
            href: p("/pricing/academies"),
            description: t.navigation.pricingAcademiesDescription,
            icon: Landmark,
            iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
            tone: "orange",
            price: t.navigation.pricingAcademiesPrice,
            priceHint: t.navigation.pricingAcademiesUnit,
        },
        {
            title: t.navigation.pricingCenters,
            href: p("/pricing/centers"),
            description: t.navigation.pricingCentersDescription,
            icon: School,
            iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
            tone: "blue",
            price: t.navigation.pricingCentersPrice,
            priceHint: t.navigation.pricingCentersUnit,
        },
    ];

    const featuredProduct = premium ? products.find((item) => item.featured) : undefined;
    const gridProducts = premium ? products.filter((item) => !item.featured) : products;
    const platformProducts = products.filter((item) => item.group === "platform");
    const moduleProducts = products.filter((item) => item.group === "modules");
    const audienceSegments = segments.filter((item) => item.group === "audience");
    const centerSegments = segments.filter((item) => item.group === "center");
    const mobileProducts = featuredProduct ? [featuredProduct, ...gridProducts] : products;
    const productGroups: MenuGroup[] = [
        ...(featuredProduct ? [{ items: [featuredProduct] }] : []),
        { label: t.navigation.navPlatform, items: platformProducts },
        { label: t.navigation.navModules, items: moduleProducts },
    ];
    const segmentGroups: MenuGroup[] = [
        { label: t.navigation.navForWhom, items: audienceSegments },
        { label: t.navigation.forCenter, items: centerSegments },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((open) => {
            if (open) setOpenMobileSection("");
            return !open;
        });
    };

    useEffect(() => {
        if (!premium) return;
        const header = headerRef.current;
        if (!header) return;

        let frame = 0;
        const update = () => {
            frame = 0;
            const bar = header.getBoundingClientRect().height;
            const over = Array.from(document.querySelectorAll<HTMLElement>("[data-ena]")).some(
                (section) => {
                    const rect = section.getBoundingClientRect();
                    return rect.top < bar && rect.bottom > 0;
                },
            );
            header.classList.toggle("ds-nav--invert", over);
        };
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true, capture: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
            header.classList.remove("ds-nav--invert");
        };
    }, [premium]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    const renderItems = (items: MenuItem[], featuredFirst?: MenuItem) => (
        <>
            {featuredFirst && (
                <ListItem
                    title={featuredFirst.title}
                    href={featuredFirst.href}
                    icon={featuredFirst.icon}
                    iconImage={featuredFirst.iconImage}
                    iconColor={featuredFirst.iconColor}
                    tone={featuredFirst.tone}
                    featured
                    premium={premium}
                >
                    {featuredFirst.description}
                </ListItem>
            )}
            {items.map((item) => (
                <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                    iconImage={item.iconImage}
                    iconColor={item.iconColor}
                    tone={item.tone}
                    featured={item.featured}
                    premium={premium}
                >
                    {item.description}
                </ListItem>
            ))}
        </>
    );

    return (
        <header
            ref={headerRef}
            className={cn("w-full bg-background fixed h-15 flex items-center z-50", className)}
            data-menu-open={isMobileMenuOpen ? "" : undefined}
        >
            <div className="container mx-auto px-4 flex h-fit items-center">
                <div className="flex min-w-0 items-center gap-3 xl:gap-4">
                    <Logo lang={lang} className="lg:hidden xl:block" />

                    <div className="hidden lg:flex relative overflow-visible">
                        <NavigationMenu className="flex-none justify-start">
                            <NavigationMenuList className="justify-start">
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="font-medium">
                                        {t.navigation.products}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {premium ? (
                                            <div className="ds-nav-panel ds-nav-panel--products">
                                                {featuredProduct && (
                                                    <ListItem
                                                        title={featuredProduct.title}
                                                        href={featuredProduct.href}
                                                        icon={featuredProduct.icon}
                                                        iconImage={featuredProduct.iconImage}
                                                        featured
                                                        layout="featured"
                                                        premium
                                                        eyebrow={featuredProduct.eyebrow}
                                                        more={pm.ena.navCta}
                                                    >
                                                        {featuredProduct.description}
                                                    </ListItem>
                                                )}
                                                <NavColumn
                                                    label={t.navigation.navPlatform}
                                                    items={platformProducts}
                                                />
                                                <NavColumn
                                                    label={t.navigation.navModules}
                                                    items={moduleProducts}
                                                />
                                            </div>
                                        ) : (
                                            <ul className="grid w-[400px] gap-2 p-2 lg:w-[600px] lg:grid-cols-2">
                                                {renderItems(gridProducts, featuredProduct)}
                                            </ul>
                                        )}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="font-medium">
                                        {t.navigation.functionalities}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {premium ? (
                                            <div className="ds-nav-panel ds-nav-panel--segments">
                                                <NavColumn
                                                    label={t.navigation.navForWhom}
                                                    items={audienceSegments}
                                                />
                                                <NavColumn
                                                    label={t.navigation.forCenter}
                                                    items={centerSegments}
                                                />
                                            </div>
                                        ) : (
                                            <ul className="grid w-[400px] gap-2 p-2 lg:w-[600px] lg:grid-cols-2">
                                                {renderItems(segments)}
                                            </ul>
                                        )}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="font-medium">
                                        {t.navigation.pricing}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {premium ? (
                                            <div className="ds-nav-panel ds-nav-panel--pricing">
                                                {pricingAudiences.map((item) => (
                                                    <ListItem
                                                        key={item.title}
                                                        title={item.title}
                                                        href={item.href}
                                                        icon={item.icon}
                                                        iconImage={item.iconImage}
                                                        tone={item.tone}
                                                        layout="choice"
                                                        premium
                                                        price={item.price}
                                                        priceHint={item.priceHint}
                                                    >
                                                        {item.description}
                                                    </ListItem>
                                                ))}
                                            </div>
                                        ) : (
                                            <ul className="grid w-[400px] gap-2 p-2 lg:w-[500px] grid-cols-2">
                                                {renderItems(pricingAudiences)}
                                            </ul>
                                        )}
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    {premium ? (
                                        <a href={p("/contact")} className="ds-nav-text-link">
                                            {t.navigation.contact}
                                        </a>
                                    ) : (
                                        <Link href={p("/contact")}>
                                            <Button variant="ghost" className="font-medium">
                                                {t.navigation.contact}
                                            </Button>
                                        </Link>
                                    )}
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <div className="flex items-center gap-1 lg:hidden ml-auto">
                    {premium ? (
                        <a href={p("/demo")} className="ds-btn ds-btn--primary">
                            {t.bookDemo}
                        </a>
                    ) : (
                        <Link href={p("/demo")}>
                            <Button size="sm">{t.bookDemo}</Button>
                        </Link>
                    )}

                    <MenuButton
                        isOpen={isMobileMenuOpen}
                        onClick={toggleMobileMenu}
                        premium={premium}
                    />
                </div>

                <div className="hidden lg:flex shrink-0 items-center gap-2 ml-auto pl-8 xl:pl-6">
                    {premium ? (
                        <>
                            <a href={p("/demo")} className="ds-nav-text-link">
                                {t.bookDemo}
                            </a>
                            <a
                                href="https://app.edena.es/login"
                                className="ds-btn ds-btn--secondary"
                            >
                                {t.loginButton}
                            </a>
                            <a
                                href="https://app.edena.es/register-organization"
                                className="ds-btn ds-btn--primary"
                            >
                                {t.registerButton}
                            </a>
                        </>
                    ) : (
                        <>
                            <Link href={p("/demo")}>
                                <Button variant="link" className="font-medium">
                                    {t.bookDemo}
                                </Button>
                            </Link>
                            <Link href="https://app.edena.es/login">
                                <Button variant="secondary">{t.loginButton}</Button>
                            </Link>
                            <Link href="https://app.edena.es/register-organization">
                                <Button>{t.registerButton}</Button>
                            </Link>
                        </>
                    )}
                    <LanguageSwitcher
                        currentLang={lang}
                        iconButtonClassName={premium ? "ds-nav-icon-btn" : undefined}
                    />
                    <ThemeToggle
                        labels={t.theme}
                        className={premium ? "ds-nav-icon-btn rounded-full" : "rounded-full"}
                    />
                </div>

                <div
                    className={cn(
                        "lg:hidden fixed inset-x-0 top-15 bottom-0 z-40 overflow-hidden",
                        isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none",
                    )}
                    aria-hidden={!isMobileMenuOpen}
                    inert={!isMobileMenuOpen}
                >
                    <nav
                        id="mobile-nav-menu"
                        className={cn(
                            "h-full origin-top",
                            premium ? "will-change-[translate]" : "bg-background",
                            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full",
                            !isMobileMenuOpen && premium && "ds-nav-sheet-hidden",
                            !premium &&
                                "transition-[translate] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                        )}
                    >
                        {premium ? (
                            <>
                                <div className="ds-nav-sheet-body">
                                    <div className="ds-nav-group w-full">
                                        <Accordion
                                            type="single"
                                            collapsible
                                            value={openMobileSection}
                                            onValueChange={setOpenMobileSection}
                                            className="w-full"
                                        >
                                            <MobileMenuSection
                                                value="products"
                                                title={t.navigation.products}
                                                items={mobileProducts}
                                                groups={productGroups}
                                                premium
                                            />
                                            <MobileMenuSection
                                                value="functionalities"
                                                title={t.navigation.functionalities}
                                                items={segments}
                                                groups={segmentGroups}
                                                premium
                                            />
                                            <MobileMenuSection
                                                value="pricing"
                                                title={t.navigation.pricing}
                                                items={pricingAudiences}
                                                premium
                                            />
                                        </Accordion>
                                        <a href={p("/contact")} className="ds-nav-plain">
                                            {t.navigation.contact}
                                        </a>
                                        <a href={p("/blog/")} className="ds-nav-plain">
                                            {t.navigation.blog}
                                        </a>
                                        <a href={p("/faqs")} className="ds-nav-plain">
                                            {t.navigation.faqs}
                                        </a>
                                    </div>

                                    <DownloadAppIcons
                                        lang={lang}
                                        quiet
                                        className="flex flex-col items-center py-3"
                                    />

                                    <div className="ds-nav-group">
                                        <p className="ds-nav-group-label ds-nav-group-label--center">
                                            {t.changeWebsiteLanguage}
                                        </p>
                                        <LanguageSwitcher
                                            currentLang={lang}
                                            className="px-2 pb-2"
                                        />
                                        <div className="ds-nav-setting">
                                            <span className="type-callout text-ink">
                                                {t.appearance}
                                            </span>
                                            <ThemeToggle
                                                labels={t.theme}
                                                className="ds-nav-icon-btn rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="ds-nav-sheet-foot">
                                    <div className="flex gap-2">
                                        <a
                                            href="https://app.edena.es/login"
                                            className="ds-btn ds-btn--secondary w-full"
                                        >
                                            {t.loginButton}
                                        </a>
                                        <a
                                            href="https://app.edena.es/register-organization"
                                            className="ds-btn ds-btn--primary w-full"
                                        >
                                            {t.registerButton}
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="container h-full overflow-y-auto px-4 pt-2 pb-[max(2.5rem,env(safe-area-inset-bottom))] mx-auto">
                                <Accordion
                                    type="single"
                                    collapsible
                                    value={openMobileSection}
                                    onValueChange={setOpenMobileSection}
                                    className="w-full"
                                >
                                    <MobileMenuSection
                                        value="products"
                                        title={t.navigation.products}
                                        items={mobileProducts}
                                    />
                                    <MobileMenuSection
                                        value="functionalities"
                                        title={t.navigation.functionalities}
                                        items={segments}
                                    />
                                    <MobileMenuSection
                                        value="pricing"
                                        title={t.navigation.pricing}
                                        items={pricingAudiences}
                                    />
                                </Accordion>
                                <a
                                    href={p("/contact")}
                                    className="block py-2 text-sm font-medium hover:text-primary"
                                >
                                    {t.navigation.contact}
                                </a>
                                <a
                                    href={p("/blog/")}
                                    className="block py-2 text-sm font-medium hover:text-primary"
                                >
                                    {t.navigation.blog}
                                </a>
                                <a
                                    href={p("/faqs")}
                                    className="block py-2 text-sm font-medium hover:text-primary"
                                >
                                    {t.navigation.faqs}
                                </a>

                                <DownloadAppIcons
                                    lang={lang}
                                    className="flex flex-col justify-center items-center py-4"
                                />
                                <div className="flex flex-col items-center py-4">
                                    <p className="uppercase tracking-widest text-[10px] mb-4 text-muted-foreground">
                                        {t.changeWebsiteLanguage}
                                    </p>
                                    <LanguageSwitcher currentLang={lang} />
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded bg-secondary py-1.5 pl-4 pr-1.5">
                                    <span className="text-sm font-medium">{t.appearance}</span>
                                    <ThemeToggle
                                        labels={t.theme}
                                        className="bg-background hover:bg-background/80"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href="https://app.edena.es/login"
                                            className="block w-full hover:no-underline"
                                        >
                                            <Button variant="secondary" className="w-full">
                                                {t.loginButton}
                                            </Button>
                                        </Link>
                                        <Link
                                            href="https://app.edena.es/register-organization"
                                            className="block w-full hover:no-underline"
                                        >
                                            <Button className="w-full">{t.registerButton}</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default MainNavigationMenu;
