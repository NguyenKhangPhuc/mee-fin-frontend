import apiClient from '../index';
import { SlotCreationDto, SlotResponse } from '@/app/types/slot';
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

export const createSlot = async (
  data: SlotCreationDto
): Promise<{ data: SlotResponse | null; error: string | null }> => {
  try {
    const response = await apiClient.post<SlotResponse>('/slots/create', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to create slot") };
    }
    return { data: null, error: "Failed to create slot" };
  }
};
