import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kaïa Sun',
        short_name: 'Kaïa Sun',
        description: 'Lunettes de soleil Premium',
        theme_color: '#0d2823',
        background_color: '#faf9f6',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
