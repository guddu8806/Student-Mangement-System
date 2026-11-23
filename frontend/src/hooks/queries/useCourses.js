import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../services/api/course.api";

export const COURSE_KEYS = {
  all: ["courses"],
  detail: (id) => ["courses", id],
};



// Hook to fetch all courses
export const useCourses = (params) => {
  return useQuery({
    queryKey: params ? [...COURSE_KEYS.all, params] : COURSE_KEYS.all,
    queryFn: async () => {
      const response = await getAllCourses(params);
      return Array.isArray(response) ? response : (response?.courses || []);
    },
  });
};

// Hook to fetch a single course by ID
export const useCourse = (id) => {
  return useQuery({
    queryKey: COURSE_KEYS.detail(id),
    queryFn: () => getCourseById(id),
    enabled: Boolean(id),
  });
};

// Hook to create a course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseData) => createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
};

// Hook to update a course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, courseData }) => updateCourse(id, courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
};

// Hook to delete a course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.all });
    },
  });
};
