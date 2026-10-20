# Product Marketing Context

**Document version:** v1.1
**Last updated:** 2026-10-20

## Product Overview
**One-liner:** Software de gestión para centros educativos: colegios, escuelas infantiles, academias y grupos educativos.
**What it does:** Matrículas y CRM de admisiones, expedientes y asistencia, evaluaciones y boletines, facturación con Verifactu y cobros SEPA, comunicación con familias y app gratuita (iOS y Android), en una sola plataforma. Ena es la IA integrada.
**Product category:** Software de gestión escolar / ERP educativo. Es el término con el que se busca y con el que se compara (TokApp, Clickedu, LiveKid, SM Educamos, Alexia, Esemtia, Dinantia).
**Product type:** SaaS B2B, web + app móvil.
**Business model:** Pago por alumno, sin cuota de alta ni permanencia. Academias: packs desde 0,60 € por alumno (mínimo 36 €/mes). Centros: desde 36 €/mes, precio cerrado en la demo. Prueba gratis 30 días. Fuente: `src/constants/pricing.ts`, `public/llms.txt`.

## Target Audience
**Target companies:** Colegios (Infantil a Bachillerato y FP), escuelas infantiles y guarderías (0-3), academias (idiomas, refuerzo, música, danza, deporte) y grupos educativos multicentro. España y Francia.
**Decision-makers:** Dirección, titularidad y responsables de administración/secretaría.
**Primary use case:** Llevar la administración del centro (matrícula, asistencia, cobro, comunicación) en un solo sistema.
**Jobs to be done:**
- Cobrar cada mes sin perseguir a las familias, con facturas Verifactu.
- Avisar a las familias sin grupos de WhatsApp.
- Convertir consultas en matrículas.

## Problems & Pain Points
**Core problem:** El centro trabaja con herramientas que no comparten datos (WhatsApp, correo, Excel, el programa de facturación) y secretaría copia lo mismo a mano en varios sitios.
**Why alternatives fall short:**
- Apps de comunicación (TokApp, Dinantia) no facturan ni llevan expedientes.
- ERPs escolares tradicionales: precio no público, puesta en marcha larga.
- IA genérica (ChatGPT, etc.) no conoce los datos del centro.

## Competitive Landscape
Comparativas con fuentes públicas en `/compare/` (`src/data/competitors.ts`).

## Differentiation
**Key differentiators:**
- Verifactu integrado en la facturación (declaración responsable publicada en `/verifactu/`).
- Precio público por alumno y prueba de 30 días.
- En marcha en 2 semanas, migración y formación incluidas.
- IA integrada (Ena) con el contexto del centro; el equipo revisa antes de enviar.
- App gratuita para familias. Módulos activables por separado.

## Brand Voice
| Attribute | Means | Doesn't mean | Example line |
|-----------|-------|--------------|--------------|
| Concreto | Escenas del día a día de secretaría | Frases crípticas sin contexto | "La familia ve las notas, el recibo y el aviso" |
| Claro | Decir qué es y para quién antes de la escena | Jerga de software ("solución integral") | "Software de gestión para centros educativos" |

**Never use (and why):** "solución integral", "potente", "revoluciona" (no dicen nada); cifras sin fuente.

## Copy rules (learned on the site)
- **Categoría primero.** Cada hero lleva un antetítulo con la categoría y el público dentro del H1 (`hero.eyebrow`, `pageEyebrows.*`). La frase-escena va debajo. Una escena sin categoría no se entiende para quien llega sin contexto.
- El H1 debe compartir la palabra clave del `<title>` de la página.
- Las secciones de la home deben entenderse sueltas: nombrar a Ena como "la IA de Edena" la primera vez.

## Proof Points
**Metrics (con fuente):**
- 37 horas semanales ahorradas en secretaría: **solo Gimbebe**. Citarlo siempre como dato de Gimbebe, nunca como "los centros".
**Metrics pendientes de fuente:** +35% conversión de matrículas, −75% tiempo de alta de familias, 98% satisfacción de familias, −40% impagos. [NEED: origen y muestra de cada cifra antes de reutilizarlas en copy nuevo.]
**Customers:** Gimbebe (logo en la sección de cifras). [NEED: lista de clientes que se pueden citar.]

## Goals
**Conversion action:** Pedir demostración (15 minutos) y, en segundo lugar, prueba gratis 30 días.

## Learnings
| Date | Learning | Evidence | Applies to | Status |
|------|----------|----------|------------|--------|
| 2026-10-19 | Los H1 escritos solo como escena ("Administra, factura y habla con las familias…") dejan a la home sin decir qué es Edena ni para quién; hay que poner la categoría primero. | Revisión del equipo: en la home renderizada, "gestión escolar", "software" y "centro educativo" aparecían 0 veces. | copywriting, seo-audit, cro | active |
| 2026-10-20 | El soporte es por email y chat, incluido en el precio; no hay soporte 24/7 ni centro de ayuda. Lo que funciona 24/7 es Ena. | Auditoría SEO: 16 posts por idioma y la página de Ena prometían "soporte 24/7", en contra de las FAQ (`centers_support_levels`). Corregido. | copywriting, seo-audit, content-strategy | active |
| 2026-10-20 | Las fichas de App Store y Google Play no publican valoración: no mostrar estrellas, número de valoraciones ni posición en ranking. | Fichas públicas revisadas el 2026-10-20, sin `aggregateRating`; la ilustración de /app/ mostraba 4,8 y 150 valoraciones. Corregido. | copywriting, cro | active |
| 2026-10-20 | En el blog, ni casos con cifras inventadas ni frases genéricas sobre competidores: cualquier dato de un competidor sale de `src/data/competitors.ts` y enlaza a su comparativa. | Auditoría SEO: la comparativa 2026 prometía comparar plataformas sin nombrar ninguna e incluía casos sin fuente. Reescrita en 5 idiomas. | copywriting, seo-audit, competitors | active |

## Changelog
- v1 (2026-10-19) — Initial context, built from the site (llms.txt, pricing, comparativas) after the home copy review.
- v1.1 (2026-10-20) — Three learnings from the full SEO audit (support hours, store ratings, competitor and case claims in the blog).
