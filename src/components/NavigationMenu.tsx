import React, { useState } from "react";
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
import logo from "@/assets/img/logos/logo.svg";

interface MenuItem {
    title: string;
    href: string;
    description: string;
}

const Logo: React.FC = () => (
    <a href="/">
        <img src={logo.src} alt="Edena Logo" className="h-6 w-auto" />
    </a>
);

const MenuButton: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => (
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

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            className
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    }
);
ListItem.displayName = "ListItem";

const MainNavigationMenu: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const academics: MenuItem[] = [
        {
            title: "Students",
            href: "/students",
            description: "Manage student records, attendance, and performance.",
        },
        {
            title: "Teachers",
            href: "/teachers",
            description: "Manage teaching staff and assignments.",
        },
        {
            title: "Classes",
            href: "/classes",
            description: "Schedule and organize classes for your school.",
        },
    ];

    const administration: MenuItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard",
            description: "View your school's performance at a glance.",
        },
        {
            title: "Finance",
            href: "/finance",
            description: "Manage school finances, fees, and budgets.",
        },
        {
            title: "Reports",
            href: "/reports",
            description: "Generate and view various reports and analytics.",
        },
        {
            title: "Settings",
            href: "/settings",
            description: "Configure school settings and preferences.",
        },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="w-full bg-background fixed h-15 flex items-center z-50">
            <div className="container mx-auto px-4 flex h-fit items-center justify-between">
                <Logo />

                <MenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />

                <div className="hidden md:block flex-1">
                    <NavigationMenu className="mx-auto flex justify-center">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Academics</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {academics.map((item) => (
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
                                <NavigationMenuTrigger>Administration</NavigationMenuTrigger>
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
                                    <a href="/pricing" className={navigationMenuTriggerStyle()}>
                                        Pricing
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a href="/faqs" className={navigationMenuTriggerStyle()}>
                                        FAQS
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex items-center">
                    <button className="h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        Book a demo
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div
                        className={`md:hidden fixed inset-x-0 top-15 z-50 bg-background border-b transition-transform duration-300 ease-in-out transform ${
                            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
                        }`}
                    >
                        <div className="container px-4 py-4 space-y-4">
                            <div className="space-y-2">
                                <div className="font-medium">Academics</div>
                                <ul className="pl-2 space-y-2">
                                    {academics.map((item) => (
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
                                <div className="font-medium">Administration</div>
                                <ul className="pl-2 space-y-2">
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
                                    href="/pricing"
                                    className="block py-2 text-sm hover:text-primary"
                                >
                                    Pricing
                                </a>
                            </div>
                            <div className="space-y-2">
                                <a href="/faqs" className="block py-2 text-sm hover:text-primary">
                                    FAQS
                                </a>
                            </div>

                            <button className="w-full h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                Book a demo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default MainNavigationMenu;
