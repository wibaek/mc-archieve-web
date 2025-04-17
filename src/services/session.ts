import type { ApiResponse } from "@/types/api"
import type {
  CreateSessionRequest,
  CreateStoryRequest,
  Session,
  SessionJoinRequest,
  SessionMember,
  Story,
  UpdateSessionRequest,
  UpdateStoryRequest,
} from "@/types/session"
import axiosInstance from "./axios-config"
import axios from "axios"

export const session = {
  // 세션 목록 조회
  getSessions: async (params?: { page?: number; limit?: number }): Promise<ApiResponse<Session[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Session[]>>("/v1/sessions", { params })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Session[]>
      }
      throw error
    }
  },

  // 내 세션 목록 조회
  getMySessions: async (): Promise<ApiResponse<Session[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Session[]>>("/v1/sessions/my")
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Session[]>
      }
      throw error
    }
  },

  // 세션 상세 조회
  getSession: async (sessionId: string): Promise<ApiResponse<Session>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Session>>(`/v1/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Session>
      }
      throw error
    }
  },

  // 세션 생성
  createSession: async (data: CreateSessionRequest): Promise<ApiResponse<Session>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Session>>("/v1/sessions", data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Session>
      }
      throw error
    }
  },

  // 세션 업데이트
  updateSession: async (sessionId: string, data: UpdateSessionRequest): Promise<ApiResponse<Session>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Session>>(`/v1/sessions/${sessionId}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Session>
      }
      throw error
    }
  },

  // 세션 삭제
  deleteSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`/v1/sessions/${sessionId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 세션 멤버 목록 조회
  getSessionMembers: async (sessionId: string): Promise<ApiResponse<{ items: SessionMember[] }>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<{ items: SessionMember[] }>>(
        `/v1/sessions/${sessionId}/members`,
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<{ items: SessionMember[] }>
      }
      throw error
    }
  },

  // 세션 참가 요청 보내기
  joinSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<null>>(`/v1/sessions/${sessionId}/join`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 세션 참가 요청 목록 조회
  getJoinApplications: async (sessionId: string): Promise<ApiResponse<SessionJoinRequest[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<{ applications: SessionJoinRequest[] }>>(
        `/v1/sessions/${sessionId}/join-applications`,
      )
      // API 응답 구조에 맞게 변환
      return {
        ...response.data,
        data: response.data.data.applications,
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<SessionJoinRequest[]>
      }
      throw error
    }
  },

  // 세션 참가 요청 승인
  approveJoinRequest: async (sessionId: string, applicationId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<null>>(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/approve`,
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 세션 참가 요청 거절
  rejectJoinRequest: async (sessionId: string, applicationId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<null>>(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/reject`,
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 멤버 제거 (소유자용)
  removeMember: async (sessionId: string, userId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`/v1/sessions/${sessionId}/members/${userId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 세션 나가기 (멤버용)
  leaveSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`/v1/sessions/${sessionId}/leave`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },

  // 세션의 스토리 목록 조회
  getSessionStories: async (sessionId: string): Promise<ApiResponse<Story[]>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Story[]>>(`/v1/sessions/${sessionId}/stories`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Story[]>
      }
      throw error
    }
  },

  // 스토리 생성
  createStory: async (data: CreateStoryRequest): Promise<ApiResponse<Story>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Story>>(`/v1/stories`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Story>
      }
      throw error
    }
  },

  // 스토리 상세 조회
  getStory: async (storyId: string): Promise<ApiResponse<Story>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Story>>(`/v1/stories/${storyId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Story>
      }
      throw error
    }
  },

  // 스토리 업데이트
  updateStory: async (storyId: string, data: UpdateStoryRequest): Promise<ApiResponse<Story>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Story>>(`/v1/stories/${storyId}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<Story>
      }
      throw error
    }
  },

  // 스토리 삭제
  deleteStory: async (storyId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`/v1/stories/${storyId}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<null>
      }
      throw error
    }
  },
}
