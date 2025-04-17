import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from "@/types/api";
import axiosInstance from "./axios-config";
import { setToken, removeToken } from "./token";
import axios from "axios";

// authService를 auth로 변경
export const auth = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        "/v1/auth/login",
        data
      );

      // 응답에서 토큰 추출 및 저장
      if (response.data.token) {
        setToken(response.data.token);
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

      // 회원가입 후 자동 로그인 시 토큰 저장
      if (response.data.token) {
        setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as AuthResponse;
      }
      throw error;
    }
  },

  // 로그아웃
  logout: (): void => {
    removeToken();
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("/v1/auth/me");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as User;
      }
      throw error;
    }
  },
};
