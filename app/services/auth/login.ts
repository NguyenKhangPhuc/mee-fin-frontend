import apiClient from '../index';
import { LoginDto, LoginResponse } from '@/app/types/authentication';
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

export const loginService = async (
  data: LoginDto
): Promise<{ data: LoginResponse | null; error: string | null; errorCode?: string }> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: formatErrorString(error.response?.data?.message, "Failed to login"),
        errorCode: error.response?.data?.code,
      };
    }
    return { data: null, error: "Failed to login" };
  }
};

