import { Search, Calendar, FileSpreadsheet, X, Filter } from "lucide-react";
import exportToCsv from "../../config/exportoCsv";

export default function ReportFilters({ searchTerm = "", onSearchChange,selectedCourse = "all", onCourseChange, courses = [], startDate = "", onStartDateChange, endDate = "", onEndDateChange, onClearFilters, filteredRoster, filteredCount = 0,}) {
  const isAnyFilterActive = Boolean(searchTerm) || selectedCourse !== "all" || Boolean(startDate) || Boolean(endDate);
  const columns = [
            { key: "enrollment_id", label: "Enrollment ID" },
            { key: "student_name", label: "Student Name" },
            { key: "student_email", label: "Email" },
            { key: "student_phone", label: "Phone" },
            { key: "course_code", label: "Course Code" },
            { key: "course_name", label: "Course Name" },
            { key: "credits", label: "Credits" },
            { key: "enrollment_date", label: "Enrollment Date" },
        ];
  const timestamp = new Date().toISOString().split("T")[0];

  const handleExport =()=>{
    exportToCsv(filteredRoster, `enrollment_report_${timestamp}.csv`, columns)
  }

  return (
    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Detailed Records
          </h2>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-50 flex-1 sm:flex-initial">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search student or course..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-300 bg-gray-50/50 py-2 pl-9 pr-3 text-xs focus:border-violet-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-violet-400"
            />
          </div>

          <div className="relative min-w-37.5">
            <select
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              className="w-full rounded-xl cursor-pointer border border-gray-300 bg-gray-50/50 px-3 py-2 text-xs font-medium text-gray-700 focus:border-violet-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900  dark:focus:border-violet-400"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_code} - {c.course_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50/50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
            <Calendar size={14} className="text-gray-400 shrink-0 " />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase leading-none">
                From
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="bg-transparent cursor-pointer text-xs text-gray-700 focus:outline-none dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl border border-gray-300 bg-gray-50/50 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800">
            <Calendar size={14} className="text-gray-400 shrink-0 " />
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase leading-none">
                To
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="bg-transparent text-xs cursor-pointer text-gray-700 focus:outline-none dark:text-gray-200"
              />
            </div>
          </div>

          {isAnyFilterActive && (
            <button
              onClick={onClearFilters}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
              title="Reset all active filters"
            >
              <X size={14} /> Clear
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={filteredCount === 0}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-violet-600/25 transition-all hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
