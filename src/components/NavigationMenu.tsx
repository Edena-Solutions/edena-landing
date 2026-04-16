import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
    Baby,
    BookOpenText,
    GraduationCap,
    HeartHandshake,
    Landmark,
    LayoutDashboard,
    LayoutGrid,
    School,
    Shapes,
    SquareUser,
    Users,
    WalletCards,
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
import LanguageSwitcher from "./LanguageSwitcher";
import { translations } from "@/i18n/index.ts";
import { Button } from "./ui/button";
import Link from "./ui/link";

interface MenuItem {
    title: string;
    href: string;
    description: string;
    icon: LucideIcon;
}

interface Props {
    className?: string;
    lang: string;
}

const Logo = ({ lang }: { lang: string }) => {
    const t = translations[lang as keyof typeof translations];
    const url = lang === "es" ? "/" : `/${lang}/`;
    return (
        <a href={url}>
            <img src={logo.src} alt={t.altText.logo} className="h-5 w-auto dark:invert" />
        </a>
    );
};

const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
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
    icon: Icon,
}: {
    className?: string;
    title: string;
    href: string;
    children: React.ReactNode;
    icon: LucideIcon;
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
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground transition-colors group-hover:bg-background group-hover:text-primary-foreground group-focus-within:bg-primary group-focus-within:text-primary-foreground">
                        <Icon size={20} />
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
    const Icon = item.icon;
    return (
        <li>
            <a
                href={item.href}
                className="group flex flex-row items-start gap-3 rounded-md px-2 py-2.5 -mx-2 text-foreground no-underline transition-colors hover:bg-muted focus-visible:bg-muted"
            >
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-focus-within:bg-primary group-focus-within:text-primary-foreground">
                    <Icon size={20} />
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

    const products: MenuItem[] = [
        {
            title: t.navigation.students,
            href: `/${lang}/students`,
            description: t.navigation.studentsDescription,
            icon: GraduationCap,
        },
        {
            title: t.navigation.dashboard,
            href: `/${lang}/dashboard`,
            description: t.navigation.dashboardDescription,
            icon: LayoutDashboard,
        },
        {
            title: t.navigation.finance,
            href: `/${lang}/finance`,
            description: t.navigation.financeDescription,
            icon: WalletCards,
        },
        {
            title: t.navigation.crm,
            href: `/${lang}/crm`,
            description: t.navigation.crmDescription,
            icon: SquareUser,
        },
        {
            title: t.navigation.guardians,
            href: `/${lang}/guardians`,
            description: t.navigation.guardiansDescription,
            icon: Users,
        },
        {
            title: t.navigation.assignment,
            href: `/${lang}/assignment`,
            description: t.navigation.assignmentDescription,
            icon: BookOpenText,
        },
        {
            title: t.navigation.app,
            href: `/${lang}/app`,
            description: t.navigation.appDescription,
            icon: Shapes,
        },
    ];

    const segments: MenuItem[] = [
        {
            title: t.navigation.nurseries,
            href: `/${lang}/nurseries`,
            description: t.navigation.nurseriesDescription,
            icon: Baby,
        },
        {
            title: t.navigation.schools,
            href: `/${lang}/schools`,
            description: t.navigation.schoolsDescription,
            icon: School,
        },
        {
            title: t.navigation.academies,
            href: `/${lang}/academies`,
            description: t.navigation.academiesDescription,
            icon: Landmark,
        },
        {
            title: t.navigation.groups,
            href: `/${lang}/groups`,
            description: t.navigation.groupsDescription,
            icon: LayoutGrid,
        },
        {
            title: t.navigation.forFamilies,
            href: `/${lang}/families`,
            description: t.features.appFeatures.tagline,
            icon: HeartHandshake,
        },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={cn("w-full bg-background fixed h-15 flex items-center z-50", className)}>
            <div className="container mx-auto px-4 flex h-fit items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4 md:items-center">
                <div className="md:justify-self-start">
                    <Logo lang={lang} />
                </div>

                <div className="flex items-center gap-4 md:hidden">
                    <Link href={"/demo"} className="sm:hidden">
                        <Button className="w-full" size="sm">
                            {t.bookDemo}
                        </Button>
                    </Link>

                    <MenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
                </div>

                <div className="hidden md:flex md:justify-center relative overflow-visible">
                    <NavigationMenu className="flex justify-center">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    {t.navigation.products}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {products.map((item) => (
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
                                <NavigationMenuTrigger>
                                    {t.navigation.functionalities}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-2 p-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                                <Link href={`/${lang}/pricing`}>
                                    <Button variant="ghost">{t.navigation.pricing}</Button>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href={`/${lang}/contact`}>
                                    <Button variant="ghost">{t.navigation.contact}</Button>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center gap-2 md:justify-self-end">
                    <Link href={`/${lang}/blog`}>
                        <Button variant="ghost">{t.navigation.blog}</Button>
                    </Link>
                    <Link href="/demo">
                        <Button>{t.bookDemo}</Button>
                    </Link>
                    <LanguageSwitcher currentLang={lang} />
                </div>

                {isMobileMenuOpen && (
                    <div
                        className={`md:hidden fixed inset-x-0 top-15 z-50 bg-background border-b transition-transform duration-300 ease-in-out transform ${
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
                                        href={`/${lang}/pricing`}
                                        className="block py-2 text-sm hover:text-primary"
                                    >
                                        {t.navigation.pricing}
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href={`/${lang}/contact`}
                                        className="block py-2 text-sm hover:text-primary"
                                    >
                                        {t.navigation.contact}
                                    </a>
                                </div>
                                <div>
                                    <a
                                        href={`/${lang}/blog`}
                                        className="block py-2 text-sm hover:text-primary"
                                    >
                                        {t.navigation.blog}
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
