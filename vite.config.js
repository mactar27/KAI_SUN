import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'kaia-icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kaïa Sun',
        short_name: 'Kaïa Sun',
        description: 'Lunettes de soleil Premium',
        theme_color: '#0d2823',
        background_color: '#faf9f6',
        display: 'standalone',
        icons: [
          {
            src: 'kaia-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
