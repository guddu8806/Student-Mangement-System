import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
} from "../../services/api/enrollment.api";

export const ENROLLMENT_KEYS = {
  all: ["enrollments"],
  detail: (id) => ["enrollments", id],
};

// Hook to fetch enrollments
export const useEnrollments = (params) => {
  return useQuery({
    queryKey: params ? [...ENROLLMENT_KEYS.all, params] : ENROLLMENT_KEYS.all,
    queryFn: async () => {
      const response = await getAllEnrollments(params);
      return Array.isArray(response) ? response : (response?.enrollments || []);
    },
  });
};

// Hook to fetch single enrollment by ID
export const useEnrollment = (id) => {
  return useQuery({
    queryKey: ENROLLMENT_KEYS.detail(id),
    queryFn: () => getEnrollmentById(id),
    enabled: Boolean(id),
  });
};

// Hook to create enrollment
export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentData) => createEnrollment(enrollmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

// Hook to delete enrollment
export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ENROLLMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
