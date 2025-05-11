import { Profile } from "./user";

// 세션 생성 요청
export interface CreateSessionRequest {
  name: string;
  description?: string;
}

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
  startDate: string | null;
  endDate: string | null;
}

// // 세션 멤버
// export interface SessionMember {
//   id: string;
//   sessionId: string;
//   userId: string;
//   user: User;
//   role: SessionMemberRole;
//   joinedAt: string;
// }

// 세션 참가 요청
export interface SessionJoinRequest {
  id: string;
  user: Profile;
  status: SessionJoinRequestStatus;
  createdAt: string;
}
