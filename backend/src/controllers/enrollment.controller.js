const enrollmentService = require("../services/enrollment.service");
const AppError = require("../utils/AppError");

const findAllEnrollment = async (req, res, next) => {
    try {
        const all_enrollment = await enrollmentService.findAll(req.query, req.user);
        res.status(200).json({
            success: true,
            message: "Enrollments retrieved successfully.",
            data: all_enrollment
        });
    } catch (error) {
        next(error);
    }
};

const createEnroll = async (req, res, next) => {
    try {
        const enroll = await enrollmentService.createEnrollment(req.body, req.user);
        res.status(201).json({
            success: true,
            message: "Enrolled successfully",
            data: enroll
        });
    } catch (error) {
        if(error.code === "23505"){
            return next(new AppError("Student is already enrolled in this course." , 409));
        }
        next(error);
    }
};

const dropEnrollment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted_enrollment = await enrollmentService.dropEnrollment(id, req.user);
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
