import {isEmpty, template} from 'lodash';
import axios, {AxiosResponse, CancelToken} from 'axios';
import {buildHttpRequestHeader, buildHttpUrl} from '../../utils/ApiUtil';

interface Api {
  url: string;
  auth: boolean;
  search?: boolean;
  method: string;
}

interface RqCreateMultipartRequestParams {
  api: Api;
  body?: any;
  token?: string;
  params?: any;
  signal: CancelToken;
}

interface RqCreateRequestParams {
  api: Api;
  body?: any;
  token?: string;
  params?: any;
  query?: any;
  signal: any;
  contentType?: string;
  accept?: string;
  filter?: any;
}

export const rqCreateMultipartRequest = ({
  api,
  body,
  token,
  params,
  signal,
}: RqCreateMultipartRequestParams): Promise<any> => {
  return rqCreateRequest({
    api,
    body,
    token,
    params,
    signal,
    contentType: 'multipart/form-data',
    accept: 'multipart/form-data',
  },
  );
};


export const rqCreateRequest = ({
  api,
  body,
  token,
  params,
  query,

  signal,
  contentType = 'application/json',
  accept = 'application/json',
  filter = {},
}: RqCreateRequestParams): Promise<any> => {
  let url = api.url;

  // ✅ Manual param replacement
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, encodeURIComponent(String(value)));
    });
  }

  if (isEmpty(token)) {
    token = '';
  }

  const headers = buildHttpRequestHeader({
    isAuth: api.auth,
    token,
    contentType,
  });

  // Handle query parameters
  const queryParams = new URLSearchParams();
  
  // Add search filter params if it's a search API
  if (api.search && filter && typeof filter === 'object') {
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  
  // Add general query params
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
  }
  
  // Append query string if there are any params
  if (queryParams.toString()) {
    url = `${url}?${queryParams.toString()}`;

  }

  if (api.method === 'POST') {
    return axios
      .post(buildHttpUrl(url), body, {
        headers,
        withCredentials: true,
        signal,
      })
      .then((response: AxiosResponse) => response.data);
  } else if (api.method === 'PUT') {
    return axios
      .put(buildHttpUrl(url), body, {
        headers,
        withCredentials: true,
        signal,
      })
      .then((response: AxiosResponse) => response.data);
  } else {
    return axios({
      url: buildHttpUrl(url),
      method: api.method,
      headers,
      withCredentials: true,
      signal,
    }).then((response: AxiosResponse) => response.data);
  }
};

export const rqGetImgRequest = ({
  api,
  body,
  token,
  params,
  signal,
  contentType = 'application/json',
  accept = 'application/json',
  filter = {},
}: RqCreateRequestParams): Promise<any> => {
  let url = api.url;
  if (params !== null && params !== undefined) {
    url = template(url)(params);
  }

  if (isEmpty(token)) {
    token = '';
  }

  const headers = buildHttpRequestHeader({ isAuth: api.auth, token, contentType });

  if (api.search) {
    url = `${url}${new URLSearchParams(filter).toString()}`;
  }

  const config = {
    headers,
    withCredentials: true,
    signal,
  };

  if (api.method === 'POST') {
    return axios.post(buildHttpUrl(url), body, config).then((res) => res.data);
  } else if (api.method === 'PUT') {
    return axios.put(buildHttpUrl(url), body, config).then((res) => res.data);
  } else {
    return axios({
      url: buildHttpUrl(url),
      method: api.method,
      headers: headers,
      withCredentials: true,
      signal,
      responseType: 'blob', // 👈 This is important
    }).then((res) => res); // 👈 Return full response (or use res.data if only the blob is needed)
  }
};

