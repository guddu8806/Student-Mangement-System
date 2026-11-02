import apiClient from "./apiClient";

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

// Create Enrollment
export const createEnrollment = async (enrollmentData) => {
    const response = await apiClient.post("/enrollment", enrollmentData);
    return unwrap(response);
};

// Get All Enrollments
export const getAllEnrollments = async (params) => {
    const response = await apiClient.get("/enrollment", { params });
    return unwrap(response);
};

// Get Enrollment By ID
export const getEnrollmentById = async (id) => {
    const response = await apiClient.get(`/enrollment/${id}`);
    return unwrap(response);
};

// Delete Enrollment
export const deleteEnrollment = async (id) => {
    const response = await apiClient.delete(`/enrollment/${id}`);
    return unwrap(response);
};
