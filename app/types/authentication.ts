export type SafeUser = {
  id: string;
  displayName: string | null;
  email: string;
  confirmationAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

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
  user?: SafeUser;
  [key: string]: unknown;
}

export interface SignupResponse {
  accessToken?: string;
  user?: SafeUser;
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
  user?: SafeUser;
  [key: string]: unknown;
}

export interface VerifyCodeDto {
  email: string;
  code: string;
}

export interface GenerateCodeDto {
  email: string;
  code?: string;
}
