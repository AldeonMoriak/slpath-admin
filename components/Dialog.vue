<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on"> Open Dialog </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ item.title }}
      </v-card-title>
      <v-card-text>{{ item.message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dialog = false"> نه </v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">
          باشه
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {
          title: '',
          message: '',
        }
      },
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
}
</script>
