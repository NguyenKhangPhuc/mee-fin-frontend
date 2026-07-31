/**
 * PURPOSE:
 * API service for fetching all ratings received by the current user.
 *
 * CONTEXT/PARENT FILE:
 * Used by rating history & user profile modules.
 *
 * RETURNS:
 * - Promise<{ data: SlotRatingUncheckedCreateInput[] | null; error: string | null }>
 */

import apiClient from "../index";
import { SlotRatingUncheckedCreateInput } from "@/app/types/ratings";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const getReceivedRatings = async (): Promise<{
  data: SlotRatingUncheckedCreateInput[] | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<SlotRatingUncheckedCreateInput[]>(
      "/slot-rating/rated"
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch received ratings",
      };
    }
    return { data: null, error: "Failed to fetch received ratings" };
  }
};

export default getReceivedRatings;
