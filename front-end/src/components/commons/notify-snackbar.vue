<template>
  <div>
    <template v-for="(notify, index) in notifications">
      <v-snackbar
        :key="notify.code"
        :value="notify.show"
        :class="'pos-' + index"
        :color="notify.color"
        v-bind="options"
        @input="changeStateSnackBar(notify.code, $event)"
      >
        <div style="margin-right: 15px">{{ notify.message }}</div>
        <v-icon dark @click="resetNotify(notify.code)">{{
          $vuetify.icons.CLOSE
        }}</v-icon>
      </v-snackbar>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      options: {
        timeout: 5000,

        top: false,
        bottom: true,
        left: false,
        right: true,

        'multi-line': true,

        dark: true
      }
    };
  },

  computed: {
    ...mapGetters('global', ['notifications'])
  },

  methods: {
    ...mapActions('global', ['resetNotify']),

    changeStateSnackBar(code, value) {
      if (!value) {
        this.resetNotify(code);
      }
    }
  }
};
</script>

<style scoped>
.pos-1 {
  bottom: 90px;
}

.pos-2 {
  bottom: 180px;
}

.pos-3 {
  bottom: 270px;
}

.pos-4 {
  bottom: 360px;
}
</style>
