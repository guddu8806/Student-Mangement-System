import { useEffect, useState, useMemo } from "react";
import {AlertCircle } from "lucide-react";
import { getReportAnalytics, getReportRoster } from "../services/api/report.api";
import ReportKPIs from "../features/reports/ReportKPIs";
import RegistrationSummary from "../features/reports/RegistrationSummary";
import ReportFilters from "../features/reports/ReportFilters";
import ReportTable from "../features/reports/ReportTable";
import TopCourses from "../features/reports/TopCourses";

export default function Reports() {
    const [analytics, setAnalytics] = useState(null);
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [overview, rosterData] = await Promise.all([getReportAnalytics(), getReportRoster(),]);
            setAnalytics(overview);
            setRoster(rosterData);
        } catch (err) {
            console.error("Failed to load reports", err);
            setError("Unable to load reports data. Please ensure the backend server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filtered Roster: combines Search, Course, and Date Range
    const filteredRoster = useMemo(() => {
        return roster.filter((item) => {
            const q = searchTerm.toLowerCase().trim();
            const matchesSearch =!q ||
                (item.student_name && item.student_name.toLowerCase().includes(q)) ||
                (item.student_email && item.student_email.toLowerCase().includes(q)) ||
                (item.course_code && item.course_code.toLowerCase().includes(q)) ||
                (item.course_name && item.course_name.toLowerCase().includes(q));

            const matchesCourse = selectedCourse === "all" || String(item.course_id) === String(selectedCourse);
            let itemDate = "";
            if (item.enrollment_date) {
                try {
                    itemDate = new Date(item.enrollment_date).toISOString().split("T")[0];
                } catch {
                    itemDate = "";
                }
            }
            const matchesStartDate = !startDate || (itemDate && itemDate >= startDate);
            const matchesEndDate = !endDate || (itemDate && itemDate <= endDate);

            return matchesSearch && matchesCourse && matchesStartDate && matchesEndDate;
        });
    }, [roster, searchTerm, selectedCourse, startDate, endDate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCourse, startDate, endDate]);

    const totalPages = Math.ceil(filteredRoster.length / pageSize) || 1;
    const paginatedRoster = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRoster.slice(start, start + pageSize);
    }, [filteredRoster, currentPage]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCourse("all");
        setStartDate("");
        setEndDate("");
    };

    const kpis = analytics?.kpis || {};
    const enrollmentByCourse = analytics?.enrollmentByCourse || [];
    const registrationHistory = analytics?.registrationHistory || [];

    return (
        <main className="min-h-screen bg-slate-50 mt-4  text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100 sm:px-6 lg:px-4">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between border border-gray-200 dark:border-gray-800 bg-background dark:bg-gray-900 dark:text-slate-100  p-4 rounded-2xl">
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

                <div className="my-5 rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
                    <ReportFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedCourse={selectedCourse}
                        onCourseChange={setSelectedCourse}
                        courses={enrollmentByCourse}
                        startDate={startDate}
                        onStartDateChange={setStartDate}
                        endDate={endDate}
                        onEndDateChange={setEndDate}
                        onClearFilters={handleClearFilters}
                        filteredRoster={filteredRoster}
                        filteredCount={filteredRoster.length}
                    />

                    <ReportTable
                        data={paginatedRoster}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        totalFilteredCount={filteredRoster.length}
                    />
                </div>
            </div>
        </main>
    );
}
