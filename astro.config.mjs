import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://edena.es',
    server: {
        open: true,
    },
    redirects: {
        // /guardians (Portal de Familias) was merged into /families.
        // One entry per path: trailing-slash duplicates collide in the router.
        '/guardians': '/families',
        '/es/guardians': '/es/families',
        '/en/guardians': '/en/families',
        '/ca/guardians': '/ca/families',
        '/eus/guardians': '/eus/families',
        '/fr/guardians': '/fr/families',
        // Retired: its premise (Verifactu as an official platform issuing compliance
        // certificates) was wrong. The VeriFactu 2027 guide covers the topic.
        '/blog/verifactu-integracion-educacion': '/blog/guia-verifactu-2027-centros-educativos',
        '/es/blog/verifactu-integracion-educacion': '/es/blog/guia-verifactu-2027-centros-educativos',
        '/ca/blog/verifactu-integracio-educacio': '/ca/blog/guia-verifactu-2027-centres-educatius',
        '/en/blog/verifactu-education-integration': '/en/blog/verifactu-2027-guide-schools',
        '/fr/blog/verifactu-integration-education': '/fr/blog/guide-verifactu-2027-etablissements',
        '/eus/blog/verifactu-hezkuntza-integrazioa': '/eus/blog/verifactu-2027-gida-ikastetxeak',
    },
    // NOTE: Astro's built-in i18n routing was removed on purpose. Locales are
    // fully hand-rolled via [...lang] routes + literal locale dirs; the old
    // i18n block only generated stray fallback pages like /en/es/.
    vite: {
        plugins: [tailwindcss()],
        ssr: {
            noExternal: ["gsap"]
        }
    },
    integrations: [react()]
});