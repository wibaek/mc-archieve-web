import { auth } from "./auth"
import { session } from "./session"

// API 클라이언트
export const apiClient = {
  auth,
  sessions: session,
}

// 타입 재내보내기
export type { ApiResponse } from "@/types/api"
export type {
  Session,
  SessionMember,
  SessionJoinRequest,
  SessionMemberRole,
  SessionJoinRequestStatus,
  Story,
} from "@/types/session"
