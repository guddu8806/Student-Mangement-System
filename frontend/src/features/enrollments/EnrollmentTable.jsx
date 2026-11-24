import { useEffect, useState } from "react";
import { ClipboardList, Trash2, Clock, AlertCircle } from "lucide-react";

function checkDropStatus(dateStr, now) {
  if (!dateStr) return { eligible: true, text: "Eligible to drop" };
  const enrollDate = new Date(dateStr);
  if (isNaN(enrollDate.getTime())) return { eligible: true, text: "Eligible to drop" };

  const diffMs = now - enrollDate.getTime();
  const limitMs = 24 * 60 * 60 * 1000;

  if (diffMs > limitMs) {
    return { eligible: false, text: "Drop window expired" };
  }

  const remainingMs = limitMs - diffMs;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    eligible: true,
    text: hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`,
  };
}

function EnrollmentTable({enrollments = [],loading = false,search = "",onDelete,isStudent = false,}) {
  const [currentTime , setCurrentTime] = useState(() => Date.now());
  useEffect(() =>{
    const timer = setInterval(() => setCurrentTime(Date.now()) , 60000);
    return () => clearInterval(timer);
  },[]);

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
          {search
            ? "Try searching with a different term."
            : isStudent
            ? "You have not enrolled in any courses yet. Browse courses to get started!"
            : "Enroll students in available courses to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            {!isStudent && <th scope="col" className="px-5 py-3.5">Student</th>}
            <th scope="col" className="px-5 py-3.5">Course</th>
            <th scope="col" className="px-5 py-3.5">Credits</th>
            <th scope="col" className="px-5 py-3.5">Enrollment Date</th>
            {isStudent && <th scope="col" className="px-5 py-3.5">24h Drop Policy</th>}
            <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {enrollments.map((item) => {
            const studentName =
              item.student_name ||
              `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
              `Student #${item.student_id}`;
            const courseName = item.course_name || `Course #${item.course_id}`;
            const dropStatus = checkDropStatus(item.enrollment_date, currentTime);

            return (
              <tr
                key={item.enrollment_id || item.id}
                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                {!isStudent && (
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {studentName}
                        </p>
                        {item.student_email && (
                          <p className="text-xs text-slate-400">{item.student_email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                )}

                <td className="whitespace-nowrap px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {courseName}
                    </p>
                    {item.course_code && (
                      <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                        {item.course_code}
                      </span>
                    )}
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                    {item.credits ?? 3} Credits
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                  {item.enrollment_date
                    ? new Date(item.enrollment_date).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </td>

                {isStudent && (
                  <td className="whitespace-nowrap px-5 py-4">
                    {dropStatus.eligible ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <Clock size={12} />
                        {dropStatus.text}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <AlertCircle size={12} />
                        Drop window closed
                      </span>
                    )}
                  </td>
                )}

                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {isStudent ? (
                    dropStatus.eligible ? (
                      <button
                        type="button"
                        onClick={() => onDelete(item.enrollment_id || item.id)}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                        title="Drop this course within the 24-hour window"
                      >
                        <Trash2 size={13} />
                        Drop Course
                      </button>
                    ) : (
                      <span
                        className="text-xs text-slate-400 dark:text-slate-500 italic"
                        title="Enrollments cannot be dropped after 24 hours"
                      >
                        Non-droppable
                      </span>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => onDelete(item.enrollment_id || item.id)}
                      aria-label={`Remove enrollment for ${studentName}`}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                      title="Admin Delete Enrollment"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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
