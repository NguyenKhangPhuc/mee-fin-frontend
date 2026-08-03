import apiClient from '../index';
import { GenerateCodeDto } from '@/app/types/authentication';
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

export const generateSignUpCodeService = async (
  data: GenerateCodeDto
): Promise<{ data: any | null; error: string | null }> => {
  try {
    const response = await apiClient.post('/verification-code/sign-up', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to generate verification code") };
    }
    return { data: null, error: "Failed to generate verification code" };
  }
};
