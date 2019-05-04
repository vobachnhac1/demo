import Vue from 'vue';
import Vuetify from 'vuetify';
import VeeValidate from 'vee-validate';

import router from 'router';
import store from 'store';
import i18n from './locale';
import Filters from 'core/filters';
import 'core/mixins';
import './components/commons';
import { bus } from './core/app-events';
import { RESTClient } from './core';
import App from 'components/layout/app';
import { Checker, CommonIcons, Notify, Alert } from 'utilities';

Vue.config.productionTip = false;

Vue.use(Filters);
Vue.use(VeeValidate, { fieldsBagName: 'formFields' });

Vue.use(Vuetify, {
  iconfont: CommonIcons.ICON_TYPE,
  icons: CommonIcons.DEFAULT,
  theme: {
    primary: '#00695c',
    secondary: '#424242',
    accent: '#a1a1a1',

    error: '#c9302c',
    info: '#888888',
    success: '#00695c',
    warning: '#ec971f'
  },
  options: {
    customProperties: true
  }
});

store.dispatch('authentication/firstLoad');
let access_token = store.getters['authentication/getAccessToken'];
if (Checker.hasText(access_token)) {
  RESTClient.setAccessToken(access_token);
}

Vue.prototype.$bus = bus;
Vue.prototype.$checker = Checker;
Vue.prototype.$notify = Notify;
Vue.prototype.$alert = Alert;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
