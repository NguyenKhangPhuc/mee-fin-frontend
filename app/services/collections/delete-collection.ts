/**
 * PURPOSE:
 * Deletes a vocabulary collection by ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted into app/services/collections/ as part of the vocabulary collections API layer.
 *
 * INPUTS / PARAMETERS:
 * - payload ({ id: string }, Required): Object containing the collection id to delete.
 *
 * RETURNS:
 * Promise<{ data: any | null; error: string | null }>
 */

import axios from "axios";
import api from "..";
import { ResponseError } from "@/app/types/error";

export interface CollectionDeletePayload {
  id: string;
}

export const deleteCollection = async (
  payload: CollectionDeletePayload
): Promise<{
  data: any | null;
  error: string | null;
}> => {
  try {
    const result = await api.delete("/vocabulary-collection/delete", { data: payload });
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to delete collection",
      };
    }
    return { data: null, error: "Failed to delete collection" };
  }
};
