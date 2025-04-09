import { useState, useEffect } from "react";
import { languages } from "@/i18n/index.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface LanguageSwitcherProps {
    currentLang: string;
}

const languageNames: Record<string, { code: string; name: string }> = {
    en: { code: "EN", name: "English" },
    es: { code: "ES", name: "Español" },
};

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
    const getPathWithoutLang = () => {
        if (typeof window !== "undefined") {
            const path = window.location.pathname;
            const parts = path.split("/").filter(Boolean);

            if (parts.length > 0 && languages.includes(parts[0])) {
                return "/" + parts.slice(1).join("/");
            }
            return path;
        }
        return "/";
    };

    const createLanguageUrl = (lang: string) => {
        const pathWithoutLang = getPathWithoutLang();
        return `/${lang}${pathWithoutLang}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                    {languageNames[currentLang]?.code || currentLang}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-fit">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang} asChild>
                        <a
                            href={createLanguageUrl(lang)}
                            className="flex items-center justify-between gap-4 cursor-pointer"
                        >
                            <span>{languageNames[lang]?.name || lang}</span>
                            {currentLang === lang && <Check className="h-4 w-4 text-primary" />}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
