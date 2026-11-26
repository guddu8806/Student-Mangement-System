import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

export const createEnrollment = async (enrollmentData) => {
    const response = await apiClient.post("/enrollment", enrollmentData);
    return unwrap(response);
};

export const getAllEnrollments = async (params) => {
    const response = await apiClient.get("/enrollment", { params });
    return unwrap(response);
};

export const getEnrollmentById = async (id) => {
    const response = await apiClient.get(`/enrollment/${id}`);
    return unwrap(response);
};

export const deleteEnrollment = async (id) => {
    const response = await apiClient.delete(`/enrollment/${id}`);
    return unwrap(response);
};
