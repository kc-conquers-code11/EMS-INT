import {AppConfig, OAuth2Config} from '../components/config';
import {endsWith} from 'lodash';

export const TENANT_ID_KEY: string = 'APP-Tenant-Id';
const OAUTH2_ENABLE: string = 'APP-Oauth2-Enable';
const AUTHORIZATION_KEY: string = 'Authorization';

export const parseNdjsonData = (data: any): any[] => {
  if (typeof data === 'object') {
    return [data];
  }

  if (typeof data !== 'string') {
    throw new Error('Unexpected nd-json data type!');
  }
  const rows: string[] = data.split(/\n|\n\r/).filter(Boolean);
  return rows.map((row: string) => JSON.parse(row));
};

export const buildHttpRequestHeader = ({
  isAuth = false,
  token = '',
  contentType = 'application/json',
}): any => {
  const headers: any = {};
  headers['Content-Type'] = contentType;
  headers[TENANT_ID_KEY] = AppConfig.TENANT_ID;
  headers[OAUTH2_ENABLE] = '' + OAuth2Config.OAUTH2_ENABLE;
  if (isAuth) {
    headers[AUTHORIZATION_KEY] = `Bearer ${token}`;
  }

  return headers;
};

export const buildHttpUrl = (relativePath: string): string => {
  console.log("Relative Path: ",relativePath,process.env.REACT_APP_API_BASE_URL)
  return `${AppConfig.API_BASE_URL}/${relativePath}`;
};

export const buildHttpDocumentViewUrl = ({url = '', token = ''}: { url?: string, token?: string }): string => {
  if (!(endsWith(url, '?') || endsWith(url, '&'))) {
    if (url.includes('&')) {
      url = url + '&';
    } else {
      url = url + '?';
    }
  }

  return url + AUTHORIZATION_KEY + '=' + token + '&' + TENANT_ID_KEY + '=' + AppConfig.TENANT_ID;
};
