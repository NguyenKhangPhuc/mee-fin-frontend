/**
 * PURPOSE:
 * API service for deleting a slot rating/feedback by ID.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (RatingDeletionPayload, Required): Object containing rating id and slotId.
 *
 * RETURNS:
 * - Promise<{ data: any | null; error: string | null }>
 */

import apiClient from "../index";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface RatingDeletionPayload {
  id: string;
  slotId: string;
}

export const deleteRating = async (
  payload: RatingDeletionPayload
): Promise<{
  data: any | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.delete<any>("/slot-rating/delete", {
      data: payload,
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to delete slot rating",
      };
    }
    return { data: null, error: "Failed to delete slot rating" };
  }
};

export default deleteRating;
