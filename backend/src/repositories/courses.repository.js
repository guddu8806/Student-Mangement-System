const pool = require('../config/db');

//  create, view, update, and delete courses. 

const create = async(courseData) =>{
    const {course_code , course_name, description , credits} = courseData;
    const query = `INSERT INTO courses (course_code , course_name , description , credits ) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [course_code , course_name , description , credits];

    const result = await pool.query(query, values);
    return result.rows[0];
}

const findById = async(id) =>{
    const query = `SELECT * FROM courses WHERE id = $1`;
    const value = [id];
    const result = await pool.query(query,value);

    return result.rows[0];
}

const findAll = async () => {
    const query = `SELECT * FROM courses ORDER BY id`;
    const result = await pool.query(query);
    return result.rows;
}

const update = async(id, courseData) =>{
    const allowedFields = ['course_code', 'course_name', 'description', 'credits'];
    const fields = Object.keys(courseData).filter(key => allowedFields.includes(key));
    if(fields.length === 0){
        throw new Error('No valid fields provided for update');
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE courses SET ${setClause} WHERE id = $1 RETURNING *`;
    const values = [id, ...fields.map(field => courseData[field])];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const deleteById = async(id) =>{
    const query = `DELETE FROM courses WHERE id = $1 RETURNING *`;
    const value = [id];
    const result = await pool.query(query,value);
    return result.rowCount > 0;
}

module.exports = {
    create,
    findById,
    findAll,
    update,
    deleteById
}
