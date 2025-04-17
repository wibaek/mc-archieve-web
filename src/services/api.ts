import axios from "axios";
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  UserProfile,
  UpdateProfileRequest,
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionMember,
  SessionJoinRequest,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  PaginatedResponse,
} from "@/types/api";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 관련 API
export const auth = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/refresh");
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get<{ success: boolean; data: User }>(
      "/auth/me"
    );
    return response.data;
  },
};

// 사용자 관련 API
export const users = {
  getProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (
    userId: string,
    data: UpdateProfileRequest
  ): Promise<User> => {
    const response = await api.put<User>(`/users/${userId}`, data);
    return response.data;
  },

  uploadProfileImage: async (userId: string, image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post<string>(
      `/users/${userId}/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// 세션 관련 API
export const sessions = {
  getSessions: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Session>> => {
    const response = await api.get<PaginatedResponse<Session>>("/v1/sessions", {
      params: { page, limit },
    });
    return response.data;
  },

  getSession: async (sessionId: string): Promise<Session> => {
    const response = await api.get<Session>(`/v1/sessions/${sessionId}`);
    return response.data;
  },

  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await api.post<Session>("/v1/sessions", data);
    return response.data;
  },

  updateSession: async (
    sessionId: string,
    data: UpdateSessionRequest
  ): Promise<Session> => {
    const response = await api.put<Session>(`/v1/sessions/${sessionId}`, data);
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/v1/sessions/${sessionId}`);
  },

  getSessionMembers: async (
    sessionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SessionMember>> => {
    const response = await api.get<PaginatedResponse<SessionMember>>(
      `/v1/sessions/${sessionId}/members`,
      { params: { page, limit } }
    );
    return response.data;
  },

  getSessionJoinRequests: async (
    sessionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SessionJoinRequest>> => {
    const response = await api.get<PaginatedResponse<SessionJoinRequest>>(
      `/v1/sessions/${sessionId}/join-requests`,
      { params: { page, limit } }
    );
    return response.data;
  },

  requestJoinSession: async (
    sessionId: string,
    message?: string
  ): Promise<SessionJoinRequest> => {
    const response = await api.post<SessionJoinRequest>(
      `/v1/sessions/${sessionId}/join-requests`,
      { message }
    );
    return response.data;
  },

  acceptJoinRequest: async (
    sessionId: string,
    requestId: string
  ): Promise<void> => {
    await api.post(
      `/v1/sessions/${sessionId}/join-requests/${requestId}/accept`
    );
  },

  rejectJoinRequest: async (
    sessionId: string,
    requestId: string
  ): Promise<void> => {
    await api.post(
      `/v1/sessions/${sessionId}/join-requests/${requestId}/reject`
    );
  },
};

// API 클라이언트 객체 생성
export const apiClient = {
  auth,
  users,
  sessions,
};

export default api;

// 타입 재내보내기
export type {
  Session,
  SessionMember,
  SessionJoinRequest,
  SessionMemberRole,
  SessionJoinRequestStatus,
} from "@/types/session";
