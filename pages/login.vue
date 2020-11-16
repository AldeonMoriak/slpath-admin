<template>
  <div>
    <div class="text-center ma-2">
      <v-snackbar
        v-model="snackbarData.show"
        left
        transition="scroll-x-reverse-transition"
        app
        content-class="d-flex justify-center"
        :color="snackbarData.color"
      >
        {{ snackbarData.text }}
      </v-snackbar>
    </div>
    <v-row align="center" justify="center">
      <v-card width="450" height="500" class="ma-5 pa-5 pt-16" shaped>
        <v-card-title class="justify-center">ورود</v-card-title>
        <v-text-field
          v-model="credentials.username"
          dir="ltr"
          autofocus
          background-color="grey lighten-4"
          outlined
          label="نام کاربری"
        >
        </v-text-field>
        <v-text-field
          v-model="credentials.password"
          dir="ltr"
          background-color="grey lighten-4"
          outlined
          type="password"
          label="رمز عبور"
          @keypress.enter="login"
        ></v-text-field>
        <v-btn
          :loading="loading"
          :disabled="loading"
          block
          class="d-flex justify-center"
          large
          color="primary"
          @click="login"
          >ورود</v-btn
        >
      </v-card>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

interface LoginDTO {
  username: string
  password: string
}

interface SnackbarData {
  show: boolean
  color: string
  text: string
}
@Component({
  layout: 'auth-layout',
  auth: false,
})
export default class Login extends Vue {
  credentials: LoginDTO = {
    username: '',
    password: '',
  }

  snackbarData: SnackbarData = {
    show: false,
    color: 'primary',
    text: '',
  }

  loading = false

  async login(): Promise<void> {
    this.loading = true
    try {
      await this.$auth
        .loginWith('local', {
          data: this.credentials,
        })
        .then(() => {
          this.loading = false
          this.snackbarData = {
            show: true,
            color: 'primary',
            text: 'عملیات با موفقیت انجام شد.',
          }
          setTimeout(() => {
            this.$router.push('/')
          }, 4000)
        })
    } catch (err) {
      this.loading = false
      this.snackbarData = {
        show: true,
        color: 'error',
        text: err,
      }
    }
  }
}
</script>
