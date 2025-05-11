import type { SessionJoinRequest } from "@/types/session";
import { ErrorResponse } from "@/types/error";
import { handleApiError } from "@/utils/error";
import axiosInstance from "../utils/axios";

// 세션 참가 요청 목록 조회
export const getSessionJoinRequests = async (
  sessionId: string
): Promise<{ items: SessionJoinRequest[] } | ErrorResponse> => {
  try {
    const response = await axiosInstance.get<{
      applications: SessionJoinRequest[];
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
  sessionId: string,
  applicationId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.post(
      `/v1/sessions/${sessionId}/join-applications/${applicationId}/approve`
    );
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 참가 요청 거절
export const rejectJoinRequest = async (
  sessionId: string,
  applicationId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.post(
      `/v1/sessions/${sessionId}/join-applications/${applicationId}/reject`
    );
  } catch (error) {
    return handleApiError(error);
  }
};

// 멤버 제거 (소유자용)
export const removeMember = async (
  sessionId: string,
  userId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.delete(`/v1/sessions/${sessionId}/members/${userId}`);
  } catch (error) {
    return handleApiError(error);
  }
};

// 세션 나가기 (멤버용)
export const leaveSession = async (
  sessionId: string
): Promise<void | ErrorResponse> => {
  try {
    await axiosInstance.delete(`/v1/sessions/${sessionId}/leave`);
  } catch (error) {
    return handleApiError(error);
  }
};
