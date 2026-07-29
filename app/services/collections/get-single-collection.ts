/**
 * PURPOSE:
 * Fetches a single vocabulary collection by ID along with its associated words.
 *
 * CONTEXT/PARENT FILE:
 * Extracted into app/services/collections/ as part of the vocabulary collections API layer.
 *
 * INPUTS / PARAMETERS:
 * - id (string, Required): The collection ID to retrieve.
 *
 * RETURNS:
 * Promise<{ data: VocabularyCollectionUncheckedCreateInput | null; error: string | null }>
 */

import axios from "axios";
import api from "..";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { ResponseError } from "@/app/types/error";

export const getSingleCollection = async (
  id: string
): Promise<{
  data: VocabularyCollectionUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.get<VocabularyCollectionUncheckedCreateInput>(`/vocabulary-collection/${id}`);
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to fetch collection",
      };
    }
    return { data: null, error: "Failed to fetch collection" };
  }
};
