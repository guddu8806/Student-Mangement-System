const pool = require("../config/db");
const enrollmentRepository = require("../repositories/enrollment.repository");
const studentRepository = require("../repositories/student.repository");
const AppError = require("../utils/AppError");
const { validateEnrollment } = require("../validators/enrollment.validator");

// Helper to resolve student_id from logged-in user
const getStudentIdForUser = async (user) => {
    if (user.student_id) return user.student_id;
    let student = await studentRepository.findByUserId(user.id);
    if (!student) {
        const userRec = await pool.query(`SELECT email FROM users WHERE id = $1`, [user.id]);
        if (userRec.rows.length > 0 && userRec.rows[0].email) {
            const stRes = await pool.query(`SELECT * FROM students WHERE LOWER(email) = LOWER($1)`, [userRec.rows[0].email]);
            if (stRes.rows.length > 0) {
                student = stRes.rows[0];
                await pool.query(`UPDATE students SET user_id = $1 WHERE id = $2`, [user.id, student.id]);
            }
        }
    }
    if (!student) {
        throw new AppError("Student profile not found for this account", 404);
    }
    return student.id;
};

const findAll = async (params = {}, user) => {
    if (user && user.role === 'student') {
        const studentId = await getStudentIdForUser(user);
        return await enrollmentRepository.findByStudentId(studentId);
    }
    if (params && params.student_id) {
        return await enrollmentRepository.findByStudentId(Number(params.student_id));
    }

    return await enrollmentRepository.findAllEnrollment();
};

// Create enrollment: Student enrolls themselves; Admin can enroll any student
const createEnrollment = async (data, user) => {
    let studentId = data.student_id;

    if (user && user.role === 'student') {
        studentId = await getStudentIdForUser(user);
    }

    const payload = {
        student_id: studentId,
        course_id: data.course_id
    };

    const errors = validateEnrollment(payload);
    if (Object.keys(errors).length > 0) {
        throw new AppError(errors, 400);
    }

    return await enrollmentRepository.createEnrollment(payload.student_id, payload.course_id);
};

const dropEnrollment = async (id, user) => {
    const enroll_id = Number(id);
    if (!Number.isInteger(enroll_id) || enroll_id <= 0) {
        throw new AppError("Invalid enrollment ID", 400);
    }

    const existing = await enrollmentRepository.findById(enroll_id);
    if (!existing) {
        throw new AppError("Enrollment not found", 404);
    }

    // Role-based authorization & 24-hour limit
    if (user && user.role === 'student') {
        const studentId = await getStudentIdForUser(user);

        if (Number(existing.student_id) !== Number(studentId)) {
            throw new AppError("Forbidden: You can only drop your own enrollments", 403);
        }

        const enrolledTime = existing.enrollment_date || existing.enrolled_at || existing.created_at;
        if (enrolledTime) {
            const diffMs = Date.now() - new Date(enrolledTime).getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            if (diffHours > 24) {
                throw new AppError("Enrollment cannot be dropped after 24 hours of enrolling", 400);
            }
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
