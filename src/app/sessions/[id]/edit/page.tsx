"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, LogIn } from "lucide-react"
import { apiClient } from "@/services/api"
import { useAuth } from "@/contexts/auth-context"

export default function EditSessionPage() {
  const { id } = useParams() as { id: string }
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // 인증 상태 확인
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      setErrorMessage("세션을 편집하려면 로그인이 필요합니다.")
      setFetchLoading(false)
    } else {
      fetchSession()
    }
  }, [isAuthenticated])

  // 세션 정보 가져오기
  const fetchSession = async () => {
    try {
      setFetchLoading(true)
      const response = await apiClient.sessions.getSession(id)

      if (response.success) {
        // 소유자 확인
        if (user && response.data.ownerId !== user.id) {
          setErrorMessage("세션 소유자만 편집할 수 있습니다.")
        } else {
          setName(response.data.name)
          setDescription(response.data.description || "")
        }
      } else {
        setErrorMessage("세션 정보를 불러오는 중 오류가 발생했습니다.")
      }
    } catch (error) {
      setErrorMessage("세션 정보를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("세션 이름을 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.sessions.updateSession(id, {
        name,
        description: description.trim() ? description : undefined,
      })

      if (response.success) {
        router.push(`/sessions/${id}`)
      } else {
        setErrorMessage(response.message || "세션 수정 중 오류가 발생했습니다.")
      }
    } catch (error) {
      setErrorMessage("세션 수정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5D4037]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/sessions/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            세션으로 돌아가기
          </Link>
        </Button>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D4037]">세션 편집</CardTitle>
            <CardDescription className="text-[#33691E]">세션 정보를 수정합니다</CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {errorMessage}
                {!isAuthenticated && (
                  <div className="mt-2">
                    <Button asChild className="bg-[#795548] hover:bg-[#5D4037] w-full">
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        로그인하기
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#5D4037]">
                  세션 이름
                </Label>
                <Input
                  id="name"
                  placeholder="세션 이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-gray-200 bg-white"
                  required
                  disabled={isLoading || !isAuthenticated}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#5D4037]">
                  세션 설명 (선택사항)
                </Label>
                <Textarea
                  id="description"
                  placeholder="세션에 대한 설명을 입력하세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-gray-200 bg-white min-h-[100px]"
                  disabled={isLoading || !isAuthenticated}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/sessions/${id}`)}
                  disabled={isLoading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#33691E] hover:bg-[#1B5E20]"
                  disabled={isLoading || !isAuthenticated}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    "변경사항 저장"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
