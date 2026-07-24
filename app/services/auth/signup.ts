import api from '../index';
import { SignUpDto, SignupResponse } from '@/app/types/authentication';

export const signupService = async (data: SignUpDto): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/auth/signup', data);
  return response.data;
};
