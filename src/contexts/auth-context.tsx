"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/services/auth";
import { hasToken, removeToken } from "@/services/token";
import type { User } from "@/types/api";

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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 토큰이 있는지 확인
        if (typeof window !== "undefined" && hasToken()) {
          const user = await auth.getCurrentUser();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        logout();
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Failed to login:", error);
      setError("로그인에 실패했습니다.");
      return { success: false };
    }
  };

  const signup = async (email: string, password: string, nickname: string) => {
    try {
      setError(null);
      const response = await auth.signup({ email, password, nickname });
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Failed to signup:", error);
      setError("회원가입에 실패했습니다.");
      return { success: false };
    }
  };

  const logout = () => {
    auth.logout();
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
