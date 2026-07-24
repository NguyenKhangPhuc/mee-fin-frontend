import api from '../index';
import { GithubCallbackParams, GithubCallbackResponse } from '@/app/types/authentication';

export const githubCallbackService = async (params?: GithubCallbackParams): Promise<GithubCallbackResponse> => {
  const response = await api.get<GithubCallbackResponse>('/auth/github/callback', {
    params,
  });
  return response.data;
};
