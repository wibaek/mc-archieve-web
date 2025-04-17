"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/services/api"
import { hasToken, removeToken } from "@/services/token"
import type { User } from "@/types/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // 토큰이 있는지 확인
        if (typeof window !== "undefined" && hasToken()) {
          const response = await apiClient.auth.getCurrentUser()

          if (response.success) {
            setUser(response.data)
          } else {
            setUser(null)
            removeToken()
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        setError("인증 확인 중 오류가 발생했습니다.")
        setUser(null)
        removeToken()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiClient.auth.login({ username, password })

      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError("로그인에 실패했습니다.")
        return { success: false, message: response.message }
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.")
      return { success: false, message: "로그인 중 오류가 발생했습니다." }
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiClient.auth.register({ username, email, password })

      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError("회원가입에 실패했습니다.")
        return { success: false, message: response.message }
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.")
      return { success: false, message: "회원가입 중 오류가 발생했습니다." }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    apiClient.auth.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
