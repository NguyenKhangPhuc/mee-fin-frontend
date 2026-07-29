/**
 * PURPOSE:
 * Updates an existing vocabulary collection by ID.
 *
 * CONTEXT/PARENT FILE:
 * Extracted into app/services/collections/ as part of the vocabulary collections API layer.
 *
 * INPUTS / PARAMETERS:
 * - payload (CollectionUpdatePayload, Required): Object containing id, ownerId, name, languageId, description.
 *
 * RETURNS:
 * Promise<{ data: VocabularyCollectionUncheckedCreateInput | null; error: string | null }>
 */

import axios from "axios";
import api from "..";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { ResponseError } from "@/app/types/error";

export interface CollectionUpdatePayload {
  id: string;
  ownerId: string;
  name: string;
  languageId: string;
  description: string;
}

export const updateCollection = async (
  payload: CollectionUpdatePayload
): Promise<{
  data: VocabularyCollectionUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.post<VocabularyCollectionUncheckedCreateInput>(
      "/vocabulary-collection/update",
      payload
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to update collection",
      };
    }
    return { data: null, error: "Failed to update collection" };
  }
};
