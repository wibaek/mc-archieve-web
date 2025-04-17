import axios from "axios";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  PaginatedResponse,
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionMember,
  SessionJoinRequest,
} from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const apiClient = {
  auth: {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await axios.post(`${API_URL}/v1/auth/login`, data);
      return response.data;
    },
    signup: async (data: SignupRequest): Promise<AuthResponse> => {
      const response = await axios.post(`${API_URL}/v1/auth/signup`, data);
      return response.data;
    },
    logout: () => {
      localStorage.removeItem("token");
    },
    getCurrentUser: async (): Promise<User> => {
      const response = await axios.get(`${API_URL}/v1/auth/me`);
      return response.data;
    },
  },
  sessions: {
    getSessions: async (params?: {
      page?: number;
      limit?: number;
    }): Promise<Session[]> => {
      const response = await axios.get(`${API_URL}/v1/sessions`, { params });
      return response.data;
    },
    getMySessions: async (): Promise<Session[]> => {
      const response = await axios.get(`${API_URL}/v1/sessions/my`);
      return response.data;
    },
    getSession: async (sessionId: string): Promise<Session> => {
      const response = await axios.get(`${API_URL}/v1/sessions/${sessionId}`);
      return response.data;
    },
    createSession: async (data: CreateSessionRequest): Promise<Session> => {
      const response = await axios.post(`${API_URL}/v1/sessions`, data);
      return response.data;
    },
    updateSession: async (
      sessionId: string,
      data: UpdateSessionRequest
    ): Promise<Session> => {
      const response = await axios.put(
        `${API_URL}/v1/sessions/${sessionId}`,
        data
      );
      return response.data;
    },
    deleteSession: async (sessionId: string): Promise<void> => {
      await axios.delete(`${API_URL}/v1/sessions/${sessionId}`);
    },
    getSessionMembers: async (
      sessionId: string
    ): Promise<{ items: SessionMember[] }> => {
      const response = await axios.get(
        `${API_URL}/v1/sessions/${sessionId}/members`
      );
      return response.data;
    },
    joinSession: async (sessionId: string): Promise<void> => {
      await axios.post(`${API_URL}/v1/sessions/${sessionId}/join`);
    },
    getJoinApplications: async (
      sessionId: string
    ): Promise<SessionJoinRequest[]> => {
      const response = await axios.get(
        `${API_URL}/v1/sessions/${sessionId}/join-applications`
      );
      return response.data.applications;
    },
    approveJoinRequest: async (
      sessionId: string,
      applicationId: string
    ): Promise<void> => {
      await axios.post(
        `${API_URL}/v1/sessions/${sessionId}/join-applications/${applicationId}/approve`
      );
    },
    rejectJoinRequest: async (
      sessionId: string,
      applicationId: string
    ): Promise<void> => {
      await axios.post(
        `${API_URL}/v1/sessions/${sessionId}/join-applications/${applicationId}/reject`
      );
    },
    removeMember: async (sessionId: string, userId: string): Promise<void> => {
      await axios.delete(
        `${API_URL}/v1/sessions/${sessionId}/members/${userId}`
      );
    },
    leaveSession: async (sessionId: string): Promise<void> => {
      await axios.delete(`${API_URL}/v1/sessions/${sessionId}/leave`);
    },
  },
  posts: {
    getPosts: async (
      page = 1,
      limit = 10
    ): Promise<PaginatedResponse<Post>> => {
      const response = await axios.get(`${API_URL}/posts`, {
        params: { page, limit },
      });
      return response.data;
    },
    getPost: async (id: string): Promise<Post> => {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      return response.data;
    },
    createPost: async (data: CreatePostRequest): Promise<Post> => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("image", data.image);
      if (data.tags) formData.append("tags", JSON.stringify(data.tags));

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    updatePost: async (id: string, data: UpdatePostRequest): Promise<Post> => {
      const response = await axios.put(`${API_URL}/posts/${id}`, data);
      return response.data;
    },
    deletePost: async (id: string): Promise<void> => {
      await axios.delete(`${API_URL}/posts/${id}`);
    },
  },
  comments: {
    getComments: async (postId: string): Promise<Comment[]> => {
      const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
      return response.data;
    },
    createComment: async (data: CreateCommentRequest): Promise<Comment> => {
      const response = await axios.post(`${API_URL}/comments`, data);
      return response.data;
    },
    updateComment: async (
      id: string,
      data: UpdateCommentRequest
    ): Promise<Comment> => {
      const response = await axios.put(`${API_URL}/comments/${id}`, data);
      return response.data;
    },
    deleteComment: async (id: string): Promise<void> => {
      await axios.delete(`${API_URL}/comments/${id}`);
    },
  },
};

export { apiClient };

// 타입 재내보내기
export type { ApiResponse } from "@/types/api";
export type {
  Session,
  SessionMember,
  SessionJoinRequest,
  SessionMemberRole,
  SessionJoinRequestStatus,
  Story,
} from "@/types/session";
