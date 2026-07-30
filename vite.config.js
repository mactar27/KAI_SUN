import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['kaia-logo-v3.svg'],
      manifest: {
        name: 'Kaïa Sun',
        short_name: 'Kaïa Sun',
        description: 'Lunettes de soleil Premium',
        theme_color: '#0d2823',
        background_color: '#faf9f6',
        display: 'standalone',
        icons: [
          {
            src: 'kaia-logo-v3.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: 'kaia-logo-v3.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
