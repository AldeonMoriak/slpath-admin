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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :key="item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="orange lighten-3"
            class="orange--text text--darken-4"
            @click="$router.push(`/articles/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="`${item.id} comment`"
            :loading="item.loading"
            :disabled="item.loading"
            color="purple lighten-3"
            class="purple--text text--darken-4"
            @click="$router.push(`/articles/comments/${item.id}`)"
            >نظرات</v-btn
          >
          <v-btn
            :key="`${item.id} delete`"
            :loading="item.loading"
            :disabled="item.loading"
            color="red lighten-4"
            class="red--text text--darken-4"
            @click="deleteArticle(item)"
            >حذف</v-btn
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

  created() {
    this.getAllArticles()
  }

  async deleteArticle(item: any): Promise<void> {
    await this.$axios
      .delete(`articles/deleteArticle/${item.id}`)
      .then(() => this.getAllArticles())
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
      text: 'ویرایشگر',
      value: 'editor.name',
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
      text: 'تاریخ ویرایش',
      sortable: false,
      align: 'center',
      value: 'updateDateTime',
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
