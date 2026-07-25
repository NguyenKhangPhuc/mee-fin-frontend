import { UserLanguageUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

const formatErrorString = (msg: any, fallback: string): string => {
  if (typeof msg === 'string') return msg;
  if (Array.isArray(msg)) {
    return msg.map((m: any) => (typeof m === 'object' && m ? m.message || JSON.stringify(m) : String(m))).join('; ');
  }
  if (typeof msg === 'object' && msg !== null) {
    return msg.message || JSON.stringify(msg);
  }
  return fallback;
};

export const getAllUserLanguages = async (userId: string): Promise<{
    data: UserLanguageUncheckedCreateInput[] | null;
    error: string | null;
}> => {
    try {
        const result = await api.get<UserLanguageUncheckedCreateInput[]>(`/user-languages/user/${userId}`);
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: formatErrorString(error.response?.data?.message, "Fail to fetched the user languages") };
        }
        return { data: null, error: "Fail to fetched the user languages" };
    }
};