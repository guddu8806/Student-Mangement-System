const pool = require("../config/db");
const AppError = require("../utils/AppError");

// manage enroll in courses and prevent duplicate enrollments;


// find existing enrollment
const findEnrollment = async(studentId , courseId) =>{
    const query = `SELECT * FROM enrollments WHERE student_id = $1 AND course_id = $2`;
    const values = [studentId ,courseId];
    const result = await pool.query(query , values);
    return result.rows[0] || null;
}

// create enrollment
const createEnrollment = async(studentId , courseId) =>{
    const existing = findEnrollment(studentId , courseId);
    if(existing !== null){
        throw new AppError("Student is already enrolled in this course.", 409);
    }
    const query = `INSERT INTO enrollments (student_id , course_id) VALUES($1, $2) RETURNING *`;
    const value = [studentId, courseId];
    const saved = await pool.query(query , value);

    return saved.rows[0];
}


// drop enrollment
const dropEnrollment = async(studentId , courseId) =>{
    const query = `UPDATE enrollments SET status = 'dropped' WHERE student_id = $1 AND course_id = $2  AND CURRENT_TIMESTAMP <= enrolled_at + INTERVAL '1 days' RETURNING * `;
    const values = [studentId , courseId];

    const result = await pool.query(query , values);
    return result.rows[0] || null;
}


module.exports = {
    createEnrollment , findEnrollment , dropEnrollment
}
