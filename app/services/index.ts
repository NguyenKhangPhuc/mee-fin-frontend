import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { EXPIRED_ACCESS_TOKEN } from '../constants/error-code';
import { ResponseError } from '../types/error';

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

// Response Interceptor for handling 401 and token refreshing
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error: AxiosError): Promise<AxiosResponse> => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    console.log(error.response?.data);
    if (!originalRequest || (error.response?.status !== 401 && (error.response?.data as ResponseError).code !== EXPIRED_ACCESS_TOKEN)) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || '';
    if (requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
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
