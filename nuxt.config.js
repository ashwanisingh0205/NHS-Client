// nuxt.config.js
export default defineNuxtConfig({
  compatibilityDate: '2025-11-10',
  devtools: { 
    enabled: true,
    componentInspector: true,
  },
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  pinia: {
    storesDirs: ['./stores'],
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (server-side only)
    apiSecret: '',
    
    // Public keys (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      appName: 'My App',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },

  // App config
  app: {
    head: {
      title: 'My App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'My professional Nuxt app' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ],
    },
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // Build optimization
  build: {
    transpile: [],
  },

  // Nitro (server) config
  nitro: {
    compressPublicAssets: true,
  },

  // Experimental features
  experimental: {
    payloadExtraction: false,
  },

  // Image optimization
  image: {
    quality: 80,
    formats: ['webp', 'avif', 'jpeg'],
  },
})