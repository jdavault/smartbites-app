// lib/apiClient.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';
import RNBlobUtil from 'react-native-blob-util';

export async function postRequest<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.post<T>(url, data, config);
  return response.data;
}

export async function getRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.get<T>(url, config);
  return response.data;
}

export async function putRequest<T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.put<T>(url, data, config);
  return response.data;
}

export async function deleteRequest<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.delete<T>(url, config);
  return response.data;
}

export async function patchRequest<T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.patch<T>(url, data, config);
  return response.data;
}

export async function fetchImageBlob(url: string): Promise<Blob | string> {
  if (Platform.OS === 'web') {
    // ✅ Web
    const response = await axios.get(url, { responseType: 'blob' });
    return response.data; // native Blob
  } else {
    try {
      const safeName = 'image_' + Date.now() + '.png';
      const path = `${RNBlobUtil.fs.dirs.CacheDir}/${safeName}`;
      console.log('[✅ fetchImageBlob1() - File saved at:', path);

      const res = await RNBlobUtil.config({
        fileCache: true,
        path,
      }).fetch('GET', url, {
        Accept: 'image/png',
      });

      console.log('[✅ fetchImageBlob2() - File saved at:', res.path());
      return res.path();
    } catch (err: any) {
      console.error('[❌ fetchImageBlob Android] Error:', err.message);
      throw err;
    }
  }
}

export { axios, AxiosError };
