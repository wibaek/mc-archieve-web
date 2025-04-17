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

        const response = await apiClient.auth.getCurrentUser();

        if (response.success) {
          setUser(response.data);
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
      const response = await apiClient.auth.login({ email, password });

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError("로그인에 실패했습니다.");
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
      return { success: false, message: "로그인 중 오류가 발생했습니다." };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);
      const response = await apiClient.auth.register({
        username,
        email,
        password,
      });

      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        setError("회원가입에 실패했습니다.");
        return { success: false, message: response.message };
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
      return { success: false, message: "회원가입 중 오류가 발생했습니다." };
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
    register,
    logout,
    isAuthenticated: !!user,
  };
}
