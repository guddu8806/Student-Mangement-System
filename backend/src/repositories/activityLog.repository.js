const pool = require("../config/db");

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
    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Number(limit) || 10);
    const offset = (parsedPage - 1) * parsedLimit;
    const conditions = [];
    const values = [];
    if (action && action !== 'all') {
        const legacyActionMap = {
            'PROFILE_UPDATED': ['PROFILE_UPDATED', 'ADMIN_UPDATED'],
            'PROFILE_DELETED': ['PROFILE_DELETED', 'ADMIN_DELETED'],
            'STUDENT_UPDATE': ['STUDENT_UPDATE', 'STUDENT_UPDATED'],
            'STUDENT_DELETE': ['STUDENT_DELETE', 'STUDENT_DELETED']
        };
        const targetActions = legacyActionMap[action] || [action];
        values.push(targetActions);
        conditions.push(`al.action = ANY($${values.length}::text[])`);
    }
    if (userId && userId !== 'all') {
        values.push(Number(userId));
        conditions.push(`al.user_id = $${values.length}`);
    }
    if (startDate) {
        values.push(startDate);
        conditions.push(`al.created_at >= $${values.length}::date`);
    }

    if (endDate) {
        values.push(endDate);
        conditions.push(`al.created_at < ($${values.length}::date + INTERVAL '1 day')`);
    }

    const hasSearch = Boolean(search && search.trim() !== '');
    if (hasSearch) {
        values.push(`%${search.trim()}%`);
        const searchIdx = values.length;
        conditions.push(`(
            al.description ILIKE $${searchIdx} OR
            al.action ILIKE $${searchIdx} OR
            al.entity_type ILIKE $${searchIdx} OR
            u.name ILIKE $${searchIdx} OR
            u.email ILIKE $${searchIdx}
        )`);
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
        ${hasSearch ? 'LEFT JOIN users u ON al.user_id = u.id' : ''}
        ${whereClause}
    `;

    const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [...values, parsedLimit, offset]),
        pool.query(countQuery, values)
    ]);

    const total = countResult.rows[0]?.total || 0;

    return {
        logs: dataResult.rows,
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: total === 0 ? 0 : Math.ceil(total / parsedLimit)
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
        SELECT u.id, u.name, u.email, u.role
        FROM users u
        WHERE EXISTS (
            SELECT 1 FROM activity_logs al WHERE al.user_id = u.id
        )
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
