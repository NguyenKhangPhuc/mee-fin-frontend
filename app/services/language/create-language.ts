import { LanguageCreationDto, LanguageUncheckedCreateInput } from "@/app/types/language";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";
import { formatErrorString } from "@/app/helpers/error-formatter";

export const createLanguage = async (
  payload: LanguageCreationDto
): Promise<{
  data: LanguageUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.post<LanguageUncheckedCreateInput>(
      "/languages/create",
      payload
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: formatErrorString(
          error.response?.data?.message,
          "Failed to create language"
        ),
      };
    }
    return { data: null, error: "Failed to create language" };
  }
};
