/**
 * PURPOSE:
 * API service for fetching current authenticated user's slots (both provided and booked exchange slots).
 * Supports pagination (page, limit) and filters (status, date order).
 *
 * CONTEXT/PARENT FILE:
 * Used by app/history/page.tsx Server Component and app/history/HistoryClient.tsx.
 *
 * INPUTS / PARAMETERS:
 * - query (SlotPaginationQuery, Optional): Object containing page, limit, status, and order.
 *
 * RETURNS:
 * - Promise<{ data: PaginatedResponse<SlotUncheckedCreateInput> | null; error: string | null }>
 */

import { SlotUncheckedCreateInput } from "@/app/types";
import { SlotStatus } from "@/app/types/enum";
import { PaginatedResponse } from "@/app/services/profile/get-all-user";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface SlotPaginationQuery {
  page?: number;
  limit?: number;
  status?: SlotStatus;
  order?: "asc" | "desc";
}

export const getAllUserSlots = async (
  query?: SlotPaginationQuery
): Promise<{
  data: PaginatedResponse<SlotUncheckedCreateInput> | null;
  error: string | null;
}> => {
  try {
    const result = await api.get<PaginatedResponse<SlotUncheckedCreateInput>>(
      "/slots/user",
      {
        params: query,
      }
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch user slots",
      };
    }
    return { data: null, error: "Failed to fetch user slots" };
  }
};