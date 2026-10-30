const enrollmentService = require("../services/enrollment.service");

// find all
const findAllEnrollment = async (req, res, next) => {
    try {
        const all_enrollment = await enrollmentService.findAll(req.query);
        res.status(200).json({
            success: true,
            message: "All enrollments retrieved successfully.",
            data: all_enrollment
        });
    } catch (error) {
        next(error);
    }
};

// create enrollment
const createEnroll = async (req, res, next) => {
    try {
        const { student_id, course_id } = req.body;
        const enroll = await enrollmentService.createEnrollment({ student_id, course_id });
        res.status(201).json({
            success: true,
            message: "Enrolled successfully",
            data: enroll
        });
    } catch (error) {
        next(error);
    }
};

// drop enrollment
const dropEnrollment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted_enrollment = await enrollmentService.dropEnrollment(id);
        res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully",
            data: deleted_enrollment
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createEnroll,
    findAllEnrollment,
    dropEnrollment
};
