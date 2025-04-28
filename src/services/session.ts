import type {
  CreateSessionRequest,
  CreateStoryRequest,
  Session,
  Story,
  UpdateStoryRequest,
} from "@/types/session";
import axiosInstance from "./axios-config";
import axios from "axios";

export const session = {
  // 세션 목록 조회
  getSessions: async (params?: {
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
  },

  // 내 세션 목록 조회
  getMySessions: async (): Promise<Session[]> => {
    try {
      const response = await axiosInstance.get<Session[]>("/v1/sessions/my");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Session[];
      }
      throw error;
    }
  },

  // 세션 상세 조회
  getSession: async (sessionId: string): Promise<Session> => {
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
  },

  // 세션 생성
  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    try {
      const response = await axiosInstance.post<Session>("/v1/sessions", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Session;
      }
      throw error;
    }
  },

  // 세션의 스토리 목록 조회
  getSessionStories: async (sessionId: string): Promise<Story[]> => {
    try {
      const response = await axiosInstance.get<Story[]>(
        `/v1/sessions/${sessionId}/stories`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story[];
      }
      throw error;
    }
  },

  // 스토리 생성
  createStory: async (data: CreateStoryRequest): Promise<Story> => {
    try {
      const response = await axiosInstance.post<Story>(`/v1/stories`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 상세 조회
  getStory: async (storyId: string): Promise<Story> => {
    try {
      const response = await axiosInstance.get<Story>(`/v1/stories/${storyId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 업데이트
  updateStory: async (
    storyId: string,
    data: UpdateStoryRequest
  ): Promise<Story> => {
    try {
      const response = await axiosInstance.put<Story>(
        `/v1/stories/${storyId}`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 삭제
  deleteStory: async (storyId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/stories/${storyId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },
};
