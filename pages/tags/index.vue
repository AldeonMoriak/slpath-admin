<template>
  <v-card class="pa-2" width="100%" height="100%">
    <div>
      <v-data-table
        disable-sort
        :loading="loading"
        :headers="headers"
        :items="rows"
        :options.sync="options"
        class="elevation-8"
      >
        <!-- <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="secondary" @click="$router.push(`/tags/${item.id}`)">
            ویرایش</v-btn
          >
          <v-btn
            :key="item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="error"
            @click="deleteTag(item)"
            >حذف</v-btn
          > -->
        <!-- </template> -->
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
    console.log(item)
    const tag = await this.$axios
      .patch('tags/editTag', { title: item.title, id: item.id })
      .then((res) => (item.loading = false))
    console.log(tag)
  }

  cancel() {}

  open() {}

  close() {}

  async getAllTags(): Promise<void> {
    this.loading = true
    const tags = await this.$axios.get('/tags/getAll')
    const els = tags.data as Tag[]
    els.map((el, i) => {
      el.loading = false
      el.rowNumber = i + 1
    })
    this.rows = els
    this.loading = false
  }

  items = [5, 10, 25, 50, 100]
  rows: Tag[] = []

  max25chars = (v: any) => v.length <= 25 || 'تعداد حروف زیاد است!'

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
  ]
}
</script>
