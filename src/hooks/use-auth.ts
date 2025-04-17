"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

        // TODO: API 연동 필요
        // const userData = await apiClient.auth.getCurrentUser();
        // if (userData.success) {
        //   setUser(userData.data);
        // } else {
        //   setUser(null);
        //   localStorage.removeItem("token");
        // }

        // 임시 사용자 데이터
        setUser({
          email: "temp@example.com",
        });
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
      // TODO: API 연동 필요
      // const authData = await apiClient.auth.login({ email, password });
      // setUser(authData.user);

      // 임시 로그인 로직
      if (email && password) {
        setUser({
          email: email,
        });
        localStorage.setItem("token", "temp-token");
        return { success: true };
      } else {
        throw new Error("이메일과 비밀번호를 입력해주세요.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "로그인 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setLoading(true);
      // TODO: API 연동 필요
      // const authData = await apiClient.auth.signup({
      //   email,
      //   password,
      //   nickname,
      // });
      // setUser(authData.user);

      // 임시 회원가입 로직
      if (email && password && nickname) {
        setUser({
          email: email,
        });
        localStorage.setItem("token", "temp-token");
        return { success: true };
      } else {
        throw new Error("모든 필드를 입력해주세요.");
      }
    } catch (err: any) {
      const errorMessage = err.message || "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // TODO: API 연동 필요
    // apiClient.auth.logout();
    localStorage.removeItem("token");
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
