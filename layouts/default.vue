<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="#1a1a27" right app>
      <v-list-item class="px-2">
        <v-list-item-title
          class="d-flex justify-center align-center white--text"
          >ادمین گفتار درمانی</v-list-item-title
        >

        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon color="white">{{
            `mdi-chevron-${mini ? 'left' : 'right'}`
          }}</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dark>
        <v-list-item class="d-flex justify-center align-center">
          <v-list-item-avatar>
            <v-icon color="secondary">mdi-home</v-icon>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              class="secondary--text title d-flex justify-center align-center"
            >
              {{ userFullName }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex justify-center align-center">{{
              email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="$router.push(item.to)"
          >
            <v-list-item-icon>
              <v-icon color="secondary" v-text="item.icon"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                class="white--text"
                v-text="item.text"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app dense dark color="#1a1a27" clipped-right>
      <v-app-bar-nav-icon
        v-if="!drawer"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div
        style="width: 400px"
        class="d-flex align-center text-body-2 text--grey"
      >
        <!-- {{ getPageTitle }} -->
      </div>
      <v-container fluid>
        <v-row
          justify="end"
          align="center"
          class="float-left spacer d-none d-sm-flex ml-5"
          no-gutters
        >
          <v-col sm="10" order="1" class="pa-1">
            <div class="float-left">{{ userFullName }}</div>
          </v-col>
          <v-col cols="1" sm="1" order="2" class="pa-1">
            <v-menu
              offset-y
              bottom
              origin="center center"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon light v-bind="attrs" v-on="on">
                  <v-avatar size="36px" class="float-right"
                    ><v-icon color="white">mdi-account-circle</v-icon>
                  </v-avatar>
                </v-btn>
              </template>

              <v-list>
                <v-list-item to="/profile">
                  <v-list-item-title>پروفایل</v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-list-item-title @click="logout">خروج </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>
    <v-fab-transition>
      <v-btn
        v-show="fab"
        v-scroll="onScroll"
        fab
        dark
        fixed
        bottom
        left
        color="primary"
        style="z-index: 99"
        @click="toTop"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-footer
      absolute
      class="font-weight-medium"
      app
      color="grey lighten-4"
      inset
    >
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} — <strong>Aldeon</strong>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

interface ScrollEvent extends Event {
  target: HTMLElement & EventTarget
}

@Component
export default class DefaultLayout extends Vue {
  drawer = true
  mini = false
  loading = false
  fab = false

  userFullName = this.$auth.user.name
  email = this.$auth.user.email

  selectedItem = 0
  items = [
    { text: 'داشبورد', icon: 'mdi-view-dashboard', to: '/' },
    { text: 'پروفایل کاربری', icon: 'mdi-account', to: '/profile' },
    { text: 'مدیریت ادمین', icon: 'mdi-account-group', to: '/admins' },
    { text: 'مدیریت تگ', icon: 'mdi-tag', to: '/tags' },
    { text: 'مدیریت تخصخص', icon: 'mdi-shape', to: '/categories' },
    { text: 'مدیریت مقاله', icon: 'mdi-file', to: '/articles' },
  ]

  async logout(): Promise<void> {
    try {
      await this.$auth.logout() /* .then(() => (location.href = '/')) */
    } catch (error) {}
  }

  onScroll(e: ScrollEvent) {
    if (typeof window === 'undefined') return
    const top = window.pageYOffset || e.target.scrollTop || 0
    this.fab = top > 20
  }

  toTop() {
    this.$vuetify.goTo(0)
  }
}
</script>
