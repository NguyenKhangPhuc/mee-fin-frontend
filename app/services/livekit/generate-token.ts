import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";

export const generateToken = async ({ slotId }: { slotId: string }):
    Promise<{ data: string | null, error: string | null }> => {
    try {
        const token = await api.post<{ token: string }>('/livekit/generate-token', {
            slotId,
        })
        return { data: token.data.token, error: null }
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to generate token") };
        }
        return { data: null, error: "Failed to generate token" };
    }
}