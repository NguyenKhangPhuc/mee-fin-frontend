/**
 * PURPOSE:
 * API service for fetching all user profiles with language exchange preferences,
 * available slots, and rating statistics (rating_avg, rating_count). Supports pagination (page, limit).
 *
 * CONTEXT/PARENT FILE:
 * Used by app/community/page.tsx Server Component and app/community/CommunityClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - query (GetProfilesQuery, Optional): Object containing page and limit.
 *
 * RETURNS:
 * - Promise<{ data: PaginatedResponse<ProfileWithScore> | null; error: string | null }>
 */

import { ProfileWithScore } from "@/app/types/profile";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface GetProfilesQuery {
  page?: number;
  limit?: number;
}

export const getAllUserProfileWithLanguagesAndSlots = async (
  query?: GetProfilesQuery
): Promise<{
  data: PaginatedResponse<ProfileWithScore> | null;
  error: string | null;
}> => {
  try {
    const result = await api.get<PaginatedResponse<ProfileWithScore>>(
      "/profile/languages-slots",
      {
        params: query,
      }
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch all user information",
      };
    }
    return { data: null, error: "Failed to fetch all user information" };
  }
};