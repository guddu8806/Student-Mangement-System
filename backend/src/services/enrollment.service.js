const pool = require("../config/db");
const enrollmentRepository = require("../repositories/enrollment.repository");
const studentRepository = require("../repositories/student.repository");
const notificationService = require("./notification.service");
const AppError = require("../utils/AppError");
const { validateEnrollment } = require("../validators/enrollment.validator");

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

    // Check course capacity and available seats
    const courseStatus = await enrollmentRepository.getCourseCapacityStatus(payload.course_id);
    if (!courseStatus) {
        throw new AppError("Course not found", 404);
    }

    if (courseStatus.enrolled_count >= courseStatus.capacity) {
        throw new AppError(
            `Course '${courseStatus.course_name}' has reached its maximum enrollment capacity (${courseStatus.capacity}/${courseStatus.capacity} seats filled).`,
            400
        );
    }

    const newEnrollment = await enrollmentRepository.createEnrollment(payload.student_id, payload.course_id);

    try {
        const student = await studentRepository.findById(payload.student_id);
        const studentUserId = student?.user_id || (user?.role === 'student' ? user.id : null);
        const studentName = student ? `${student.first_name} ${student.last_name}`.trim() : 'A student';

        if (studentUserId) {
            await notificationService.notifyUser(studentUserId, {
                title: "Enrollment Confirmed",
                message: `You have successfully enrolled in ${courseStatus.course_name}`,
                type: "enrollment"
            });
        }
        await notificationService.notifyAdmins({
            title: "New Student Enrollment",
            message: `${studentName} enrolled in ${courseStatus.course_name}`,
            type: "enrollment"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    return newEnrollment;
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

    try {
        const student = await studentRepository.findById(existing.student_id);
        const studentUserId = student?.user_id || (user?.role === 'student' ? user.id : null);
        const studentName = student ? `${student.first_name} ${student.last_name}`.trim() : 'A student';

        if (studentUserId) {
            await notificationService.notifyUser(studentUserId, {
                title: "Course Dropped",
                message: "Your course enrollment has been dropped",
                type: "enrollment"
            });
        }
        await notificationService.notifyAdmins({
            title: "Course Dropped",
            message: `${studentName}'s course enrollment was dropped`,
            type: "enrollment"
        });
    } catch (err) {
        console.error("Notification error:", err.message);
    }

    return dropped;
};

module.exports = {
    createEnrollment,
    dropEnrollment,
    findAll
};
