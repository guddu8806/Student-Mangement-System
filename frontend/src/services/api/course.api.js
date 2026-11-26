import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

export const createCourse = async (courseData) => {
    const response = await apiClient.post("/courses", courseData);
    return unwrap(response);
};

export const getAllCourses = async (params) => {
    const response = await apiClient.get("/courses", params ? { params } : {});
    return unwrap(response);
};

export const getCourseById = async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return unwrap(response);
};

export const updateCourse = async (id, courseData) => {
    const response = await apiClient.put(`/courses/${id}`, courseData);
    return unwrap(response);
};

export const deleteCourse = async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return unwrap(response);
};
