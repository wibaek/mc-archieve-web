"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Session, Story } from "@/types/session";
import StoryGrid from "./StoryGrid";

interface SessionTabsProps {
  session: Session;
  stories: Story[];
  storiesLoading: boolean;
  isOwner: boolean;
}

export default function SessionTabs({
  session,
  stories,
  storiesLoading,
  isOwner,
}: SessionTabsProps) {
  return (
    <Tabs defaultValue="stories" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="stories">스토리</TabsTrigger>
        <TabsTrigger value="members">멤버</TabsTrigger>
        {isOwner && <TabsTrigger value="requests">참가 요청</TabsTrigger>}
      </TabsList>
      <TabsContent value="stories">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#5D4037]">
              스토리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StoryGrid stories={stories} loading={storiesLoading} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="members">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#5D4037]">
              멤버 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">멤버 목록이 여기에 표시됩니다.</p>
          </CardContent>
        </Card>
      </TabsContent>
      {isOwner && (
        <TabsContent value="requests">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#5D4037]">
                참가 요청
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">참가 요청이 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
}
