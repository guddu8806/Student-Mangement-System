import apiClient from "./apiClient";

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

export const getAllStudents = async (params) => {
    const res = await apiClient.get("/students", { params });
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
