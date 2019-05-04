import Vue from 'vue';
import Vuex from 'vuex';

import global from './global';
import authentication from 'components/modules/authentication/store';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    global,
    authentication
  },
  strict: process.env.NODE_ENV !== 'production'
});
