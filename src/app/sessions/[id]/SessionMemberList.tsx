import { useEffect, useState } from "react";
import { SessionJoinApplication } from "@/types/sessionMember";
import {
  getSessionJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  requestJoinSession,
} from "@/services/sessionMember";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";
import { useAuth } from "@/contexts/auth-context";

interface SessionMemberListProps {
  sessionId: string;
  isOwner: boolean;
  type: "members" | "requests";
}

export default function SessionMemberList({
  sessionId,
  isOwner,
  type,
}: SessionMemberListProps) {
  const [joinRequests, setJoinRequests] = useState<SessionJoinApplication[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(type === "requests");
  const [isRequesting, setIsRequesting] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchJoinRequests = async () => {
    if (type !== "requests" || !isOwner) return;

    try {
      setIsLoading(true);
      const response = await getSessionJoinRequests(sessionId);
      if ("items" in response) {
        setJoinRequests(response.items);
      }
    } catch (error) {
      console.error("Failed to fetch join requests:", error);
      setJoinRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    try {
      await acceptJoinRequest(applicationId);
      await fetchJoinRequests();
    } catch (error) {
      console.error("Failed to accept join request:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await rejectJoinRequest(applicationId);
      await fetchJoinRequests();
    } catch (error) {
      console.error("Failed to reject join request:", error);
    }
  };

  const handleJoinRequest = async () => {
    if (!isAuthenticated) {
      // TODO: 로그인 페이지로 리다이렉트
      return;
    }

    try {
      setIsRequesting(true);
      await requestJoinSession(sessionId);
      alert("가입 요청이 완료되었습니다.");
    } catch (error) {
      console.error("Failed to request join:", error);
      alert("가입 요청에 실패했습니다.");
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    fetchJoinRequests();
  }, [sessionId, isOwner, type]);

  if (isLoading) {
    return <Loading size="md" />;
  }

  if (type === "members") {
    return (
      <div className="space-y-4">
        {!isOwner && (
          <div className="flex justify-center">
            <Button
              onClick={handleJoinRequest}
              disabled={isRequesting}
              className="bg-[#33691E] hover:bg-[#1B5E20]"
            >
              {isRequesting ? (
                <>
                  <Loading size="sm" />
                  <span className="ml-2">요청 중...</span>
                </>
              ) : (
                "가입 요청하기"
              )}
            </Button>
          </div>
        )}
        <div className="text-center text-gray-500">
          멤버 목록이 여기에 표시됩니다.
        </div>
      </div>
    );
  }

  if (type === "requests" && isOwner) {
    return (
      <div className="space-y-4">
        {joinRequests.length === 0 ? (
          <p className="text-gray-500">대기 중인 참가 요청이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {joinRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{request.user.nickname}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    거절
                  </Button>
                  <Button
                    onClick={() => handleAccept(request.id)}
                    className="bg-[#33691E] hover:bg-[#1B5E20]"
                  >
                    수락
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
