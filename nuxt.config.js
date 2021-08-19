import colors from 'vuetify/es5/util/colors'
import fa from 'vuetify/es5/locale/fa'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - slpath-admin',
    title: 'slpath-admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/fonts/SansFont.css', '@mdi/font/css/materialdesignicons.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/ckeditor.ts',
    '~/plugins/axios.ts',
    { src: '~/plugins/lottie-player.js', mode: 'client' },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://slpath-backedn.herokuapp.com/',
    // baseUrl: 'http://localhost:5000/',
  },

  router: {
    middleware: ['auth'],
  },

  auth: {
    resetOnError: true,
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: false,
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'portal/login',
            method: 'post',
            propertyName: 'access_token',
          },
          user: {
            url: 'admin/getProfile',
            method: 'get',
            propertyName: 'user',
          },
          logout: { url: 'auth/logout', method: 'get' },
        },
        // tokenRequired: true,
        // tokenType: 'bearer',
        // globalToken: true,
        // autoFetchUser: true
      },
    },
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    rtl: true,
    defaultAssets: false,
    icons: {
      iconfont: 'mdi',
    },
    lang: {
      locales: { fa },
      current: 'fa',
    },
    theme: {
      dark: false,
      options: {
        customProperties: true,
      },
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.teal.accent4,
          info: '#ECE2D0',
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: '#3C7A89',
          background: '#edeef4',
          accent: '#522596',
          secondary: '#7FD1B9',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: '#FB5012',
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: ['@nuxtjs/auth'],
  },
}
