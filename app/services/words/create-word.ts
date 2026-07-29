/**
 * PURPOSE:
 * API service for creating a new vocabulary word inside a collection.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/collection/components/WordsManagementModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (WordCreationPayload, Required): Object containing collectionId, term, meaning, and optional example/note.
 *
 * RETURNS:
 * - Promise<{ data: VocabularyWordUncheckedCreateInput | null; error: string | null }>
 */

import apiClient from "../index";
import { VocabularyWordUncheckedCreateInput } from "@/app/types/word";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface WordCreationPayload {
  collectionId: string;
  term: string;
  meaning: string;
  example?: string;
  note?: string;
  slotId?: string;
}

export const createWord = async (
  payload: WordCreationPayload
): Promise<{
  data: VocabularyWordUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.post<VocabularyWordUncheckedCreateInput>(
      "/vocabulary-word/create",
      payload
    );
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to create word",
      };
    }
    return { data: null, error: "Failed to create word" };
  }
};

export default createWord;
