import { Stats } from "@/types/stat";
import { ErrorResponse } from "@/types/error";
import { handleApiError } from "@/utils/error";
import axiosInstance from "@/utils/axios";

// 통계 정보 조회
export const getStats = async (): Promise<Stats | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<Stats>("/v1/stats");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
