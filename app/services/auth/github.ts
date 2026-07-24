import api from '../index';
import { GithubAuthResponse } from '@/app/types/authentication';

export const githubService = async (): Promise<GithubAuthResponse> => {
  const response = await api.get<GithubAuthResponse>('/auth/github');
  return response.data;
};
