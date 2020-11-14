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
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn color="secondary" @click="$router.push(`/brands/${item.id}`)">
            ویرایش</v-btn
          >
          <v-btn
            :key="item.id"
            :loading="item.loading"
            :disabled="item.loading"
            color="error"
            @click="deleteTag(item)"
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

@Component
export default class Categories extends Vue {
  loading = true

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
  }

  async getAllCategories(): Promise<void> {
    this.loading = true
    const categories = await this.$axios.get('/categories/getAll')
    this.rows = categories.data
    this.loading = false
  }

  items = [5, 10, 25, 50, 100]
  rows = []

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
      value: 'admin',
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
      align: 'center',
      sortable: false,
      value: 'actions',
    },
  ]
}
</script>
