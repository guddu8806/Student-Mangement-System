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

// find all enrollments
const findAllEnrollment = async ({ limit = 10, offset = 0 } = {}) => {
    const query = `SELECT * FROM enrollments ORDER BY id LIMIT $1 OFFSET $2`;
    const values = [Number(limit), Number(offset)];
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

    const query = `INSERT INTO enrollments (student_id, course_id) VALUES($1, $2) RETURNING *`;
    const value = [sId, cId];
    const saved = await pool.query(query, value);

    return saved.rows[0];
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
    dropEnrollment,
    findAllEnrollment
};
