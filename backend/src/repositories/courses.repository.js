const pool = require('../config/db');

//  create, view, update, and delete courses. 

const create = async(courseData) =>{
    const {course_code , course_name, description , credits, capacity} = courseData;
    const query = `INSERT INTO courses (course_code , course_name , description , credits, capacity ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [course_code , course_name , description , credits, capacity];

    const result = await pool.query(query, values);
    return result.rows[0];
}

const findById = async(id) =>{
    const query = `
        SELECT 
            c.*,
            COUNT(e.id)::int AS enrolled_count,
            GREATEST(0, (COALESCE(c.capacity, 30) - COUNT(e.id)))::int AS available_seats
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.id = $1
        GROUP BY c.id
    `;
    const value = [id];
    const result = await pool.query(query,value);

    return result.rows[0];
}

const findAll = async ({ page, limit, search } = {}) => {
    const conditions = [];
    const values = [];

    if (search && search.trim()) {
        values.push(`%${search.trim()}%`);
        const idx = values.length;
        conditions.push(`(c.course_name ILIKE $${idx} OR c.course_code ILIKE $${idx} OR c.description ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    if (!page && !limit) {
        const query = `
            SELECT 
                c.*,
                COUNT(e.id)::int AS enrolled_count,
                GREATEST(0, (COALESCE(c.capacity, 30) - COUNT(e.id)))::int AS available_seats
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            ${whereClause}
            GROUP BY c.id
            ORDER BY c.id
        `;
        const result = await pool.query(query, values);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const dataQuery = `
        SELECT 
            c.*,
            COUNT(e.id)::int AS enrolled_count,
            GREATEST(0, (COALESCE(c.capacity, 30) - COUNT(e.id)))::int AS available_seats
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        ${whereClause}
        GROUP BY c.id
        ORDER BY c.id
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM courses c
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        courses: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: total === 0 ? 0 : Math.ceil(total / parsedLimit)
    };
};

const update = async(id, courseData) =>{
    const allowedFields = ['course_code', 'course_name', 'description', 'credits', 'capacity'];
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
