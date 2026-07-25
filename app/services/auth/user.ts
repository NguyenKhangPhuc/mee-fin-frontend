import apiClient from '../index';
import { SafeUser } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const getUser = async (): Promise<{ data: SafeUser | null; error: string | null }> => {
  try {
    const response = await apiClient.get<SafeUser>('/auth/user');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Failed to get user profile" };
    }
    return { data: null, error: "Failed to get user profile" };
  }
};

export default getUser;