<template>
  <v-app dark>
    <v-card
      max-width="600"
      min-width="400"
      min-height="100"
      class="mx-auto my-12"
    >
      <div class="my-12 mx-auto">
        <a href="/"><p class="text-center">صفحه اصلی</p></a>
        <div v-if="error.statusCode === 404">
          <h1 class="text-center">
            {{ pageNotFound }}
          </h1>
          <lottie-player
            class="mx-auto"
            autoplay
            loop
            src="/animations/404.json"
            speed="1"
          ></lottie-player>
        </div>
        <div v-else>
          <h1 class="text-center">
            {{ otherError }}
          </h1>
          <lottie-player
            class="mx-auto"
            autoplay
            loop
            src="/animations/not-found.json"
            speed="1"
          ></lottie-player>
        </div>
      </div>
    </v-card>
  </v-app>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'صفحه مورد نظر یافت نشد',
      otherError: 'خطایی رخ داده است',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
