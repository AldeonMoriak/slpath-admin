<template>
  <v-card class="pa-2" width="100%" height="100%">
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
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-card-title>مدیریت نظرات</v-card-title>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">پاسخ</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="newItem.title"
                      autofocus
                      filled
                      @keypress.enter="onSaveReply"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDialog">بستن</v-btn>
              <v-btn
                color="primary"
                :loading="loading"
                text
                @click="onSaveReply"
                >ثبت</v-btn
              >
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
        <template v-slot:item.creator="{ item }">
          <span style="font-weight: 600">{{ item.creator }}</span>
          <span style="color: gray; display: block">{{ item.email }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            :key="item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="light-blue lighten-3"
            class="light-blue--text text--darken-4 mt-2 mb-1"
            style="min-width: 100px"
            @click="open(item.id)"
            >پاسخ</v-btn
          >
          <v-btn
            :key="`${item.id} delete`"
            :loading="item.loading"
            :disabled="item.loading"
            style="min-width: 100px"
            class="mt-2 mb-1"
            :color="item.isActive ? 'red lighten-4' : 'light-green accent-1'"
            @click="activeHandler(item.id)"
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

interface ArticleComment {
  id: number
  creator: string
  createdDateTime: Date
  email: string
  content: string
  reply: string[]
  article: { id: number }
  loading: boolean
  rowNumber: number
  isActive: boolean
  isAdmin: boolean
}

interface SnackbarData {
  show: boolean
  color: string
  text: string
}

@Component
export default class Articles extends Vue {
  snackbarData: SnackbarData = {
    show: false,
    color: 'primary',
    text: '',
  }

  loading = true
  id = 0

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  created() {
    this.getAllComments()
  }

  async activeHandler(id: number): Promise<void> {
    await this.$axios
      .get(`comments/toggleActive/${id}`)
      .then(() => this.getAllComments())
  }

  cancel() {}

  open(id: number) {
    this.dialog = true
    this.newItem.title = ''
    this.id = id
  }

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
    this.id = 0
  }

  async onSaveReply(): Promise<void> {
    this.loading = true
    await this.$axios
      .post<{ message: string }>('comments/insertComment', {
        name: this.$auth.user.name,
        content: this.newItem.title,
        articleId: this.$route.params.id,
        email: this.$auth.user.email,
        parentId: this.id,
      })
      .then((res) => {
        this.snackbarData = {
          show: true,
          color: 'info',
          text: res.data.message,
        }
        this.getAllComments()
      })
      .catch((err) => {
        this.snackbarData = {
          show: true,
          color: 'error',
          text: err.message,
        }
      })
      .finally(() => {
        this.loading = false
        this.closeDialog()
      })
  }

  async getAllComments(): Promise<void> {
    this.loading = true
    const comments = await this.$axios.get<ArticleComment[]>(
      'comments/getAll/' + this.$route.params.id
    )
    const els = comments.data as ArticleComment[]
    els.map((el, i) => {
      el.loading = false
      el.rowNumber = i + 1

      const crDt = el.createdDateTime as unknown
      el.createdDateTime = toJalaaliConverter(crDt as string) as Date
    })

    this.rows = els

    this.loading = false
  }

  items = [5, 10, 25, 50, 100]
  rows: ArticleComment[] = []
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
      text: 'سازنده',
      align: 'center',
      sortable: false,
      value: 'creator',
    },
    // {
    //   text: 'ایمیل',
    //   value: 'email',
    //   align: 'center',
    //   sortable: false,
    // },
    {
      text: 'تاریخ ساخت',
      sortable: false,
      align: 'center',
      value: 'createdDateTime',
    },
    {
      text: 'محتوا',
      sortable: false,
      align: 'right',
      value: 'content',
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
