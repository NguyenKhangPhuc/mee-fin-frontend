import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// 1. Định nghĩa kiểu dữ liệu cho Request Config có chứa cờ _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 2. Định nghĩa kiểu dữ liệu cho các item trong hàng đợi Queue
interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

// Hàm xử lý các request đang đứng chờ trong hàng đợi
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

// 3. Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error: AxiosError): Promise<AxiosResponse> => {
    // Ép kiểu request config về CustomAxiosRequestConfig để truy cập cờ _retry
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Nếu không có request config hoặc không phải lỗi 401 thì throw lỗi ngay
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 xuất phát từ chính API /auth/refresh hoặc /auth/login -> Bỏ qua, đẩy đi Login
    const requestUrl = originalRequest.url || '';
    if (requestUrl.includes('/auth/refresh') || requestUrl.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Nếu request này đã từng thử retry 1 lần rồi mà vẫn 401 -> Bỏ qua tránh lặp vô hạn
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Đánh dấu request này đã được retry
    originalRequest._retry = true;

    // XỬ LÝ CONCURRENCY (Race Condition):
    // Nếu đang có một request khác gọi /refresh, các request tới sau sẽ xếp hàng chờ
    if (isRefreshing) {
      return new Promise<unknown>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err: unknown) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Gọi API Refresh Token
      await api.post('/auth/refresh');

      // Refresh thành công! Cho phép tất cả request trong hàng đợi chạy tiếp
      processQueue(null);

      // Thực hiện lại request ban đầu
      return api(originalRequest);
    } catch (refreshError) {
      const typedRefreshError = refreshError as AxiosError;

      // Báo lỗi cho toàn bộ request đang đứng chờ
      processQueue(typedRefreshError);

      // Nếu Refresh thất bại (Refresh token hết hạn) -> Chuyển về trang đăng nhập
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
