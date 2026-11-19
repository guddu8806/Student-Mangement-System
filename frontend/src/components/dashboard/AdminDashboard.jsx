import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import { Megaphone } from "lucide-react";
import { getDashboardCourses, getDashboardEnrollments, getDashboardStats, getDashboardStudents,} from "../../services/api/dashboard.api";
import { useAuth } from "../../context/AuthContext";
import WelcomeSection from "./WelcomeSection";
import AnnouncementModal from "../notifications/AnnouncementModal";

function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const {user} = useAuth();

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [statsData, studentsData, coursesData, enrollmentsData] = await Promise.all([getDashboardStats(),getDashboardStudents(),getDashboardCourses(),getDashboardEnrollments(),]);
        if (!active) return;

        setStats({
          students: Number(studentsData.length),
          courses: Number(coursesData.length),
          enrollments: Number(enrollmentsData.length)
        });
        setStudents(
          statsData.recentStudents
        );
        setEnrollments(enrollmentsData);
      } catch {
        if (active) {
          setError("Unable to Fetch the data !")
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const monthlyEnrollments = Object.values(
    enrollments.reduce((months, enrollment) => {
      if (!enrollment.enrollment_date) return months;

      const date = new Date(enrollment.enrollment_date);
      if (Number.isNaN(date.getTime())) return months;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      months[key] ??= {
        month: date.toLocaleString("en-US", { month: "short", year: "2-digit" }),
        enrollments: 0,
        timestamp: date.getFullYear() * 12 + date.getMonth(),
      };
      months[key].enrollments += 1;
      return months;
    }, {})
  )
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(({ month, enrollments: count }) => ({ month, enrollments: count }));

  const courseEnrollments = Object.values(
    enrollments.reduce((courses, enrollment) => {
      const courseId = enrollment.course_id;
      const name = enrollment.course_name || courses[courseId]?.name || `Course #${courseId}`;
      courses[courseId] ??= {
        name,
        course_code: enrollment.course_code || `C-${courseId}`,
        enrollments: 0,
      };
      courses[courseId].enrollments += 1;
      return courses;
    }, {})
  ).sort((a, b) => b.enrollments - a.enrollments);

  const metricCards = [
    { label: "Total Students", value: stats.students, link: "/students" },
    { label: "Active Courses", value: stats.courses, link: "/courses" },
    { label: "Total Enrollments", value: stats.enrollments, link: "/enrollments" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100 sm:px-6 lg:px-4">
      <div className="mx-auto max-w-7xl">
        {error && (
          <p role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        <WelcomeSection
          user={user}
          action={
            <button
              type="button"
              onClick={() => setIsAnnouncementOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 transition cursor-pointer"
            >
              <Megaphone size={15} /> Broadcast Announcement
            </button>
          }
        />

        <div className="flex items-center justify-between mt-4 mb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            System Overview
          </h2>
        </div>

        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3 mb-2">
          {metricCards.map(({ label, value, link }) => (
            <Link to={link}  key={label} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-violet-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-violet-500/40">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label}
                </p>
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {loading ? "…" : value.toLocaleString()}
              </p>
            </Link>
          ))}
        </section>

        {/* Analytics Charts */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Enrollments Over Time
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Monthly registration trajectory
            </p>
            <div className="h-72">
              {monthlyEnrollments.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyEnrollments}>
                    <defs>
                      <linearGradient id="enrollmentFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      fill="url(#enrollmentFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  {loading ? "Loading…" : "No enrollment data available."}
                </p>
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Enrollments by Course
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Total students currently enrolled in each course
            </p>
            <div className="h-72">
              {courseEnrollments.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseEnrollments}
                    layout="vertical"
                    margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis type="number" allowDecimals={false} stroke="#64748b" fontSize={12} />
                    <YAxis
                      type="category"
                      dataKey="course_code"
                      width={100}
                      tickLine={false}
                      axisLine={false}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(value) => [value, "Students enrolled"]}
                      cursor={{ fill: "#8b5cf6", fillOpacity: 0.08 }}
                    />
                    <Bar
                      dataKey="enrollments"
                      name="Students enrolled"
                      fill="#7c3aed"
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                    >
                      <LabelList dataKey="enrollments" position="right" fontSize={12} fill="#64748b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  {loading ? "Loading…" : "No enrollment data available."}
                </p>
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Recent Students
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest students registered into EduCore
              </p>
            </div>
            <Link to="/students" className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700">
              Manage Students
            </Link>
          </div>

          {students.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((student) => {
                  const name = [student.first_name, student.last_name].filter(Boolean).join(" ")
                  return (
                    <li key={student.id ?? student.email} className="flex items-center justify-between px-4 py-3 transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {student.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {student.phone || "No phone"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Loading…" : "No students found."}
            </p>
          )}
        </section>

        <AnnouncementModal
          isOpen={isAnnouncementOpen}
          onClose={() => setIsAnnouncementOpen(false)}
        />
      </div>
    </main>
  );
}

export default AdminDashboard;
