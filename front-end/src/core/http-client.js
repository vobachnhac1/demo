import _ from 'lodash';
import { REQUEST_HEADER_AUTH } from './constant';

export const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export class HTTPClient {
  constructor(axios) {
    if (!_.isObject(axios) && _.isEmpty(axios)) {
      throw 'Please provide correct AXIOS instance.';
    }
    this.axiosInstance = _.cloneDeep(axios);
  }

  setAccessToken(access_token) {
    if (_.isString(access_token) && _.trim(access_token) != '') {
      this.axiosInstance.defaults.headers.common[
        REQUEST_HEADER_AUTH
      ] = `${access_token}`;
    } else {
      _.omit(this.axiosInstance.defaults.headers.common, [REQUEST_HEADER_AUTH]);
    }
  }

  async get(url, requestParams = {}, headers = {}) {
    if (!_.isString(url)) throw 'String value of URL must correct';
    return await request(
      this.axiosInstance,
      url,
      REQUEST_METHOD.GET,
      headers,
      requestParams,
      {}
    );
  }

  async post(url, requestBody = {}, headers = {}) {
    if (!_.isString(url)) throw 'String value of URL must correct';
    return await request(
      this.axiosInstance,
      url,
      REQUEST_METHOD.POST,
      headers,
      {},
      requestBody
    );
  }

  async put(url, requestBody = {}, headers = {}) {
    if (!_.isString(url)) throw 'String value of URL must correct';
    return await request(
      this.axiosInstance,
      url,
      REQUEST_METHOD.PUT,
      headers,
      {},
      requestBody
    );
  }

  async delete(url, requestParams = {}, headers = {}) {
    if (!_.isString(url)) throw 'String value of URL must correct';
    return await request(
      this.axiosInstance,
      url,
      REQUEST_METHOD.DELETE,
      headers,
      requestParams,
      {}
    );
  }

  async upload(url, requestBody = {}, headers = {}) {
    if (!_.isString(url)) throw 'String value of URL must correct';
    headers['Content-Type'] = 'multipart/form-data';
    return await request(
      this.axiosInstance,
      url,
      REQUEST_METHOD.POST,
      headers,
      {},
      requestBody
    );
  }

  async request(
    url,
    method,
    headers = {},
    requestParams = {},
    requestBody = {}
  ) {
    if (!_.includes(_.keys(REQUEST_METHOD), method) || !_.isString(url)) {
      throw 'HTTPClient only support [GET, POST, PUT, DELETE]';
    }
    return await request(
      this.axiosInstance,
      url,
      method,
      headers,
      requestParams,
      requestBody
    );
  }
}

const SUPPORT_REQ_BODY = [REQUEST_METHOD.POST, REQUEST_METHOD.PUT];

const request = async (
  axios,
  url,
  method,
  headers,
  requestParams,
  requestBody
) => {
  let params = {};
  if (!_.isEmpty(requestParams)) {
    params = new URLSearchParams(requestParams);
  }

  let data = {};
  if (_.includes(SUPPORT_REQ_BODY, method)) {
    data = requestBody;
  }

  let transformRequest = [
    data => {
      if (_.isObject(data)) {
        return JSON.stringify(data);
      } else if (_.isString(data) || isFormData(data)) {
        return data;
      }
      throw 'Request body must belong with [String, Object, FormData]';
    }
  ];

  let transformResponse = [
    response => {
      return response;
    }
  ];
  var response = {};
  try {
    response = await axios.request(url, {
      method,
      params,
      headers: headers || {},
      data: data || {},
      transformRequest,
      transformResponse
    });
  } catch (error) {
    if (!_.isNil(error.message) && error.message === 'Network Error') {
      response = { status: 0 };
    } else if (!_.isNil(error.response)) {
      response = error.response;
    } else {
      response = {};
    }
  }

  return readRestResponse(response);
};

const toObject = urlParams => {
  if (urlParams instanceof URLSearchParams) {
    let result = {};
    for (let pair of urlParams.entries()) {
      result[pair[0]] = pair[1];
    }
  }
  return {};
};

const isFormData = val => {
  return typeof FormData !== 'undefined' && val instanceof FormData;
};

const readRestResponse = resp => {
  if (_.isNil(resp) || !_.isNumber(resp.status))
    return {
      success: false,
      data: null,
      message: 'http_client.errors.4xx'
    };

  switch (resp.status) {
    case 0:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.000'
      };

    case 200:
      return resp.data;

    case 304:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.304',
        http_status: 304
      };

    case 401:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.401',
        http_status: 401
      };

    case 403:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.403',
        http_status: 403
      };

    case 404:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.404',
        http_status: 404
      };

    case 415:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.415',
        http_status: 415
      };

    case 500:
      return {
        success: false,
        data: null,
        message: 'http_client.errors.500',
        http_status: 500
      };

    default:
      return processUnknowCode(resp.status);
  }
};

const processUnknowCode = code => {
  if (100 <= code && code < 200) {
    return {
      success: false,
      message: 'http_client.errors.1xx',
      http_status: code
    };
  } else if (200 <= code && code < 300) {
    return {
      success: false,
      message: 'http_client.errors.2xx',
      http_status: code
    };
  } else if (300 <= code && code < 400) {
    return {
      success: false,
      message: 'http_client.errors.3xx',
      http_status: code
    };
  } else if (400 <= code && code < 500) {
    return {
      success: false,
      message: 'http_client.errors.4xx',
      http_status: code
    };
  } else if (500 <= code && code < 600) {
    return {
      success: false,
      message: 'http_client.errors.5xx',
      http_status: code
    };
  }
};

export const readRequestParams = params => {
  if (_.isNil(params)) return {};

  if (_.startsWith(params, 'http://') || _.startsWith(params, 'https://')) {
    let url = URL(params);
    return toObject(new URLSearchParams(url.search));
  }

  if (_.isString(params)) {
    return toObject(new URLSearchParams(params));
  }

  return {};
};
