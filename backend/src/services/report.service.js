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

const generateCsvString = async (filters) => {
    const data = await reportRepository.getDetailedEnrollmentRoster(filters);
    const list = Array.isArray(data) ? data : (data?.roster || []);
    const headers = ["Enrollment ID","Enrollment Date","Student ID", "Student Name", "Email", "Phone", "Course Code", "Course Name", "Credits"];

    if (!list || list.length === 0) {
        return headers.join(",") + "\n";
    }
    const escapeCsv = (str) => {
        if (str === null || str === undefined) return '""';
        return `"${String(str).replace(/"/g, '""')}"`;
    };

    const rows = list.map(item => [
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