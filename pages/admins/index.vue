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
        <template v-slot:item.actions="{ item }">
          <v-btn
            :key="item.id + 'edit'"
            color="secondary"
            @click="$router.push(`/admins/${item.id}`)"
            >ویرایش</v-btn
          >
          <v-btn
            :key="'toggle' + item.id"
            :loading="item.loading"
            :disabled="item.loading"
            :color="!item.isActive ? 'success' : 'error'"
            @click="toggle(item)"
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
  loading: boolean
}

@Component
export default class Admins extends Vue {
  loading = true

  items = [5, 10, 25, 50, 100]
  rows: Admin[] = []
  dialog = false

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  created() {
    this.getAllAdmins()
  }

  async toggle(item: Admin): Promise<void> {
    const index = this.rows.findIndex((admin) => admin.id === item.id)
    this.rows[index].loading = true
    await this.$axios
      .put(`admin/toggleAdminActivation/${item.id}`)
      .then(() => {
        this.rows[index].loading = false
        this.rows[index].isActive = !this.rows[index].isActive
        // this.getAllAdmins()
      })
      .catch(() => {
        this.rows[index].loading = false
      })
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  admins: Admin[] = []

  async getAllAdmins(): Promise<void> {
    this.loading = true
    await this.$axios
      .get<Admin[]>('/getAdmins')
      .then((res) => {
        this.loading = false
        this.admins = res.data
      })
      .catch((err) => {
        this.loading = false
        throw new Error(err.message)
      })
    const els = this.admins
    els.map((el, i) => {
      el.loading = false
      el.rowNumber = i + 1

      const crDt = el.createdDateTime as unknown
      el.createdDateTime = toJalaaliConverter(crDt as string) as Date
    })

    this.rows = els
  }

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
