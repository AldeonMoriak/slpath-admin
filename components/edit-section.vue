<template>
  <div style="max-width: 960px" class="mx-auto">
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
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card class="pa-5 mx-auto">
        <v-card-title>{{ title }}</v-card-title>
        <v-row>
          <v-col cols="6" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.username"
              type="text"
              prepend-inner-icon="mdi-account-tie"
              label="نام کاربری"
              solo
              disabled
            />
          </v-col>
          <v-col>
            <v-select
              v-model="admin.categories"
              :items="categories"
              solo
              :rules="categoryRules"
              multiple
              prepend-inner-icon="mdi-doctor"
              item-text="title"
              item-value="id"
              label="تخصص ها"
              return-object
              single-line
            ></v-select>
          </v-col>
          <v-col cols="6" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.name"
              label="نام ادمین"
              solo
              prepend-inner-icon="mdi-account-edit"
            />
          </v-col>
          <v-col cols="6" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.occupation"
              label="عنوان شغلی"
              solo
              prepend-inner-icon="mdi-storefront"
              :rules="[(v) => !!v || 'این فیلد الزامی است']"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.email"
              label="ایمیل"
              solo
              prepend-inner-icon="mdi-email"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.password"
              type="password"
              prepend-inner-icon="mdi-account-key"
              label="رمز عبور"
              solo
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-file-input
              v-model="admin.image"
              :rules="rules"
              accept="image/png, image/jpeg, image/bmp"
              placeholder="یک تصویر انتخاب کنید"
              prepend-inner-icon="mdi-camera"
              label="عکس کاربر"
            ></v-file-input>
          </v-col>
          <v-col cols="12" sm="6" md="6" class="d-flex justify-center">
            <v-img
              class="d-flex justify-center"
              max-height="150"
              max-width="250"
              :src="
                admin.profilePictureThumbnailUrl
                  ? `https://kbodliatjlwcgvcbarwj.supabase.in/storage/v1/object/public/tani-images/${admin.profilePictureThumbnailUrl}`
                  : null
              "
            ></v-img
          ></v-col>
        </v-row>
        <v-row>
          <v-textarea
            v-model="admin.description"
            label="درباره خود"
            clearable
            prepend-inner-icon="mdi-information"
            solo
            counter
            clear-icon="mdi-close-circle"
          />
        </v-row>
      </v-card>
      <v-card class="ma-5 mx-auto pa-5">
        <v-card-title>اطلاعات تماس</v-card-title>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.mobileNumber"
              prepend-inner-icon="mdi-cellphone"
              label="شماره موبایل"
              :rules="mobileNumberRule"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              solo
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.whatsappId"
              label="واتساپ"
              prepend-inner-icon="mdi-whatsapp"
              :rules="whatsappRule"
              solo
              dir="ltr"
              placeholder="۹۸۹۱۲۳۴۵۶۷۸۹"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.instagramUsername"
              prepend-inner-icon="mdi-instagram"
              label="اینستاگرام"
              dir="ltr"
              solo
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.telegramUsername"
              prepend-inner-icon="mdi-telegram"
              dir="ltr"
              label="تلگرام"
              solo
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="4">
            <v-text-field
              v-model="admin.linkedinId"
              prepend-inner-icon="mdi-linkedin"
              dir="ltr"
              label="لینکداین"
              solo
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="12" lg="12">
            <v-textarea
              v-model="admin.clinicAddress"
              prepend-inner-icon="mdi-map-marker"
              label="آدرس کلینیک"
              clearable
              solo
              counter
              clear-icon="mdi-close-circle"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-card class="ma-5 pa-5 mx-auto">
        <v-row>
          <v-col
            cols="12"
            align-self="center"
            class="mt-5 d-flex justify-center align-center"
          >
            <v-btn
              :disabled="disabled"
              color="primary"
              class="ml-5"
              @click="onSaveAdmin"
              >ثبت</v-btn
            >
            <v-btn color="error" @click="$router.go(-1)">بازگشت</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

interface Category {
  id: number
  title: string
}

interface SnackbarData {
  show: boolean
  color: string
  text: string
}

