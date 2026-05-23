import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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