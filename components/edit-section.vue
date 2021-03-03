<template>
  <div style="max-width: 960px" class="mx-auto">
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
    <v-card class="pa-5 mx-auto">
      <v-card-title>{{ title }}</v-card-title>
      <v-row>
        <v-col cols="6" sm="6" md="4" lg="4">
          <v-text-field
            v-model="admin.username"
            type="text"
            label="نام کاربری"
            solo
            disabled
          />
        </v-col>
        <v-col cols="6" sm="6" md="4" lg="4">
          <v-text-field v-model="admin.name" label="نام ادمین" solo />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-text-field v-model="admin.email" label="ایمیل" solo />
        </v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-text-field
            v-model="admin.password"
            type="password"
            label="رمز عبور"
            solo
          />
        </v-col>
      </v-row>
      <v-row> </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-file-input
            v-model="admin.image"
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="یک تصویر انتخاب کنید"
            prepend-icon="mdi-camera"
            label="عکس مقاله"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6" md="6" class="d-flex justify-center">
          <v-img
            class="d-flex justify-center"
            max-height="150"
            max-width="250"
            :src="
              admin.profilePictureThumbnailUrl
                ? `${$axios.defaults.baseURL}image/${admin.profilePictureThumbnailUrl}`
                : null
            "
          ></v-img
        ></v-col>
      </v-row>
      <v-row>
        <v-textarea
          v-model="admin.description"
          label="درباره خود"
          clearable
          solo
          counter
          clear-icon="mdi-close-circle"
        />
      </v-row>
      <v-row>
        <v-col
          cols="12"
          align-self="center"
          class="mt-5 d-flex justify-center align-center"
        >
          <v-btn color="primary" class="ml-5" @click="onSaveAdmin">ثبت</v-btn>
          <v-btn color="error" @click="$router.go(-1)">بازگشت</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

interface SnackbarData {
  show: boolean
  color: string
  text: string
}

interface AdminDTO {
  name: string
  email: string
  username: string
  password: string
  image: string | Blob | null
  profilePictureThumbnailUrl: string
  description: string
}

const EditProps = Vue.extend({
  props: {
    url: {
      type: String,
      default: 'admin/editAdmin',
    },
    title: {
      type: String,
      default: 'ویرایش ادمین',
    },
    fetchUrl: {
      type: String,
      default: 'admin/getProfile',
    },
  },
})

@Component
export default class CreateAdmin extends EditProps {
  admin: AdminDTO = {
    name: '',
    email: '',
    username: '',
    password: '',
    image: null,
    profilePictureThumbnailUrl: '',
    description: '',
  }

  snackbarData: SnackbarData = {
    show: false,
    color: 'primary',
    text: '',
  }

  rules = [
    function (value: File) {
      return (
        !value ||
        value.size < 500000 ||
        'تصویر پروفایل باید کمتر از ۵۰۰ کیلوبایت باشد!'
      )
    },
  ]

  async created() {
    await this.getProfile()
  }

  async getProfile() {
    await this.$axios
      .get<{ user: AdminDTO }>(this.fetchUrl)
      .then((res) => {
        this.admin = { ...res.data.user }
      })
      .catch((err) => {
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }

  async onSaveAdmin() {
    const { image, name, email, username, password, description } = this.admin
    const formData = new FormData()
    if (image) formData.append('file', image!)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('username', username)
    formData.append('password', password ?? null)
    formData.append('description', description)

    await this.$axios
      .put<{ message: string }>(this.url, formData)
      .then((res) => {
        this.snackbarData = {
          text: res.data.message,
          color: 'success',
          show: true,
        }
      })
      .catch((err) => {
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }
}
</script>
