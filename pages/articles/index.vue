<template>
  <v-card class="pa-2" width="100%" height="100%">
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-card-title>مدیریت مقاله ها</v-card-title>
        <v-btn
          color="primary"
          dark
          class="mb-2 mt-2"
          @click="$router.push('/articles/createArticle')"
        >
          مقاله جدید
        </v-btn>
      </v-col>
    </v-row>
    <div>
      <v-data-table
        disable-sort
        :loading="loading"
        :headers="headers"
        :items="rows"
        :options.sync="options"
        class="elevation-8"
      >
        <template v-slot:item.admin.name="{ item }">
          <div>
            <span style="font-weight: 600">{{ item.admin.name }}</span>
            <span style="color: gray; display: block">{{
              item.editor ? item.editor.name : ''
            }}</span>
          </div>
        </template>
        <template v-slot:item.createdDateTime="{ item }">
          <div>
            <span style="font-weight: 600">{{ item.createdDateTime }}</span>
            <span style="color: gray; display: block">{{
              item.updateDateTime ? item.updateDateTime : ''
            }}</span>
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :key="item.id"
            color="orange lighten-3"
            class="orange--text text--darken-4"
            @click="$router.push(`/articles/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="`${item.id}-comment`"
            color="purple lighten-3"
            class="purple--text text--darken-4"
            @click="$router.push(`/articles/comments/${item.id}`)"
            >نظرات</v-btn
          >
          <v-btn
            :key="`${item.id}-toggle`"
            :loading="item.loading"
            :disabled="item.loading"
            :color="toggleColor(item.isActive)"
            :class="toggleClass(item.isActive)"
            @click="toggleArticleActivation(item)"
            >{{ item.isActive ? 'غیرفعال' : 'فعال' }}</v-btn
          >
        </template>
      </v-data-table>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import toJalaaliConverter from '@/utils/date-convertor'

interface RAdmin {
  name: string
}

interface Article {
  id: number
  title: string
  admin: RAdmin
  imageUrl: string
  thumbnailUrl: string
  referenceUrl: string
  description: string
  content: string
  createdDateTime: Date
  updateDateTime: Date
  editor: RAdmin
  loading: boolean
  rowNumber: number
  isActive: boolean
}

interface ArticleResponse {
  tag: Article
  message: string
}

@Component
export default class Articles extends Vue {
  loading = true

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  toggleClass(isActive: boolean) {
    return isActive ? 'red--text text--darken-4' : 'green--text text--darken-4'
  }

  toggleColor(isActive: boolean) {
    return isActive ? 'red lighten-4' : 'green lighten-4'
  }

  created() {
    this.getAllArticles()
  }

  async toggleArticleActivation(item: Article): Promise<void> {
    const articleIndex = this.rows.findIndex(
      (article) => article.id === item.id
    )
    this.rows[articleIndex].loading = true
    await this.$axios
      .put(`articles/toggleArticleActivation/${item.id}`)
      .then(() => {
        this.rows[articleIndex].loading = false
        this.rows[articleIndex].isActive = !this.rows[articleIndex].isActive
        // this.getAllArticles()
      })
      .catch((err) => {
        console.log(err)
        this.rows[articleIndex].loading = false
      })
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  async getAllArticles(): Promise<void> {
    this.loading = true
    const tags = await this.$axios.get('articles/getArticles')
    const els = tags.data as Article[]
    els.map((el, i) => {
      el.loading = false
      el.rowNumber = i + 1

      const crDt = el.createdDateTime as unknown
      el.createdDateTime = toJalaaliConverter(crDt as string) as Date
      if (el.updateDateTime) {
        const upDt = el.updateDateTime as unknown
        el.updateDateTime = toJalaaliConverter(upDt as string) as Date
      }
    })

    this.rows = els

    this.loading = false
  }

  items = [5, 10, 25, 50, 100]
  rows: Article[] = []
  dialog = false

  max25chars = (v: any) => v.length <= 25 || 'تعداد حروف زیاد است!'

  newItem = {
    title: '',
  }

  headers = [
    {
      text: 'ردیف',
      align: 'center',
      value: 'rowNumber',
    },
    {
      text: 'نام',
      align: 'center',
      sortable: false,
      value: 'title',
    },
    {
      text: 'سازنده',
      value: 'admin.name',
      align: 'center',
      sortable: false,
    },
    {
      text: 'تاریخ ساخت',
      sortable: false,
      align: 'center',
      value: 'createdDateTime',
    },
    {
      text: 'عملیات',
      sortable: false,
      align: 'center',
      value: 'actions',
    },
  ]
}
</script>
