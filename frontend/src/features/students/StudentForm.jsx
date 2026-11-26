import { useState } from "react";
import { X } from "lucide-react";

function StudentForm({ isOpen, onClose, onSubmit, initialData = null, saving = false, error = "" }) {
  const [form, setForm] = useState(() => ({
    first_name: initialData?.first_name || initialData?.firstName || "",
    last_name: initialData?.last_name || initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  }));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Student Profile" : "Add New Student"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close modal"
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
              First Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Aanya"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Last Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Sharma"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="email"
              placeholder="e.g. aanya.sharma@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g. +919876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="cursor-pointer rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : initialData ? "Save Changes" : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
