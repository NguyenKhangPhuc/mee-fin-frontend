import { SlotUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const getUserSlotsAdmin = async (userId: string): Promise<{
    data: SlotUncheckedCreateInput[] | null;
    error: string | null;
}> => {
    try {
        const result = await api.get<SlotUncheckedCreateInput[]>(`/slots/admin/user/${userId}`);
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to fetch user slots" };
        }
        return { data: null, error: "Failed to fetch user slots" };
    }
};
