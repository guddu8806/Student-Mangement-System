import { ClipboardList, Trash2 } from "lucide-react";

function EnrollmentTable({ enrollments = [], loading = false, search = "", onDelete }) {
  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading enrollments...
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center p-12 text-center">
        <ClipboardList size={32} className="text-slate-400" />
        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
          {search ? "No matching enrollments found" : "No enrollments yet"}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {search ? "Try searching with a different term." : "Enroll students in available courses to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-5 py-3.5">Student</th>
            <th scope="col" className="px-5 py-3.5">Course</th>
            <th scope="col" className="px-5 py-3.5">Credits</th>
            <th scope="col" className="px-5 py-3.5">Enrollment Date</th>
            <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {enrollments.map((item) => {
            const studentName = item.student_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || `Student #${item.student_id}`;
            const courseName = item.course_name || `Course #${item.course_id}`;

            return (
              <tr
                key={item.enrollment_id || item.id}
                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{studentName}</p>
                      {item.email && <p className="text-xs text-slate-400">{item.email}</p>}
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{courseName}</p>
                      {item.course_code && (
                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                          {item.course_code}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                    {item.credits ?? 3} Credits
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                  {item.enrollment_date
                    ? new Date(item.enrollment_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(item.enrollment_id || item.id)}
                    aria-label={`Remove enrollment for ${studentName}`}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EnrollmentTable;
