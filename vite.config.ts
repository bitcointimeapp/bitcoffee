import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        // PDFs komplett vom Precaching ausschließen
        globIgnores: ['**/*.pdf'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'NetworkFirst',     // Immer zuerst vom Netzwerk holen
            options: {
              cacheName: 'pdf-cache-v2',
              expiration: {
                maxEntries: 3,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Tage
              }
            }
          }
        ]
      },
      manifest: {
        name: '₿itCoffee Da Nang',
        short_name: '₿itCoffee',
        description: '₿itcoin Café Da Nang',
        theme_color: '#f59e0b',
        background_color: '#0a0a0a',
        display: 'standalone',
        icons: [
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})