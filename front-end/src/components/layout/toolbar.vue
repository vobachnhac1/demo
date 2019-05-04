<template>
  <v-toolbar color="primary" fixed dark app height="56">
    <div class="no_padding account_info">
      <div />
      <img class="logo" src="/logo.png" />
    </div>
    <v-toolbar-title>
      <v-toolbar-side-icon @click.stop="toggleDrawer" />
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon ripple @click="handleFullScreen">
      <v-icon>{{ $vuetify.icons.FULL_SCREEN }}</v-icon>
    </v-btn>
    <v-btn icon ripple @click="exitApp">
      <v-icon>{{ $vuetify.icons.LOGOUT }}</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import _ from 'lodash';
import { toggleFullScreen } from 'utilities';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: {}
    };
  },

  computed: {
    ...mapGetters('authentication', ['authUser'])
  },

  created() {
    this.user = _.assign({}, this.authUser);
    let server = process.env.VUE_APP_WEBSERVICE_LOCATION;
    if (!_.endsWith(server, '/')) {
      server += '/';
    }
    this.user.avatar = server + this.user.avatar;
  },

  methods: {
    ...mapActions('global', ['toggleDrawer']),
    ...mapActions('authentication', ['logout']),

    handleFullScreen() {
      toggleFullScreen();
    },

    exitApp() {
      this.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.account_info {
  width: 250px;
  margin-left: -24px !important;
  max-height: 100%;
  display: flex;
  border-right: 1px solid #00554a;
  user-select: none;
  position: relative;
}

.account_info div {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
}

.logo {
  margin: 8px auto;
  height: 40px;
  filter: brightness(0) invert(1);
  -webkit-filter: brightness(0) invert(1);
}
</style>
