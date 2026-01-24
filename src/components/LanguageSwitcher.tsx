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
    currentPath?: string;
}

const languageNames: Record<string, { code: string; name: string }> = {
    en: { code: "EN", name: "English" },
    es: { code: "ES", name: "Español" },
};

export default function LanguageSwitcher({ currentLang, currentPath }: LanguageSwitcherProps) {
    const [pathWithoutLang, setPathWithoutLang] = useState<string>("/");

    useEffect(() => {
        const path = window.location.pathname;
        const parts = path.split("/").filter(Boolean);

        if (parts.length > 0 && languages.includes(parts[0])) {
            setPathWithoutLang("/" + parts.slice(1).join("/"));
        } else {
            setPathWithoutLang(path);
        }
    }, []);

    const createLanguageUrl = (lang: string) => {
        return `/${lang}${pathWithoutLang}`;
    };

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <>
                <div className="flex gap-2 md:hidden">
                    {["es", "en"].map((lang) => (
                        <a
                            key={lang}
                            href={`/${lang}${currentPath || "/"}`}
                            className={`px-3 py-1 rounded text-sm font-medium ${currentLang === lang
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}
                        >
                            {languageNames[lang].code}
                        </a>
                    ))}
                </div>
                <div className="hidden md:block">
                    <Button variant="secondary">
                        {languageNames[currentLang]?.code || currentLang}
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex gap-2 md:hidden">
                {["es", "en"].map((lang) => (
                    <a
                        key={lang}
                        href={createLanguageUrl(lang)}
                        className={`px-3 py-1 rounded text-sm font-medium ${currentLang === lang
                                ? "bg-black text-white"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                    >
                        {languageNames[lang].code}
                    </a>
                ))}
            </div>
            <div className="hidden md:block">
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
                                    {currentLang === lang && (
                                        <Check className="h-4 w-4 text-primary" />
                                    )}
                                </a>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
