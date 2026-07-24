import apiClient from '../index';
import { SafeUser } from '@/app/types/authentication';

export const getUser = async (): Promise<{ data: SafeUser | null; error: unknown }> => {
  try {
    const response = await apiClient.get<SafeUser>('/auth/user');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export default getUser;