import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { SafeUser } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const getUser = async (): Promise<{ data: SafeUser | null; error: AxiosError<ResponseError> | null }> => {
  try {
    const response = await apiClient.get<SafeUser>('/auth/user');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    // Lỗi không phải từ axios (ví dụ lỗi JS thường, lỗi code) -> vẫn phải trả về đúng type
    return { data: null, error: null };
  }
};

export default getUser;