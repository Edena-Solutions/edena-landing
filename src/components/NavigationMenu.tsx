import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
    Baby,
    BookOpenText,
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
import { cn } from "@/lib/utils";
import logo from "@/assets/img/logos/logo.png";
import aiLogo from "@/assets/img/logos/ai.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { translations, localePath } from "@/i18n/index.ts";
import { Button } from "./ui/button";
import Link from "./ui/link";

interface MenuItem {
    title: string;
    href: string;
    description: string;
    icon?: LucideIcon;
    iconImage?: { src: string };
    iconColor?: string;
}

const MenuItemIcon = ({
    icon: Icon,
    iconImage,
}: {
    icon?: LucideIcon;
    iconImage?: { src: string };
}) => {
    if (iconImage) {
        return <img src={iconImage.src} alt="" aria-hidden="true" className="size-5" />;
    }

    if (!Icon) return null;

    return <Icon size={20} className="text-current" />;
};

const iconBoxBase =
    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors";
const iconBoxDefault =
    "bg-muted text-foreground group-hover:bg-background group-hover:text-foreground group-focus-within:bg-primary group-focus-within:text-primary-foreground";

interface Props {
    className?: string;
    lang: string;
}

const Logo = ({ lang, className }: { lang: string; className?: string }) => {
    const t = translations[lang as keyof typeof translations];
    const url = lang === "es" ? "/" : `/${lang}/`;
    return (
        <a href={url} className={cn("block shrink-0", className)}>
            <img src={logo.src} alt={t.altText.logo} className="h-5 w-auto dark:invert" />
        </a>
    );
};

