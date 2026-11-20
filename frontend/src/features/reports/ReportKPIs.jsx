export default function ReportKPIs({ kpis = {}, loading = false }) {
  const cards = [
    {
      label: "Total Students",
      value: kpis.total_students ?? 0,
      subtext: "Verified student profiles",
      color: "emerald",
      borderGradient: "from-violet-500 to-indigo-500",
    },
    {
      label: "Active Courses",
      value: kpis.total_courses ?? 0,
      subtext: "Catalog offerings",
      color: "blue",
      borderGradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Enrollments",
      value: kpis.total_enrollments ?? 0,
      subtext: "Active enrollments",
      color: "emerald",
      borderGradient: "from-emerald-500 to-teal-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                  {loading ? "..." : card.value}
                </h3>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {card.subtext}
                </p>
              </div>
            </div>
            <div
              className={`absolute inset-x-0 bottom-0 h-1 bg-linear-to-r ${card.borderGradient}`}
            />
          </div>
      ))}
    </div>
  );
}
