import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";

export const deleteUserSlot = async ({ slotId }: { slotId: string }):
    Promise<{ error: string | null }> => {
    console.log(slotId)
    try {
        await api.post('/slots/delete', {
            id: slotId,
        })
        return { error: null }
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            console.log(error)
            return { error: formatErrorString(error.response?.data?.message, "Failed to delete slot") };
        }
        return { error: "Failed to delete slot" };
    }
}