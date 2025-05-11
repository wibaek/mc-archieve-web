"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/services/user";
import { isTokenValid, removeToken } from "@/utils/token";
import type { User } from "@/types/user";
import { login as authLogin, signup as authSignup } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (
    email: string,
    password: string,
    nickname: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        // 토큰이 있는지 확인
        if (typeof window !== "undefined" && isTokenValid()) {
          const user = await getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authLogin({ email, password });
      // 로그인 성공 후 현재 사용자 정보를 가져옵니다
      const user = await getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Failed to login:", error);
      setError("로그인에 실패했습니다.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setError(null);
      setLoading(true);
      await authSignup({ email, password, nickname });
      // 회원가입 성공 후 현재 사용자 정보를 가져옵니다
      const user = await getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Failed to signup:", error);
      setError("회원가입에 실패했습니다.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
