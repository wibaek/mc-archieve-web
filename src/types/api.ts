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

export interface UpdateSessionRequest {
  name?: string;
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

// 게시물 관련 타입
export interface Post {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  userId: string;
  user: User;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  description?: string;
  image: File;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  tags?: string[];
}

// 댓글 관련 타입
export interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: string;
}

export interface UpdateCommentRequest {
  content: string;
}