interface AdminDTO {
  name: string
  email: string
  username: string
  password: string
  image: string | Blob | null
  profilePictureThumbnailUrl: string
  description: string
  mobileNumber: string
  telegramUsername: string
  instagramUsername: string
  whatsappId: string
  clinicAddress: string
  categories: Category[]
  linkedinId: string
  occupation: string
}

const EditProps = Vue.extend({
  props: {
    url: {
      type: String,
      default: 'admin/editAdmin',
    },
    title: {
      type: String,
      default: 'ویرایش ادمین',
    },
    fetchUrl: {
      type: String,
      default: 'admin/getProfile',
    },
  },
})

@Component
export default class CreateAdmin extends EditProps {
  admin: AdminDTO = {
    name: '',
    email: '',
    username: '',
    password: '',
    image: null,
    profilePictureThumbnailUrl: '',
    description: '',
    mobileNumber: '',
    telegramUsername: '',
    instagramUsername: '',
    whatsappId: '',
    clinicAddress: '',
    categories: [
      {
        id: 0,
        title: '',
      },
    ],
    linkedinId: '',
    occupation: '',
  }

  disabled = false
  valid = true

  snackbarData: SnackbarData = {
    show: false,
    color: 'primary',
    text: '',
  }

  rules = [
    function (value: File) {
      return (
        !value ||
        value.size < 500000 ||
        'تصویر پروفایل باید کمتر از ۵۰۰ کیلوبایت باشد!'
      )
    },
  ]

  categories: Category[] = []

  categoryRules = [(v: any) => !!v || 'این فیلد اجباری است']

  mobileNumberRule = [
    function (v: string) {
      return !v || /09\d{9}/g.test(v) || 'فرمت وارد شده صحیح نمی باشد'
    },
  ]

  whatsappRule = [
    function (v: string) {
      return !v || /989\d{9}/g.test(v) || 'فرمت وارد شده صحیح نمی باشد'
    },
  ]

  async created() {
    await this.getProfile()
    await this.getCategories()
  }

  destroyed() {
    clearTimeout(this.timer)
  }

  async getCategories() {
    const categories = await this.$axios.get('categories/getAll')
    const els = categories.data as Category[]
    els.map((category: Category) => {
      const id = category.id as number
      const title = category.title as string
      this.categories.push({ id, title })
    })
  }

  async getProfile() {
    await this.$axios
      .get<{ user: AdminDTO }>(this.fetchUrl)
      .then((res) => {
        this.admin = { ...res.data.user }
      })
      .catch((err) => {
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }

  $refs!: {
    form: HTMLFormElement
  }

  timer: any = null

  async onSaveAdmin() {
    const {
      image,
      name,
      email,
      username,
      password,
      description,
      clinicAddress,
      whatsappId,
      instagramUsername,
      telegramUsername,
      mobileNumber,
      categories,
      linkedinId,
      occupation,
    } = this.admin

    this.$refs.form.validate()
    if (!this.valid) return
    const categoryIds: number[] = []
    categories.map((el) => {
      if (el.id !== 0) categoryIds.push(el.id)
    })
    const formData = new FormData()
    if (image) formData.append('file', image!)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('username', username)
    formData.append('occupation', occupation)
    formData.append('categories', JSON.stringify(categoryIds))
    if (password) formData.append('password', password)
    if (clinicAddress) formData.append('clinicAddress', clinicAddress)
    if (whatsappId) formData.append('whatsappId', whatsappId)
    if (instagramUsername)
      formData.append('instagramUsername', instagramUsername)
    if (telegramUsername) formData.append('telegramUsername', telegramUsername)
    if (mobileNumber) formData.append('mobileNumber', mobileNumber)
    if (linkedinId) formData.append('linkedinId', linkedinId)
    formData.append('description', description)

    await this.$axios
      .put<{ message: string }>(this.url, formData)
      .then((res) => {
        this.snackbarData = {
          text: res.data.message,
          color: 'success',
          show: true,
        }
        this.disabled = true
        this.timer = setTimeout(() => {
          this.$router.go(-1)
        }, 4000)
      })
      .catch((err) => {
        this.snackbarData = {
          text: err.message ?? err,
          color: 'error',
          show: true,
        }
      })
  }
}
</script>
