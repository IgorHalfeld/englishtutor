// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-og-image'],

  runtimeConfig: {
    public: {
      workerUrl: 'https://englishtutor-agent.igorhalfeld.workers.dev',
    },
  },

  site: {
    url: 'https://englishtutor.pages.dev',
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  googleFonts: {
    base64: true,
    fontsDir: 'assets/fonts',
    overwriting: true,
    families: {
      Montserrat: [300, 500, 800],
    },
  },
})
