import apiClient from '../index';
import { SlotCreationDto, SlotUncheckedCreateInput } from '@/app/types/slot';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';
import { formatErrorString } from '@/app/helpers/error-formatter';


export const createSlot = async (
  data: SlotCreationDto
): Promise<{ data: SlotUncheckedCreateInput | null; error: string | null }> => {
  try {
    const response = await apiClient.post<SlotUncheckedCreateInput>('/slots/create', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to book slot") };
    }
    return { data: null, error: "Failed to book slot" };
  }
};
