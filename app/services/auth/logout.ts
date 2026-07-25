import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { LogoutResponse } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const logoutService = async (): Promise<{
  data: LogoutResponse | null;
  error: AxiosError<ResponseError> | null;
}> => {
  try {
    const response = await apiClient.post<LogoutResponse>('/auth/logout');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
