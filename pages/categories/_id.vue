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
    <v-card class="pa-5">
      <v-card-title>ویرایش تخصص</v-card-title>
      <v-row>
        <v-col cols="3" sm="3" md="3" lg="3">
          <v-text-field v-model="interest.title" label="عنوان" solo />
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          v-model="interest.description"
          label="خلاصه تخصص"
          clearable
          solo
          counter
          clear-icon="mdi-close-circle"
        />
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-file-input
            v-model="interest.image"
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="یک تصویر انتخاب کنید"
            prepend-icon="mdi-camera"
            label="عکس تخصص"
          ></v-file-input>
        </v-col>
        <v-col cols="12" sm="6" md="6" class="d-flex justify-center">
          <v-img
            class="d-flex justify-center"
            max-height="150"
            max-width="250"
            :src="`${$axios.defaults.baseURL}categories/image/${interest.thumbnailUrl}`"
          ></v-img
        ></v-col>
      </v-row>
      <v-row>
        <v-col class="elevation-5" cols="12">
          <v-row><v-col cols="12">محتوای تخصص</v-col></v-row>
          <v-row>
            <v-col cols="12">
              <ckeditor
                v-model="interest.content"
                :editor="editor"
                :config="editorConfig"
                @ready="onReady"
              ></ckeditor>
            </v-col>
          </v-row>
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
            @click="onSaveArticle"
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
interface Interest {
  id: number
  image: string | Blob | null
  title: string
  content: string
  description: string
  thumbnailUrl: string
}

@Component
export default class EditInterest extends Vue {
  disabled = false
  interest: Interest = {
    id: 0,
    image: null,
    title: '',
    content: '',
    description: '',
    thumbnailUrl: '',
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

  editor = DecoupledEditor
  editorData = '<p>در این قسمت مقاله خود را بنویسید.</p>'
  editorConfig = {
    // The configuration of the editor.
    language: 'fa',
    link: {
      addTargetToExternalLinks: true,
    },
  }

  async created() {
    await this.getInterest()
  }

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

  async getInterest() {
    await this.$axios
      .get(`categories/getcategory/${this.$route.params.id}`)
      .then((res) => {
        const { id, title, description, content, thumbnailUrl } = res.data

        this.interest = {
          id,
          title,
          description,
          content,
          image: null,
          thumbnailUrl,
        }
      })
  }

  timer: any = null

  async onSaveArticle() {
    const { image, content, description, title } = this.interest
    const formData = new FormData()
    if (image) formData.append('file', image!)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('description', description)

    await this.$axios
      .post('categories/editCategory', formData)
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
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }
}
</script>
