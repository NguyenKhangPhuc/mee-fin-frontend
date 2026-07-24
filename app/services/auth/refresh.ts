import api from '../index';
import { RefreshTokenResponse } from '@/app/types/authentication';

export const refreshService = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<RefreshTokenResponse>('/auth/refresh');
  return response.data;
};
