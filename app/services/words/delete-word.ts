/**
 * PURPOSE:
 * API service for deleting a vocabulary word from a collection by ID.
 *
 * CONTEXT/PARENT FILE:
 * Used by app/collection/components/WordsManagementModal.tsx.
 *
 * INPUTS / PARAMETERS:
 * - payload (WordDeletionPayload, Required): Object containing word id and collectionId.
 *
 * RETURNS:
 * - Promise<{ data: any | null; error: string | null }>
 */

import apiClient from "../index";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export interface WordDeletionPayload {
  id: string;
  collectionId: string;
}

export const deleteWord = async (
  payload: WordDeletionPayload
): Promise<{
  data: any | null;
  error: string | null;
}> => {
  try {
    const response = await apiClient.delete<any>("/vocabulary-word/delete", {
      data: payload,
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: error.response?.data?.message ?? "Failed to delete word",
      };
    }
    return { data: null, error: "Failed to delete word" };
  }
};

export default deleteWord;
