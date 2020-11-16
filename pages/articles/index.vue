<template>
  <v-card class="pa-2" width="100%" height="100%">
    <v-row>
      <v-col cols="4">
        <v-card-title>مدیریت مقاله ها</v-card-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="2">
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2 mt-2"
              v-bind="attrs"
              v-on="on"
            >
              مقاله جدید
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">ایجاد مقاله</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newItem.title"
                      label="عنوان مقاله"
                      @keypress.enter="onSaveNewItem"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDialog">بستن</v-btn>
              <v-btn color="primary" text @click="onSaveNewItem">ثبت</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
            color="secondary"
            @click="$router.push(`/articles/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="error"
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

  async editArticle(item: Article): Promise<void> {
    await this.$axios
      .post('articles/editArticle', { title: item.title, id: item.id })
      .then((res) => {
        item.loading = false
        this.getAllArticles()
      })
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  async onSaveNewArticle() {
    await this.$axios
      .post('articles/createArticle', { title: this.newItem.title })
      .then(() => {
        this.getAllArticles()
        this.dialog = false
        this.newItem.title = ''
      })
  }

  async getAllArticles(): Promise<void> {
    this.loading = true
    const tags = await this.$axios.get('articles/getAll')
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
