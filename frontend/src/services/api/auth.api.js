import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

export const register = async (userData) => {
    const res = await apiClient.post("/auth/register", userData);
    return unwrap(res);
};

export const login = async (userData) => {
    const res = await apiClient.post("/auth/login", userData);
    return unwrap(res);
};

export const getProfile = async () => {
    const res = await apiClient.get("/auth/profile");
    return unwrap(res);
};

export const updateProfile = async (userData) => {
    const res = await apiClient.put("/auth/profile", userData);
    return unwrap(res);
};

export const deleteAccount = async () => {
    const res = await apiClient.delete("/auth/profile");
    return unwrap(res);
};

export const deleteByUserId = async (userId) => {
    const res = await apiClient.delete(`/auth/users/${userId}`);
    return unwrap(res);
};
