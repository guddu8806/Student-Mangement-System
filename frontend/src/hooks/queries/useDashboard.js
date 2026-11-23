import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getDashboardCourses,
  getDashboardEnrollments,
} from "../../services/api/dashboard.api";

export const DASHBOARD_KEYS = {
  stats: ["dashboard", "stats"],
  courses: ["dashboard", "courses"],
  enrollments: (params) => (params ? ["dashboard", "enrollments", params] : ["dashboard", "enrollments"]),
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.stats,
    queryFn: getDashboardStats,
  });
};

export const useDashboardCourses = () => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.courses,
    queryFn: getDashboardCourses,
  });
};

export const useDashboardEnrollments = (params) => {
  return useQuery({
    queryKey: DASHBOARD_KEYS.enrollments(params),
    queryFn: () => getDashboardEnrollments(params),
  });
};
