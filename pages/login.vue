<template>
  <v-row align="center" justify="center">
    <v-card width="450" height="500" class="ma-5 pa-5 pt-16" shaped>
      <v-card-title class="justify-center">ورود</v-card-title>
      <v-text-field
        v-model="credentials.username"
        background-color="grey lighten-4"
        outlined
        label="نام کاربری"
      >
      </v-text-field>
      <v-text-field
        v-model="credentials.password"
        background-color="grey lighten-4"
        outlined
        label="رمز عبور"
      ></v-text-field>
      <v-btn block class="d-flex justify-center" large color="primary"
        >ورود</v-btn
      >
    </v-card>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

interface LoginDTO {
  firstName: string
  lastName: string
}
export default Vue.extend({
  name: 'Login',
  data() {
    return {
      credentials: {
        username: '',
        password: '',
      },
    }
  },
})
</script>
