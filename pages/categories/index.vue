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
        <v-card-title>تخصص ها</v-card-title>
        <v-btn
          color="primary"
          dark
          class="mb-2 mt-2"
          @click="$router.push('/categories/createInterest')"
        >
          تخصص جدید
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
            :key="'edit' + item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="secondary"
            class="secondary--text text--darken-4"
            @click="$router.push(`/categories/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="'delete' + item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="error"
            @click="deleteCategory(item)"
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

interface SnackbarData {
  show: boolean
  color: string
  text: string
}
interface RAdmin {
  name: string
}

interface Category {
  id: number
  title: string
  createdDateTime: Date
  updateDateTime: Date
  loading: boolean
  rowNumber: number
}

interface CategoryResponse {
  tag: Category
  message: string
}

@Component
export default class Categories extends Vue {
  loading = true

  snackbarData: SnackbarData = {
    show: false,
    color: 'primary',
    text: '',
  }

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  created() {
    this.getAllCategories()
  }

  async deleteCategory(item: any): Promise<void> {
    await this.$axios
      .delete(`categories/deleteCategory/${item.id}`)
      .then(() => this.getAllCategories())
      .catch((err) => {
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  async getAllCategories(): Promise<void> {
    this.loading = true
    const tags = await this.$axios.get('categories/getAll')
    const els = tags.data as Category[]
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
  rows: Category[] = []
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
      text: 'تاریخ ساخت',
      sortable: false,
      align: 'center',
      value: 'createdDateTime',
    },
    { text: 'عملیات', sortable: false, align: 'center', value: 'actions' },
  ]
}
</script>
