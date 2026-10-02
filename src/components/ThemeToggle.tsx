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
    return "light";
}

function applyTheme(theme: "light" | "dark") {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff");
}

export function ThemeToggle({
    labels,
    className,
}: {
    labels: { light: string; dark: string };
    className?: string;
}) {
    const [mounted, setMounted] = React.useState(false);
    const [theme, setTheme] = React.useState<"light" | "dark">("light");

    React.useEffect(() => {
        const initial = getInitialTheme();
        setMounted(true);
        setTheme(initial);
        applyTheme(initial);

        // The nav renders one toggle per breakpoint; keep them all in sync.
        const root = document.documentElement;
        const observer = new MutationObserver(() => {
            setTheme(root.classList.contains("dark") ? "dark" : "light");
        });
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    };

    if (!mounted) {
        return (
            <div className={cn("size-9 shrink-0 rounded bg-secondary", className)} aria-hidden />
        );
    }

    const isDark = theme === "dark";
    const label = isDark ? labels.light : labels.dark;

    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleClick}
            aria-label={label}
            title={label}
            className={cn("shrink-0", className)}
        >
            <span className="relative inline-flex size-5 items-center justify-center">
                <Sun
                    className={cn(
                        "size-5 absolute transition-all duration-300 ease-out",
                        isDark
                            ? "rotate-0 opacity-100"
                            : "-rotate-90 opacity-0 pointer-events-none",
                    )}
                    aria-hidden
                />
                <Moon
                    className={cn(
                        "size-5 absolute transition-all duration-300 ease-out",
                        !isDark
                            ? "rotate-0 opacity-100"
                            : "rotate-90 opacity-0 pointer-events-none",
                    )}
                    aria-hidden
                />
            </span>
        </Button>
    );
}
