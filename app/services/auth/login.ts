import api from '../index';
import { LoginDto, LoginResponse } from '@/app/types/authentication';

export const loginService = async (data: LoginDto): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};
