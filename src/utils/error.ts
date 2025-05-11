import { ErrorResponse } from "@/types/error";
import axios from "axios";

export const handleApiError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error) && error.response) {
    return error.response.data as ErrorResponse;
  }
  throw error;
};
