import { Link } from "react-router-dom";

export default function ProfileAcademicInfo({ enrollments = [] }) {
  const enrolledCoursesCount = enrollments.length;
  const totalCredits = enrollments.reduce(
    (sum, item) => sum + Number(item.credits || 0),
    0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Academic Information
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your enrolled courses and credit progress
          </p>
        </div>
        <Link
          to="/courses"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
        >
          Browse Courses &rarr;
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Enrolled Courses
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
            {enrolledCoursesCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Credits
          </p>
          <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
            {totalCredits}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Enrolled Courses
        </h3>

        {enrollments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              You are not enrolled in any courses yet.
            </p>
            <Link
              to="/courses"
              className="mt-2 inline-block rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {enrollments.map((item) => (
              <div
                key={item.id ?? item.enrollment_id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 transition hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/30"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {item.course_code && (
                      <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
                        {item.course_code}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.course_name}
                    </h4>
                  </div>
                </div>

                <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-2xs dark:bg-slate-900 dark:text-violet-300">
                  {item.credits} Credits
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
