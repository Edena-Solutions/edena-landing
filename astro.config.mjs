import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://edena.es',
    redirects: {
        '/demo': '/es/demo',
        '/demo/': '/es/demo/',
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