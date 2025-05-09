"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Edit, Trash2 } from "lucide-react";
import type { Session } from "@/types/session";

interface SessionHeaderProps {
  session: Session;
  isOwner: boolean;
}

export default function SessionHeader({
  session,
  isOwner,
}: SessionHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden mb-8">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-[#5D4037]">
            {session.name}
          </CardTitle>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              생성일: {session.startDate && formatDate(session.startDate)}
            </span>
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
              <Button variant="destructive" size="sm" onClick={() => {}}>
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500">
          <div className="mt-2 text-sm text-gray-500">
            <span>소유자: {session.owner?.nickname || "알 수 없음"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
