const enrollmentRepository = require("../repositories/enrollment.repository");
const AppError = require("../utils/AppError");
const { validateEnrollment } = require("../validators/enrollment.validator");

// find all enrollments
const findAll = async (params = {}) => {
    const limit = Number(params.limit ?? 10);
    const offset = Number(params.offset ?? 0);

    if (!Number.isInteger(limit) || limit <= 0 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
        throw new AppError("Invalid query parameters", 400);
    }

    return await enrollmentRepository.findAllEnrollment({ limit, offset });
};

// create enrollment
const createEnrollment = async (data) => {
    const errors = validateEnrollment(data);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }
    return await enrollmentRepository.createEnrollment(data.student_id, data.course_id);
};

// drop enrollment
const dropEnrollment = async (id) => {
    const enroll_id = Number(id);
    if (!Number.isInteger(enroll_id) || enroll_id <= 0) {
        throw new AppError("Invalid enrollment ID", 400);
    }

    const existing = await enrollmentRepository.findById(enroll_id);
    if (!existing) {
        throw new AppError("Enrollment not found", 404);
    }

    // Check if enrolled within 24 hours if timestamp exists
    const enrolledTime = existing.enrolled_at || existing.created_at || existing.enrollment_date;
    if (enrolledTime) {
        const diffMs = Date.now() - new Date(enrolledTime).getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours > 24) {
            throw new AppError("Enrollment cannot be dropped after 24 hours", 400);
        }
    }

    const dropped = await enrollmentRepository.dropEnrollment(enroll_id);
    if (!dropped) {
        throw new AppError("Enrollment could not be dropped", 400);
    }

    return dropped;
};

module.exports = {
    createEnrollment,
    dropEnrollment,
    findAll
};
