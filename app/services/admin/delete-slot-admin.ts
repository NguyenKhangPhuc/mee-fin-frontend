import { SlotUncheckedCreateInput } from "@/app/types";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const deleteSlotAdmin = async (slotId: string): Promise<{
    data: SlotUncheckedCreateInput | null;
    error: string | null;
}> => {
    try {
        const result = await api.post<SlotUncheckedCreateInput>('/slots/admin/delete', { id: slotId });
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to delete slot" };
        }
        return { data: null, error: "Failed to delete slot" };
    }
};
