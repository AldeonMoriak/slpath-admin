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
      <v-card-title>ایجاد مقاله</v-card-title>
      <v-row>
        <v-col>
          <v-text-field v-model="article.title" label="عنوان" solo />
        </v-col>
        <v-col>
          <v-select
            v-model="article.tags"
            :items="tags"
            solo
            multiple
            item-text="title"
            item-value="id"
            label="تگ ها"
            return-object
            single-line
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-textarea
          v-model="article.description"
          label="خلاصه مقاله"
          clearable
          solo
          counter
          clear-icon="mdi-close-circle"
        />
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-file-input
            v-model="article.image"
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="یک تصویر انتخاب کنید"
            prepend-icon="mdi-camera"
            label="عکس مقاله"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="elevation-5" cols="12">
          <v-row><v-col cols="12">محتوای مقاله</v-col></v-row>
          <v-row>
            <v-col cols="12">
              <ckeditor
                v-model="article.content"
                :editor="editor"
                :config="editorConfig"
                @ready="onReady"
              ></ckeditor>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="article.referenceUrl"
            type="url"
            dir="ltr"
            solo
            label="آدرس مرجع"
          />
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
// import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import DecoupledEditor from '@ckeditor/ckeditor5-build-classic'
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

interface Article {
  image: string | Blob | null
  title: string
  referenceUrl: string
  tags: {
    id: number
    title: string
  }[]
  content: string
  description: string
}

@Component
export default class CreateArticle extends Vue {
  disabled = false
  article: Article = {
    image: null,
    title: '',
    content: '',
    referenceUrl: '',
    description: '',
    tags: [
      {
        id: 0,
        title: '',
      },
    ],
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

  tags: Tag[] = []

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
    await this.getTags()
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

  async getTags() {
    const tags = await this.$axios.get('tags/getAll')
    const els = tags.data as Tag[]
    els.map((tag: Tag) => {
      const id = tag.id as number
      const title = tag.title as string
      this.tags.push({ id, title })
    })
  }

  timer: any = null

  async onSaveArticle() {
    const { image, content, referenceUrl, description, title, tags } =
      this.article
    const tagIds: number[] = []
    tags.map((tag) => {
      if (tag.id !== 0) tagIds.push(tag.id)
    })
    const formData = new FormData()
    formData.append('file', image!)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('description', description)
    formData.append('tags', JSON.stringify(tagIds))
    formData.append('referenceUrl', referenceUrl)

    await this.$axios
      .post('articles/createArticle', formData)
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

<style>
.ck.ck-toolbar {
  position: sticky;
  top: 55px;
}
</style>
