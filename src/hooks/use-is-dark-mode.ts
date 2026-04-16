import { useState, useLayoutEffect } from "react";

export function useIsDarkMode(): boolean {
    const [isDark, setIsDark] = useState(false);

    useLayoutEffect(() => {
        const root = document.documentElement;
        const sync = () => setIsDark(root.classList.contains("dark"));
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}
