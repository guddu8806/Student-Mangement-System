import { BookOpen, Pencil, Trash2 } from "lucide-react";

const CourseTable = ({ courses = [], loading = false, search = "", onEdit, onDelete, isUser }) => {
  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading courses...
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center p-12 text-center">
        <BookOpen size={32} className="text-slate-400" />
        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
          {search ? "No matching courses found" : "No courses in catalog yet"}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {search ? "Try a different search term." : "Add your first course to begin building the curriculum."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-5 py-3.5">Course</th>
            <th scope="col" className="px-5 py-3.5">Code</th>
            <th scope="col" className="px-5 py-3.5">Description</th>
            <th scope="col" className="px-5 py-3.5">Credits</th>
            <th scope="col" className="px-5 py-3.5">Seats</th>
            {isUser && <th scope="col" className="px-5 py-3.5 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {courses.map((course) => (
            <tr
              key={course.id}
              className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
            >
              <td className="whitespace-nowrap px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-xs font-bold text-white shadow-xs">
                    {(course.course_code || "CR").slice(0, 2).toUpperCase()}
                  </div> */}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{course.course_name}</p>
                    {/* <p className="text-xs text-slate-400">ID #{course.id}</p> */}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center rounded-md bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                  {course.course_code || "—"}
                </span>
              </td>
              <td className="max-w-sm px-5 py-4 text-slate-600 dark:text-slate-300">
                <p className="line-clamp-2">
                  {course.description || "No description provided."}
                </p>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                {course.credits ?? "—"} Credits
              </td>
              <td className="whitespace-nowrap px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                    course.available_seats === 0
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      : course.available_seats !== undefined && course.available_seats <= 5
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}
                >
                  {course.available_seats === 0
                    ? "Full (0 left)"
                    : course.available_seats !== undefined
                    ? `${course.available_seats}/${course.capacity || 30} left`
                    : `${course.capacity || 30} seats`}
                </span>
              </td>
              {isUser && (
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(course)}
                      aria-label={`Edit ${course.course_name}`}
                      className="cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(course)}
                      aria-label={`Delete ${course.course_name}`}
                      className=" cursor-pointer rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseTable;
