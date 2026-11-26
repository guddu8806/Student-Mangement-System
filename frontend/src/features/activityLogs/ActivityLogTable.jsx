import { ChevronLeft, ChevronRight, Activity } from "lucide-react";

const ActivityTable = ({ activities = [],totalCount = 0,currentPage = 1,totalPages = 1,pageSize = 10,onPageChange = () => {},}) => {
  const getActionStyle = (action = "") => {
    const act = action.toUpperCase();
    if (act.includes("BROADCAST") || act.includes("ANNOUNCEMENT")) {
      return "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400";
    }
    if (act.includes("CREATE")) {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    }
    if (act.includes("UPDATE")) {
      return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    }
    if (act.includes("DELETE") || act.includes("DROP")) {
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    }
    return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
  };
  const formatActionName = (action = "") => {
    const act = (action || "").toUpperCase();
    if (act === "ANNOUNCEMENT_BROADCAST") {
      return "Announcement Broadcast";
    }
    if (act === "PROFILE_UPDATED" || act === "ADMIN_UPDATED") {
      return "Profile Updated";
    }
    if (act === "PROFILE_DELETED" || act === "ADMIN_DELETED") {
      return "Profile Deleted";
    }
    if (act === "STUDENT_CREATE") {
      return "Student Created";
    }
    if (act === "STUDENT_UPDATE" || act === "STUDENT_UPDATED") {
      return "Student Updated";
    }
    if (act === "STUDENT_DELETE" || act === "STUDENT_DELETED") {
      return "Student Deleted";
    }
    if (act === "ENROLLMENT_CREATE") {
      return "Enrollment Created";
    }
    if (act === "ENROLLMENT_DROP") {
      return "Enrollment Dropped";
    }
    if (act === "COURSE_CREATE") {
      return "Course Created";
    }
    if (act === "COURSE_UPDATE") {
      return "Course Updated";
    }
    if (act === "COURSE_DELETE") {
      return "Course Deleted";
    }
    return action.replaceAll("_", " ");
  };

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const getPageNumbers = () => {
    if(totalPages <= 1) return [];
    if(totalPages <= 5){
      return Array.from({length:totalPages} , (_,i) => i+1);
    }
    const pages = [];
    if(currentPage > 2) pages.push(1);
    if(currentPage > 3) pages.push("...");

    const start = Math.max(1 , currentPage-1);
    const end = Math.min(totalPages , currentPage+1);
    for(let i = start; i <= end; i++) pages.push(i);

    if(currentPage < totalPages - 2) pages.push("...");
    if(currentPage < totalPages -1) pages.push(totalPages);
    return [...new Set(pages)];
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Recent Activities
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Audit trail of administrative and student actions
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Activity</th>
              <th className="px-5 py-3.5">Entity</th>
              <th className="px-5 py-3.5">Description</th>
              <th className="px-5 py-3.5">Date & Time</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                    <Activity size={24} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                    No activity logs found
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Try adjusting your filters, searching for another term, or clearing date ranges.
                  </p>
                </td>
              </tr>
            ) : (
              activities.map((log) => (
                <tr
                  key={log.id}
                  className="transition hover:bg-gray-50/70 dark:hover:bg-gray-800/40"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.user}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {log.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${getActionStyle(
                        log.action
                      )}`}
                    >
                      {formatActionName(log.action)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{log.entity}</span>
                    </div>
                  </td>

                  <td className="max-w-md px-5 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {log.description}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {log.date}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {log.time}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {startItem}–{endItem} of {totalCount} records
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg cursor-pointer border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((pageItem, index) =>
            pageItem === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-xs text-slate-400"
              >
                ...
              </span>
            ) : (
              <button
                key={pageItem}
                type="button"
                onClick={() => onPageChange(pageItem)}
                className={`min-w-8 cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  pageItem === currentPage
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {pageItem}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="rounded-lg border cursor-pointer border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityTable;
