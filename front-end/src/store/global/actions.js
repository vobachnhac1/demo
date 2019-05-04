import {
  TOGGLE_APP_DRAWER,
  SET_APPLICATION_LOADING,
  SET_FEATURE_LOADING,
  CLEAR_MESSAGE,
  ADD_SUCCESS_MSG,
  ADD_ERROR_MSG,
  ADD_WARNING_MSG
} from './types';
import store from 'store';
import { Checker } from 'utilities';

export const toggleDrawer = ({ commit }, flag) => {
  if (!Checker.isUndefined(flag) && Checker.isBoolean(flag)) {
    commit(TOGGLE_APP_DRAWER, flag);
  } else {
    let status = store.getters['global/drawerToggled'];
    commit(TOGGLE_APP_DRAWER, !status);
  }
};

export const setAppLoading = ({ commit }, flag = false) => {
  commit(SET_APPLICATION_LOADING, flag);
};

export const setFeatureLoading = ({ commit }, flag = false) => {
  commit(SET_FEATURE_LOADING, flag);
};

export const showSuccessMsg = ({ commit }, msg) => {
  commit(ADD_SUCCESS_MSG, msg);
};

export const showErrorMsg = ({ commit }, msg) => {
  commit(ADD_ERROR_MSG, msg);
};

export const showWarningMsg = ({ commit }, msg) => {
  commit(ADD_WARNING_MSG, msg);
};

export const resetNotify = ({ commit }, code) => {
  commit(CLEAR_MESSAGE, code);
};
