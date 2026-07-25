import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { SignUpDto, SignupResponse } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const signupService = async (
  data: SignUpDto
): Promise<{ data: SignupResponse | null; error: AxiosError<ResponseError> | null }> => {
  try {
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
