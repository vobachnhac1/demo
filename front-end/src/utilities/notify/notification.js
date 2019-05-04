import store from 'store';

export default class Notification {
  success(msg) {
    store.dispatch('global/showSuccessMsg', msg, { root: true });
  }

  warning(msg) {
    store.dispatch('global/showWarningMsg', msg, { root: true });
  }

  error(msg) {
    store.dispatch('global/showErrorMsg', msg, { root: true });
  }
}
