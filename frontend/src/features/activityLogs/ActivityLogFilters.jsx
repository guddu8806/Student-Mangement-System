import React from "react";
import {
  Filter,
  Search,
  RotateCcw,
  X,
} from "lucide-react";

const STUDENT_ACTIONS = [
  { value: "ENROLLMENT_CREATE", label: "Enrollment Created" },
  { value: "PROFILE_DELETED", label: "Profile Deleted" },
  { value: "PROFILE_UPDATED", label: "Profile Updated" },
  { value: "ENROLLMENT_DROP", label: "Drop Enrollment" },
];

const ADMIN_ACTIONS = [
  { value: "COURSE_CREATE", label: "Course Created" },
  { value: "COURSE_UPDATE", label: "Course Updated" },
  { value: "ENROLLMENT_DROP", label: "Enrollment Dropped" },
  { value: "PROFILE_DELETED", label: "Profile Deleted" },
  { value: "PROFILE_UPDATED", label: "Profile Updated" },
  { value: "STUDENT_CREATE", label: "Student Created" },
  { value: "STUDENT_UPDATE", label: "Student Updated" },
  { value: "STUDENT_DELETE", label: "Student Deleted" },
];

const ActivityLogFilter = ({
  userRole = "student",
  search = "",
  onSearchChange = () => {},
  action = "all",
  onActionChange = () => {},
  userId = "all",
  onUserChange = () => {},
  startDate = "",
  onStartDateChange = () => {},
  endDate = "",
  onEndDateChange = () => {},
  filterOptions = { users: [], actions: [] },
  onReset = () => {},
}) => {
  const isAdmin = userRole === "admin";
  const availableActions = isAdmin ? ADMIN_ACTIONS : STUDENT_ACTIONS;

  const hasActiveFilters = Boolean(
    (search && search.trim() !== "") ||
    action !== "all" ||
    (isAdmin && userId !== "all") ||
    startDate ||
    endDate
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600 dark:text-indigo-400" />

          <h2 className="font-semibold text-gray-900 dark:text-white">
            Filter Activities
          </h2>

          {hasActiveFilters && (
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              Active Filters
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search
          </label>

          <div className="relative">
            <Search
              className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={17}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search activities..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-9 text-sm text-gray-900 transition focus:border-indigo-500  focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute  right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Activity Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Activity Type
          </label>

          <select
            value={action}
            onChange={(e) => onActionChange(e.target.value)}
            className="w-full rounded-xl border cursor-pointer border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500  focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
          >
            <option value="all">All Activities</option>
            {availableActions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Performed By (Only visible to admin) */}
        {isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Performed By
            </label>

            <select
              value={userId}
              onChange={(e) => onUserChange(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500  focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
            >
              <option value="all">All Users</option>
              {filterOptions.users &&
                filterOptions.users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role || "user"})
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Date Range */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date Range
          </label>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-xs text-gray-900 transition focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
              title="End Date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogFilter;
