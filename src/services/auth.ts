import { LoginRequest, SignupRequest, SignupResponse } from "@/types/auth";
import { LoginResponse } from "@/types/auth";
import { ErrorResponse } from "@/types/error";
import axiosInstance from "@/utils/axios";
import { handleApiError } from "@/utils/error";
import { setToken, removeToken } from "@/utils/token";

// 로그인
export const login = async (
  data: LoginRequest
): Promise<LoginResponse | ErrorResponse> => {
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
    return handleApiError(error);
  }
};

// 회원가입
export const signup = async (
  data: SignupRequest
): Promise<SignupResponse | ErrorResponse> => {
  try {
    const response = await axiosInstance.post<SignupResponse>(
      "/v1/auth/signup",
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 로그아웃
export const logout = () => {
  removeToken();
};
