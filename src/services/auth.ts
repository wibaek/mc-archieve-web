import axiosInstance from "./axios-config";
import { setToken, removeToken } from "./token";
import axios from "axios";

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

// 회원가입
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  nickname: string;
  profileImageUrl: string | null;
}

// 로그인
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
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
      return error.response.data as LoginResponse;
    }
    throw error;
  }
};

// 회원가입
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axiosInstance.post<SignupResponse>(
      "/v1/auth/signup",
      data
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as SignupResponse;
    }
    throw error;
  }
};

// 로그아웃
export const logout = () => {
  removeToken();
};
