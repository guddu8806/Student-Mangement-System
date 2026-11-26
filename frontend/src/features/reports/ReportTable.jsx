import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function ReportTable({data = [],currentPage = 1,totalPages = 1, onPageChange, pageSize = 8,totalFilteredCount = 0,}) {

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3.5">Student</th>
              <th className="px-6 py-3.5">Contact</th>
              <th className="px-6 py-3.5">Enrolled Course</th>
              <th className="px-6 py-3.5 text-center">Credits</th>
              <th className="px-6 py-3.5">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((row) => (
              <tr
                key={row.enrollment_id}
                className="transition-colors hover:bg-violet-50/30 dark:hover:bg-gray-800/40"
              >
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2.5">
                    <span>{row.student_name }</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                  <div>{row.student_email}</div>

                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">

                    <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                      {row.course_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-gray-800 dark:text-slate-300">
                    {row.credits}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {row.enrollment_date
                      ? new Date(row.enrollment_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-3 text-gray-400 dark:bg-gray-800">
                      <Search size={22} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                      No enrollments found
                    </h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Try adjusting your date range, search query, or selecting another course.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalFilteredCount > pageSize && (
        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-3.5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
