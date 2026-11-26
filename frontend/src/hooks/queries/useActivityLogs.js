import { useQuery } from "@tanstack/react-query";
import {
  getActivityLogs,
  getActivityFilterOptions,
} from "../../services/api/activityLog.api";

export const ACTIVITY_LOG_KEYS = {
  all: ["activityLogs"],
  list: (params) => ["activityLogs", "list", params],
  filters: ["activityLogs", "filters"],
};

export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ACTIVITY_LOG_KEYS.list(params),
    queryFn: async () => {
      const data = await getActivityLogs(params);
      return data;
    },
  });
};

export const useActivityFilterOptions = () => {
  return useQuery({
    queryKey: ACTIVITY_LOG_KEYS.filters,
    queryFn: async () => {
      const data = await getActivityFilterOptions();
      return data || { users: [], actions: [] };
    },
  });
};
