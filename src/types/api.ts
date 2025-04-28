import { User } from "./user";

// 세션 관련 타입
export interface Session {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner: User;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
}

export interface CreateSessionRequest {
  name: string;
  description?: string;
}

export enum SessionMemberRole {
  OWNER = "OWNER",
  MEMBER = "MEMBER",
}

export interface SessionMember {
  id: string;
  sessionId: string;
  userId: string;
  user: User;
  role: SessionMemberRole;
  joinedAt: string;
}

export enum SessionJoinRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

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
