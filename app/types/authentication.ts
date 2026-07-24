export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  displayName: string;
  email: string;
  password: string;
}

// Alias SignupDto for consistency
export type SignupDto = SignUpDto;

export interface LoginResponse {
  accessToken?: string;
  user?: unknown;
  [key: string]: unknown;
}

export interface SignupResponse {
  accessToken?: string;
  user?: unknown;
  [key: string]: unknown;
}

export interface LogoutResponse {
  message?: string;
  [key: string]: unknown;
}

export interface RefreshTokenResponse {
  accessToken?: string;
  [key: string]: unknown;
}

export interface GithubAuthResponse {
  url?: string;
  [key: string]: unknown;
}

export interface GithubCallbackParams {
  code?: string;
  state?: string;
  [key: string]: unknown;
}

export interface GithubCallbackResponse {
  accessToken?: string;
  user?: unknown;
  [key: string]: unknown;
}
