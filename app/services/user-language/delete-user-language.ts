import { UserLanguagesDeleteDto, UserLanguageUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";
import { formatErrorString } from "@/app/helpers/error-formatter";

export const deleteUserLanguage = async (
  payload: UserLanguagesDeleteDto
): Promise<{
  data: UserLanguageUncheckedCreateInput | null;
  error: string | null;
}> => {
  try {
    const result = await api.post<UserLanguageUncheckedCreateInput>(
      "/user-languages/delete",
      payload
    );
    return { data: result.data, error: null };
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      return {
        data: null,
        error: formatErrorString(
          error.response?.data?.message,
          "Failed to delete user language"
        ),
      };
    }
    return { data: null, error: "Failed to delete user language" };
  }
};
