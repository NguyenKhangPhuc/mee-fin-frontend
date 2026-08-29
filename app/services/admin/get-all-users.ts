import { SafeUser } from "@/app/types/authentication";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";
import { PaginationMeta } from "../profile/get-all-user";

export const getAllUsers = async (query: { page: number; limit: number }): Promise<{
    data: { data: SafeUser[]; meta: PaginationMeta } | null;
    error: string | null;
}> => {
    try {
        const result = await api.get<{ data: SafeUser[]; meta: PaginationMeta }>('/users/admin/all', {
            params: query,
        });
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to fetch users" };
        }
        return { data: null, error: "Failed to fetch users" };
    }
};
