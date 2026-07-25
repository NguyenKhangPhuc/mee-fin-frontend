import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { RefreshTokenResponse } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const refreshService = async (): Promise<{
  data: RefreshTokenResponse | null;
  error: AxiosError<ResponseError> | null;
}> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
