"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/services/api";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function EditSessionPage() {
  const { id } = useParams() as { id: string };
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // 인증 상태 확인
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      setErrorMessage("세션을 편집하려면 로그인이 필요합니다.");
      setFetchLoading(false);
    } else {
      fetchSession();
    }
  }, [isAuthenticated]);

  // 세션 정보 가져오기
  const fetchSession = async () => {
    try {
      setFetchLoading(true);
      const session = await apiClient.sessions.getSession(id);

      // 소유자 확인
      if (user && session.ownerId !== user.id) {
        setErrorMessage("세션 소유자만 편집할 수 있습니다.");
      } else {
        setName(session.name);
        setDescription(session.description || "");
      }
    } catch (error) {
      setErrorMessage("세션 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("세션 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const session = await apiClient.sessions.updateSession(id, {
        name,
        description: description.trim() ? description : undefined,
      });
      router.push(`/sessions/${id}`);
    } catch (error) {
      setErrorMessage("세션 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5D4037]" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#5D4037]">
                오류가 발생했습니다
              </CardTitle>
              <CardDescription className="text-red-600">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href="/sessions">세션 목록으로 돌아가기</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#5D4037]">
              세션 수정
            </CardTitle>
            <CardDescription>세션 정보를 수정합니다.</CardDescription>
          </CardHeader>
          <CardContent>
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
                    수정 중...
                  </>
                ) : (
                  "세션 수정하기"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">세션 정보를 수정합니다.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
