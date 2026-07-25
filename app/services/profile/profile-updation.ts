import apiClient from '../index';
import { ProfileUpdationDto, ProfileResponse } from '@/app/types/profile';
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

export const updateProfile = async (
  data: ProfileUpdationDto
): Promise<{ data: ProfileResponse | null; error: string | null }> => {
  try {
    const response = await apiClient.post<ProfileResponse>('/profile/update', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to update profile") };
    }
    return { data: null, error: "Failed to update profile" };
  }
};

export const updateProfileImage = async (
  formData: FormData
): Promise<{ data: ProfileResponse | null; error: string | null }> => {
  try {
    const response = await apiClient.post<ProfileResponse>('/profile/update-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to upload profile image") };
    }
    return { data: null, error: "Failed to upload profile image" };
  }
};
