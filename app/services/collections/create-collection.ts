/**
 * PURPOSE:
 * Creates a new vocabulary collection for the authenticated user.
 *
 * CONTEXT/PARENT FILE:
 * Extracted into app/services/collections/ as part of the vocabulary collections API layer.
 *
 * INPUTS / PARAMETERS:
 * - payload (CollectionCreationDto, Required): Object containing ownerId, name, languageId, description.
 *
 * RETURNS:
 * Promise<{ data: VocabularyCollectionUncheckedCreateInput | null; error: string | null }>
 */

import axios from "axios";
import api from "..";
import { VocabularyCollectionUncheckedCreateInput } from "@/app/types/collection";
import { ResponseError } from "@/app/types/error";

export interface CollectionCreationPayload {
  ownerId: string;
  name: string;
  languageId: string;
  description: string;
}

export const createCollection = async (
  payload: CollectionCreationPayload
): Promise<{
  data: VocabularyCollectionUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.post<VocabularyCollectionUncheckedCreateInput>(
      "/vocabulary-collection/create",
      payload
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to create collection",
      };
    }
    return { data: null, error: "Failed to create collection" };
  }
};
