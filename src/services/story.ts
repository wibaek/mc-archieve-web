import type { Story, StoryBulkResponse } from "@/types/story";
import axiosInstance from "./axios-config";
import axios from "axios";

// 스토리 생성
export const createStory = async (
  sessionId: number,
  image: Blob,
  caption: string | null
): Promise<Story> => {
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

// 스토리 벌크 생성
export const createStories = async (
  sessionId: number,
  images: Blob[]
): Promise<StoryBulkResponse> => {
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
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw error;
  }
};

// 스토리 상세 조회
export const getStory = async (storyId: string): Promise<Story> => {
  try {
    const response = await axiosInstance.get<Story>(`/v1/stories/${storyId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Story;
    }
    throw error;
  }
};

export const getStoriesBySession = async (
  sessionId: number
): Promise<Story[]> => {
  try {
    const response = await axiosInstance.get<Story[]>(
      `/v1/sessions/${sessionId}/stories`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Story[];
    }
    throw error;
  }
};
