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
    const response = await api.get<PaginatedResponse<Session>>("/sessions", {
      params: { page, limit },
    });
    return response.data;
  },

  getSession: async (sessionId: string): Promise<Session> => {
    const response = await api.get<Session>(`/sessions/${sessionId}`);
    return response.data;
  },

  createSession: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await api.post<Session>("/sessions", data);
    return response.data;
  },

  updateSession: async (
    sessionId: string,
    data: UpdateSessionRequest
  ): Promise<Session> => {
    const response = await api.put<Session>(`/sessions/${sessionId}`, data);
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/sessions/${sessionId}`);
  },

  getSessionMembers: async (
    sessionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<SessionMember>> => {
    const response = await api.get<PaginatedResponse<SessionMember>>(
      `/sessions/${sessionId}/members`,
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
      `/sessions/${sessionId}/join-requests`,
      { params: { page, limit } }
    );
    return response.data;
  },

  requestJoinSession: async (
    sessionId: string,
    message?: string
  ): Promise<SessionJoinRequest> => {
    const response = await api.post<SessionJoinRequest>(
      `/sessions/${sessionId}/join-requests`,
      { message }
    );
    return response.data;
  },

  acceptJoinRequest: async (
    sessionId: string,
    requestId: string
  ): Promise<void> => {
    await api.post(`/sessions/${sessionId}/join-requests/${requestId}/accept`);
  },

  rejectJoinRequest: async (
    sessionId: string,
    requestId: string
  ): Promise<void> => {
    await api.post(`/sessions/${sessionId}/join-requests/${requestId}/reject`);
  },
};

// 게시물 관련 API
export const posts = {
  getPosts: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>("/posts", {
      params: { page, limit },
    });
    return response.data;
  },

  getPost: async (postId: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("image", data.image);
    if (data.tags) {
      formData.append("tags", JSON.stringify(data.tags));
    }

    const response = await api.post<Post>("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePost: async (
    postId: string,
    data: UpdatePostRequest
  ): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${postId}`, data);
    return response.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },

  likePost: async (postId: string): Promise<void> => {
    await api.post(`/posts/${postId}/like`);
  },

  unlikePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}/like`);
  },
};

// 댓글 관련 API
export const comments = {
  getComments: async (
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/posts/${postId}/comments`,
      { params: { page, limit } }
    );
    return response.data;
  },

  createComment: async (
    postId: string,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, data);
    return response.data;
  },

  updateComment: async (
    postId: string,
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<Comment> => {
    const response = await api.put<Comment>(
      `/posts/${postId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },
};

// API 클라이언트 객체 생성
export const apiClient = {
  auth,
  users,
  sessions,
  posts,
  comments,
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
