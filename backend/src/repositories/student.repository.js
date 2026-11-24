const pool = require('../config/db');

// Create student record (Used by Admin or auto-created during Student registration)
const create = async (studentData) => {
    const { first_name, last_name, email, phone, user_id = null } = studentData;
    
    if (user_id) {
        const query = `
            INSERT INTO students (first_name, last_name, email, phone, user_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [first_name, last_name, email, phone, user_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    const query = `
        INSERT INTO students (first_name, last_name, email, phone) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
    `;
    const values = [first_name, last_name, email, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const findAll = async ({ page, limit, search } = {}) => {
    if (!page && !limit) {
        let query = `SELECT * FROM students`;
        const values = [];
        if (search && search.trim()) {
            values.push(`%${search.trim()}%`);
            query += ` WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1)`;
        }
        query += ` ORDER BY id`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const values = [];

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        const idx = values.length;
        conditions.push(`(first_name ILIKE $${idx} OR last_name ILIKE $${idx} OR email ILIKE $${idx} OR phone ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const dataQuery = `
        SELECT * FROM students
        ${whereClause}
        ORDER BY id
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM students
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        students: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: total === 0 ? 0 : Math.ceil(total / parsedLimit)
    };
};

const findById = async (id) => {
    const query = `SELECT * FROM students WHERE id = $1`;
    const value = [id];
    const result = await pool.query(query, value);
    return result.rows[0];
};

// Find student profile by linked user_id
const findByUserId = async (userId) => {
    const query = `SELECT * FROM students WHERE user_id = $1`;
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Update student record by Student ID (For Admin)
const update = async (id, studentData) => {
    const allowedFields = ['first_name', 'last_name', 'email', 'phone'];

    const fields = Object.keys(studentData).filter(key => allowedFields.includes(key));
    if (fields.length === 0) {
        throw new Error('No valid fields provided for update');
    }
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE students SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...fields.map(field => studentData[field])];

    const result = await pool.query(query, values);
    const updatedStudent = result.rows[0];

    // If the student has a linked user account, keep the user account in sync
    if (updatedStudent && updatedStudent.user_id) {
        const userUpdates = [];
        const userValues = [];
        let paramIndex = 1;

        if (studentData.first_name || studentData.last_name) {
            userUpdates.push(`name = $${paramIndex++}`);
            userValues.push(`${updatedStudent.first_name} ${updatedStudent.last_name}`.trim());
        }
        if (studentData.email) {
            userUpdates.push(`email = $${paramIndex++}`);
            userValues.push(studentData.email.toLowerCase().trim());
        }

        if (userUpdates.length > 0) {
            userValues.push(updatedStudent.user_id);
            await pool.query(
                `UPDATE users SET ${userUpdates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}`,
                userValues
            );
        }
    }

    return updatedStudent;
};

// Update student record by User ID (For Student Profile update - Email is protected)
const updateByUserId = async (userId, studentData) => {
    const allowedFields = ['first_name', 'last_name', 'phone'];

    const fields = Object.keys(studentData).filter(key => allowedFields.includes(key));
    if (fields.length === 0) {
        return null;
    }
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE students SET ${setClause} WHERE user_id = $1 RETURNING *`;
    const values = [userId, ...fields.map(field => studentData[field])];

    const result = await pool.query(query, values);
    return result.rows[0];
};


const deleteById = async (id) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const checkQuery = `
            SELECT user_id
            FROM students
            WHERE id = $1
            FOR UPDATE
        `;
        const checkResult = await client.query(checkQuery, [id]);
        if (checkResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return false;
        }
        const userId = checkResult.rows[0].user_id;

        // Clean up linked enrollments first to satisfy foreign key constraints
        await client.query(`DELETE FROM enrollments WHERE student_id = $1`, [id]);

        const deleteStudentQuery = `
            DELETE FROM students
            WHERE id = $1
            RETURNING *
        `;
        const deleteResult = await client.query(
            deleteStudentQuery,
            [id]
        );
        if (userId) {
            // Clean up user notifications
            await client.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);
            // Preserve historical audit trail by nullifying user_id in activity logs
            await client.query(`UPDATE activity_logs SET user_id = NULL WHERE user_id = $1`, [userId]);
            await client.query(
                `DELETE FROM users WHERE id = $1`,
                [userId]
            );
        }
        await client.query("COMMIT");
        return deleteResult.rowCount > 0;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};


const notEnrolledStudent = async({ page, limit, search } = {}) =>{
    const conditions = [
        `NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.student_id = s.id)`
    ];
    const values = [];

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        const idx = values.length;
        conditions.push(`(s.first_name ILIKE $${idx} OR s.last_name ILIKE $${idx} OR s.email ILIKE $${idx} OR s.phone ILIKE $${idx})`);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    if (page === undefined && limit === undefined) {
        const query = `
            SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.created_at 
            FROM students s
            ${whereClause}
            ORDER BY s.id
        `;
        const result = await pool.query(query, values);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const dataQuery = `
        SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.created_at 
        FROM students s
        ${whereClause}
        ORDER BY s.id
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM students s
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        students: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1
    };
};

module.exports = {
    create,
    findAll,
    findById,
    findByUserId,
    update,
    updateByUserId,
    deleteById,
    notEnrolledStudent
};
