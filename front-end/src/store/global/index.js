import {
  TOGGLE_APP_DRAWER,
  SET_APPLICATION_LOADING,
  SET_FEATURE_LOADING,
  CLEAR_MESSAGE,
  ADD_SUCCESS_MSG,
  ADD_ERROR_MSG,
  ADD_WARNING_MSG
} from './types';
import * as getters from './getters';
import * as actions from './actions';

const state = {
  drawerToggled: true,
  loading_app: false,
  loading_feature: false,
  messagePoll: []
};

const showMsg = (state, msgInfo) => {
  let snackbar_info = {
    code: new Date().getTime(),
    show: true,
    ...msgInfo
  };

  state.messagePoll.push(snackbar_info);
  if (state.messagePoll.length > 5) {
    state.messagePoll.shift();
  }
};

const mutations = {
  [TOGGLE_APP_DRAWER](state, flag) {
    state.drawerToggled = flag;
  },

  [SET_FEATURE_LOADING](state, flag) {
    state.loading_feature = flag;
  },

  [SET_APPLICATION_LOADING](state, flag) {
    state.loading_app = flag;
  },

  [ADD_SUCCESS_MSG](state, message) {
    showMsg(state, { message, color: 'green' });
  },

  [ADD_ERROR_MSG](state, message) {
    showMsg(state, { message, color: 'red' });
  },

  [ADD_WARNING_MSG](state, message) {
    showMsg(state, { message, color: 'orange' });
  },

  [CLEAR_MESSAGE](state, code) {
    state.messagePoll = state.messagePoll.filter(
      message => message.code != code
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
