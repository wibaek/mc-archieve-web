// 스토리 정보
export interface Story {
  id: number;
  caption: string;
  imageUrl: string;
  createdBy: {
    nickname: string;
    profileImageUrl: string | null;
  };
}

export interface StoryBulkResponse {
  stories: Story[];
  isSuccess: boolean;
}
