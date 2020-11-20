<template>
  <v-card> </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Index extends Vue {
  text = 'سلام'

  // beforeDestory() {
  //   this.editor.destroy()
  // }

  async logout(): Promise<void> {
    try {
      await this.$auth.logout() /* .then(() => (location.href = '/')) */
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
