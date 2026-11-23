import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  deleteByUserId,
} from "../../services/api/auth.api";

export const PROFILE_KEYS = {
  all: ["profile"],
  current: ["profile", "current"],
};

// Hook to fetch the current user's profile
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: PROFILE_KEYS.current,
    queryFn: getProfile,
    ...options,
  });
};

// Hook to update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData) => updateProfile(userData),
    onSuccess: (updatedData) => {
      queryClient.setQueryData(PROFILE_KEYS.current, updatedData);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

// Hook to delete the current user's own account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Hook to delete user by ID (admin operation)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => deleteByUserId(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
