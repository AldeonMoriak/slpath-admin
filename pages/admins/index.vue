<template>
  <v-card class="pa-2" width="100%" height="100%">
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-card-title>مدیریت ادمین ها</v-card-title>
        <v-btn
          color="primary"
          dark
          class="mb-2 mt-2"
          @click="$router.push('/admins/createAdmin')"
        >
          ادمین جدید
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
            color="secondary"
            @click="$router.push(`/admins/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="`${item.id} delete`"
            :loading="item.loading"
            :disabled="item.loading"
            color="error"
            @click="deleteAdmin(item)"
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

export interface Admin {
  id: number
  name: string
  username: string
  email: string
  profilePictureUrl: string
  profilePicturethumbnailUrl: string
  isActive: boolean
  createdDateTime: Date
  createdBy: { name: string }
  rowNumber: number
  loading: false
}

@Component
export default class Admins extends Vue {
  loading = true

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  created() {
    this.getAllAdmins()
  }

  async deleteAdmin(item: Admin): Promise<void> {
    await this.$axios
      .delete(`admins/deleteAdmin/${item.id}`)
      .then(() => this.getAllAdmins())
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  async getAllAdmins(): Promise<void> {
    this.loading = true
    const admins = await this.$axios.get('/getAdmins')
    const els = admins.data as Admin[]
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
  rows: Admin[] = []
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
      value: 'name',
    },
    {
      text: 'نام کاربری',
      align: 'center',
      sortable: false,
      value: 'username',
    },
    {
      text: 'ایجاد کننده',
      value: 'createdBy.name',
      align: 'center',
      sortable: false,
    },
    {
      text: 'تاریخ ایجاد',
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
