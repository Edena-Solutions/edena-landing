import { useState, useEffect } from "react";
import { languages, localePath } from "@/i18n/index.ts";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Globe } from "lucide-react";

interface LanguageSwitcherProps {
    currentLang: string;
    currentPath?: string;
    /**
     * Per-language link for pages whose path differs by language: a blog post's slug is translated,
     * so swapping the prefix would land on a 404.
     */
    languageHrefs?: Record<string, string>;
    className?: string;
    /** Desktop icon trigger (e.g. `ds-nav-icon-btn` in premium nav). */
    iconButtonClassName?: string;
}

const languageNames: Record<string, { code: string; name: string; flag: string }> = {
    en: { code: "EN", name: "English", flag: "https://flagcdn.com/gb.svg" },
    ca: {
        code: "CA",
        name: "Català",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Catalonia.svg/330px-Flag_of_Catalonia.svg.png",
    },
    es: { code: "ES", name: "Español", flag: "https://flagcdn.com/es.svg" },
    eus: {
        code: "EUS",
        name: "Euskera",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Flag_of_the_Basque_Country.svg/960px-Flag_of_the_Basque_Country.svg.png",
    },
    fr: { code: "FR", name: "Français", flag: "https://flagcdn.com/fr.svg" },
};

function LangFlag({ src }: { src: string }) {
    return (
        <img
            src={src}
            alt=""
            width={16}
            height={16}
            className="inline-block h-4 w-4 shrink-0 rounded object-cover"
            loading="lazy"
            decoding="async"
            aria-hidden
        />
    );
}

export default function LanguageSwitcher({
    currentLang,
    currentPath,
    languageHrefs,
    className,
    iconButtonClassName,
}: LanguageSwitcherProps) {
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
        return languageHrefs?.[lang] ?? localePath(lang, pathWithoutLang);
    };

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <>
                <div className={cn("flex flex-wrap justify-center gap-2 lg:hidden", className)}>
                    {languages.map((lang) => (
                        <a
                            key={lang}
                            href={languageHrefs?.[lang] ?? localePath(lang, currentPath || "/")}
                            className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
                                currentLang === lang
                                    ? "bg-ink text-canvas"
                                    : "bg-fill-2 text-ink hover:bg-fill"
                            }`}
                        >
                            {languageNames[lang].name}
                        </a>
                    ))}
                </div>
                <div className={cn("hidden lg:block", className)}>
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn("rounded-full", iconButtonClassName)}
                        aria-label={languageNames[currentLang]?.name || currentLang}
                    >
                        <Globe className="size-4" aria-hidden />
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={cn("flex flex-wrap justify-center gap-2 lg:hidden", className)}>
                {languages.map((lang) => (
                    <a
                        key={lang}
                        href={createLanguageUrl(lang)}
                        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium ${
                            currentLang === lang
                                ? "bg-ink text-canvas"
                                : "bg-fill-2 text-ink hover:bg-fill"
                        }`}
                    >
                        {languageNames[lang].name}
                    </a>
                ))}
            </div>
            <div className={cn("hidden lg:block", className)}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="secondary"
                            size="icon"
                            className={cn("rounded-full", iconButtonClassName)}
                            aria-label={languageNames[currentLang]?.name || currentLang}
                        >
                            <Globe className="size-4" aria-hidden />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-fit">
                        {languages.map((lang) => (
                            <DropdownMenuItem key={lang} asChild>
                                <a
                                    href={createLanguageUrl(lang)}
                                    className="flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <LangFlag src={languageNames[lang].flag} />
                                        {languageNames[lang]?.name || lang}
                                    </span>
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
