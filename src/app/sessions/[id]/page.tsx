"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  ArrowLeft,
  Users,
  Calendar,
  Edit,
  Trash2,
  LogOut,
  UserPlus,
  Check,
  X,
  LogIn,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { session } from "@/services/session";
import type {
  Session,
  SessionMember,
  SessionJoinRequest,
  Story,
} from "@/types/session";
import { SessionMemberRole } from "@/types/session";
import { useAuth } from "@/contexts/auth-context";

const StoryGrid = ({ stories }: { stories: Story[] }) => {
  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          스토리가 없습니다
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          첫 번째 스토리를 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stories.map((story) => (
        <div
          key={story.id}
          className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
        >
          <Image
            src={story.imageUrl}
            alt={story.caption}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                {story.createdBy.profileImageUrl && (
                  <Image
                    src={story.createdBy.profileImageUrl}
                    alt={story.createdBy.nickname}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <p className="text-sm font-medium text-white">
                  {story.createdBy.nickname}
                </p>
              </div>
              <p className="text-xs text-white/80 truncate">{story.caption}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SessionDetailPage() {
  const { id } = useParams() as { id: string };
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<SessionJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [membersLoading, setMembersLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [joinRequestSending, setJoinRequestSending] = useState(false);
  const [myRole, setMyRole] = useState<SessionMemberRole | null>(null);
  const [hasJoinRequest, setHasJoinRequest] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const sessionData = await session.getSession(id);
      setSessionData(sessionData);
    } catch (error) {
      setError("세션 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const membersData = await session.getSessionMembers(id);
      setMembers(membersData.items || []);

      // 내 역할 확인 (로그인한 경우에만)
    } catch (error) {
      console.error("멤버 목록을 불러오는 중 오류가 발생했습니다.", error);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    // 로그인한 사용자이고 세션 소유자인 경우에만 요청 목록 가져오기
    if (!isAuthenticated || !user || !sessionData) {
      return;
    }

    try {
      setRequestsLoading(true);
      const requests = await session.getSessionJoinRequests(id);
      setJoinRequests(requests.items || []);

      // 내 참가 요청 확인
    } catch (error) {
      console.error("참가 요청 목록을 불러오는 중 오류가 발생했습니다.", error);
      setJoinRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchStories = async () => {
    if (!id) return;
    try {
      setStoriesLoading(true);
      const storiesData = await session.getSessionStories(id);
      setStories(storiesData);
    } catch (error) {
      console.error("스토리를 불러오는 중 오류가 발생했습니다.", error);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (sessionData && user) {
      fetchJoinRequests();
    }
  }, [sessionData, user]);

  useEffect(() => {
    if (sessionData) {
      fetchStories();
    }
  }, [sessionData]);

  const handleJoinSession = async () => {
    if (!sessionData) return;
    try {
      setLoading(true);
      await session.requestJoinSession(sessionData.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to join session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!sessionData) return;
    try {
      setLoading(true);
      await session.acceptJoinRequest(sessionData.id, requestId);
      router.refresh();
    } catch (error) {
      console.error("Failed to approve request:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#5D4037]" />
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
            <p className="mb-4">{error || "세션을 찾을 수 없습니다."}</p>
            <Button asChild variant="outline">
              <Link href="/sessions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                세션 목록으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user;
  const isMember = myRole !== null;

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/sessions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            세션 목록으로 돌아가기
          </Link>
        </Button>

        <Card className="border-0 shadow-sm overflow-hidden mb-8">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#5D4037]">
                {sessionData.name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>생성일: {formatDate(sessionData.startDate)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {isOwner && (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/sessions/${sessionData.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      편집
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => {}}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {sessionData.name && (
              <p className="text-[#33691E] mb-6">{sessionData.name}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>소유자: {sessionData.owner.nickname}</span>
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated && (
          <Card className="border-0 shadow-sm mb-8 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-blue-700 mb-2">
                세션에 참가하거나 더 많은 기능을 사용하려면 로그인이 필요합니다.
              </p>
              <Button asChild className="bg-[#795548] hover:bg-[#5D4037]">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && !isMember && !hasJoinRequest && (
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#5D4037]">
                세션 참가 요청
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="참가 요청 메시지를 입력하세요 (선택사항)"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  className="border-gray-200 bg-white"
                  disabled={joinRequestSending}
                />
                <Button
                  onClick={handleJoinSession}
                  className="w-full bg-[#33691E] hover:bg-[#1B5E20]"
                  disabled={joinRequestSending}
                >
                  {joinRequestSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      요청 중...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      참가 요청 보내기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {hasJoinRequest && (
          <Card className="border-0 shadow-sm mb-8 bg-yellow-50">
            <CardContent className="p-4">
              <p className="text-yellow-700">
                이 세션에 참가 요청을 보냈습니다. 소유자의 승인을 기다리고
                있습니다.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="stories">
          <TabsList className="mb-6">
            <TabsTrigger value="stories">스토리</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
            {isOwner && <TabsTrigger value="requests">참가 요청</TabsTrigger>}
          </TabsList>

          <TabsContent value="stories">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  스토리
                </CardTitle>
              </CardHeader>
              <CardContent>
                {storiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#5D4037]" />
                  </div>
                ) : (
                  <StoryGrid stories={stories} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  멤버 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#5D4037]" />
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    아직 멤버가 없습니다.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="ml-3">
                            <p className="font-medium text-[#5D4037]">
                              {member.user.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.role === SessionMemberRole.OWNER
                                ? "소유자"
                                : "멤버"}{" "}
                              • 가입일: {formatDate(member.joinedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isOwner && (
            <TabsContent value="requests">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-[#5D4037]">
                    참가 요청
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {requestsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#5D4037]" />
                    </div>
                  ) : joinRequests.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      아직 참가 요청이 없습니다.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {joinRequests.map((request) => (
                        <div
                          key={request.id}
                          className="p-4 bg-gray-50 rounded-md"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-[#5D4037]">
                                {request.user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                요청일: {formatDate(request.createdAt)}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                수락
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                onClick={() => {}}
                              >
                                <X className="h-4 w-4 mr-1" />
                                거절
                              </Button>
                            </div>
                          </div>
                          {request.message && (
                            <div className="mt-2 p-3 bg-white rounded border border-gray-100">
                              <p className="text-sm text-[#33691E]">
                                {request.message}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
