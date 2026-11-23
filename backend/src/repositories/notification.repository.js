const pool = require("../config/db");

const createNotification  = async({user_id , title , message , type}) =>{
    const query = `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [user_id , title , message, type];
    const result = await pool.query(query ,values);
    return result.rows[0];
};

const createAnnouncement = async(userIds, { title, message, type }) =>{
    if(!userIds || userIds.length === 0) return [];
    const values = [];
    const placeholders =  userIds.map((userId, index) => {
        const startIndex = index * 4;
        values.push(userId, title, message, type);
        return `($${startIndex + 1}, $${startIndex + 2}, $${startIndex + 3}, $${startIndex + 4})`;
    }).join(', ');

    const query = `INSERT INTO notifications (user_id, title, message, type) VALUES ${placeholders} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows;
};



const findByUserId = async (userId, { unreadOnly = false, page, limit } = {}) => {
    let whereClause = `WHERE user_id = $1`;
    const values = [userId];

    if (unreadOnly) {
        whereClause += ` AND is_read = false`;
    }

    if (!page && !limit) {
        const query = `SELECT * FROM notifications ${whereClause} ORDER BY created_at DESC`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;

    const dataQuery = `
        SELECT * FROM notifications
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total FROM notifications ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [userId, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        notifications: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: total === 0 ? 0 : Math.ceil(total / parsedLimit)
    };
};


const getUnreadCount = async (userId) => {
    const query = `SELECT COUNT(*)::int AS unread_count FROM notifications WHERE user_id = $1 AND is_read = false`;
    const result = await pool.query(query, [userId]);
    return result.rows[0]?.unread_count || 0;
};


const markAsRead = async (id, userId) => {
    const query = `UPDATE notifications SET is_read = true  WHERE id = $1 AND user_id = $2 RETURNING *`;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0] || null;
};

const markAllAsRead = async (userId) => {
    const query = ` UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING id `;
    const result = await pool.query(query, [userId]);
    return result.rowCount;
};


const deleteById = async (id, userId) => {
    const query = ` DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING * `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0] || null;
};


const findAdminUserIds = async () => {
    const query = `SELECT id FROM users WHERE role = 'admin'`;
    const result = await pool.query(query);
    return result.rows.map(row => row.id);
};


const findStudentUserIdsByCourseId = async (courseId) => {
    const query = `
        SELECT DISTINCT s.user_id
        FROM enrollments e
        JOIN students s ON e.student_id = s.id
        WHERE e.course_id = $1
        AND s.user_id IS NOT NULL
    `;
    const result = await pool.query(query, [courseId]);
    return result.rows.map(row => row.user_id);
};


const findAllStudentUserIds = async () => {
    const query = `SELECT id FROM users WHERE role = 'student'`;
    const result = await pool.query(query);
    return result.rows.map(row => row.id);
};


const createManyNotifications = async (userIds, { title, message, type }) => {
    if (!userIds.length) return [];
    const query = `
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type
        )
        SELECT
            user_id,
            $2,
            $3,
            $4
        FROM UNNEST($1::INTEGER[]) AS user_id
        RETURNING *
    `;

    const values = [userIds, title, message, type];

    const result = await pool.query(query, values);

    return result.rows;
};


module.exports = {
    createNotification,
    createAnnouncement,
    findByUserId,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteById,
    findAdminUserIds,
    findStudentUserIdsByCourseId,
    findAllStudentUserIds,
    createManyNotifications
};
