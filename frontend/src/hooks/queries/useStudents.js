import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  notEnrolledStudents,
} from "../../services/api/student.api";

export const STUDENT_KEYS = {
  all: ["students"],
  notEnrolled: ["students", "not_enrolled"],
  detail: (id) => ["students", id],
};

// Hook to fetch all students
export const useStudents = (params) => {
  return useQuery({
    queryKey: params ? [...STUDENT_KEYS.all, params] : STUDENT_KEYS.all,
    queryFn: async () => {
      const response = await getAllStudents(params);
      return Array.isArray(response) ? response : (response?.students || []);
    },
  });
};

// Hook to fetch students not enrolled in any course
export const useNotEnrolledStudents = (params) => {
  return useQuery({
    queryKey: params ? [...STUDENT_KEYS.notEnrolled, params] : STUDENT_KEYS.notEnrolled,
    queryFn: async () => {
      const response = await notEnrolledStudents(params);
      return Array.isArray(response) ? response : (response?.students || []);
    },
  });
};

// Hook to fetch single student by ID
export const useStudent = (id) => {
  return useQuery({
    queryKey: STUDENT_KEYS.detail(id),
    queryFn: () => getStudentById(id),
    enabled: Boolean(id),
  });
};

// Hook to create a student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentData) => createStudent(studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.notEnrolled });
    },
  });
};

// Hook to update a student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, studentData }) => updateStudent(id, studentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.notEnrolled });
    },
  });
};

// Hook to delete a student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STUDENT_KEYS.notEnrolled });
    },
  });
};
