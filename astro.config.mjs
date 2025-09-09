import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://www.edena.es',
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
    redirects: {
        '/': '/es'
    },
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [react()]
});