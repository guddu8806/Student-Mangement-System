import exportToCsv from "../../config/exporToCsv";
import {FileSpreadsheet} from "lucide-react"
import Loader from "../../components/common/Loader";

export default function RegistrationSummary({data = [], loading = false, title = "Registration & Enrollment History", description = "Student registrations vs course enrollments"}) {

  const summaryColumns = [
    { key: "label", label: "Month / Period" },
    { key: "registrations", label: "Student Registrations" },
    { key: "enrollments", label: "Course Enrollments" }
  ];
  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    exportToCsv(data, `monthly_summary_${timestamp}.csv`, summaryColumns);
  };
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Loader size="sm" minHeight="min-h-[200px]" text="Loading report..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold dark:text-white">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          No historical records found.
        </p>
      </div>
    );
  }

  const totalRegistrations = data.reduce(
    (total, item) => total + (item.registrations || 0),
    0
  );

  const totalEnrollments = data.reduce(
    (total, item) => total + (item.enrollments || 0),
    0
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">

        <div className="rounded-xl bg-sky-50 dark:bg-sky-950/30 p-4">
          <p className="text-sm text-sky-600 dark:text-sky-400">
            Total Registrations
          </p>

          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalRegistrations}
          </p>
        </div>

        <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 p-4">
          <p className="text-sm text-violet-600 dark:text-violet-400">
            Total Enrollments
          </p>

          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {totalEnrollments}
          </p>
        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full text-sm text-left">

          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              <th className="py-3 pr-4 font-semibold">
                Period
              </th>

              <th className="py-3 px-4 font-semibold text-right">
                Registrations
              </th>

              <th className="py-3 pl-4 font-semibold text-right">
                Enrollments
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.period || index}
                className="border-b border-gray-100 dark:border-gray-800 last:border-0"
              >

                <td className="py-4 pr-4 font-medium text-gray-900 dark:text-white">
                  {item.label}
                </td>

                <td className="py-4 px-4 text-right text-sky-600 dark:text-sky-400 font-semibold">
                  {item.registrations ?? 0}
                </td>

                <td className="py-4 pl-4 text-right text-violet-600 dark:text-violet-400 font-semibold">
                  {item.enrollments ?? 0}
                </td>

              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2 border-gray-200 dark:border-gray-700 font-bold">
              <td className="py-4 text-gray-900 dark:text-white">
                Total
              </td>

              <td className="py-4 px-4 text-right text-sky-600 dark:text-sky-400">
                {totalRegistrations}
              </td>

              <td className="py-4 pl-4 text-right text-violet-600 dark:text-violet-400">
                {totalEnrollments}
              </td>
            </tr>
          </tfoot>

        </table>

      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p className="text-xs font-medium">Monthly registration vs. enrollment summary</p>
        <button
            onClick={handleExport}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-violet-600/25 transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
      </div>

    </div>
  );
}
