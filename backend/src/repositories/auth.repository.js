const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const findUserById = async (id) => {
    const query = `SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const createUser = async (user) => {
    const { name, email, password_hash, role } = user;
    const query = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [name, email, password_hash, role];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const updateUserName = async (userId, name) => {
    const query = `
        UPDATE users
        SET name = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, email, role, created_at, updated_at
    `;
    const values = [name, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteUserById = async (id) => {

    await pool.query(`DELETE FROM students WHERE user_id = $1`, [id]);
    const query = `DELETE FROM users WHERE id = $1 RETURNING id, name, email, role`;
    const values = [id];
    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    updateUserName,
    deleteUserById,
};
