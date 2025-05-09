"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import SessionHeader from "./SessionHeader";
import SessionTabs from "./SessionTabs";
import { getSession } from "@/services/session";
import { getStoriesBySession } from "@/services/story";
import type { Session } from "@/types/session";
import type { Story } from "@/types/story";
import { StoryUploadForm } from "./StoryUploadForm";

interface SessionDetailPageProps {
  id: string;
}

export function SessionDetailPage({ id }: SessionDetailPageProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchStories = async () => {
    try {
      const storiesData = await getStoriesBySession(Number(id));
      setStories(storiesData);
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
        setSession(sessionData);
        setStories(storiesData);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
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
        <SessionHeader session={session} isOwner={false} />
        <StoryUploadForm sessionId={id} onUploadSuccess={fetchStories} />
        <SessionTabs
          session={session}
          stories={stories}
          storiesLoading={false}
          isOwner={false}
        />
      </div>
    </div>
  );
}
