import { useQuery } from "@tanstack/react-query";
import {
  getReportAnalytics,
  getReportRoster,
  downloadReportCsvDirect,
} from "../../services/api/report.api";

export const REPORT_KEYS = {
  all: ["reports"],
  analytics: ["reports", "analytics"],
  roster: (params) => ["reports", "roster", params],
};

export const useReportAnalytics = () => {
  return useQuery({
    queryKey: REPORT_KEYS.analytics,
    queryFn: getReportAnalytics,
  });
};

export const useReportRoster = (params = {}) => {
  return useQuery({
    queryKey: REPORT_KEYS.roster(params),
    queryFn: () => getReportRoster(params),
  });
};

export { downloadReportCsvDirect };
