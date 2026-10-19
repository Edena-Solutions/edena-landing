import alexiaLogo from "@/assets/img/logos/competitors/alexia.png";
import clickeduLogo from "@/assets/img/logos/competitors/clickedu.png";
import dinantiaLogo from "@/assets/img/logos/competitors/dinantia.png";
import educamosLogo from "@/assets/img/logos/competitors/educamos.png";
import esemtiaLogo from "@/assets/img/logos/competitors/esemtia.png";
import livekidLogo from "@/assets/img/logos/competitors/livekid.png";
import tokappLogo from "@/assets/img/logos/competitors/tokapp.png";

/**
 * The comparison pages (`/compare`, `/compare/edena-vs-*`): Edena against the platforms Spanish
 * centres weigh it against, criterion by criterion. This file holds the facts, which do not change
 * with the language; the words for them live in each locale's `comparePage`.
 *
 * Every competitor cell has to be defensible as comparative advertising (Ley 3/1991, art. 10):
 * objective, verifiable, about the same need. So a cell only says `yes` or `partial` where a source
 * in `sources` says so, and `none` reads "not included or no public information" — it never claims
 * a product lacks something, only that its public information does not show it. Re-check the cells
 * against the sources and move `COMPARE_REVIEWED_ON` whenever this file is touched.
 */
export const COMPARE_REVIEWED_ON = "2026-10-19";

export type CompareStatus = "yes" | "partial" | "none";

export type CompareRowId =
    | "comms"
    | "app"
    | "attendance"
    | "records"
    | "grades"
    | "segments"
    | "lms"
    | "payments"
    | "billing"
    | "verifactu"
    | "store"
    | "crm"
    | "ai"
    | "staffTime"
    | "price"
    | "trial"
    | "migration";

export type CompareGroupId = "comms" | "platform" | "money" | "growth" | "terms";

/**
 * The criteria, grouped as a buyer reads them. Communication, collections and the shop are their
 * own rows, so a messaging product is not scored as if it had failed at being an ERP. Invoicing
 * (`billing`) is separate from family payments (`payments`). `store` is an online shop, not a
 * wallet. `trial` is `yes` for a self-serve trial and `partial` for a published demo.
 */
export const COMPARE_GROUPS: { id: CompareGroupId; rows: CompareRowId[] }[] = [
    { id: "comms", rows: ["comms", "app", "attendance"] },
    { id: "platform", rows: ["records", "grades", "segments", "lms"] },
    { id: "money", rows: ["payments", "billing", "verifactu", "store"] },
    { id: "growth", rows: ["crm", "ai", "staffTime"] },
    { id: "terms", rows: ["price", "trial", "migration"] },
];

export const COMPARE_ROWS: CompareRowId[] = COMPARE_GROUPS.flatMap((group) => group.rows);

/** Edena's own column. `lms` stays partial: tasks, grades and report cards, but no publisher content. */
export const EDENA_STATUS: Record<CompareRowId, CompareStatus> = {
    comms: "yes",
    app: "yes",
    attendance: "yes",
    records: "yes",
    grades: "yes",
    segments: "yes",
    lms: "partial",
    payments: "yes",
    billing: "yes",
    verifactu: "yes",
    store: "yes",
    crm: "yes",
    ai: "yes",
    staffTime: "yes",
    price: "yes",
    trial: "yes",
    migration: "yes",
};

/**
 * What each of the three "where Edena wins" arguments is about, in the order of the locale's
 * `wins`: a criterion of the table, whose two marks then stand under the argument as its proof, or
 * `publisher` (Educamos's first argument, which no criterion measures).
 */
export type WinTopic = CompareRowId | "publisher";

export type CompetitorId =
    | "tokapp"
    | "clickedu"
    | "livekid"
    | "educamos"
    | "alexia"
    | "esemtia"
    | "dinantia";

