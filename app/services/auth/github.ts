import apiClient from '../index';
import { GithubAuthResponse } from '@/app/types/authentication';
import { ResponseError } from '@/app/types/error';
import axios from 'axios';

export const githubService = async (): Promise<{
  data: GithubAuthResponse | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.get<GithubAuthResponse>('/auth/github');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error: error.response?.data?.message ?? "Github auth failed" };
    }
    return { data: null, error: "Github auth failed" };
  }
};
