import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { EXPIRED_ACCESS_TOKEN } from '../constants/error-code';
import { ResponseError } from '../types/error';
import { parseSetCookie } from 'set-cookie-parser';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';


function normalizeSameSite(
  value: string | undefined
): ResponseCookie['sameSite'] {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower === 'lax' || lower === 'strict' || lower === 'none') {
    return lower;
  }
  return undefined;
}
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};


// Request Interceptor: Forward cookies on server-side calls (Server Components)
api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.toString();
      if (cookieHeader) {
        config.headers.set('Cookie', cookieHeader);
      }
    } catch {
      // Ignore error if invoked outside request store context
    }
  }
  return config;
});

// Response Interceptor for handling 401 and token refreshing
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    console.log(error.response?.data);
    if (!originalRequest || ((error.response?.data as ResponseError | undefined)?.code !== EXPIRED_ACCESS_TOKEN)) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    if (requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/login') || requestUrl.includes('/verification-code')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      if (!error.config) {
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err: unknown) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      await api.post('/auth/refresh');
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      const typedRefreshError = refreshError as AxiosError;
      processQueue(typedRefreshError);

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(typedRefreshError);
    } finally {
      isRefreshing = false;
    }

  },
);

export default api;

export * from './auth';
export * from './profile';
export * from './slots';
export * from './collections';
export * from './words';
export * from './ratings';
export * from './verification-code';
export * from './language';



