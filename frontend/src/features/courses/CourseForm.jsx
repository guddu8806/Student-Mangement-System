import { useState } from "react";
import { X } from "lucide-react";

function CourseForm({ isOpen, onClose, onSubmit, initialData = null, saving = false, error = "" }) {
  const [form, setForm] = useState(() => ({
    course_code: initialData?.course_code ?? "",
    course_name: initialData?.course_name ?? "",
    description: initialData?.description ?? "",
    credits: initialData?.credits ?? "",
    capacity: initialData?.capacity ?? 30,
  }));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      course_code: form.course_code.trim(),
      course_name: form.course_name.trim(),
      description: form.description.trim(),
      credits: Number(form.credits),
      capacity: Number(form.capacity) || 30,
    });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 id="course-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Course" : "Add Course"}
          </h2>
          <button onClick={onClose} className=" cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800"  aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Course Name <span className="text-rose-500">*</span>
            <input
              required
              type="text"
              placeholder="e.g. Data Structures & Algorithms"
              value={form.course_name}
              onChange={(e) => setForm({ ...form, course_name: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Course Code <span className="text-rose-500">*</span>
            <input
              required
              type="text"
              placeholder="e.g. CS201"
              value={form.course_code}
              onChange={(e) => setForm({ ...form, course_code: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
            <textarea
              rows={3}
              placeholder="Course overview, syllabus, prerequisites..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Credits <span className="text-rose-500">*</span>
              <input
                required
                type="number"
                min="1"
                step="1"
                placeholder="3"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Capacity (Seats) <span className="text-rose-500">*</span>
              <input
                required
                type="number"
                min="1"
                step="1"
                placeholder="30"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm font-normal outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : initialData ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CourseForm;
