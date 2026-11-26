import { useEffect, useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useReportAnalytics, useReportRoster, downloadReportCsvDirect } from "../hooks/queries/useReports";
import ReportKPIs from "../features/reports/ReportKPIs";
import RegistrationSummary from "../features/reports/RegistrationSummary";
import ReportFilters from "../features/reports/ReportFilters";
import ReportTable from "../features/reports/ReportTable";
import TopCourses from "../features/reports/TopCourses";

export default function Reports() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const rosterParams = useMemo(() => ({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearchTerm.trim() || undefined,
        courseId: selectedCourse !== "all" ? selectedCourse : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    }), [currentPage, pageSize, debouncedSearchTerm, selectedCourse, startDate, endDate]);

    const { data: analytics = null, isLoading: loadingAnalytics, error: analyticsError } = useReportAnalytics();
    const { data: rosterData, isLoading: loadingRoster, error: rosterError } = useReportRoster(rosterParams);

    const loading = loadingAnalytics || loadingRoster;
    const error = (analyticsError || rosterError)
        ? "Unable to load reports data. Please ensure the backend server is running."
        : "";

    const roster = Array.isArray(rosterData) ? rosterData : (rosterData?.roster || []);
    const totalCount = typeof rosterData?.total === "number" ? rosterData.total : roster.length;
    const totalPages = rosterData?.totalPages || Math.ceil(totalCount / pageSize) || 1;

    const handleClearFilters = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
        setSelectedCourse("all");
        setStartDate("");
        setEndDate("");
        setCurrentPage(1);
    };

    const handleExportCsv = () => {
        downloadReportCsvDirect({
            courseId: selectedCourse !== "all" ? selectedCourse : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            search: debouncedSearchTerm.trim() || undefined,
        });
    };

    const kpis = analytics?.kpis || {};
    const enrollmentByCourse = analytics?.enrollmentByCourse || [];
    const registrationHistory = analytics?.registrationHistory || [];

    return (
        <div className="px-4 py-4 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-4">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-slate-100 p-4 rounded-2xl">
                    <div>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                            Reports & Analytics
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Live enrollment statistics, course utilization trends, and historical records.
                        </p>
                    </div>
                </div>
                {error && (
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="mt-5">
                    <ReportKPIs kpis={kpis} loading={loading} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <TopCourses
                        data={enrollmentByCourse}
                        loading={loading}
                        title="Enrollment by Course"
                        description="Enrolled student volume categorized by course code"
                    />
                    <RegistrationSummary
                        data={registrationHistory}
                        loading={loading}
                        title="Registration & Enrollment History"
                        description="Timeline comparing student registrations vs course enrollments"
                    />
                </div>

                <div className="my-5 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <ReportFilters
                        searchTerm={searchTerm}
                        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                        selectedCourse={selectedCourse}
                        onCourseChange={(val) => { setSelectedCourse(val); setCurrentPage(1); }}
                        courses={enrollmentByCourse}
                        startDate={startDate}
                        onStartDateChange={(val) => { setStartDate(val); setCurrentPage(1); }}
                        endDate={endDate}
                        onEndDateChange={(val) => { setEndDate(val); setCurrentPage(1); }}
                        onClearFilters={handleClearFilters}
                        filteredCount={totalCount}
                        onExport={handleExportCsv}
                    />

                    <ReportTable
                        data={roster}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        totalFilteredCount={totalCount}
                    />
                </div>
            </div>
        </div>
    );
}
