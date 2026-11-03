const pool = require('../config/db');


const create = async (studentData) => {
    const {first_name , last_name , email, phone} = studentData;
    const query = `INSERT INTO students (first_name , last_name , email , phone ) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [first_name, last_name, email, phone];

    const result = await pool.query(query, values);
    return result.rows[0];
}   


const findAll = async () => {
    const query = `SELECT * FROM students ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
}

const findById  = async (id) =>{
    const query = `SELECT * FROM students WHERE id = $1`;
    const value = [id];
    const result = await pool.query(query,value);
    return result.rows[0];
}


const update = async (id , studentData) => {
    const allowedFields = ['first_name', 'last_name', 'email', 'phone'];

    const fields = Object.keys(studentData).filter(key => allowedFields.includes(key));
    if(fields.length === 0){
        throw new Error('No valid fields provided for update');
    }
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE students SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...fields.map(field => studentData[field])];

    const result = await pool.query(query, values);
    return result.rows[0];
}


const deleteById = async(id) => {
    const query = `DELETE FROM students WHERE id = $1 RETURNING *`;
    const value = [id];
    const result = await pool.query(query,value);
    return result.rowCount > 0;
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    deleteById
}