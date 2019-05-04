import {
  RESET_AUTH_STATE,
  CURRENT_ACCOUNT,
  ACCESS_TOKEN,
  TOKEN_EXPIRED_IN,
  TOKEN_LAST_ACCESS
} from './types';
import * as actions from './actions';
import * as getters from './getters';

const state = {
  account: null,
  access_token: undefined,
  expired_in: -1,
  token_last_access: -1
};

const mutations = {
  [RESET_AUTH_STATE](state) {
    state.account = null;
    state.access_token = undefined;
    state.expired_in = -1;
    state.token_last_access = -1;
  },

  [CURRENT_ACCOUNT](state, account) {
    state.account = account;
  },

  [ACCESS_TOKEN](state, token) {
    state.access_token = token;
  },

  [TOKEN_EXPIRED_IN](state, expired_in) {
    state.expired_in = expired_in;
  },

  [TOKEN_LAST_ACCESS](state) {
    state.token_last_access = new Date().getTime();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
