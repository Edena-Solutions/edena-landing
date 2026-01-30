"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "edena-theme";

function getInitialTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff");
}

export function ThemeToggle({ className }: { className?: string }) {
    const [mounted, setMounted] = React.useState(false);
    const [theme, setTheme] = React.useState<"light" | "dark">("light");

    React.useEffect(() => {
        const initial = getInitialTheme();
        setMounted(true);
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const handleClick = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    };

    if (!mounted) {
        return (
            <div
                className={cn(
                    "fixed z-[100] size-11 rounded bg-secondary border border-border",
                "bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]",
                    className
                )}
                aria-hidden
            />
        );
    }

    const isDark = theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleClick}
            aria-label={label}
            title={label}
            className={cn(
                "fixed z-[100] size-11 rounded border border-border",
                "bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))]",
                "bg-background/95 backdrop-blur-sm",
                className
            )}
        >
            <span className="relative inline-flex size-5 items-center justify-center">
                <Sun
                    className={cn(
                        "size-5 absolute transition-all duration-300 ease-out",
                        isDark
                            ? "rotate-0 opacity-100"
                            : "-rotate-90 opacity-0 pointer-events-none"
                    )}
                    aria-hidden
                />
                <Moon
                    className={cn(
                        "size-5 absolute transition-all duration-300 ease-out",
                        !isDark
                            ? "rotate-0 opacity-100"
                            : "rotate-90 opacity-0 pointer-events-none"
                    )}
                    aria-hidden
                />
            </span>
        </Button>
    );
}
