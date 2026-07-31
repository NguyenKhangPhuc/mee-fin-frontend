/**
 * PURPOSE:
 * API service for creating a new slot rating/feedback for a completed meeting slot.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (RatingCreationPayload, Required): Object containing slotId, raterId, ratedUserId, rating, feedback.
 *
 * RETURNS:
 * - Promise<{ data: SlotRatingUncheckedCreateInput | null; error: string | null }>
 */

import apiClient from "../index";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface RatingCreationPayload {
  slotId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  feedback: string;
}

export const createRating = async (
  payload: RatingCreationPayload
): Promise<{
  data: SlotRatingUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<SlotRatingUncheckedCreateInput>(
      "/slot-rating/create",
      payload
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to create slot rating",
      };
    }
    return { data: null, error: "Failed to create slot rating" };
  }
};

export default createRating;
