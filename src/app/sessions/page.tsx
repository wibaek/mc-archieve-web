"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Users, Calendar, LogIn } from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import { Session } from "@/types/session";
import { getSessions } from "@/services/session";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await getSessions();
        const sessionsData = Array.isArray(response) ? response : [];
        setSessions(sessionsData);
      } catch (error) {
        setError("세션 목록을 불러오는 중 오류가 발생했습니다.");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}년 ${month}월 ${day}일`;
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">세션 목록</h1>
          {isAuthenticated ? (
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/sessions/create">
                <Plus className="mr-2 h-4 w-4" />새 세션 만들기
              </Link>
            </Button>
          ) : (
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                로그인하여 세션 만들기
              </Link>
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-secondary/10 text-secondary p-4 rounded-md mb-6">
            <p>
              세션을 생성하거나 참여하려면{" "}
              <Link href="/login" className="underline font-medium">
                로그인
              </Link>
              이 필요합니다.
            </p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              아직 세션이 없습니다.
            </p>
            {isAuthenticated ? (
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/sessions/create">
                  <Plus className="mr-2 h-4 w-4" />첫 세션 만들기
                </Link>
              </Button>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary/90">
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
                    <CardTitle className="text-primary">
                      {session.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span>멤버 {1}명</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        생성일:{" "}
                        {session.startDate && formatDate(session.startDate)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      소유자: {session.owner.nickname}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
