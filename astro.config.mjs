import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://edena.es',
    server: {
        open: true,
    },
    redirects: {
        '/demo': '/es/demo',
        '/demo/': '/es/demo/',
        // /guardians (Portal de Familias) was merged into /families
        '/guardians': '/families',
        '/guardians/': '/families/',
        '/es/guardians': '/es/families',
        '/es/guardians/': '/es/families/',
        '/en/guardians': '/en/families',
        '/en/guardians/': '/en/families/',
        '/ca/guardians': '/ca/families',
        '/ca/guardians/': '/ca/families/',
        '/eus/guardians': '/eus/families',
        '/eus/guardians/': '/eus/families/',
        '/fr/guardians': '/fr/families',
        '/fr/guardians/': '/fr/families/',
    },
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
        routing: {
            prefixDefaultLocale: false
        },
        fallback: {
            en: 'es'
        }
    },
    vite: {
        plugins: [tailwindcss()],
        ssr: {
            noExternal: ["gsap"]
        }
    },
    integrations: [react()]
});