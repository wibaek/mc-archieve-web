"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sessions");

  // 인증 상태 확인 - 로그인 페이지로 리다이렉트하지 않음
  useEffect(() => {
    // 로그인 상태 확인만 하고 리다이렉트는 하지 않음
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5D4037]" />
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 안내 메시지 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-sm mb-8 bg-blue-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#5D4037] mb-4">
                  프로필 접근 제한
                </h2>
                <p className="text-blue-700 mb-6">
                  프로필 정보를 보려면 로그인이 필요합니다.
                </p>
                <Button asChild className="bg-[#795548] hover:bg-[#5D4037]">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#5D4037]">내 프로필</h1>
          <Button asChild variant="outline" className="border-gray-200">
            <Link href="/profile/settings">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-[#5D4037]">
              프로필 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-500 sm:w-32">
                  사용자 이름:
                </span>
                <span className="text-[#5D4037] font-medium">
                  {user?.email}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-500 sm:w-32">
                  이메일:
                </span>
                <span className="text-[#5D4037]">{user?.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-gray-500 sm:w-32">
                  가입일:
                </span>
                <span className="text-[#5D4037]"></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          defaultValue="sessions"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="sessions">내 세션</TabsTrigger>
            <TabsTrigger value="uploads">업로드한 사진</TabsTrigger>
            <TabsTrigger value="stories">내 스토리</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  내 세션
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  세션 목록을 보려면{" "}
                  <Link
                    href="/sessions"
                    className="text-[#33691E] hover:underline"
                  >
                    세션 페이지
                  </Link>
                  를 방문하세요.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  업로드한 사진
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  아직 업로드한 사진이 없습니다.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  내 스토리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  아직 작성한 스토리가 없습니다.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
