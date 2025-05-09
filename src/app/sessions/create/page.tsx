"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { createSession } from "@/services/session";

export default function CreateSessionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      // 로그인 페이지로 리다이렉트하지 않고 로그인 안내 메시지 표시
      setErrorMessage("세션을 생성하려면 로그인이 필요합니다.");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!name.trim()) {
      setErrorMessage("세션 이름을 입력해주세요.");
      return;
    }

    try {
      const response = await createSession({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      // 생성된 세션의 ID로 리다이렉트
      router.push(`/sessions/${response.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      setErrorMessage("세션 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/sessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            세션 목록으로 돌아가기
          </Link>
        </Button>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D4037]">
              새 세션 만들기
            </CardTitle>
            <CardDescription className="text-[#33691E]">
              새로운 세션을 만들어 다른 사용자들과 함께하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {errorMessage}
                {!isAuthenticated && (
                  <div className="mt-2">
                    <Button
                      asChild
                      className="bg-[#795548] hover:bg-[#5D4037] w-full"
                    >
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

              <Button
                type="submit"
                className="w-full bg-[#33691E] hover:bg-[#1B5E20]"
                disabled={isLoading || !isAuthenticated}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  "세션 생성하기"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">
              세션을 생성하면 자동으로 해당 세션의 소유자가 됩니다.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
