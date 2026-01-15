import { ApiClient } from "@/lib/apiClient";
import { buildFormData } from "@/lib/formData";
import { User } from "@/types/auth";
import { ApiResponse } from "@/types/commons";


export const register = async (fullName: string, email: string, password: string, phoneNumber: string) => {
  const formData = buildFormData({
    fullName,
    email,
    password,
    phoneNumber,
  });
  const response = await ApiClient.post<ApiResponse<{ token: string }>>('/auth/register', formData);
  return response;
}

export const login = async (email: string, password: string) => {
  const formData = buildFormData({
    email,
    password,
  });
  const response = await ApiClient.post<ApiResponse<{ token: string }>>('/auth/login', formData);
  return response;
}

export const verifyEmailToken = async (token: string) => {
  const formData = buildFormData({
    token,
  });
  const response = await ApiClient.post<ApiResponse>('/auth/verify-email', formData);
  return response;
}

export const resendVerificationLink = async (email: string) => {
  const formData = buildFormData({
    email,
  });
  const response = await ApiClient.post<ApiResponse>('/auth/resend-verification', formData);
  return response;
}

export const getCurrentUser = async () => {
  const response = await ApiClient.get<ApiResponse<User>>('/auth/me');
  return response;
}

export const refreshAccessToken = async () => {
  const response = await ApiClient.post<ApiResponse>('/auth/refresh-token');
  return response;
}

export const logout = async () => {
  const response = await ApiClient.post<ApiResponse>('/auth/logout');
  return response;
}

export const googleLogin = async () => {
  const response = await ApiClient.get<ApiResponse>('/auth/google/login');
  return response;
}