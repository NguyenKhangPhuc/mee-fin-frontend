import apiClient from '../index';
import { LogoutResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const logoutService = async (): Promise<{
  data: LogoutResponse | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Failed to logout" };
    }
    return { data: null, error: "Failed to logout" };
  }
};
