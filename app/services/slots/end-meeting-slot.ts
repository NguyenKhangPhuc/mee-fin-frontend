import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";

export const forceEndMeeting = async ({ slotId }: { slotId: string }):
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
            return { error: formatErrorString(error.response?.data?.message, "Failed to end the meeting slot") };
        }
        return { error: "Failed to end the meeting slot" };
    }
}