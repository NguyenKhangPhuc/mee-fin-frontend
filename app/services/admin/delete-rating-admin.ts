import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";

export const deleteRatingAdmin = async (ratingId: string): Promise<{
    data: any | null;
    error: string | null;
}> => {
    try {
        const result = await api.post('/slot-rating/admin/delete', { id: ratingId });
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to delete rating" };
        }
        return { data: null, error: "Failed to delete rating" };
    }
};
