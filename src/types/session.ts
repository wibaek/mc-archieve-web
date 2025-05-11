import { Profile } from "./user";

// 세션 생성 요청
export interface CreateSessionRequest {
  name: string;
  description?: string;
}

// 세션 정보
export interface Session {
  id: string;
  name: string;
  owner: Profile;
  startDate: string | null;
  endDate: string | null;
}
