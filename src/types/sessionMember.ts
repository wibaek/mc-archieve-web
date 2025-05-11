import { Profile } from "./user";

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

// 세션 참가 요청
export interface SessionJoinApplication {
  id: string;
  user: Profile;
  status: SessionJoinRequestStatus;
  createdAt: string;
}
