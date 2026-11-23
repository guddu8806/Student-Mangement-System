export default function ProfileHeader({
  profile,
  roleLabel,
  isEditing,
  saving,
  onEditToggle,
  onLogout,
}) {
  return (
    <section className="overflow-hidden mt-2 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="px-6 py-16 pb-6">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile?.name || "User"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile?.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
              {roleLabel}
            </span>
            <button
              type="button"
              onClick={onEditToggle}
              disabled={saving}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
