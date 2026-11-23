import apiClient from "./apiClient";

const unwrap = (res) => res.data.data;

export const getAllStudents = async (params) => {
    const res = await apiClient.get("/students", params ? { params } : {});
    return unwrap(res);
};

export const getStudentById = async (id) => {
    const res = await apiClient.get(`/students/${id}`);
    return unwrap(res);
};

export const createStudent = async (studentData) => {
    const res = await apiClient.post("/students", studentData);
    return unwrap(res);
};

export const updateStudent = async (id, studentData) => {
    const res = await apiClient.put(`/students/${id}`, studentData);
    return unwrap(res);
};

export const deleteStudent = async (id) => {
    const res = await apiClient.delete(`/students/${id}`);
    return unwrap(res);
};

export const notEnrolledStudents = async (params = {}) => {
    const resp = await apiClient.get(`/students/not_enrolled`, { params });
    return unwrap(resp);
};
