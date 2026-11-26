import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi, register as registerApi } from "../../services/api/auth.api";
import { useAuth as useAuthContext } from "../../context/AuthContext";

export const AUTH_KEYS = {
  all: ["auth"],
  session: ["auth", "session"],
};

export const useLogin = (options = {}) => {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (data, variables, context) => {
      if (data?.user && data?.token) {
        login(data.user, data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

export const useRegister = (options = {}) => {
  const queryClient = useQueryClient();
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: (userData) => registerApi(userData),
    onSuccess: (data, variables, context) => {
      if (data?.user && data?.token) {
        login(data.user, data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthContext();

  return () => {
    logout();
    queryClient.clear();
  };
};
