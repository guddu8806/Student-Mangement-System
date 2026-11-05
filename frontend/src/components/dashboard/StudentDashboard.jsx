import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Trash2 } from "lucide-react";
import { getAllCourses } from "../../services/api/course.api";
import { getAllEnrollments, deleteEnrollment } from "../../services/api/enrollment.api";

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

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    async function loadStudentData() {
      try {
        const [coursesData, enrollmentsData] = await Promise.all([
          getAllCourses(),
          getAllEnrollments(),
        ]);
        if (!active) return;
        setCourses(coursesData);
        setEnrollments(enrollmentsData);
      } catch (err) {
        if (active) {
          setError("Failed to load student data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadStudentData();
    return () => {
      active = false;
    };
  }, []);

  const handleDrop = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to drop this course? Note: Courses can only be dropped within 24 hours of enrollment.")) {
      return;
    }
    setError("");
    try {
      await deleteEnrollment(enrollmentId);
      setEnrollments((prev) => prev.filter((e) => (e.id ?? e.enrollment_id) !== enrollmentId));
    } catch (err) {
      setError("Failed to drop the course.");
    }
  };

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id || e.id));
  const enrolledCoursesCount = enrollments.length;
  const availableCourses = courses.filter((c) => !enrolledCourseIds.has(c.id));

  // Compute total enrolled credits
  const totalCredits = enrollments.reduce((acc, curr) => {
    const cred = Number(curr.credits || curr.course_credits || 0);
    return acc + cred;
  }, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        <section className="flex flex-row mb-4">
          <div className="w-1/2 mr-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Enrolled Courses
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {loading ? "…" : enrolledCoursesCount}
            </p>
          </div>
          <div className=" w-1/2 ml-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-violet-300 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Credits
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {loading ? "…" : totalCredits}
            </p>
          </div>
        </section>

        <section className="rounded-2xl mb-4 border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                My Active Courses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Courses you are actively enrolled in (can be dropped within 24 hours)
              </p>
            </div>
            <Link to="/enrollments" className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400">
              View all enrollments &rarr;
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading your courses…</p>
          ) : enrollments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                You have not enrolled in any courses yet.
              </p>
              <Link
                to="/courses"
                className="mt-3 inline-block rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700"
              >
                Explore Available Courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((item) => {
                const enrollmentId = item.id ?? item.enrollment_id;
                const dropStatus = checkDropStatus(item.enrollment_date, currentTime);

                return (
                  <div
                    key={enrollmentId}
                    className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
                          {item.course_code || "COURSE"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Enrolled
                        </span>
                      </div>

                      <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                        {item.course_name || `Course #${item.course_id}`}
                      </h3>

                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          {item.enrollment_date
                            ? new Date(item.enrollment_date).toLocaleDateString()
                            : "Recent"}
                        </span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400">
                          {item.credits ? `${item.credits} Credits` : ""}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {dropStatus.eligible ? (
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            {dropStatus.text}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Drop window expired
                          </span>
                        )}

                        {dropStatus.eligible && (
                          <button
                            type="button"
                            onClick={() => handleDrop(enrollmentId)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                          >
                            <Trash2 size={12} />
                            Drop
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {availableCourses.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Available Courses to Explore
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Expand your skills and earn credits with new subjects
                </p>
              </div>
              <Link
                to="/courses"
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
              >
                View all courses &rarr;
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition hover:border-violet-300 dark:border-slate-800"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {course.course_code}
                      </span>
                      <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                        {course.credits} Credits
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-white">
                      {course.course_name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {course.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-4 pt-2">
                    <Link
                      to="/courses"
                      className="block w-full rounded-lg bg-violet-50 py-2 text-center text-xs font-semibold text-violet-700 transition hover:bg-violet-600 hover:text-white dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-600 dark:hover:text-white"
                    >
                      View & Enroll
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

export default StudentDashboard;
