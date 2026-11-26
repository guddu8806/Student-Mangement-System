const pool = require("../config/db");

const getDashboardStats = async() =>{
    const studentsCountQuery = `SELECT COUNT(*)::int AS total FROM students`;
    const coursesCountQuery = `SELECT COUNT(*)::int AS total FROM courses`;
    const enrollmentsCountQuery = `SELECT COUNT(*)::int AS total FROM enrollments`;
    const recentStudentsQuery = `
        SELECT id, first_name, last_name, email, phone, created_at
        FROM students
        ORDER BY created_at DESC
        LIMIT 5
    `;
    const monthlyEnrollmentsQuery = `
        SELECT
            TO_CHAR(DATE_TRUNC('month', enrollment_date), 'Mon YY') AS month,
            COUNT(*)::int AS enrollments
        FROM enrollments
        WHERE enrollment_date IS NOT NULL
        GROUP BY DATE_TRUNC('month', enrollment_date)
        ORDER BY DATE_TRUNC('month', enrollment_date) ASC
    `;
    const courseEnrollmentsQuery = `
        SELECT
            c.id AS course_id,
            c.course_name AS name,
            c.course_code,
            COUNT(e.id)::int AS enrollments
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        GROUP BY c.id, c.course_name, c.course_code
        HAVING COUNT(e.id) > 0
        ORDER BY enrollments DESC
    `;

    const [studentRes, courseRes, enrollmentRes, recentStudent, monthlyRes, courseEnrollmentsRes] = await Promise.all([
        pool.query(studentsCountQuery),
        pool.query(coursesCountQuery),
        pool.query(enrollmentsCountQuery),
        pool.query(recentStudentsQuery),
        pool.query(monthlyEnrollmentsQuery),
        pool.query(courseEnrollmentsQuery)
    ]);

    return {
        totalStudents: Number(studentRes.rows[0].total),
        totalCourses: Number(courseRes.rows[0].total),
        totalEnrollments: Number(enrollmentRes.rows[0].total),
        recentStudents: recentStudent.rows,
        monthlyEnrollments: monthlyRes.rows,
        courseEnrollments: courseEnrollmentsRes.rows
    };
};

const getAllCourses = async() =>{
    const courses = `SELECT * FROM courses`;
    const result = await pool.query(courses);
    return result.rows;
};

const getAllEnrollments = async({ page, limit } = {}) =>{
    if (page === undefined && limit === undefined) {

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
            LIMIT 100
        `;
        const result = await pool.query(enrollment_table);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const dataQuery = `
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
        LIMIT $1 OFFSET $2
    `;

    const countQuery = `SELECT COUNT(*)::int AS total FROM enrollments`;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [parsedLimit, offset]),
        pool.query(countQuery)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        enrollments: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1
    };
};

module.exports ={
    getAllCourses, getAllEnrollments, getDashboardStats
};