export interface Competitor {
    id: CompetitorId;
    /** Path segment under `/compare/`. */
    slug: string;
    name: string;
    /** Centres the vendor claims, as published (see `sources`). */
    centers: number;
    /**
     * The brand's mark, cut from its white ground and trimmed (`assets/img/logos/competitors`). It is
     * drawn on a white app-icon tile, so marks with white inside them read as intended.
     */
    logo: { src: string; width: number; height: number };
    status: Record<CompareRowId, CompareStatus>;
    wins: [WinTopic, WinTopic, WinTopic];
    sources: { label: string; url: string }[];
}

const none = (
    overrides: Partial<Record<CompareRowId, CompareStatus>>,
): Record<CompareRowId, CompareStatus> => ({
    ...Object.fromEntries(COMPARE_ROWS.map((row) => [row, "none"])),
    ...overrides,
}) as Record<CompareRowId, CompareStatus>;

/** In the order they are listed: the four most asked about first. */
export const COMPETITORS: Competitor[] = [
    {
        id: "tokapp",
        slug: "edena-vs-tokapp",
        name: "TokApp",
        centers: 5000,
        logo: tokappLogo,
        status: none({
            comms: "yes",
            app: "yes",
            attendance: "yes",
            records: "partial",
            segments: "yes",
            payments: "yes",
            store: "yes",
            ai: "yes",
            trial: "partial",
        }),
        wins: ["records", "billing", "price"],
        sources: [
            { label: "tokappschool.com", url: "https://www.tokappschool.com/" },
            {
                label: "tokappschool.com | Escuelas infantiles",
                url: "https://www.tokappschool.com/escuelas-infantiles/",
            },
            {
                label: "tokappschool.com | Tienda en la app",
                url: "https://tokappschool.com/ahora-puedes-comprar-libros-y-material-escolar-desde-tokapp/",
            },
            {
                label: "Google Play | TokApp School",
                url: "https://play.google.com/store/apps/details?id=com.MultiExpo.tokappschool&hl=es",
            },
        ],
    },
    {
        id: "clickedu",
        slug: "edena-vs-clickedu",
        name: "Clickedu",
        centers: 700,
        logo: clickeduLogo,
        status: none({
            comms: "yes",
            app: "yes",
            attendance: "yes",
            records: "yes",
            grades: "yes",
            segments: "partial",
            lms: "partial",
            payments: "yes",
            billing: "yes",
            verifactu: "yes",
            store: "yes",
            crm: "partial",
            trial: "partial",
            migration: "partial",
        }),
        wins: ["crm", "ai", "price"],
        sources: [
            { label: "clickedu.net | Plataforma", url: "https://clickedu.net/plataforma/" },
            {
                label: "Interempresas | Clickedu",
                url: "https://www.interempresas.net/Tecnologia-aulas/Articulos/392787-Mas-de-700-colegios-utilizan-la-plataforma-de-gestion-Clickedu.html",
            },
        ],
    },
    {
        id: "livekid",
        slug: "edena-vs-livekid",
        name: "LiveKid",
        centers: 6000,
        logo: livekidLogo,
        status: none({
            comms: "yes",
            app: "yes",
            attendance: "yes",
            records: "yes",
            segments: "partial",
            payments: "yes",
            billing: "yes",
            crm: "partial",
            staffTime: "yes",
            price: "yes",
            ai: "yes",
            trial: "yes",
            migration: "yes",
        }),
        wins: ["segments", "verifactu", "crm"],
        sources: [
            { label: "livekid.com", url: "https://livekid.com/es/" },
            { label: "livekid.com | Asistente", url: "https://livekid.com/" },
            { label: "livekid.com | Funciones", url: "https://livekid.com/es/funciones/" },
            { label: "livekid.com | Pricing", url: "https://livekid.com/pricing/" },
            {
                label: "tech.eu | LiveKid acquires Aldea (2026)",
                url: "https://tech.eu/2026/06/24/livekid-acquires-aldea-to-expand-in-latin-america/",
            },
        ],
    },
    {
        id: "educamos",
        slug: "edena-vs-educamos",
        name: "SM Educamos",
        centers: 1600,
        logo: educamosLogo,
        status: none({
            comms: "yes",
            app: "yes",
            records: "yes",
            grades: "yes",
            segments: "partial",
            lms: "yes",
            payments: "yes",
            billing: "yes",
            store: "yes",
            crm: "partial",
            attendance: "yes",
            trial: "partial",
        }),
        wins: ["publisher", "verifactu", "migration"],
        sources: [
            {
                label: "educamos.com | Gestión del centro",
                url: "https://educamos.com/es/funcionalidades/gestion-del-centro/",
            },
            {
                label: "educamos.com | Familias",
                url: "https://educamos.com/es/beneficios/familias/",
            },
        ],
    },
    {
        id: "alexia",
        slug: "edena-vs-alexia",
        name: "Alexia",
        centers: 1400,
        logo: alexiaLogo,
        status: none({
            comms: "yes",
            app: "yes",
            records: "yes",
            grades: "yes",
            segments: "partial",
            lms: "yes",
            attendance: "yes",
            payments: "yes",
            billing: "yes",
            verifactu: "yes",
            store: "yes",
            crm: "partial",
            ai: "yes",
            staffTime: "partial",
            trial: "partial",
        }),
        wins: ["crm", "price", "segments"],
        sources: [
            {
                label: "Educación 3.0 | Alexia, suite educativa de Educaria",
                url: "https://www.educaciontrespuntocero.com/recursos/alexia-suite-educativa-de-educaria/",
            },
            { label: "alexiaeducaria.com | Gestión", url: "https://www.alexiaeducaria.com/gestion/" },
            { label: "alexiaeducaria.com", url: "https://www.alexiaeducaria.com/" },
        ],
    },
    {
        id: "esemtia",
        slug: "edena-vs-esemtia",
        name: "Esemtia",
        centers: 700,
        logo: esemtiaLogo,
        status: none({
            comms: "yes",
            app: "yes",
            records: "yes",
            grades: "yes",
            segments: "partial",
            lms: "yes",
            attendance: "yes",
            payments: "yes",
            billing: "yes",
            store: "yes",
            crm: "partial",
            trial: "partial",
        }),
        wins: ["crm", "ai", "trial"],
        sources: [
            { label: "esemtia.com | School", url: "https://esemtia.com/soluciones/esemtia-school/" },
            {
                label: "esemtia.com | Connect",
                url: "https://esemtia.com/esemtia-renueva-imagen-hub-educativo/",
            },
            {
                label: "Educación 3.0 | Esemtia de Edebé",
                url: "https://www.educaciontrespuntocero.com/noticias/esemtia-edebe-plataforma-mejorar-la-gestion-escolar/",
            },
        ],
    },
    {
        id: "dinantia",
        slug: "edena-vs-dinantia",
        name: "Dinantia",
        centers: 900,
        logo: dinantiaLogo,
        status: none({
            comms: "yes",
            app: "yes",
            attendance: "yes",
            records: "partial",
            segments: "partial",
            payments: "yes",
            store: "yes",
            crm: "yes",
            staffTime: "yes",
            trial: "yes",
        }),
        wins: ["records", "billing", "price"],
        sources: [
            { label: "dinantia.com", url: "https://www.dinantia.com/" },
            { label: "dinantia.com | CRM", url: "https://dinantia.com/es/crm/" },
            { label: "ayuda.dinantia.com", url: "https://ayuda.dinantia.com/es/" },
            { label: "AIN | LiveKid acquires Dinantia (2022)", url: "https://en.ain.ua/2022/07/04/livekid-acquires-dinantia" },
        ],
    },
];

export function competitorBySlug(slug: string): Competitor | undefined {
    return COMPETITORS.find((competitor) => competitor.slug === slug);
}

/** Included counts one, partial a half: the hero's scoreboard and the matrix's totals. */
export function scoreOf(status: Record<CompareRowId, CompareStatus>): number {
    return COMPARE_ROWS.reduce(
        (sum, row) => sum + (status[row] === "yes" ? 1 : status[row] === "partial" ? 0.5 : 0),
        0,
    );
}

export const EDENA_SCORE = scoreOf(EDENA_STATUS);
