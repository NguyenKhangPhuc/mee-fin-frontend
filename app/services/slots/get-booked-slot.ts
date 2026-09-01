import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";
import { SlotUncheckedCreateInput } from "@/app/types";

export const getBookedSlot = async ({ slotId }: { slotId: string }):
    Promise<{ data: SlotUncheckedCreateInput | null, error: string | null }> => {
    try {
        const result = await api.get<SlotUncheckedCreateInput>(`/slots/${slotId}`)
        return { data: result.data, error: null }
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to get booked slot") };
        }
        return { data: null, error: "Failed to get booked slot" };
    }
}