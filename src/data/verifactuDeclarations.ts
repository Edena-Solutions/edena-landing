/**
 * Public copy of the producer's "declaración responsable" for the Edena invoicing system (art. 13
 * RD 1007/2023, art. 15 Orden HAC/1177/2024). It has to be available to anyone before they contract
 * the product, not only inside it. The in-app copy is served by edena-finance-api
 * (`src/verifactu/declaracion-responsable.ts`) and both must say the same for the same version.
 *
 * The text is kept in Spanish, the language it is signed in, on every locale. Each version of the
 * system gets its own declaration: add a new entry at the top and keep the earlier ones published,
 * together with their PDF under `public/verifactu/`.
 */
export interface VerifactuDeclarationItem {
    /** "1.x" follows the letters of art. 15.1 Orden HAC/1177/2024; "2.x" is the annex. */
    id: string;
    label: string;
    /** One entry per paragraph. */
    value: string[];
}

export interface VerifactuDeclaration {
    version: string;
    /** ISO date the declaration was signed on. */
    signedOn: string;
    signedAt: string;
    pdfPath: string;
    items: VerifactuDeclarationItem[];
    annex: VerifactuDeclarationItem[];
}

export const verifactuDeclarations: VerifactuDeclaration[] = [
    {
        version: "1.0",
        signedOn: "2026-09-28",
        signedAt: "Barcelona",
        pdfPath: "/verifactu/declaracion-responsable-edena-v1.0.pdf",
        items: [
            { id: "1.a", label: "Nombre del sistema informático", value: ["Edena"] },
            { id: "1.b", label: "Código identificador del sistema informático", value: ["ED"] },
            {
                id: "1.c",
                label: "Identificador completo de la versión concreta del sistema informático",
                value: ["1.0"],
            },
            {
                id: "1.d",
                label: "Componentes, hardware y software, del sistema informático y breve descripción de lo que hace y de sus principales funcionalidades",
                value: [
                    "Se trata de un servicio de software en la nube (SaaS) al que el usuario accede desde un navegador web o desde la aplicación móvil, sin instalar ningún componente propio del sistema en sus equipos. El sistema se ejecuta en la infraestructura en la nube del productor y se compone de la aplicación web de gestión, la aplicación móvil, la API de servidor con su base de datos y los procesos en segundo plano que generan los registros de facturación y los remiten a la Agencia Tributaria.",
                    "Permite gestionar la facturación de centros educativos y organizaciones similares: capturar la información de facturación, expedir facturas completas y facturas rectificativas con su código «QR» tributario, generar y encadenar los registros de facturación y remitirlos a la sede electrónica de la AEAT, consultar las facturas expedidas y el estado de su registro, y exportar los datos de facturación.",
                    "Cada organización usuaria gestiona su facturación de forma independiente dentro del sistema, cumpliendo por separado con la normativa indicada en el apartado 1.k) para cada una de ellas, como si se tratara de sistemas informáticos de facturación distintos, con su propio número de instalación.",
                ],
            },
            {
                id: "1.e",
                label: "Indicación de si el sistema informático se ha producido de tal modo que solo pueda funcionar exclusivamente como «VERI*FACTU»",
                value: ["Sí."],
            },
            {
                id: "1.f",
                label: "Indicación de si el sistema informático permite ser usado por varios obligados tributarios o por un mismo usuario para dar soporte a la facturación de varios obligados tributarios",
                value: ["Sí."],
            },
            {
                id: "1.g",
                label: "Tipos de firma utilizados para firmar los registros de facturación y de evento en el caso de que el sistema informático no sea utilizado como «VERI*FACTU»",
                value: [
                    "Dado que se trata de un sistema que solo puede utilizarse en la modalidad «VERI*FACTU», no se realiza una firma electrónica expresa de los registros de facturación generados: la normativa considera que quedan firmados al ser remitidos correctamente a los servicios electrónicos de la Agencia Tributaria con la debida autenticación mediante el certificado electrónico cualificado del obligado tributario o de su representante.",
                ],
            },
            {
                id: "1.h",
                label: "Razón social completa de la entidad productora del sistema informático",
                value: ["Edena Software S.L."],
            },
            {
                id: "1.i",
                label: "NIF español de la entidad productora del sistema informático",
                value: ["B27627462"],
            },
            {
                id: "1.j",
                label: "Dirección postal completa de contacto de la entidad productora del sistema informático",
                value: ["AVENIDA JOSEP TARRADELLAS 103, PORTAL 4, PLANTA 4, PTA. 2, 08029 BARCELONA"],
            },
            {
                id: "1.k",
                label: "Declaración de cumplimiento",
                value: [
                    "La entidad productora del sistema informático a que se refiere esta declaración responsable hace constar que dicho sistema informático, en la versión indicada en ella, cumple con lo dispuesto en el artículo 29.2.j) de la Ley 58/2003, de 17 de diciembre, General Tributaria, en el Reglamento que establece los requisitos que deben adoptar los sistemas y programas informáticos o electrónicos que soporten los procesos de facturación de empresarios y profesionales, y la estandarización de formatos de los registros de facturación, aprobado por el Real Decreto 1007/2023, de 5 de diciembre, en la Orden HAC/1177/2024, de 17 de octubre, y en la sede electrónica de la Agencia Estatal de Administración Tributaria para todo aquello que complete las especificaciones de dicha orden.",
                ],
            },
            {
                id: "1.l",
                label: "Fecha y lugar de suscripción de la declaración responsable",
                value: ["Barcelona, 28 de septiembre de 2026."],
            },
        ],
        annex: [
            { id: "2.a", label: "Contacto", value: ["soporte@edena.es"] },
            { id: "2.b", label: "Sitio web", value: ["https://www.edena.es"] },
            {
                id: "2.c",
                label: "Cómo se implementan los requisitos técnicos y funcionales",
                value: [
                    "La generación del registro de facturación y su encadenamiento con el registro anterior se realizan en una sola unidad transaccional de la base de datos, en el momento en que se expide la factura.",
                    "Los registros se remiten a la AEAT en el orden en que se generan, en envíos de hasta 1000 registros, respetando el tiempo de espera entre envíos indicado por la AEAT (control de flujo). Si la AEAT no está disponible, se reintenta automáticamente al menos una vez por hora, indicando la incidencia.",
                    "Cada registro se conserva tal como se generó y los reenvíos transmiten exactamente el mismo registro.",
                    "Los registros rechazados por la AEAT se subsanan reenviando la factura corregida sin cambiar su número; no se reutilizan números de factura.",
                    "La factura impresa o en PDF incluye el código «QR» tributario conforme a las especificaciones de la AEAT y la mención «VERI*FACTU».",
                ],
            },
        ],
    },
];

/** The declaration of the version currently in service. */
export const currentVerifactuDeclaration = verifactuDeclarations[0];
