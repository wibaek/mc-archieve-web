import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SessionHeader from "./SessionHeader";
import SessionTabs from "./SessionTabs";
import { getSession } from "@/services/session";
import { getStoriesBySession } from "@/services/story";

interface SessionDetailPageProps {
  id: string;
}

export async function SessionDetailPage({ id }: SessionDetailPageProps) {
  const sessionData = await getSession(id);
  const stories = await getStoriesBySession(parseInt(id, 10));
  const isOwner = false; // TODO: 실제 소유자 확인 로직 구현

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/sessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            세션 목록으로 돌아가기
          </Link>
        </Button>

        <SessionHeader session={sessionData} isOwner={isOwner} />

        <SessionTabs
          session={sessionData}
          stories={stories}
          storiesLoading={false}
          isOwner={isOwner}
        />
      </div>
    </div>
  );
}
