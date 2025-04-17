"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signup } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(email, password, nickname);

      if (result.success) {
        router.push("/");
      } else {
        setErrorMessage(result.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8BC34A]/20">
              <UserPlus className="h-6 w-6 text-[#33691E]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#5D4037] mt-4">
            계정 만들기
          </CardTitle>
          <CardDescription className="text-[#33691E]">
            MC Archive 계정을 만들기 위해 정보를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#5D4037]">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-200 bg-white"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-[#5D4037]">
                닉네임
              </Label>
              <Input
                id="nickname"
                placeholder="사용할 닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border-gray-200 bg-white"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#5D4037]">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-200 bg-white"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-[#5D4037]">
                비밀번호 확인
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-gray-200 bg-white"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#33691E] hover:bg-[#1B5E20] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  회원가입 중...
                </>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-[#33691E]">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-[#5D4037] font-medium hover:underline"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
