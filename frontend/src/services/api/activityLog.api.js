import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

export const getActivityLogs = async (params) => {
    const res = await apiClient.get("/activity-logs", { params });
    return unwrap(res);
};

export const getActivityFilterOptions = async () => {
    const res = await apiClient.get("/activity-logs/filters");
    return unwrap(res);
};

export const getActivityLogById = async (id) => {
    const res = await apiClient.get(`/activity-logs/${id}`);
    return unwrap(res);
};
