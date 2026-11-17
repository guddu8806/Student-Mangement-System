const reportRepository = require("../repositories/report.repository");

const getAnalyticsOverview = async () => {
    const [kpis, enrollmentByCourse, registrationHistory] = await Promise.all([
        reportRepository.getReportKPIs(),
        reportRepository.getEnrollmentByCourse(),
        reportRepository.getRegistrationHistory('month')
    ]);

    return {
        kpis,
        enrollmentByCourse,
        registrationHistory
    };
};

const getDetailedRoster = async (filters) => {
    return await reportRepository.getDetailedEnrollmentRoster(filters);
};

// Generates RFC-compliant CSV with UTF-8 BOM for Excel
const generateCsvString = async (filters) => {
    const data = await reportRepository.getDetailedEnrollmentRoster(filters);
    
    const headers = ["Enrollment ID","Enrollment Date","Student ID", "Student Name", "Email", "Phone", "Course Code", "Course Name", "Credits"];

    if (!data || data.length === 0) {
        return headers.join(",") + "\n";
    }
    const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        return `"${String(str).replace(/"/g, '""')}"`;
    };

    const rows = data.map(item => [
        escapeCsv(item.enrollment_id),
        escapeCsv(item.enrollment_date ? new Date(item.enrollment_date).toISOString().split('T')[0] : ""),
        escapeCsv(item.student_id),
        escapeCsv(item.student_name),
        escapeCsv(item.student_email),
        escapeCsv(item.student_phone),
        escapeCsv(item.course_code),
        escapeCsv(item.course_name),
        escapeCsv(item.credits)
    ].join(","));

    return "\uFEFF" + [headers.join(","), ...rows].join("\n");
};

module.exports = {
    getAnalyticsOverview,
    getDetailedRoster,
    generateCsvString
};