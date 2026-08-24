import { LanguageDeleteDto, LanguageUncheckedCreateInput } from "@/app/types/language";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";
import { formatErrorString } from "@/app/helpers/error-formatter";

export const deleteLanguage = async (
  payload: LanguageDeleteDto
): Promise<{
  data: LanguageUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.delete<LanguageUncheckedCreateInput>(
      "/languages/delete",
      { data: payload }
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: formatErrorString(
          error.response?.data?.message,
          "Failed to delete language"
        ),
      };
    }
    return { data: null, error: "Failed to delete language" };
  }
};
