import type {
  CreateSessionRequest,
  CreateStoryRequest,
  Session,
  SessionJoinRequest,
  SessionMember,
  Story,
  UpdateSessionRequest,
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

  // 세션 업데이트
  updateSession: async (
    sessionId: string,
    data: UpdateSessionRequest
  ): Promise<Session> => {
    try {
      const response = await axiosInstance.put<Session>(
        `/v1/sessions/${sessionId}`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Session;
      }
      throw error;
    }
  },

  // 세션 삭제
  deleteSession: async (sessionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/sessions/${sessionId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 멤버 목록 조회
  getSessionMembers: async (
    sessionId: string
  ): Promise<{ items: SessionMember[] }> => {
    try {
      const response = await axiosInstance.get<{ items: SessionMember[] }>(
        `/v1/sessions/${sessionId}/members`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as { items: SessionMember[] };
      }
      throw error;
    }
  },

  // 세션 참가 요청 보내기
  joinSession: async (sessionId: string): Promise<void> => {
    try {
      await axiosInstance.post(`/v1/sessions/${sessionId}/join`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 참가 요청 목록 조회
  getJoinApplications: async (
    sessionId: string
  ): Promise<SessionJoinRequest[]> => {
    try {
      const response = await axiosInstance.get<{
        applications: SessionJoinRequest[];
      }>(`/v1/sessions/${sessionId}/join-applications`);
      return response.data.applications;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as SessionJoinRequest[];
      }
      throw error;
    }
  },

  // 세션 참가 요청 승인
  approveJoinRequest: async (
    sessionId: string,
    applicationId: string
  ): Promise<void> => {
    try {
      await axiosInstance.post(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/approve`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 참가 요청 거절
  rejectJoinRequest: async (
    sessionId: string,
    applicationId: string
  ): Promise<void> => {
    try {
      await axiosInstance.post(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/reject`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 멤버 제거 (소유자용)
  removeMember: async (sessionId: string, userId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/sessions/${sessionId}/members/${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 나가기 (멤버용)
  leaveSession: async (sessionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/sessions/${sessionId}/leave`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
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
