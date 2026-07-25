import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { ProfileUpdationDto, ProfileResponse } from '@/app/types/profile';
import axios, { AxiosError } from 'axios';

export const updateProfile = async (
  data: ProfileUpdationDto
): Promise<{ data: ProfileResponse | null; error: AxiosError<ResponseError> | null }> => {
  try {
    const response = await apiClient.post<ProfileResponse>('/profile/update', data);
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};

export const updateProfileImage = async (
  formData: FormData
): Promise<{ data: ProfileResponse | null; error: AxiosError<ResponseError> | null }> => {
  try {
    const response = await apiClient.post<ProfileResponse>('/profile/update-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
