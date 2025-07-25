import { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
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
}

interface Props {
    className?: string;
    lang: string;
}

const Logo = ({ lang }: { lang: string }) => (
    <a href={`/${lang}/`}>
        <img src={logo.src} alt="Edena Logo" className="h-6 w-auto" />
    </a>
);

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
}: {
    className?: string;
    title: string;
    href: string;
    children: React.ReactNode;
}) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    className={cn(
                        "block select-none space-y-1 rounded p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    href={href}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
};

const MainNavigationMenu = ({ lang, className }: Props) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = translations[lang as keyof typeof translations];

    const users: MenuItem[] = [
        {
            title: t.navigation.guardians,
            href: `/${lang}/guardians`,
            description: t.navigation.guardiansDescription,
        },
        {
            title: t.navigation.students,
            href: `/${lang}/students`,
            description: t.navigation.studentsDescription,
        },
    ];

    const administration: MenuItem[] = [
        {
            title: t.navigation.dashboard,
            href: `/${lang}/dashboard`,
            description: t.navigation.dashboardDescription,
        },
        {
            title: t.navigation.finance,
            href: `/${lang}/finance`,
            description: t.navigation.financeDescription,
        },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={cn("w-full bg-background fixed h-15 flex items-center z-50", className)}>
            <div className="container mx-auto px-4 flex h-fit items-center justify-between">
                <Logo lang={lang} />

                <div className="flex items-center gap-4">
                    <Link href={`/${lang}/demo`} className="sm:hidden">
                        <Button className="w-full" size="sm">
                            {t.bookDemo}
                        </Button>
                    </Link>

                    <MenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
                </div>

                <div className="hidden md:block flex-1">
                    <NavigationMenu className="mx-auto flex justify-center">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>{t.navigation.users}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {users.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    {t.navigation.administration}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {administration.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            >
                                                {item.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href={`/${lang}/app`}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t.navigation.app}
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href={`/${lang}/pricing`}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t.navigation.pricing}
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a
                                        href={`/${lang}/faqs`}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t.navigation.faqs}
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <Link href={`/${lang}/blog`}>
                        <Button variant="ghost">{t.navigation.blog}</Button>
                    </Link>
                    <Link href={`/${lang}/demo`}>
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
                        <div className="container px-4 py-4 space-y-4">
                            <div className="space-y-2">
                                <div className="font-medium">{t.navigation.users}</div>
                                <ul className="space-y-2">
                                    {users.map((item) => (
                                        <li key={item.title}>
                                            <a
                                                href={item.href}
                                                className="block py-2 text-sm hover:text-primary"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <div className="font-medium">{t.navigation.administration}</div>
                                <ul className="space-y-2">
                                    {administration.map((item) => (
                                        <li key={item.title}>
                                            <a
                                                href={item.href}
                                                className="block py-2 text-sm hover:text-primary"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <a
                                    href={`/${lang}/app`}
                                    className="block py-2 text-sm hover:text-primary"
                                >
                                    {t.navigation.app}
                                </a>
                            </div>
                            <div className="space-y-2">
                                <a
                                    href={`/${lang}/pricing`}
                                    className="block py-2 text-sm hover:text-primary"
                                >
                                    {t.navigation.pricing}
                                </a>
                            </div>
                            <div className="space-y-2">
                                <a
                                    href={`/${lang}/faqs`}
                                    className="block py-2 text-sm hover:text-primary"
                                >
                                    {t.navigation.faqs}
                                </a>
                            </div>
                            <div className="space-y-2">
                                <a
                                    href={`/${lang}/blog`}
                                    className="block py-2 text-sm hover:text-primary"
                                >
                                    {t.navigation.blog}
                                </a>
                            </div>
                            <div>
                                <Link href={`/${lang}/demo`}>
                                    <Button className="w-full">{t.bookDemo}</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default MainNavigationMenu;
