import type {
  CreateStoryRequest,
  Story,
  UpdateStoryRequest,
} from "@/types/session";
import axiosInstance from "./axios-config";
import axios from "axios";

export const story = {
  // 스토리 생성
  createStory: async (data: CreateStoryRequest): Promise<Story> => {
    try {
      const response = await axiosInstance.post<Story>(`/v1/stories`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 상세 조회
  getStory: async (storyId: string): Promise<Story> => {
    try {
      const response = await axiosInstance.get<Story>(`/v1/stories/${storyId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 업데이트
  updateStory: async (
    storyId: string,
    data: UpdateStoryRequest
  ): Promise<Story> => {
    try {
      const response = await axiosInstance.put<Story>(
        `/v1/stories/${storyId}`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as Story;
      }
      throw error;
    }
  },

  // 스토리 삭제
  deleteStory: async (storyId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/stories/${storyId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },
};
