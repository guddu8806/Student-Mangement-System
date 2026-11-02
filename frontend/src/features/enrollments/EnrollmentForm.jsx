import { useState } from "react";
import { X } from "lucide-react";

function EnrollmentForm({
  isOpen,
  onClose,
  onSubmit,
  students = [],
  courses = [],
  saving = false,
  error = "",
}) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    onSubmit({
      student_id: Number(studentId),
      course_id: Number(courseId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Enroll Student in Course
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Select Student <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">-- Choose a Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.first_name } {s.last_name } ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Select Course <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="">-- Choose a Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_code ? `[${c.course_code}] ` : ""}{c.course_name} ({c.credits ?? 3} Credits)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !studentId || !courseId}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EnrollmentForm;
