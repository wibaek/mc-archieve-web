import type { Story, StoryBulkResponse } from "@/types/story";
import { ErrorResponse } from "@/types/error";
import { handleApiError } from "@/utils/error";
import axiosInstance from "../utils/axios";

// 스토리 생성
export const createStory = async (
  sessionId: number,
  image: Blob,
  caption: string | null
): Promise<Story | ErrorResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    if (caption !== null) {
      formData.append("caption", caption);
    }
    const response = await axiosInstance.post<Story>(
      `/v1/sessions/${sessionId}/stories`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 스토리 벌크 생성
export const createStories = async (
  sessionId: number,
  images: Blob[]
): Promise<StoryBulkResponse | ErrorResponse> => {
  try {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("files", image);
    });
    const response = await axiosInstance.post<StoryBulkResponse>(
      `/v1/sessions/${sessionId}/stories/bulk`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 스토리 상세 조회
export const getStory = async (
  storyId: string
): Promise<Story | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Story>(`/v1/stories/${storyId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션별 스토리 조회
export const getStoriesBySession = async (
  sessionId: number
): Promise<Story[] | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Story[]>(
      `/v1/sessions/${sessionId}/stories`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
