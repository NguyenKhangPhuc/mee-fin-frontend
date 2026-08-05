import apiClient from '../index';
import { SignUpDto, SignupResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

const formatErrorString = (msg: any, fallback: string): string => {
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) {
    return msg.map((m: any) => (typeof m === 'object' && m ? m.message || JSON.stringify(m) : String(m))).join('; ');
  }
  if (typeof msg === 'object' && msg !== null) {
    return msg.message || JSON.stringify(msg);
  }
  return fallback;
};

export const signupService = async (
  data: SignUpDto
): Promise<{ data: SignupResponse | null; error: string | null }> => {
  try {
    console.log(data)
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to signup") };
    }
    return { data: null, error: "Failed to signup" };
  }
};