const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
        onClick={onClick}
        aria-label={isOpen ? "Close menu" : "Open menu"}
    >
        <span
            className={`block w-6 h-0.5 bg-foreground transition-all ${
                isOpen ? "rotate-45 translate-y-2" : ""
            }`}
        ></span>
        <span
            className={`block w-6 h-0.5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`}
        ></span>
        <span
            className={`block w-6 h-0.5 bg-foreground transition-all ${
                isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
        ></span>
    </button>
);

const ListItem = ({
    className,
    title,
    href,
    children,
    icon,
    iconImage,
    iconColor,
}: {
    className?: string;
    title: string;
    href: string;
    children: React.ReactNode;
    icon?: LucideIcon;
    iconImage?: { src: string };
    iconColor?: string;
}) => {
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

const MobileMenuItemLink = ({ item }: { item: MenuItem }) => {
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

const MainNavigationMenu = ({ lang, className }: Props) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        },
        {
            title: t.navigation.app,
            href: p("/app"),
            description: t.navigation.appDescription,
            icon: Shapes,
            iconColor: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
        },
        {
            title: t.navigation.finance,
            href: p("/finance"),
            description: t.navigation.financeDescription,
            icon: WalletCards,
            iconColor:
                "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        },
        {
            title: pm.extracurricular.navTitle,
            href: p("/extracurricular"),
            description: pm.extracurricular.navDescription,
            icon: Sparkles,
            iconColor: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        },
        {
            title: pm.communication.navTitle,
            href: p("/communication"),
            description: pm.communication.navDescription,
            icon: MessagesSquare,
            iconColor: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
        },
        {
            title: pm.internalPayments.navTitle,
            href: p("/internal-payments"),
            description: pm.internalPayments.navDescription,
            icon: Wallet,
            iconColor: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
        },
        {
            title: pm.shop.navTitle,
            href: p("/shop"),
            description: pm.shop.navDescription,
            icon: Store,
            iconColor:
                "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
        },
        {
            title: pm.tracking.navTitle,
            href: p("/tracking"),
            description: pm.tracking.navDescription,
            icon: Clock,
            iconColor: "bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400",
        },
        {
            title: pm.workflows.navTitle,
            href: p("/workflows"),
            description: pm.workflows.navDescription,
            icon: Zap,
            iconColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
        },
        {
            title: pm.ena.navTitle,
            href: p("/ena"),
            description: pm.ena.navDescription,
            iconImage: aiLogo,
            iconColor: "bg-muted text-black dark:text-white",
        },
    ];

    const segments: MenuItem[] = [
        {
            title: t.navigation.students,
            href: p("/students"),
            description: t.navigation.studentsDescription,
            icon: GraduationCap,
        },
        {
            title: t.navigation.dashboard,
            href: p("/dashboard"),
            description: t.navigation.dashboardDescription,
            icon: LayoutDashboard,
        },
        {
            title: t.navigation.assignment,
            href: p("/assignment"),
            description: t.navigation.assignmentDescription,
            icon: BookOpenText,
        },
        {
            title: t.navigation.nurseries,
            href: p("/nurseries"),
            description: t.navigation.nurseriesDescription,
            icon: Baby,
        },
        {
            title: t.navigation.schools,
            href: p("/schools"),
            description: t.navigation.schoolsDescription,
            icon: School,
        },
        {
            title: t.navigation.academies,
            href: p("/academies"),
            description: t.navigation.academiesDescription,
            icon: Landmark,
        },
        {
            title: t.navigation.groups,
            href: p("/groups"),
            description: t.navigation.groupsDescription,
            icon: LayoutGrid,
        },
        {
            title: t.navigation.forFamilies,
            href: p("/families"),
            description: t.features.appFeatures.tagline,
            icon: HeartHandshake,
        },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={cn("w-full bg-background fixed h-15 flex items-center z-50", className)}>
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
                                        <ul className="grid w-[400px] gap-2 p-2 lg:w-[500px] lg:grid-cols-2 lg:w-[600px]">
                                            {products.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    href={item.href}
                                                    icon={item.icon}
                                                    iconImage={item.iconImage}
                                                    iconColor={item.iconColor}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="font-medium">
                                        {t.navigation.functionalities}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-2 p-2 lg:w-[500px] lg:grid-cols-2 lg:w-[600px]">
                                            {segments.map((item) => (
                                                <ListItem
                                                    key={item.title}
                                                    title={item.title}
                                                    href={item.href}
                                                    icon={item.icon}
                                                >
                                                    {item.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href={p("/pricing")}>
                                        <Button variant="ghost" className="font-medium">
                                            {t.navigation.pricing}
                                        </Button>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href={p("/contact")}>
                                        <Button variant="ghost" className="font-medium">
                                            {t.navigation.contact}
                                        </Button>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <div className="flex items-center gap-4 lg:hidden ml-auto">
                    <Link href={p("/demo")} className="sm:hidden">
                        <Button className="w-full" size="sm">
                            {t.bookDemo}
                        </Button>
                    </Link>

                    <MenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
                </div>

                <div className="hidden lg:flex shrink-0 items-center gap-2 ml-auto pl-8 xl:pl-6">
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
                    <LanguageSwitcher currentLang={lang} />
                </div>

                {isMobileMenuOpen && (
                    <div
                        className={`lg:hidden fixed inset-x-0 top-15 z-50 bg-background border-b transition-transform duration-300 ease-in-out transform ${
                            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                        }`}
                    >
                        <div className="container px-4 py-4 space-y-4 max-h-[calc(100vh-3.75rem)] overflow-y-auto">
                            <div className="space-y-1">
                                <div className="text-[10px] font-semibold uppercase tracking-widest">
                                    {t.navigation.products}
                                </div>
                                <ul>
                                    {products.map((item) => (
                                        <MobileMenuItemLink key={item.title} item={item} />
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[10px] font-semibold uppercase tracking-widest">
                                    {t.navigation.functionalities}
                                </div>
                                <ul>
                                    {segments.map((item) => (
                                        <MobileMenuItemLink key={item.title} item={item} />
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div>
                                    <a
                                        href={p("/pricing")}
                                        className="block py-2 text-sm hover:text-primary"
                                    >
                                        {t.navigation.pricing}
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href={p("/contact")}
                                        className="block py-2 text-sm hover:text-primary"
                                    >
                                        {t.navigation.contact}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default MainNavigationMenu;
