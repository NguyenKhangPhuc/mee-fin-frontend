import { ResponseError } from "@/app/types/error";
import axios from "axios";
import api from ".."
import { formatErrorString } from "@/app/helpers/error-formatter";
import { SlotUncheckedCreateInput } from "@/app/types";

interface DBTime {
    serverNow: number
}

export const getCurrentDBTime = async ():
    Promise<{ data: DBTime | null, error: string | null }> => {
    try {
        const result = await api.get<DBTime>(`/slots/current`)
        return { data: result.data, error: null }
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            console.log(error)
            return { data: null, error: formatErrorString(error.response?.data?.message, "Failed to get current time") };
        }
        return { data: null, error: "Failed to get current time" };
    }
}