import { useEffect, useState } from "react";
// import { BookOpen, GraduationCap, Users } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { getDashboardCourses, getDashboardEnrollments, getDashboardStats, getDashboardStudents, } from "../services/api/dashboard.api";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [statsData, studentsData, coursesData, enrollmentsData] =
          await Promise.all([
            getDashboardStats(),
            getDashboardStudents(),
            getDashboardCourses(),
            getDashboardEnrollments(),
          ]);

        if (!active) return;

        const studentRows = Array.isArray(studentsData) ? studentsData : [];
        const courseRows = Array.isArray(coursesData) ? coursesData : [];
        const enrollmentRows = Array.isArray(enrollmentsData) ? enrollmentsData : [];

        setStats({
          students: Number(statsData?.totalStudents ?? studentRows.length),
          courses: Number(statsData?.totalCourses ?? courseRows.length),
          enrollments: enrollmentRows.length,
        });
        setStudents(
          Array.isArray(statsData?.recentStudents)
            ? statsData.recentStudents
            : studentRows.slice(0, 5)
        );
        setEnrollments(enrollmentRows);
      } catch (requestError) {
        if (active) {
          setError(
            requestError?.response?.data?.message ||
            requestError?.message ||
            "Could not load dashboard data."
          );
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
      const courseId = enrollment.course_id ;
      const name = courses[courseId]?.name || `Course #${courseId}`;
      courses[courseId] ??= {
        name,
        course_code: enrollment.course_code ,
        enrollments: 0,
      };
      courses[courseId].enrollments += 1;
      return courses;
    }, {})
  ).sort((a, b) => b.enrollments - a.enrollments);

  const metricCards = [
    { label: "Students", value: stats.students, },
    { label: "Courses", value: stats.courses,  },
    { label: "Enrollments", value: stats.enrollments, },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {error && (
          <p role="alert" className="mb-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        <section aria-label="Summary" className="grid gap-4 sm:grid-cols-3">
          {metricCards.map(({ label, value, }) => (
            <article
              key={label}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                {/* <Icon size={20} className="text-violet-600 dark:text-violet-400" /> */}
              </div>
              <p className="mt-3 text-3xl font-bold">
                {loading ? "…" : value.toLocaleString()}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">Enrollments over time</h2>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="enrollments"
                      stroke="#7c3aed"
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

          <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Enrollments by course</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Number of students enrolled in each course
            </p>
            <div className="h-72">
              {courseEnrollments.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={courseEnrollments}
                    layout="vertical"
                    margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#94a3b8" opacity={0.25} />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="course_code"
                      width={140}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
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
                      barSize={24}
                    >
                      <LabelList dataKey="enrollments" position="right" />
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

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Recent students
            </h2>

            <Link
              to="/students"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              View More
            </Link>
          </div>
          {students.length ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {students.map((student) => (
                <li
                  key={student.id ?? student.email}
                  className="flex flex-wrap items-center justify-between gap-2 py-3"
                >
                  <span className="font-medium">
                    {[student.first_name, student.last_name].filter(Boolean).join(" ") ||
                      "Student"}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {student.email || "No email"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loading ? "Loading…" : "No students found."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;