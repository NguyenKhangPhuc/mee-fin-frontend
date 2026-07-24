import api from '../index';
import { LogoutResponse } from '@/app/types/authentication';

export const logoutService = async (): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>('/auth/logout');
  return response.data;
};
