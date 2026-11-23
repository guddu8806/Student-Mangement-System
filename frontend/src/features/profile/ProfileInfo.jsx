export default function ProfileInfo({ infoItems = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {infoItems.map(({ label, val }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-800/30"
        >
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
            {val || "—"}
          </p>
        </div>
      ))}
    </div>
  );
}
