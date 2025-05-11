import type { User } from "@/types/user";
import axiosInstance from "../utils/axios";
import axios from "axios";

// 현재 사용자 정보 조회
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>("/v1/my");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as User;
    }
    throw error;
  }
};
