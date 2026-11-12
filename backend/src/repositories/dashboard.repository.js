const pool = require("../config/db");

const getDashboardStats = async() =>{
    const studentsCountQuery = `SELECT COUNT(*) AS total FROM students`;
    const coursesCountQuery = `SELECT COUNT(*) AS total FROM courses`;
    const recentStudentsQuery = `
        SELECT id, first_name, last_name, email, phone, created_at 
        FROM students 
        ORDER BY created_at DESC 
        LIMIT 5
    `;

    const [studentRes , courseRes, recentStudent] = await Promise.all([
        pool.query(studentsCountQuery),
        pool.query(coursesCountQuery),
        pool.query(recentStudentsQuery)
    ]);

    return {
        totalStudents: Number(studentRes.rows[0].total),
        totalCourses: Number(courseRes.rows[0].total),
        recentStudents: recentStudent.rows
    };

};


const getAllStudentsOnDashboard = async() =>{
    const students = `SELECT * FROM students`;
    const result = await pool.query(students);
    return result.rows;
};

const getAllCourses = async() =>{
    const courses = `SELECT * FROM courses `;
    const result = await pool.query(courses);
    return result.rows;
};

const getAllEnrollments = async() =>{
    const enrollment_table = `
        SELECT
            e.id AS enrollment_id,
            e.enrollment_date,

            s.id AS student_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            s.email,
            s.phone,

            c.id AS course_id,
            c.course_name,
            c.course_code,
            c.description,
            c.credits

        FROM enrollments e

        INNER JOIN students s
            ON e.student_id = s.id

        INNER JOIN courses c
            ON e.course_id = c.id

        ORDER BY e.enrollment_date DESC
    `;
    const result = await pool.query(enrollment_table);
    return result.rows;
};


module.exports ={
    getAllCourses , getAllEnrollments ,getAllStudentsOnDashboard , getDashboardStats
};