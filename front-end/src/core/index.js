import axios from 'axios';
import store from 'store';
import router from 'router';

import { HTTPClient } from './http-client';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = undefined;
axios.defaults.timeout = 20000;

export const AXIOS_INSTANCE = axios.create({
  baseURL: process.env.VUE_APP_WEBSERVICE_LOCATION || '/',
  responseType: 'json'
});

AXIOS_INSTANCE.interceptors.response.use(function(response) {
  if (response && response.status == 403) {
    store.dispatch('authentication/logout');
    router.push({ path: '/403' });
    return Promise.reject({
      success: false,
      data: null,
      message: 'http_client.errors.403',
      http_status: 403
    });
  }
  return response;
});

export const RESTClient = new HTTPClient(AXIOS_INSTANCE);
export { REQUEST_METHOD, readRequestParams } from './http-client';
