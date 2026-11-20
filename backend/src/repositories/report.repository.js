const pool = require("../config/db");

const getEnrollmentByCourse = async () => {
    const query = `
        SELECT 
            c.id AS course_id,
            c.course_name,
            c.course_code,
            c.credits,
            COALESCE(c.capacity, 30)::int AS capacity,
            COUNT(e.id)::int AS total_enrolled,
            ROUND(
                (COUNT(e.id)::numeric / NULLIF(COALESCE(c.capacity, 30), 0)::numeric) * 100, 
                1
            )::float AS utilization_rate
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        GROUP BY c.id, c.course_name, c.course_code, c.credits, c.capacity
        ORDER BY total_enrolled DESC, c.course_name ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

const getRegistrationHistory = async (interval = 'month') => {
    const validInterval = interval === 'day' ? 'day' : 'month';
    const formatString = validInterval === 'day' ? 'YYYY-MM-DD' : 'Mon YYYY';
    const periodString = validInterval === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    const enrollmentTrendsQuery = `
        SELECT 
            TO_CHAR(DATE_TRUNC('${validInterval}', enrollment_date), '${periodString}') AS period,
            TO_CHAR(DATE_TRUNC('${validInterval}', enrollment_date), '${formatString}') AS label,
            COUNT(*)::int AS enrollments
        FROM enrollments
        WHERE enrollment_date IS NOT NULL
        GROUP BY DATE_TRUNC('${validInterval}', enrollment_date)
        ORDER BY DATE_TRUNC('${validInterval}', enrollment_date) ASC;
    `;

    const studentTrendsQuery = `
        SELECT 
            TO_CHAR(DATE_TRUNC('${validInterval}', created_at), '${periodString}') AS period,
            TO_CHAR(DATE_TRUNC('${validInterval}', created_at), '${formatString}') AS label,
            COUNT(*)::int AS registrations
        FROM students
        WHERE created_at IS NOT NULL
        GROUP BY DATE_TRUNC('${validInterval}', created_at)
        ORDER BY DATE_TRUNC('${validInterval}', created_at) ASC;
    `;

    const [enrollmentRes, studentRes] = await Promise.all([
        pool.query(enrollmentTrendsQuery),
        pool.query(studentTrendsQuery)
    ]);

    const map = new Map();
    enrollmentRes.rows.forEach(row => {
        map.set(row.period, { period: row.period, label: row.label, enrollments: row.enrollments, registrations: 0 });
    });

    studentRes.rows.forEach(row => {
        if (map.has(row.period)) {
            map.get(row.period).registrations = row.registrations;
        } else {
            map.set(row.period, { period: row.period, label: row.label, enrollments: 0, registrations: row.registrations });
        }
    });

    return Array.from(map.values()).sort((a, b) => a.period.localeCompare(b.period));
};


const getReportKPIs = async () => {
    const query = `
        SELECT 
            (SELECT COUNT(*)::int FROM students) AS total_students,
            (SELECT COUNT(*)::int FROM courses) AS total_courses,
            (SELECT COUNT(*)::int FROM enrollments) AS total_enrollments,
            COALESCE((
                SELECT ROUND(AVG(enrolled_count), 1)
                FROM (
                    SELECT COUNT(id) AS enrolled_count
                    FROM enrollments
                    GROUP BY student_id
                ) sub
            ), 0)::float AS avg_enrollments_per_student;
    `;
    const result = await pool.query(query);
    return result.rows[0];
};


const getDetailedEnrollmentRoster = async ({ courseId, startDate, endDate } = {}) => {
    let query = `
        SELECT 
            e.id AS enrollment_id,
            e.enrollment_date,
            s.id AS student_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            s.email AS student_email,
            s.phone AS student_phone,
            c.id AS course_id,
            c.course_name,
            c.course_code,
            c.credits
        FROM enrollments e
        INNER JOIN students s ON e.student_id = s.id
        INNER JOIN courses c ON e.course_id = c.id
        WHERE 1=1
    `;
    const params = [];

    if (courseId) {
        params.push(courseId);
        query += ` AND c.id = $${params.length}`;
    }
    if (startDate) {
        params.push(startDate);
        query += ` AND e.enrollment_date >= $${params.length}::date`;
    }
    if (endDate) {
        params.push(endDate);
        query += ` AND e.enrollment_date < ($${params.length}::date + INTERVAL '1 day')`;
    }

    query += ` ORDER BY e.enrollment_date DESC;`;

    const result = await pool.query(query, params);
    return result.rows;
};

module.exports = {
    getEnrollmentByCourse,
    getRegistrationHistory,
    getReportKPIs,
    getDetailedEnrollmentRoster
};