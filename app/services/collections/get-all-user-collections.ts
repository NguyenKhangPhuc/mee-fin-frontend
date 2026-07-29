/**
 * PURPOSE:
 * Fetches all vocabulary collections owned by the authenticated user.
 *
 * CONTEXT/PARENT FILE:
 * Extracted into app/services/collections/ as part of the vocabulary collections API layer.
 *
 * INPUTS / PARAMETERS:
 * None (reads user session token automatically via cookie / auth header).
 *
 * RETURNS:
 * Promise<{ data: VocabularyCollectionUncheckedCreateInput[] | null; error: string | null }>
 */

import axios from "axios";
import api from "..";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { ResponseError } from "@/app/types/error";

export const getAllUserCollections = async (): Promise<{
  data: VocabularyCollectionUncheckedCreateInput[] | null;
  error: string | null;
}> => {
  try {
    const result = await api.get<VocabularyCollectionUncheckedCreateInput[]>("/vocabulary-collection/user");
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch user collections",
      };
    }
    return { data: null, error: "Failed to fetch user collections" };
  }
};
