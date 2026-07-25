import { ResponseError } from '@/app/types/error';
import apiClient from '../index';
import { GithubAuthResponse } from '@/app/types/authentication';
import axios, { AxiosError } from 'axios';

export const githubService = async (): Promise<{
  data: GithubAuthResponse | null;
  error: AxiosError<ResponseError> | null;
}> => {
  try {
    const response = await apiClient.get<GithubAuthResponse>('/auth/github');
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return { data: null, error };
    }
    return { data: null, error: null };
  }
};
