import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/types/api";
import axiosInstance from "./axios-config";
import { setToken, removeToken } from "./token";
import axios from "axios";

export const auth = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/v1/auth/login",
        data
      );

      // 응답에서 토큰 추출 및 저장
      if (response.data.accessToken) {
        setToken(response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/v1/auth/signup",
        data
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },
};
