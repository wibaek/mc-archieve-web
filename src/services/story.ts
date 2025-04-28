import type { Story } from "@/types/story";
import axiosInstance from "./axios-config";
import axios from "axios";

// 스토리 생성
export const createStory = async (
  sessionId: number,
  image: Blob,
  caption: string | null
): Promise<Story> => {
  try {
    const response = await axiosInstance.post<Story>(
      `/v1/sessions/${sessionId}/stories`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as Story;
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
