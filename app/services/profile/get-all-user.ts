import { ProfileUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const getAllUserProfileWithLanguagesAndSlots = async (): Promise<{
    data: ProfileUncheckedCreateInput[] | null;
    error: string | null;
}> => {
    try {
        const result = await api.get<ProfileUncheckedCreateInput[]>('/profile/languages-slots');
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to fetch all user information" };
        }
        return { data: null, error: "Failed to fetch all user information" };
    }
};