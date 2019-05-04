import router from 'router';
import { RESTClient } from 'core';
import { Checker } from 'utilities';
import {
  RESET_AUTH_STATE,
  TOKEN_EXPIRED_IN,
  TOKEN_LAST_ACCESS,
  CURRENT_ACCOUNT,
  ACCESS_TOKEN
} from './types';
import {
  LOCAL_STORAGE_CURRENT_USER,
  LOCAL_STORAGE_EXPIRES_IN,
  LOCAL_STORAGE_LAST_ACCESS,
  LOCAL_STORAGE_ACCESS_TOKEN
} from 'core/constant';

export const firstLoad = ({ commit }) => {
  let account = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER);
  if (Checker.hasText(account)) {
    try {
      let accountObj = JSON.parse(account);
      if (
        Checker.isObject(accountObj) &&
        accountObj.hasOwnProperty('username')
      ) {
        commit(CURRENT_ACCOUNT, accountObj);
      }
    } catch (e) {
      commit(CURRENT_ACCOUNT, null);
    }
  }

  let expired_in = Number(localStorage.getItem(LOCAL_STORAGE_EXPIRES_IN));
  commit(
    TOKEN_EXPIRED_IN,
    Checker.isNumber(expired_in) ? expired_in : 1 * 60 * 60
  );

  let now = new Date().getTime();
  let last_access = Number(localStorage.getItem(LOCAL_STORAGE_LAST_ACCESS));
  commit(TOKEN_LAST_ACCESS, Checker.isNumber(last_access) ? last_access : now);

  let access_token = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
  if (
    Checker.hasText(access_token) &&
    Checker.isNumber(last_access) &&
    Checker.isNumber(expired_in) &&
    now - last_access < expired_in
  ) {
    commit(ACCESS_TOKEN, access_token);
  }
};

export const login = async ({ commit }, account) => {
  let result = await RESTClient.post('/login/auth', {
    username: account.username,
    password: account.password
  });

  if (result.success) {
    RESTClient.setAccessToken(result.data.access_token);
    let now = new Date().getTime();

    commit(CURRENT_ACCOUNT, result.data.account);
    commit(ACCESS_TOKEN, result.data.access_token);
    commit(TOKEN_EXPIRED_IN, result.data.expires_in * 60 * 1000);
    commit(TOKEN_LAST_ACCESS, now);

    result.last_access = now;
    storeLocal(result);
    router.push({ path: '/' });
    return true;
  } else {
    return result.message ? result.message : 'login_page.errors.login';
  }
};

export const logout = ({ commit }) => {
  localStorage.clear();
  commit(RESET_AUTH_STATE);
  RESTClient.setAccessToken();
};

export const updateLastAccess = ({ commit }) => {
  let now = new Date().getTime();
  commit(TOKEN_LAST_ACCESS, now);
  localStorage.setItem(LOCAL_STORAGE_LAST_ACCESS, now);
};

const storeLocal = reps => {
  localStorage.setItem(
    LOCAL_STORAGE_CURRENT_USER,
    JSON.stringify(reps.data.account)
  );
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, reps.data.access_token);
  localStorage.setItem(
    LOCAL_STORAGE_EXPIRES_IN,
    reps.data.expires_in * 60 * 1000
  );
  localStorage.setItem(LOCAL_STORAGE_LAST_ACCESS, reps.last_access);
};
