import Vue from 'vue';
import UpdateData from './update-data';
import { mapActions } from 'vuex';

Vue.mixin(UpdateData);
Vue.mixin({
  methods: {
    ...mapActions('global', ['setAppLoading', 'setFeatureLoading'])
  }
});

export * from './date-formater';
