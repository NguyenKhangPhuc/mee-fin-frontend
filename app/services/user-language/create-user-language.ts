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

export interface CreateUserLanguageDto {
    userId: string;
    languageId: string;
    proficiency: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    timezone?: string;
}

export const createUserLanguage = async (data: CreateUserLanguageDto): Promise<{
    data: UserLanguageUncheckedCreateInput | null;
    error: string | null;
}> => {
    try {
        const result = await api.post<UserLanguageUncheckedCreateInput>('/user-languages/create', data);
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {

            return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to create user language") };
        }

        return { data: null, error: "Failed to create user language" };
    }
};
