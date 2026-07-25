import { LanguageUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const getAllLanguages = async (): Promise<{
    data: LanguageUncheckedCreateInput[] | null;
    error: string | null;
}> => {
    try {
        const result = await api.get<LanguageUncheckedCreateInput[]>('/languages');
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to fetch languages" };
        }
        return { data: null, error: "Failed to fetch languages" };
    }
};