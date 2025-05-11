"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Story } from "@/types/story";

import Image from "next/image";

interface StoryGridProps {
  stories: Story[];
  loading: boolean;
}

export default function StoryGrid({ stories, loading }: StoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-[300px]">
            <CardContent className="p-6">
              <Skeleton className="h-[200px] w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">아직 등록된 스토리가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Card key={story.id} className="h-[300px]">
          <CardContent className="p-6">
            <div className="relative h-[200px] w-full mb-4">
              <Image
                src={story.imageUrl}
                alt="스토리"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <p className="text-sm text-gray-700 mb-2">{story.caption}</p>
            <div className="flex items-center gap-2">
              {story.createdBy.profileImageUrl && (
                <div className="relative w-6 h-6">
                  <Image
                    src={story.createdBy.profileImageUrl}
                    alt={story.createdBy.nickname}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500">
                {story.createdBy.nickname}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
