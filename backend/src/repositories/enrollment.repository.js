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
const findAllEnrollment = async ({ page, limit, studentId, search } = {}) => {
    const conditions = [];
    const values = [];

    if (studentId) {
        values.push(studentId);
        conditions.push(`e.student_id = $${values.length}`);
    }

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        const idx = values.length;
        conditions.push(`(CONCAT(s.first_name, ' ', s.last_name) ILIKE $${idx} OR s.email ILIKE $${idx} OR c.course_name ILIKE $${idx} OR c.course_code ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    if (!page && !limit) {
        const query = `
            SELECT  e.id, e.student_id, e.course_id, e.enrollment_date,
                    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                    s.email AS student_email,
                    c.course_name, c.course_code, c.description, c.credits
            FROM enrollments e
            LEFT JOIN students s ON e.student_id = s.id
            LEFT JOIN courses c ON e.course_id = c.id
            ${whereClause}
            ORDER BY e.id DESC
        `;
        const result = await pool.query(query, values);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const dataQuery = `
        SELECT  e.id, e.student_id, e.course_id, e.enrollment_date,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                s.email AS student_email,
                c.course_name, c.course_code, c.description, c.credits
        FROM enrollments e
        LEFT JOIN students s ON e.student_id = s.id
        LEFT JOIN courses c ON e.course_id = c.id
        ${whereClause}
        ORDER BY e.id DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM enrollments e
        LEFT JOIN students s ON e.student_id = s.id
        LEFT JOIN courses c ON e.course_id = c.id
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        enrollments: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: total === 0 ? 0 : Math.ceil(total / parsedLimit)
    };
};

// find enrollments for a specific student
const findByStudentId = async (studentId, options = {}) => {
    return await findAllEnrollment({ ...options, studentId });
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


const getCourseCapacityStatus = async (courseId, client = pool) => {
    const isClient = client !== pool;
    const forUpdate = isClient ? " FOR UPDATE" : "";
    const courseQuery = `SELECT id, course_name, course_code, COALESCE(capacity, 30)::int AS capacity FROM courses WHERE id = $1${forUpdate}`;
    const courseResult = await client.query(courseQuery, [courseId]);
    if (!courseResult.rows.length) {
        return null;
    }
    const countQuery = `SELECT COUNT(*)::int AS enrolled_count FROM enrollments WHERE course_id = $1`;
    const countResult = await client.query(countQuery, [courseId]);
    return {
        ...courseResult.rows[0],
        enrolled_count: countResult.rows[0].enrolled_count
    };
};

const createEnrollmentWithCapacityCheck = async (studentId, courseId) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const courseStatus = await getCourseCapacityStatus(courseId, client);
        if (!courseStatus) {
            throw new AppError("Course not found", 404);
        }
        if (courseStatus.enrolled_count >= courseStatus.capacity) {
            throw new AppError(
                `Course '${courseStatus.course_name}' has reached its maximum enrollment capacity (${courseStatus.capacity}/${courseStatus.capacity} seats filled).`,
                400
            );
        }
        const checkExisting = await client.query(
            `SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2`,
            [studentId, courseId]
        );
        if (checkExisting.rows.length > 0) {
            throw new AppError("Student is already enrolled in this course.", 409);
        }
        const result = await client.query(
            `INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *`,
            [studentId, courseId]
        );
        await client.query("COMMIT");
        return {
            enrollment: result.rows[0],
            course: courseStatus
        };
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch (rollbackError) {
            console.error("Rollback failed:", rollbackError);
        }
        throw error;
    } finally {
        client.release();
    }
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
    createEnrollmentWithCapacityCheck,
    dropEnrollment,
    findAllEnrollment
};
