import {
    BILLING_FLOOR,
    CENTER_PACKS,
    MODULE_IDS,
    PACKS,
    annualPrice,
    floorFor,
    formatPrice,
    formatPriceTrim,
    moduleSectionsById,
    type PlanFeatureSection,
} from "@/constants/pricing";
import { translations } from "@/i18n/index.ts";

/*
 * Edena's prices as Markdown, for agents that read a file rather than render a page: served at
 * /pricing.md and folded into /llms-full.txt. Built from the catalogue and the Spanish copy behind
 * /pricing/academies and /pricing/centers, so it says what those pages say and nothing more. In
 * particular the centre packages stay unpublished: /pricing/centers gives a "from" price only.
 */

const SITE = "https://edena.es";
const REGISTER_URL = "https://app.edena.es/register-organization";

export function pricingMarkdown(): string {
    const lang = "es";
    const t = translations.es;
    const sections = moduleSectionsById(
        (t.pricing as { planFeatureSections?: PlanFeatureSection[] }).planFeatureSections ?? [],
    );
    const moduleName = (id: string) => sections[id]?.title ?? id;
    const perStudent = (value: number) => `${formatPrice(value, lang)} ${t.pricing.perStudent}`;

    const packRows = PACKS.map((pack) => {
        const modules = pack.modules.map((id) =>
            id === "ena" ? `${moduleName(id)} (${t.pricingPage.enaUsage})` : moduleName(id),
        );
        return `| ${t.pricing.packs.items[pack.id].name} | ${perStudent(pack.pricePerStudent)} | ${perStudent(annualPrice(pack.pricePerStudent))} | ${modules.join(", ")} |`;
    });

    const centersFrom = floorFor(
        Math.min(...CENTER_PACKS.map((pack) => pack.pricePerStudent)),
        "centers",
    );
    const centers = t.pricing.centers;

    const moduleLines = MODULE_IDS.flatMap((id) => {
        const section = sections[id];
        return section
            ? [`- **${section.title}**: ${section.items.map((item) => item.label).join("; ")}.`]
            : [];
    });

    return [
        "# Precios de Edena",
        "",
        "> Edena es un software de gestión para centros educativos: colegios, escuelas infantiles, academias y grupos educativos. Se paga por alumno matriculado y mes, sin cuota de alta ni permanencia, con prueba gratis de 30 días.",
        "",
        `Precios en euros. Fuente: ${SITE}/pricing/`,
        "",
        "## Academias",
        "",
        t.pricing.packs.description,
        "",
        `- ${t.pricing.packs.minNote.replace("{n}", String(BILLING_FLOOR.academies.value))}.`,
        `- Pago anual: ${t.pricing.calculator.annualDiscount}.`,
        "",
        `| Pack | ${t.pricing.calculator.monthly} | ${t.pricing.calculator.annual} | Incluye |`,
        "|---|---|---|---|",
        ...packRows,
        "",
        `Detalle: ${SITE}/pricing/academies/`,
        "",
        "## Colegios, escuelas infantiles y grupos educativos",
        "",
        centers.description,
        "",
        `- ${t.pricing.fromLabel} ${formatPriceTrim(centersFrom, lang)} ${centers.fromNote}. ${centers.priceCaption}.`,
        ...centers.priceBullets.map((bullet) => `- ${bullet}.`),
        "",
        `${centers.howTitle}:`,
        "",
        ...centers.steps.map((step, i) => `${i + 1}. **${step.title}**: ${step.description}`),
        "",
        centers.ctaDescription,
        "",
        `Detalle: ${SITE}/pricing/centers/`,
        "",
        "## Condiciones comunes",
        "",
        ...t.pricing.packs.notes.map((note) => `- **${note.title}**: ${note.description}`),
        "- **Prueba gratis**: 30 días.",
        "",
        "## Módulos",
        "",
        ...moduleLines,
        "",
        "## Siguientes pasos",
        "",
        `- Pedir una demostración de 15 minutos: ${SITE}/demo/`,
        `- Empezar la prueba gratis de 30 días: ${REGISTER_URL}`,
        "",
    ].join("\n");
}
