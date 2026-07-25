import apiClient from '../index';
import { GithubCallbackParams, GithubCallbackResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const githubCallbackService = async (
  params?: GithubCallbackParams
): Promise<{
  data: GithubCallbackResponse | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.get<GithubCallbackResponse>('/auth/github/callback', {
      params,
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Github callback failed" };
    }
    return { data: null, error: "Github callback failed" };
  }
};
