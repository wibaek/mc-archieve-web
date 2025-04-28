import type { User } from "@/types/user";
import axiosInstance from "./axios-config";
import axios from "axios";

export const user = {
  // 내 정보 조회
  getMyInfo: async (): Promise<User> => {
    try {
      const response = await axiosInstance.get<User>("/v1/my");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as User;
      }
      throw error;
    }
  },
};
