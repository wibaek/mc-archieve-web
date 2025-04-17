"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/api";
import type { User } from "@/types/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const userData = await apiClient.auth.getCurrentUser();
        if (userData.success) {
          setUser(userData.data);
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
      } catch (err) {
        setError("인증 확인 중 오류가 발생했습니다.");
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const authData = await apiClient.auth.login({ email, password });
      setUser(authData.user);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setLoading(true);
      const authData = await apiClient.auth.signup({
        email,
        password,
        nickname,
      });
      setUser(authData.user);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.auth.logout();
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
}
