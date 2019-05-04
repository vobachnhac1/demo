import Vue from 'vue';

import Scheduler from './scheduler';
import DatePicker from './date-picker';
import FilterTable from './filter-table';
import PerfectTable from './perfect-table';
import NumberTextField from './number-text-field';

import Alert from './alert';
import Notify from './notify-snackbar';

Vue.component('cd-scheduler', Scheduler);
Vue.component('cd-date-picker', DatePicker);
Vue.component('cd-filter-table', FilterTable);
Vue.component('cd-perfect-table', PerfectTable);
Vue.component('cd-number-text-field', NumberTextField);

export {
  Scheduler,
  DatePicker,
  Alert,
  Notify,
  FilterTable,
  PerfectTable,
  NumberTextField
};
