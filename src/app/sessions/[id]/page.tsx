"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";
import { apiClient } from "@/services/api";
import type {
  Session,
  SessionMember,
  SessionJoinRequest,
  Story,
} from "@/types/session";
import { SessionMemberRole } from "@/types/session";
import { useAuth } from "@/contexts/auth-context";

export default function SessionDetailPage() {
  const { id } = useParams() as { id: string };
  const [session, setSession] = useState<Session | null>(null);
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

  // 상태 추가
  const [stories, setStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const sessionData = await apiClient.sessions.getSession(id);
      setSession(sessionData);
    } catch (error) {
      setError("세션 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const membersData = await apiClient.sessions.getSessionMembers(id);
      setMembers(membersData.items || []);

      // 내 역할 확인 (로그인한 경우에만)
      if (user) {
        const myMembership = membersData.items?.find(
          (member) => member.userId === user.id
        );
        if (myMembership) {
          setMyRole(myMembership.role);
        } else {
          setMyRole(null);
        }
      }
    } catch (error) {
      console.error("멤버 목록을 불러오는 중 오류가 발생했습니다.", error);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const fetchJoinRequests = async () => {
    // 로그인한 사용자이고 세션 소유자인 경우에만 요청 목록 가져오기
    if (!isAuthenticated || !user || !session || session.ownerId !== user.id) {
      return;
    }

    try {
      setRequestsLoading(true);
      const requests = await apiClient.sessions.getJoinApplications(session.id);
      setJoinRequests(requests || []);

      // 내 참가 요청 확인
      if (user) {
        const myRequest = requests?.find(
          (request) => request.userId === user.id
        );
        setHasJoinRequest(!!myRequest);
      }
    } catch (error) {
      console.error("참가 요청 목록을 불러오는 중 오류가 발생했습니다.", error);
      setJoinRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchStories = async () => {
    if (!session) return;

    try {
      setStoriesLoading(true);
      const storiesData = await apiClient.sessions.getSessionStories(
        session.id
      );
      setStories(storiesData || []);
    } catch (error) {
      console.error("스토리 목록을 불러오는 중 오류가 발생했습니다.", error);
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (session && user && session.ownerId === user.id) {
      fetchJoinRequests();
    }
  }, [session, user]);

  useEffect(() => {
    if (session) {
      fetchStories();
    }
  }, [session]);

  // 참가 요청 처리 함수 수정
  const handleJoinRequest = async () => {
    if (!session || !isAuthenticated) return;

    try {
      setJoinRequestSending(true);
      await apiClient.sessions.joinSession(session.id);
      setHasJoinRequest(true);
      alert("참가 요청이 성공적으로 전송되었습니다.");
    } catch (error) {
      alert("참가 요청 전송 중 오류가 발생했습니다.");
    } finally {
      setJoinRequestSending(false);
    }
  };

  // 참가 요청 응답 함수 수정
  const handleRespondToRequest = async (requestId: string, accept: boolean) => {
    if (!session || !isAuthenticated) return;

    try {
      if (accept) {
        await apiClient.sessions.approveJoinRequest(session.id, requestId);
      } else {
        await apiClient.sessions.rejectJoinRequest(session.id, requestId);
      }

      // 요청 목록 새로고침
      fetchJoinRequests();
      // 수락한 경우 멤버 목록도 새로고침
      if (accept) {
        fetchMembers();
      }
    } catch (error) {
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!session || !isAuthenticated) return;

    if (!confirm("정말로 이 멤버를 제거하시겠습니까?")) {
      return;
    }

    try {
      await apiClient.sessions.removeMember(session.id, userId);
      fetchMembers();
    } catch (error) {
      alert("멤버 제거 중 오류가 발생했습니다.");
    }
  };

  const handleLeaveSession = async () => {
    if (!session || !isAuthenticated) return;

    if (!confirm("정말로 이 세션을 나가시겠습니까?")) {
      return;
    }

    try {
      await apiClient.sessions.leaveSession(session.id);
      router.push("/sessions");
    } catch (error) {
      alert("세션 나가기 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteSession = async () => {
    if (!session || !isAuthenticated) return;

    if (
      !confirm(
        "정말로 이 세션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    try {
      await apiClient.sessions.deleteSession(session.id);
      router.push("/sessions");
    } catch (error) {
      alert("세션 삭제 중 오류가 발생했습니다.");
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

  if (error || !session) {
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

  const isOwner = user && session.ownerId === user.id;
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
                {session.name}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>생성일: {formatDate(session.createdAt)}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {isOwner && (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/sessions/${session.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      편집
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSession}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </>
              )}
              {isMember && !isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLeaveSession}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  나가기
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {session.description && (
              <p className="text-[#33691E] mb-6">{session.description}</p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2" />
              <span>멤버 {session.memberCount}명</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <span>소유자: {session.owner.username}</span>
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
                  onClick={handleJoinRequest}
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

        <Tabs defaultValue="members">
          <TabsList className="mb-6">
            <TabsTrigger value="members">멤버</TabsTrigger>
            {isOwner && <TabsTrigger value="requests">참가 요청</TabsTrigger>}
            <TabsTrigger value="stories">스토리</TabsTrigger>
          </TabsList>

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
                              {member.user.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.role === SessionMemberRole.OWNER
                                ? "소유자"
                                : "멤버"}{" "}
                              • 가입일: {formatDate(member.joinedAt)}
                            </p>
                          </div>
                        </div>
                        {isOwner && member.userId !== user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.userId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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
                                {request.user.username}
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
                                onClick={() =>
                                  handleRespondToRequest(request.id, true)
                                }
                              >
                                <Check className="h-4 w-4 mr-1" />
                                수락
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                onClick={() =>
                                  handleRespondToRequest(request.id, false)
                                }
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
          <TabsContent value="stories">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#5D4037]">
                  스토리
                </CardTitle>
                {isMember && (
                  <Button asChild className="bg-[#33691E] hover:bg-[#1B5E20]">
                    <Link href={`/sessions/${session.id}/stories/create`}>
                      <Plus className="mr-2 h-4 w-4" />새 스토리 작성
                    </Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {storiesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#5D4037]" />
                  </div>
                ) : stories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">아직 스토리가 없습니다.</p>
                    {isMember && (
                      <Button
                        asChild
                        className="mt-4 bg-[#33691E] hover:bg-[#1B5E20]"
                      >
                        <Link href={`/sessions/${session.id}/stories/create`}>
                          <Plus className="mr-2 h-4 w-4" />첫 스토리 작성하기
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stories.map((story) => (
                      <Link
                        href={`/sessions/${session.id}/stories/${story.id}`}
                        key={story.id}
                      >
                        <div className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-[#5D4037]">
                              {story.title}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(story.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-[#33691E] line-clamp-2">
                            {story.content}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            작성자: {story.user?.username || "알 수 없음"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
