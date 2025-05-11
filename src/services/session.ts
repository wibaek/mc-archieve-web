import { CreateSessionRequest } from "@/types/api";
import { ErrorResponse } from "@/types/error";
import type { Session } from "@/types/session";
import { handleApiError } from "@/utils/error";
import axiosInstance from "@/utils/axios";

// 세션 목록 조회
export const getSessions = async (): Promise<Session[] | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Session[]>("/v1/sessions");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 내 세션 목록 조회
export const getMySessions = async (): Promise<Session[] | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Session[]>("/v1/sessions/my");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 상세 조회
export const getSession = async (
  sessionId: string
): Promise<Session | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Session>(
      `/v1/sessions/${sessionId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 생성
export const createSession = async (
  data: CreateSessionRequest
): Promise<Session | ErrorResponse> => {
  try {
    const response = await axiosInstance.post<Session>("/v1/sessions", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
