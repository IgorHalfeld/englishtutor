// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-og-image'],

  runtimeConfig: {
    public: {
      workerUrl: process.env.WORKER_URL,
    },
  },

  /*
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  */

  googleFonts: {
    base64: true,
    fontsDir: 'assets/fonts',
    overwriting: true,
    families: {
      Montserrat: [300, 500, 800],
    },
  },
})
