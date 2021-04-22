<template>
  <v-app dark>
    <v-card
      max-width="600"
      min-width="400"
      min-height="100"
      class="mx-auto my-12"
    >
      <div class="mx-2 my-12">
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
        <a href="/">صفحه اصلی</a>
      </div>
    </v-card>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
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
