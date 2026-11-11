const pool = require("../config/db");
const AppError = require("../utils/AppError");

// find existing enrollment by student_id and course_id
const findEnrollment = async (studentId, courseId) => {
    const query = `SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2`;
    const values = [studentId, courseId];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
};

// find enrollment by its primary key ID
const findById = async (id) => {
    const query = `SELECT * FROM enrollments WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
};

// find all enrollments (with student and course details)
const findAllEnrollment = async () => {
    const query = `
        SELECT  e.id, e.student_id, e.course_id, e.enrollment_date,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                s.email AS student_email,
                c.course_name, c.course_code, c.description, c.credits
        FROM enrollments e
        LEFT JOIN students s ON e.student_id = s.id
        LEFT JOIN courses c ON e.course_id = c.id
        ORDER BY e.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

// find enrollments for a specific student
const findByStudentId = async (studentId) => {
    const query = `
        SELECT  e.id, e.student_id, e.course_id, e.enrollment_date,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                s.email AS student_email,
                c.course_name, c.course_code, c.description, c.credits
        FROM enrollments e
        LEFT JOIN students s ON e.student_id = s.id
        LEFT JOIN courses c ON e.course_id = c.id
        WHERE e.student_id = $1
        ORDER BY e.id DESC
    `;
    const values = [studentId];
    const result = await pool.query(query, values);
    return result.rows;
};

// create enrollment
const createEnrollment = async (studentId, courseId) => {
    let sId = studentId;
    let cId = courseId;
    if (typeof studentId === 'object' && studentId !== null) {
        sId = studentId.student_id;
        cId = studentId.course_id;
    }

    const existing = await findEnrollment(sId, cId);
    if (existing !== null) {
        throw new AppError("Student is already enrolled in this course.", 409);
    }

    let saved;
    try {
        const query = `INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES($1, $2, CURRENT_TIMESTAMP) RETURNING *`;
        saved = await pool.query(query, [sId, cId]);
    } catch {
        const query = `INSERT INTO enrollments (student_id, course_id) VALUES($1, $2) RETURNING *`;
        saved = await pool.query(query, [sId, cId]);
    }

    return saved.rows[0];
};

// get course capacity and active enrolled count
const getCourseCapacityStatus = async (courseId) => {
    const query = `
        SELECT c.id, c.course_name, c.course_code, COALESCE(c.capacity, 30)::int AS capacity, COUNT(e.id)::int AS enrolled_count
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.id = $1
        GROUP BY c.id
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows[0] || null;
};

// drop enrollment
const dropEnrollment = async (id) => {
    const query = `DELETE FROM enrollments WHERE id = $1 RETURNING *`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
};

module.exports = {
    createEnrollment,
    findEnrollment,
    findById,
    findByStudentId,
    getCourseCapacityStatus,
    dropEnrollment,
    findAllEnrollment
};
