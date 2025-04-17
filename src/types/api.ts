// 공통 응답 타입
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// 페이지네이션 타입
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 인증 관련 타입
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// 사용자 관련 타입
export interface User {
  id: string
  username: string
  email: string
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  bio?: string
  postCount: number
  followerCount: number
  followingCount: number
}

export interface UpdateProfileRequest {
  username?: string
  email?: string
  password?: string
  profileImage?: string
  bio?: string
}

// 게시물 관련 타입
export interface Post {
  id: string
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  userId: string
  user: User
  tags: string[]
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface CreatePostRequest {
  title: string
  description?: string
  image: File
  tags?: string[]
}

export interface UpdatePostRequest {
  title?: string
  description?: string
  tags?: string[]
}

// 댓글 관련 타입
export interface Comment {
  id: string
  content: string
  postId: string
  userId: string
  user: User
  createdAt: string
  updatedAt: string
}

export interface CreateCommentRequest {
  content: string
  postId: string
}

export interface UpdateCommentRequest {
  content: string
}
