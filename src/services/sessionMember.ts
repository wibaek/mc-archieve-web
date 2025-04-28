import type { SessionJoinRequest } from "@/types/session";
import axiosInstance from "./axios-config";
import axios from "axios";

export const sessionMember = {
  // 세션 참가 요청 목록 조회
  getSessionJoinRequests: async (
    sessionId: string
  ): Promise<{ items: SessionJoinRequest[] }> => {
    try {
      const response = await axiosInstance.get<{
        applications: SessionJoinRequest[];
      }>(`/v1/sessions/${sessionId}/join-applications`);
      return { items: response.data.applications };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { items: error.response.data as SessionJoinRequest[] };
      }
      throw error;
    }
  },

  // 세션 참가 요청 보내기
  requestJoinSession: async (sessionId: string): Promise<void> => {
    try {
      await axiosInstance.post(`/v1/sessions/${sessionId}/join`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 참가 요청 승인
  acceptJoinRequest: async (
    sessionId: string,
    applicationId: string
  ): Promise<void> => {
    try {
      await axiosInstance.post(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/approve`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 참가 요청 거절
  rejectJoinRequest: async (
    sessionId: string,
    applicationId: string
  ): Promise<void> => {
    try {
      await axiosInstance.post(
        `/v1/sessions/${sessionId}/join-applications/${applicationId}/reject`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 멤버 제거 (소유자용)
  removeMember: async (sessionId: string, userId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/sessions/${sessionId}/members/${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },

  // 세션 나가기 (멤버용)
  leaveSession: async (sessionId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/sessions/${sessionId}/leave`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      throw error;
    }
  },
};
