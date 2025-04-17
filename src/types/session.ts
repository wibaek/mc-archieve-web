import type { Profile, User } from "./api";

// 세션 멤버 역할
export enum SessionMemberRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

// 세션 참가 요청 상태
export enum SessionJoinRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// 세션 정보
export interface Session {
  id: string;
  name: string;
  owner: Profile;
  startDate: string;
  endDate: string;
}

// 세션 멤버
export interface SessionMember {
  id: string;
  sessionId: string;
  userId: string;
  user: User;
  role: SessionMemberRole;
  joinedAt: string;
}

// 세션 참가 요청
export interface SessionJoinRequest {
  id: string;
  sessionId: string;
  userId: string;
  user: User;
  status: SessionJoinRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

// 세션 생성 요청
export interface CreateSessionRequest {
  name: string;
}

// 세션 참가 요청 생성
export interface CreateJoinRequestRequest {
  sessionId: string;
  message?: string;
}

// 세션 참가 요청 응답
export interface RespondToJoinRequestRequest {
  requestId: string;
  accept: boolean;
}

// 스토리 정보
export interface Story {
  id: string;
  title: string;
  content: string;
  sessionId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// 스토리 생성 요청
export interface CreateStoryRequest {
  title: string;
  content: string;
  sessionId: string;
}

// 스토리 업데이트 요청
export interface UpdateStoryRequest {
  title?: string;
  content?: string;
}
