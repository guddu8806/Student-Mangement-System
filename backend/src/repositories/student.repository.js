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

const findAll = async () => {
    const query = `SELECT * FROM students ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
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
    const checkQuery = `SELECT user_id FROM students WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);
    if (checkResult.rows.length === 0) {
        return false;
    }

    const userId = checkResult.rows[0].user_id;

    const query = `DELETE FROM students WHERE id = $1 RETURNING *`;
    const value = [id];
    const result = await pool.query(query, value);

    // 3. If there was a linked user login, clean it up as well
    if (userId) {
        await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);
    }

    return result.rowCount > 0;
};

module.exports = {
    create,
    findAll,
    findById,
    findByUserId,
    update,
    updateByUserId,
    deleteById,
};
