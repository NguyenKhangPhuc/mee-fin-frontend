import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { SlotCreationDto, SlotResponse } from '@/app/types/slot';
import axios, { AxiosError } from 'axios';

export const createSlot = async (
  data: SlotCreationDto
): Promise<{ data: SlotResponse | null; error: AxiosError<ResponseError> | null }> => {
  try {
    const response = await apiClient.post<SlotResponse>('/slots/create', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
