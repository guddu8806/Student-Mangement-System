const pool = require("../config/db");

// 1. Insert activity log
const createActivityLog = async (data) => {
    const query = `
        INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
    `;
    const values = [
        data.userId || null,
        data.action,
        data.entityType,
        data.entityId || null,
        data.description
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getFilteredActivityLogs = async ({ page = 1, limit = 10, action, userId, startDate, endDate, search } = {}) => {
    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [];
    const values = [];
    if (action && action !== 'all') {
        if (action === 'PROFILE_UPDATED') {
            conditions.push(`al.action IN ('PROFILE_UPDATED', 'ADMIN_UPDATED')`);
        } else if (action === 'PROFILE_DELETED') {
            conditions.push(`al.action IN ('PROFILE_DELETED', 'ADMIN_DELETED')`);
        } else if (action === 'STUDENT_UPDATE') {
            conditions.push(`al.action IN ('STUDENT_UPDATE', 'STUDENT_UPDATED')`);
        } else if (action === 'STUDENT_DELETE') {
            conditions.push(`al.action IN ('STUDENT_DELETE', 'STUDENT_DELETED')`);
        } else {
            values.push(action);
            conditions.push(`al.action = $${values.length}`);
        }
    }
    if (userId && userId !== 'all') {
        values.push(Number(userId));
        conditions.push(`al.user_id = $${values.length}`);
    }
    if (startDate) {
        values.push(startDate);
        conditions.push(`al.created_at >= $${values.length}::timestamp`);
    }

    if (endDate) {
        values.push(`${endDate} 23:59:59`);
        conditions.push(`al.created_at <= $${values.length}::timestamp`);
    }

    if (search && search.trim() !== '') {
        values.push(`%${search.trim()}%`);
        conditions.push(`(al.description ILIKE $${values.length} OR al.action ILIKE $${values.length} OR al.entity_type ILIKE $${values.length} OR u.name ILIKE $${values.length} OR u.email ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const dataQuery = `
        SELECT 
            al.*, 
            u.name AS user_name, 
            u.email AS user_email, 
            u.role AS user_role
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ${whereClause}
        ORDER BY al.created_at DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;

    const countQuery = `
        SELECT COUNT(*)::int AS total
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, Number(limit), offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        logs: dataResult.rows,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)) || 1
    };
};

const getActivityLogById = async (id) => {
    const query = `
        SELECT al.*, u.name AS user_name, u.email AS user_email, u.role AS user_role
        FROM activity_logs al
        LEFT JOIN users u ON al.user_id = u.id
        WHERE al.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getFilterOptions = async () => {
    const usersQuery = `
        SELECT DISTINCT u.id, u.name, u.email, u.role
        FROM users u
        INNER JOIN activity_logs al ON u.id = al.user_id
        ORDER BY u.name ASC
    `;
    const actionsQuery = `SELECT DISTINCT action FROM activity_logs ORDER BY action ASC`;

    const [usersResult, actionsResult] = await Promise.all([
        pool.query(usersQuery),
        pool.query(actionsQuery)
    ]);

    return {
        users: usersResult.rows,
        actions: actionsResult.rows.map(row => row.action)
    };
};

module.exports = {
    createActivityLog,
    getFilteredActivityLogs,
    getActivityLogById,
    getFilterOptions
};
