"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Users, Calendar, LogIn } from "lucide-react";
import { session } from "@/services/session";
import type { Session, SessionMember } from "@/types/api";
import { useAuth } from "@/contexts/auth-context";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // 상태 추가
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [mySessionsLoading, setMySessionsLoading] = useState(false);

  // 세션 목록 가져오기 함수
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await session.getSessions({ page, limit: 10 });
      setSessions((prevSessions) => [...prevSessions, ...response]);
      setHasMore(response.length > 0);
    } catch (error) {
      setError("세션 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect 수정
  useEffect(() => {
    setSessions([]);
    fetchSessions();
    setPage(1);
  }, [activeTab, isAuthenticated]);

  // 탭 변경 핸들러 추가
  const handleTabChange = (tab: "all" | "my") => {
    setActiveTab(tab);
    setPage(1); // 탭 변경 시 페이지 초기화
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const loadMore = () => {
    fetchSessions();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#5D4037]">세션 목록</h1>
          <div className="flex space-x-2 mb-6">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => handleTabChange("all")}
              className={activeTab === "all" ? "bg-[#33691E]" : ""}
            >
              모든 세션
            </Button>
            {isAuthenticated && (
              <Button
                variant={activeTab === "my" ? "default" : "outline"}
                onClick={() => handleTabChange("my")}
                className={activeTab === "my" ? "bg-[#33691E]" : ""}
              >
                내 세션
              </Button>
            )}
          </div>
          {isAuthenticated ? (
            <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
              <Link href="/sessions/create">
                <Plus className="mr-2 h-4 w-4" />새 세션 만들기
              </Link>
            </Button>
          ) : (
            <Button asChild className="bg-[#795548] hover:bg-[#5D4037]">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                로그인하여 세션 만들기
              </Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
            <p>
              세션을 생성하거나 참여하려면{" "}
              <Link href="/login" className="underline font-medium">
                로그인
              </Link>
              이 필요합니다.
            </p>
          </div>
        )}

        {activeTab === "all" ? (
          sessions.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 mb-4">
                아직 세션이 없습니다.
              </p>
              {isAuthenticated ? (
                <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
                  <Link href="/sessions/create">
                    <Plus className="mr-2 h-4 w-4" />첫 세션 만들기
                  </Link>
                </Button>
              ) : (
                <Button asChild className="bg-[#795548] hover:bg-[#5D4037]">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인하여 세션 만들기
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Link href={`/sessions/${session.id}`} key={session.id}>
                  <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-[#5D4037]">
                        {session.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {session.description && (
                        <p className="text-[#33691E] mb-4">
                          {session.description}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        <span>멤버 {session.memberCount}명</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>생성일: {formatDate(session.createdAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-gray-500">
                        소유자: {session.owner.username}
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )
        ) : mySessionsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#5D4037]" />
          </div>
        ) : mySessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">
              아직 참여한 세션이 없습니다.
            </p>
            <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
              <Link href="/sessions/create">
                <Plus className="mr-2 h-4 w-4" />새 세션 만들기
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mySessions.map((session) => (
              <Link href={`/sessions/${session.id}`} key={session.id}>
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-[#5D4037]">
                      {session.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {session.description && (
                      <p className="text-[#33691E] mb-4">
                        {session.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span>멤버 {session.memberCount}명</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>생성일: {formatDate(session.createdAt)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      소유자: {session.owner.username}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {hasMore && activeTab === "all" && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              variant="outline"
              disabled={loading}
              className="border-gray-200"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로딩 중...
                </>
              ) : (
                "더 보기"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
