"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup, getCurrentUser, logout } from "@/services/auth";
import { hasToken, removeToken } from "@/services/token";
import type { User } from "@/services/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        if (hasToken()) {
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError("인증 확인 중 오류가 발생했습니다.");
        setUser(null);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await login({ email, password });
      // 로그인 성공 후 사용자 정보 조회
      const userData = await getCurrentUser();
      setUser(userData);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    nickname: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await signup({ email, password, nickname });
      // 회원가입 성공 후 로그인 페이지로 리다이렉트
      router.push("/login");
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
}
