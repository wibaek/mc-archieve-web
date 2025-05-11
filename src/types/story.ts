export interface StoryBulkResponse {
  stories: Story[];
  isSuccess: boolean;
}

// 스토리
export interface Story {
  id: number;
  caption: string;
  imageUrl: string;
  createdBy: {
    nickname: string;
    profileImageUrl: string | null;
  };
}
