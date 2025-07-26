import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    className?: string;
    variant?: "sidebar" | "mobile";
}

export default function TableOfContents({
    className = "",
    variant = "sidebar",
}: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [debug, setDebug] = useState<string>("");

    useEffect(() => {
        // Buscar el contenedor del contenido del artículo específicamente
        const articleContainer = document.querySelector("article");
        const proseContainer = document.querySelector(".prose");
        const contentContainer = proseContainer || articleContainer;

        let debugInfo = `Article: ${!!articleContainer}, Prose: ${!!proseContainer}, Content: ${!!contentContainer}\n`;

        if (!contentContainer) {
            setDebug(debugInfo + "No content container found");
            return;
        }

        const allHeadings = Array.from(contentContainer.querySelectorAll("h2, h3, h4, h5, h6"));
        const strongElements = Array.from(contentContainer.querySelectorAll("strong"));

        debugInfo += `All headings: ${allHeadings.length}\n`;
        debugInfo += `Strong elements: ${strongElements.length}\n`;
        debugInfo += `Strong texts: ${strongElements
            .map((el) => el.textContent?.trim())
            .join(", ")}\n`;

        const strongHeadings = strongElements.filter((strong) => {
            const parent = strong.parentElement;
            if (!parent) return false;

            const nextSibling = strong.nextElementSibling;
            if (nextSibling && nextSibling.tagName === "BR") {
                return true;
            }

            const prevSibling = strong.previousElementSibling;
            if (prevSibling && prevSibling.tagName === "BR") {
                return true;
            }

            const parentText = parent.textContent?.trim();
            const strongText = strong.textContent?.trim();
            if (parentText === strongText && parent.children.length <= 2) {
                return true;
            }

            return false;
        });

        debugInfo += `Filtered strong headings: ${strongHeadings.length}\n`;
        debugInfo += `Filtered texts: ${strongHeadings
            .map((el) => el.textContent?.trim())
            .join(", ")}\n`;

        const articleHeadings = [...allHeadings, ...strongHeadings]
            .filter((heading) => {
                const text = heading.textContent?.trim() || "";
                return text.length > 3 && text.length < 100;
            })
            .map((heading, index) => {
                const baseId =
                    heading.textContent
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "") || "";
                const id = `${baseId}-${index}`;

                if (!heading.id) {
                    heading.id = id;
                }

                let level = 2;
                if (heading.tagName.startsWith("H")) {
                    level = parseInt(heading.tagName.charAt(1));
                }

                return {
                    id,
                    text: heading.textContent || "",
                    level,
                };
            });

        debugInfo += `Final headings: ${articleHeadings.length}\n`;
        debugInfo += `Final texts: ${articleHeadings.map((h) => h.text).join(", ")}\n`;

        setDebug(debugInfo);
        setHeadings(articleHeadings);

        const updateActiveId = () => {
            const scrollY = window.scrollY;
            const headerHeight = 100;

            for (let i = articleHeadings.length - 1; i >= 0; i--) {
                const element = document.getElementById(articleHeadings[i].id);
                if (element && element.offsetTop <= scrollY + headerHeight) {
                    setActiveId(articleHeadings[i].id);
                    break;
                }
            }
        };

        updateActiveId();

        window.addEventListener("scroll", updateActiveId);

        return () => {
            window.removeEventListener("scroll", updateActiveId);
        };
    }, []);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerHeight = 100;
            const elementTop = element.offsetTop - headerHeight;

            window.scrollTo({
                top: elementTop,
                behavior: "smooth",
            });

            setActiveId(id);
        }
    };

    const navClasses =
        variant === "sidebar"
            ? `sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto ${className}`
            : `lg:hidden ${className}`;

    return (
        <nav className={cn(navClasses, variant === "mobile" && "hidden")}>
            {headings.length === 0 ? (
                <p className="text-sm text-gray-500">No se encontraron encabezados</p>
            ) : (
                <ul className="space-y-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={`text-left w-full px-2 py-1 text-sm rounded transition-colors cursor-pointer ${
                                    activeId === heading.id
                                        ? "text-primary bg-primary/10 font-medium"
                                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                } ${
                                    heading.level === 2
                                        ? "font-medium"
                                        : heading.level === 3
                                        ? "ml-3"
                                        : heading.level === 4
                                        ? "ml-6"
                                        : heading.level === 5
                                        ? "ml-9"
                                        : "ml-12"
                                }`}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
