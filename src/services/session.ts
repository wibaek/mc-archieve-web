import type { Session } from "@/types/session";
import axiosInstance from "./axios-config";
import axios from "axios";

// 세션 목록 조회
export const getSessions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<Session[]> => {
  try {
    const response = await axiosInstance.get<Session[]>("/v1/sessions", {
      params,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Session[];
    }
    throw error;
  }
};

// 내 세션 목록 조회
export const getMySessions = async (): Promise<Session[]> => {
  try {
    const response = await axiosInstance.get<Session[]>("/v1/sessions/my");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Session[];
    }
    throw error;
  }
};

// 세션 상세 조회
export const getSession = async (sessionId: string): Promise<Session> => {
  try {
    const response = await axiosInstance.get<Session>(
      `/v1/sessions/${sessionId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Session;
    }
    throw error;
  }
};

// 세션 생성
export interface CreateSessionRequest {
  name: string;
  description?: string;
}

export const createSession = async (
  data: CreateSessionRequest
): Promise<Session> => {
  try {
    const response = await axiosInstance.post<Session>("/v1/sessions", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Session;
    }
    throw error;
  }
};
