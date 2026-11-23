import { useState, useEffect, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import ActivityLogFilter from "../features/activityLogs/ActivityLogFilters";
import ActivityTable from "../features/activityLogs/ActivityLogTable";
import { useActivityLogs, useActivityFilterOptions } from "../hooks/queries/useActivityLogs";
import { useAuth } from "../context/AuthContext";

const ActivityLogs = () => {
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const currentUser = user;

  // Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [action, setAction] = useState("all");
  const [userId, setUserId] = useState(user?.id ? String(user.id) : "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const defaultUserId = currentUser?.id ? String(currentUser.id) : "";
  const activeUserId = userId || defaultUserId;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  // TanStack Query Hooks
  const { data: filterOptions = { users: [], actions: [] } } = useActivityFilterOptions();

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(action !== "all" && { action }),
    ...(activeUserId && { userId: activeUserId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  }), [currentPage, pageSize, debouncedSearch, action, activeUserId, startDate, endDate]);

  const { data: logsResponse, isLoading: loading, error: queryError } = useActivityLogs(queryParams);

  const error = queryError ? "Unable to load activity logs from server. Please try again." : "";
  const totalPages = logsResponse?.totalPages ?? 0;
  const totalCount = logsResponse?.total || 0;

  const logs = useMemo(() => {
    return (logsResponse?.logs || []).map((item) => {
      const timestamp = item.created_at ? new Date(item.created_at) : null;
      return {
        id: item.id,
        user: item.user_name || "System / Deleted User",
        email: item.user_email || "N/A",
        action: item.action || "ACTIVITY",
        entity: item.entity_type
          ? item.entity_type.charAt(0).toUpperCase() + item.entity_type.slice(1)
          : "General",
        description: item.description || "—",
        date: timestamp
          ? timestamp.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "—",
        time: timestamp
          ? timestamp.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
      };
    });
  }, [logsResponse?.logs]);

  const handleActionChange = (val) => {
    setAction(val);
    setCurrentPage(1);
  };

  const handleUserChange = (val) => {
    setUserId(val);
    setCurrentPage(1);
  };

  const handleStartDateChange = (val) => {
    setStartDate(val);
    setCurrentPage(1);
  };

  const handleEndDateChange = (val) => {
    setEndDate(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setAction("all");
    setUserId("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };
  console.log("Search Iteam: " , debouncedSearch);

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* <div>API Trigger Count: {apiCount}</div> */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}


        <ActivityLogFilter
          userRole={userRole}
          currentUser={currentUser}
          search={search}
          onSearchChange={setSearch}
          action={action}
          onActionChange={handleActionChange}
          userId={activeUserId}
          onUserChange={handleUserChange}
          startDate={startDate}
          onStartDateChange={handleStartDateChange}
          endDate={endDate}
          onEndDateChange={handleEndDateChange}
          filterOptions={filterOptions}
          onReset={handleResetFilters}
        />

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
            <div className="h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
          </div>
        ) : (
          <ActivityTable
            activities={logs}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
