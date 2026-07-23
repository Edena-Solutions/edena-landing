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