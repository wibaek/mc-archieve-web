"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import SessionHeader from "./SessionHeader";
import SessionTabs from "./SessionTabs";
import { getSession } from "@/services/session";
import { getStoriesBySession } from "@/services/story";
import type { Session } from "@/types/session";
import type { Story } from "@/types/story";
import { StoryUploadForm } from "./StoryUploadForm";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";
import Link from "next/link";
import { Upload } from "lucide-react";

interface SessionDetailPageProps {
  id: string;
}

export function SessionDetailPage({ id }: SessionDetailPageProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const isOwner = false;

  const fetchStories = async () => {
    try {
      const storiesData = await getStoriesBySession(Number(id));
      if (!("error" in storiesData)) {
        setStories(storiesData);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionData, storiesData] = await Promise.all([
          getSession(id),
          getStoriesBySession(Number(id)),
        ]);

        if (!("error" in sessionData)) {
          setSession(sessionData as Session);
        }
        if (!("error" in storiesData)) {
          setStories(storiesData as Story[]);
        }
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <Loading fullScreen size="lg" />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center text-red-600">
            세션을 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <SessionHeader session={session} isOwner={isOwner} />
        <div className="flex justify-end mb-6">
          <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
            <Link href={`/sessions/${id}/upload`}>
              <Upload className="mr-2 h-4 w-4" />
              스토리 업로드
            </Link>
          </Button>
        </div>
        <StoryUploadForm sessionId={id} onUploadSuccess={fetchStories} />
        <SessionTabs
          session={session}
          stories={stories}
          storiesLoading={false}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
