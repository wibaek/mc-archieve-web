import { ErrorResponse } from "@/types/error";
import { handleApiError } from "@/utils/error";
import axiosInstance from "../utils/axios";
import { SessionJoinApplication } from "@/types/sessionMember";

// 세션 참가 요청 목록 조회
export const getSessionJoinRequests = async (
  sessionId: string
): Promise<{ items: SessionJoinApplication[] } | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<{
      applications: SessionJoinApplication[];
    }>(`/v1/sessions/${sessionId}/join-applications`);
    return { items: response.data.applications };
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 참가 요청 보내기
export const requestJoinSession = async (
  sessionId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.post(`/v1/sessions/${sessionId}/join`);
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 참가 요청 승인
export const acceptJoinRequest = async (
  applicationId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.post(`/v1/join-applications/${applicationId}/approve`);
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 참가 요청 거절
export const rejectJoinRequest = async (
  applicationId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.post(`/v1/join-applications/${applicationId}/reject`);
  } catch (error) {
    return handleApiError(error);
  }
};
