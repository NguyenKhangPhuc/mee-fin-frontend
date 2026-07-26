import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";

export const bookUserSlot = async ({ slotId, exchangeUserId }: { slotId: string, exchangeUserId: string }):
    Promise<{ error: string | null }> => {
    try {
        await api.post('/slots/book', {
            slotId,
            exchangeUserId
        })
        return { error: null }
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { error: formatErrorString(error.response?.data?.message, "Failed to create slot") };
        }
        return { error: "Failed to create slot" };
    }
}