import axios from "axios";

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

// 요청 인터셉터 - 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 오류 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 오류 처리 (인증 만료)
    if (error.response && error.response.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        // 로그인 페이지로 리다이렉트 (필요한 경우)
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
