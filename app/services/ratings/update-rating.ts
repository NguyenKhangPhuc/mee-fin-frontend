/**
 * PURPOSE:
 * API service for updating an existing slot rating/feedback.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (RatingUpdatePayload, Required): Object containing rating id, slotId, raterId, ratedUserId, rating, feedback, displayName.
 *
 * RETURNS:
 * - Promise<{ data: SlotRatingUncheckedCreateInput | null; error: string | null }>
 */

import apiClient from "../index";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface RatingUpdatePayload {
  id: string;
  slotId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  feedback: string;
  displayName: string;
}

export const updateRating = async (
  payload: RatingUpdatePayload
): Promise<{
  data: SlotRatingUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<SlotRatingUncheckedCreateInput>(
      "/slot-rating/update",
      payload
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to update slot rating",
      };
    }
    return { data: null, error: "Failed to update slot rating" };
  }
};

export default updateRating;
