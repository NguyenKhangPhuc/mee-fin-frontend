import { SafeUser } from "@/app/types/authentication";
import api from "..";
import { ResponseError } from "@/app/types/error";
import axios from "axios";
import { UserRole } from "@/app/types/enum";

export const updateUserRole = async (data: { userId: string; role: UserRole }): Promise<{
    data: SafeUser | null;
    error: string | null;
}> => {
    try {
        const result = await api.post<SafeUser>('/users/admin/update-role', data);
        return { data: result.data, error: null };
    } catch (error) {
        if (axios.isAxiosError<ResponseError>(error)) {
            return { data: null, error: error.response?.data?.message ?? "Failed to update user role" };
        }
        return { data: null, error: "Failed to update user role" };
    }
};
