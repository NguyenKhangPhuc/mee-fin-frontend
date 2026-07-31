/**
 * PURPOSE:
 * API service for fetching all ratings given by the current user.
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

export const getGivenRatings = async (): Promise<{
  data: SlotRatingUncheckedCreateInput[] | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.get<SlotRatingUncheckedCreateInput[]>(
      "/slot-rating/rater"
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch given ratings",
      };
    }
    return { data: null, error: "Failed to fetch given ratings" };
  }
};

export default getGivenRatings;
