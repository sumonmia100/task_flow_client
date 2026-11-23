import axiosInstance from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await axiosInstance.post<ApiResponse<{ message: string }>>(
      "/auth/register",
      payload,
    );
    return res.data;
  },

  verifyEmail: async (payload: { email: string; code: string }) => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/verify-email",
      payload,
    );
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return res.data;
  },

  googleLogin: async (token: string) => {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/google",
      { token },
    );
    return res.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get<ApiResponse<User>>("/auth/me");
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await axiosInstance.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      { email },
    );
    return res.data;
  },

  resetPassword: async (payload: { token: string; password: string }) => {
    const res = await axiosInstance.post<ApiResponse<{ message: string }>>(
      "/auth/reset-password",
      payload,
    );
    return res.data;
  },

  refreshToken: async () => {
    const res = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh-token",
    );
    return res.data;
  },
};
