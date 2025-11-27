import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
    site: 'https://edena.es',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
        routing: {
            prefixDefaultLocale: true
        },
        fallback: {
            en: 'es'
        }
    },
    vite: {
        plugins: [tailwindcss()]
    },
    integrations: [react()]
});