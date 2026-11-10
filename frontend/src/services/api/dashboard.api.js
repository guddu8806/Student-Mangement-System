import apiClient from "./apiClient";

const unwrap = (response) => response.data.data;

export const getDashboardStats = async () => {
    const response = await apiClient.get("/dashboard/stats");
    return unwrap(response);
};

export const getDashboardStudents = async () => {
    const response = await apiClient.get("/dashboard/students");
    return unwrap(response);
};

export const getDashboardCourses = async () => {
    const response = await apiClient.get("/dashboard/courses");
    return unwrap(response);
};

export const getDashboardEnrollments = async () => {
    const response = await apiClient.get("/dashboard/enrollments");
    return unwrap(response);
};