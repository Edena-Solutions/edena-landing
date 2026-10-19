import { useCallback, useEffect, useState } from "react";

import type { Translation } from "@/i18n";
import { localePath } from "@/i18n/utils";

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
    /** Only the banner's own words: the island's props are written into every page's HTML. */
    copy: Translation["cookieConsent"];
}

export default function CookieConsentBanner({ lang, copy }: Props) {
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

    const policyHref = localePath(lang, "/cookies");

    return (
        <div
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[100] mx-auto w-auto max-w-md rounded-card p-5 material-thick elev-3 ring-1 ring-hairline sm:right-6 sm:left-auto sm:mx-0"
        >
            <p id="cookie-consent-title" className="type-callout font-semibold text-ink">
                {copy.title}
            </p>
            <p id="cookie-consent-desc" className="mt-1.5 type-footnote text-ink-2">
                {copy.description}
            </p>
            <a
                href={policyHref}
                className="mt-2 inline-block type-footnote text-ink underline decoration-hairline-strong underline-offset-[0.2em] transition-colors duration-200 hover:text-ink-2"
            >
                {copy.policy}
            </a>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" className="ds-btn ds-btn--secondary flex-1" onClick={reject}>
                    {copy.reject}
                </button>
                <button type="button" className="ds-btn ds-btn--primary flex-1" onClick={accept}>
                    {copy.accept}
                </button>
            </div>
        </div>
    );
}
