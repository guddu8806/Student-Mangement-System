export default function TopCourses({ data = [], loading = false, title = "Top Courses", description = "Courses categorized by highest enrollments" }) {
  const topFiveCourses = [...data].sort((a, b) => b.total_enrolled - a.total_enrolled).slice(0, 5);
  console.log("Top Courses: ", topFiveCourses);
  if (loading) {
    return (
      <div className="rounded-2xl border p-6 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          Loading report...
        </p>
      </div>
    );
  }

  // Empty data state
  if (!topFiveCourses || topFiveCourses.length === 0) {
    return (
      <div className="rounded-2xl border p-6 dark:border-gray-800">
        <h2 className="text-lg font-bold dark:text-white">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          No course enrollment data available.
        </p>
      </div>
    );
  }

  const totalEnrollments = topFiveCourses.reduce(
    (total, course) =>
      total + (course.total_enrolled ?? course.enrollments ?? 0),
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>

        <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
          {topFiveCourses.length} Courses
        </span>

      </div>



      {/* Course Enrollment Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm text-left">

          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">

              <th className="py-3 pr-4 font-semibold">
                Course Code
              </th>

              <th className="py-3 px-4 font-semibold">
                Course Name
              </th>

              <th className="py-3 pl-4 font-semibold text-right">
                Enrolled Students
              </th>

            </tr>
          </thead>

          <tbody>
            {topFiveCourses.map((course, index) => {

              const enrolled =
                course.total_enrolled ?? course.enrollments ?? 0;

              return (
                <tr
                  key={course.course_id || index}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                >

                  <td className="py-4 pr-4 font-semibold text-violet-600 dark:text-violet-400">
                    {course.course_code}
                  </td>

                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    {course.course_name}
                  </td>

                  <td className="py-4 pl-4 text-right font-semibold text-gray-900 dark:text-white">
                    {enrolled}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-row justify-between rounded-xl bg-violet-50 dark:bg-violet-950/30 p-4 px-6 mb-6">
          <p className="text-sm font-bold mt-2 text-violet-600 dark:text-violet-400">
            Total Enrollments
          </p>

          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalEnrollments}
          </p>

        </div>

      </div>
    </div>
  );
}
