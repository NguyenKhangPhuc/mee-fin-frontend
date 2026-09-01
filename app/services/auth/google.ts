import apiClient from '../index';
import { GoogleAuthResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const googleService = async (): Promise<{
  data: GoogleAuthResponse | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.get<GoogleAuthResponse>('/auth/google');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Google auth failed" };
    }
    return { data: null, error: "Google auth failed" };
  }
};
