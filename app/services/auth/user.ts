import api from "..";

export const getUser = async () => {
    const response = await api.get('/auth/user');
    return response.data;
}