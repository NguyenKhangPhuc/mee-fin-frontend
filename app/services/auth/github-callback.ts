import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { GithubCallbackParams, GithubCallbackResponse } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const githubCallbackService = async (
  params?: GithubCallbackParams
): Promise<{
  data: GithubCallbackResponse | null;
  error: AxiosError<ResponseError> | null;
}> => {
  try {
    const response = await apiClient.get<GithubCallbackResponse>('/auth/github/callback', {
      params,
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
