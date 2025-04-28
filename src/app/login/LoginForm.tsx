"use client";

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
import { LogIn, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login(username, password);

      if (result.success) {
        // 성공 메시지 표시 후 홈페이지로 리다이렉트
        setErrorMessage(null);
        const successMessage = document.createElement("div");
        successMessage.className =
          "bg-green-50 text-green-600 p-3 rounded-md text-sm";
        successMessage.textContent = "로그인 성공! 홈페이지로 이동합니다.";
        document.querySelector("form")?.appendChild(successMessage);

        // 잠시 후 홈페이지로 리다이렉트
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setErrorMessage(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
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
              <LogIn className="h-6 w-6 text-[#5D4037]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#5D4037] mt-4">
            로그인
          </CardTitle>
          <CardDescription className="text-[#33691E]">
            계정에 접속하려면 아이디와 비밀번호를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#5D4037]">
                아이디
              </Label>
              <Input
                id="username"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
            <Button
              type="submit"
              className="w-full bg-[#795548] hover:bg-[#5D4037] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-[#33691E]">
            계정이 없으신가요?{" "}
            <Link
              href="/register"
              className="text-[#5D4037] font-medium hover:underline"
            >
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
