import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import type { Translation } from "@/i18n";

const STORAGE_KEY = "edena-cookie-consent";

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
    }
}

function applyAnalyticsConsent(granted: boolean) {
    window.gtag?.("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
    });
}

interface Props {
    lang: string;
    t: Translation;
}

export default function CookieConsentBanner({ lang, t }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            const v = localStorage.getItem(STORAGE_KEY);
            if (v !== "accepted" && v !== "rejected") {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    const accept = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, "accepted");
        } catch {
            /* private mode */
        }
        applyAnalyticsConsent(true);
        setVisible(false);
    }, []);

    const reject = useCallback(() => {
        try {
            localStorage.setItem(STORAGE_KEY, "rejected");
        } catch {
            /* private mode */
        }
        applyAnalyticsConsent(false);
        setVisible(false);
    }, []);

    if (!visible) {
        return null;
    }

    const policyHref = `/${lang}/cookies`;
    const copy = t.cookieConsent;

    return (
        <div
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className="fixed bottom-0 left-0 right-0 z-[100] bg-background/95 p-4 shadow-lg backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 md:p-5"
        >
            <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-muted-foreground">
                    <p
                        id="cookie-consent-title"
                        className="mb-1 font-semibold text-foreground uppercase text-[10px] tracking-wider"
                    >
                        {copy.title}
                    </p>
                    <p id="cookie-consent-desc" className="text-xs">
                        {copy.description}
                    </p>
                    <Link href={policyHref} variant="link" className="inline-block text-xs">
                        {copy.policy}
                    </Link>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button type="button" variant="white" onClick={reject}>
                        {copy.reject}
                    </Button>
                    <Button type="button" onClick={accept}>
                        {copy.accept}
                    </Button>
                </div>
            </div>
        </div>
    );
}
