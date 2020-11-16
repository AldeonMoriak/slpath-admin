<template>
  <v-card class="pa-2" width="100%" height="100%">
    <v-row>
      <v-col cols="4">
        <v-card-title>مدیریت تگ ها</v-card-title>
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
              تگ جدید
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">ایجاد تگ</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newItem.title"
                      label="عنوان تگ"
                      @keypress.enter="onSaveNewTag"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDialog">بستن</v-btn>
              <v-btn color="primary" text @click="onSaveNewTag">ثبت</v-btn>
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
            color="error"
            @click="deleteTag(item)"
            >حذف</v-btn
          >
        </template>
        <template v-slot:[`item.title`]="props">
          <v-edit-dialog
            :return-value.sync="props.item.title"
            persistent
            large
            cancel-text="بازگشت"
            save-text="ثبت"
            @save="editTag(props.item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.title }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.title"
                :loading="props.item.loading"
                :rules="[max25chars]"
                label="ویرایش"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
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

interface Tag {
  id: number
  title: string
  admin: RAdmin
  createdDateTime: Date
  updateDateTime: Date
  editor: RAdmin
  loading: boolean
  rowNumber: number
}

interface TagResponse {
  tag: Tag
  message: string
}

@Component
export default class Tags extends Vue {
  loading = true

  options = {
    itemsPerPage: 10,
    page: 1,
  }

  created() {
    this.getAllTags()
  }

  async deleteTag(item: any): Promise<void> {
    await this.$axios
      .delete(`tags/deleteTag/${item.id}`)
      .then(() => this.getAllTags())
  }

  async editTag(item: Tag): Promise<void> {
    await this.$axios
      .post('tags/editTag', { title: item.title, id: item.id })
      .then((res) => {
        item.loading = false
        this.getAllTags()
      })
  }

  cancel() {}

  open() {}

  close() {}

  closeDialog() {
    this.dialog = false
    this.newItem.title = ''
  }

  async onSaveNewTag() {
    await this.$axios
      .post('/tags/createTag', { title: this.newItem.title })
      .then(() => {
        this.getAllTags()
        this.dialog = false
        this.newItem.title = ''
      })
  }

  async getAllTags(): Promise<void> {
    this.loading = true
    const tags = await this.$axios.get('/tags/getAll')
    const els = tags.data as Tag[]
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
  rows: Tag[] = []
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
