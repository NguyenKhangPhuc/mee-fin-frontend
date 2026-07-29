/**
 * PURPOSE:
 * API service for updating an existing vocabulary word inside a collection.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/collection/components/WordsManagementModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (WordUpdatePayload, Required): Object containing word id, collectionId, term, meaning, and optional example/note.
 *
 * RETURNS:
 * - Promise<{ data: VocabularyWordUncheckedCreateInput | null; error: string | null }>
 */

import apiClient from "../index";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface WordUpdatePayload {
  id: string;
  collectionId: string;
  term: string;
  meaning: string;
  example?: string;
  note?: string;
  slotId?: string;
}

export const updateWord = async (
  payload: WordUpdatePayload
): Promise<{
  data: VocabularyWordUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<VocabularyWordUncheckedCreateInput>(
      "/vocabulary-word/update",
      payload
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to update word",
      };
    }
    return { data: null, error: "Failed to update word" };
  }
};

export default updateWord;
