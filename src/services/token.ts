// 토큰 저장
export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token)
  }
}

// 토큰 가져오기
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// 토큰 삭제 (로그아웃)
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
  }
}

// 토큰 존재 여부 확인
export const hasToken = (): boolean => {
  return !!getToken()
}
