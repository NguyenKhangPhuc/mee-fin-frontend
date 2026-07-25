import apiClient from '../index';
import { RefreshTokenResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const refreshService = async (): Promise<{
  data: RefreshTokenResponse | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Failed to refresh token" };
    }
    return { data: null, error: "Failed to refresh token" };
  }
};
