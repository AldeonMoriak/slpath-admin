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
      <v-card-title>ایجاد ادمین</v-card-title>
      <v-row class="justify-center">
        <v-col cols="12" sm="8" md="4" lg="4">
          <v-text-field v-model="admin.name" label="نام ادمین" solo />
        </v-col>
        <v-col cols="12" sm="8" md="4" lg="4">
          <v-text-field v-model="admin.email" label="ایمیل" solo />
        </v-col>
        <v-col cols="12" sm="8" md="4" lg="4">
          <v-text-field
            v-model="admin.username"
            type="text"
            label="نام کاربری"
            solo
          />
        </v-col>
        <v-col cols="12" sm="8" md="4" lg="4">
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
            label="عکس کاربر"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          align-self="center"
          class="mt-5 d-flex justify-center align-center"
        >
          <v-btn
            color="primary"
            class="ml-5"
            :disabled="disabled"
            @click="onSaveAdmin"
            >ثبت</v-btn
          >
          <v-btn color="error" @click="$router.go(-1)">بازگشت</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/fa'

interface SnackbarData {
  show: boolean
  color: string
  text: string
}

interface Tag {
  id: number
  title: string
}

interface Category {
  id: number
  title: string
}

interface AdminDTO {
  name: string
  email: string
  username: string
  password: string
  image: string | Blob | null
}

@Component
export default class CreateAdmin extends Vue {
  disabled = false

  admin: AdminDTO = {
    name: '',
    email: '',
    username: '',
    password: '',
    image: null,
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
        'تصویر برند باید کمتر از ۵۰۰ کیلوبایت باشد!'
      )
    },
  ]

  categories: Category[] = []

  tags: Tag[] = []

  editor = DecoupledEditor
  editorData = '<p>در این قسمت مقاله خود را بنویسید.</p>'
  editorConfig = {
    // The configuration of the editor.
    language: 'fa',
  }

  async created() {
    await this.getCategories()
    await this.getTags()
  }

  timer: any = null

  destroyed() {
    clearTimeout(this.timer)
  }

  onReady(editor: any) {
    // Insert the toolbar before the editable area.
    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      )
  }

  async getTags() {
    const tags = await this.$axios.get('tags/getAll')
    const els = tags.data as Tag[]
    els.map((tag: Tag) => {
      const id = tag.id as number
      const title = tag.title as string
      this.tags.push({ id, title })
    })
  }

  async getCategories() {
    const categories = await this.$axios.get('categories/getAll')
    const els = categories.data as Category[]
    els.map((category: Category) => {
      const id = category.id as number
      const title = category.title as string
      this.categories.push({ id, title })
    })
  }

  async onSaveAdmin() {
    const { image, name, email, username, password } = this.admin
    const formData = new FormData()
    if (image) formData.append('file', image!)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('username', username)
    formData.append('password', password)

    await this.$axios
      .post('admin/create', formData)
      .then((res) => {
        this.snackbarData = {
          text: res.data.message,
          color: 'success',
          show: true,
        }
        this.disabled = true
        this.timer = setTimeout(() => {
          this.$router.go(-1)
        }, 4000)
      })
      .catch((err) => {
        console.log(err.message)
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }
}
</script>
