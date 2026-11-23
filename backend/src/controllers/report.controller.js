const reportService = require("../services/report.service");

const getAnalytics = async (req, res, next) => {
    try {
        const overview = await reportService.getAnalyticsOverview();
        res.status(200).json({
            success: true,
            message: "Analytics reports fetched successfully",
            data: overview
        });
    } catch (error) {
        next(error);
    }
};

const getEnrollmentRoster = async (req, res, next) => {
    try {
        const { courseId, startDate, endDate, page, limit, search } = req.query;
        const roster = await reportService.getDetailedRoster({ courseId, startDate, endDate, page, limit, search });
        res.status(200).json({
            success: true,
            message: "Enrollment roster fetched successfully",
            data: roster
        });
    } catch (error) {
        next(error);
    }
};

const exportCsv = async (req, res, next) => {
    try {
        const { courseId, startDate, endDate, search } = req.query;
        const csv = await reportService.generateCsvString({ courseId, startDate, endDate, search });
        
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `enrollment_report_${timestamp}.csv`;

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        return res.status(200).send(csv);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAnalytics,
    getEnrollmentRoster,
    exportCsv
};