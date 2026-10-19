import type { Translation } from "@/i18n";
import { COMPETITORS, type CompetitorId } from "@/data/competitors";

/*
 * The words a hydrated island needs, cut from one language's translation on the server and passed
 * in as props. An island's imports are shipped to every visitor: importing `translations` in the
 * browser sent all five languages, legal texts included (about 1 MB of JavaScript on every page).
 */

/** The app-store buttons' words. */
export function appStoreLabels(t: Translation) {
    return {
        downloadTheApp: t.downloadTheApp,
        appStoreBadge: t.altText.appStoreBadge,
        googlePlayBadge: t.altText.googlePlayBadge,
    };
}

export type AppStoreLabels = ReturnType<typeof appStoreLabels>;

/** Everything the navigation and its mobile menu say. */
export function navCopy(t: Translation) {
    const pm = t.productModules;
    const entry = (m: { navTitle: string; navDescription: string }) => ({
        navTitle: m.navTitle,
        navDescription: m.navDescription,
    });
    const competitors = Object.fromEntries(
        COMPETITORS.map((c) => [c.id, { tagline: t.comparePage.competitors[c.id].tagline }]),
    ) as Record<CompetitorId, { tagline: string }>;

    return {
        altText: { logo: t.altText.logo },
        appearance: t.appearance,
        bookDemo: t.bookDemo,
        changeWebsiteLanguage: t.changeWebsiteLanguage,
        loginButton: t.loginButton,
        registerButton: t.registerButton,
        theme: t.theme,
        navigation: t.navigation,
        appStore: appStoreLabels(t),
        features: { familiesFeatures: { tagline: t.features.familiesFeatures.tagline } },
        comparePage: { competitors },
        productModules: {
            extracurricular: entry(pm.extracurricular),
            communication: entry(pm.communication),
            internalPayments: entry(pm.internalPayments),
            shop: entry(pm.shop),
            tracking: entry(pm.tracking),
            workflows: entry(pm.workflows),
            ena: { ...entry(pm.ena), navEyebrow: pm.ena.navEyebrow, navCta: pm.ena.navCta },
        },
    };
}

export type NavCopy = ReturnType<typeof navCopy>;
