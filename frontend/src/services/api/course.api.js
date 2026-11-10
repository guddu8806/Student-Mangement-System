import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

// Create Course
export const createCourse = async (courseData) => {
    const response = await apiClient.post("/courses", courseData);
    return unwrap(response);
};

// Get All Courses
export const getAllCourses = async (params) => {
    const response = await apiClient.get("/courses", params ? { params } : {});
    return unwrap(response);
};

// Get Course By ID
export const getCourseById = async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return unwrap(response);
};

// Update Course
export const updateCourse = async (id, courseData) => {
    const response = await apiClient.put(`/courses/${id}`, courseData);
    return unwrap(response);
};

// Delete Course
export const deleteCourse = async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return unwrap(response);
};
