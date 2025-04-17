// 인증 헤더 가져오기
export function getAuthHeader() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  return {}
}

// 응답 처리 헬퍼
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "서버 오류가 발생했습니다.")
  }
  return response.json()
}
