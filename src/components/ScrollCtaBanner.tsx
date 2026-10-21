import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Glass call to action fixed to the foot of the page. Desktop is a pill; below
 * 1024px it is a bottom sheet. It stays hidden until the first scroll, waits out
 * the cookie dialog, and steps aside while the mobile nav is open — that sheet
 * sits above it.
 */
const DISMISS_KEY = "edena-scroll-cta-dismissed";

const FACES = ["/cta/avatar-1.jpg", "/cta/avatar-2.jpg"];

interface Props {
    demoHref: string;
    trialHref: string;
    copy: {
        message: string;
        bookDemo: string;
        trial: string;
        close: string;
    };
}

function isDismissed() {
    try {
        return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
        return false;
    }
}

function isDemoPage() {
    return /\/demo\/?$/.test(window.location.pathname);
}

function cookieDialogOpen() {
    return document.querySelector('[aria-labelledby="cookie-consent-title"]') != null;
}

function mobileNavOpen() {
    return document.querySelector(".ds-nav-burger")?.getAttribute("aria-expanded") === "true";
}

export default function ScrollCtaBanner({ demoHref, trialHref, copy }: Props) {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const [covered, setCovered] = useState(false);

    useEffect(() => {
        let scrolled = window.scrollY > 24;
        let cookieOpen = cookieDialogOpen();

        const canShow = () => scrolled && !isDismissed() && !cookieOpen && !isDemoPage();

        const sync = () => {
            setLeaving(false);
            setVisible(canShow());
            setCovered(mobileNavOpen());
        };

        const onScroll = () => {
            if (scrolled || window.scrollY <= 8) return;
            scrolled = true;
            sync();
        };

        const onPage = () => {
            scrolled = window.scrollY > 24;
            cookieOpen = cookieDialogOpen();
            sync();
        };

        const onCookie = () => {
            const open = cookieDialogOpen();
            if (open === cookieOpen) return;
            cookieOpen = open;
            sync();
        };

        const onNav = () => setCovered(mobileNavOpen());

        const cookies = new MutationObserver(onCookie);
        cookies.observe(document.body, { childList: true, subtree: true });

        const nav = new MutationObserver(onNav);
        const burger = document.querySelector(".ds-nav-burger");
        if (burger) nav.observe(burger, { attributes: true, attributeFilter: ["aria-expanded"] });

        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("astro:page-load", onPage);
        sync();

        return () => {
            cookies.disconnect();
            nav.disconnect();
            window.removeEventListener("scroll", onScroll);
            document.removeEventListener("astro:page-load", onPage);
        };
    }, []);

    useEffect(() => {
        if (!leaving) return;
        const timer = window.setTimeout(() => setVisible(false), 360);
        return () => window.clearTimeout(timer);
    }, [leaving]);

    const close = () => {
        try {
            sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
            /* private mode: it still hides until the next full load */
        }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(false);
            return;
        }
        setLeaving(true);
    };

    if (!visible) return null;

    return (
        <aside
            className={
                leaving ? "ds-scroll-cta is-leaving" : covered ? "ds-scroll-cta is-covered" : "ds-scroll-cta"
            }
            aria-label={copy.message}
            onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget || !leaving) return;
                setVisible(false);
            }}
        >
            <button type="button" className="ds-scroll-cta-close" onClick={close} aria-label={copy.close}>
                <X aria-hidden="true" />
            </button>
            <div className="ds-scroll-cta-faces" aria-hidden="true">
                {FACES.map((src) => (
                    <img key={src} src={src} alt="" width={44} height={44} decoding="async" />
                ))}
            </div>
            <p className="ds-scroll-cta-copy">{copy.message}</p>
            <div className="ds-scroll-cta-actions">
                <a className="ds-btn ds-scroll-cta-demo" href={demoHref}>
                    {copy.bookDemo}
                </a>
                <a className="ds-btn ds-scroll-cta-trial" href={trialHref}>
                    {copy.trial}
                </a>
            </div>
        </aside>
    );
}
