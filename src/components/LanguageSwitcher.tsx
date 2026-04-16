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
                    {languages.map((lang) => (
                        <a
                            key={lang}
                            href={`/${lang}${currentPath || "/"}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium ${
                                currentLang === lang
                                    ? "bg-black text-white"
                                    : "bg-card text-black hover:bg-card/80"
                            }`}
                        >
                            <LangFlag src={languageNames[lang].flag} />
                            {languageNames[lang].code}
                        </a>
                    ))}
                </div>
                <div className="hidden md:block">
                    <Button variant="secondary" className="gap-2">
                        <LangFlag src={languageNames[currentLang].flag} />
                        {languageNames[currentLang]?.code || currentLang}
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex gap-2 md:hidden">
                {languages.map((lang) => (
                    <a
                        key={lang}
                        href={createLanguageUrl(lang)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium ${
                            currentLang === lang
                                ? "bg-black text-white"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                        }`}
                    >
                        <LangFlag src={languageNames[lang].flag} />
                        {languageNames[lang].code}
                    </a>
                ))}
            </div>
            <div className="hidden md:block">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="gap-2">
                            <LangFlag src={languageNames[currentLang].flag} />
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
