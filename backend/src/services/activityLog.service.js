const activityRepository = require("../repositories/activityLog.repository");

const logActivity = async (data) => {
    try {
        if (!data.action || !data.entityType || !data.description) {
            console.warn("Activity log skipped: missing required fields", data);
            return null;
        }
        return await activityRepository.createActivityLog(data);
    } catch (error) {
        console.error("Failed to log activity:", error.message);
        return null;
    }
};

const fetchActivityLogs = async (filters = {}) => {
    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.max(1, parseInt(filters.limit, 10) || 10);

    return await activityRepository.getFilteredActivityLogs({
        page,
        limit,
        action: filters.action,
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        search: filters.search
    });
};

const fetchActivityLogById = async (id) => {
    const activityLog = await activityRepository.getActivityLogById(id);
    if (!activityLog) {
        throw new Error("Activity log not found");
    }
    return activityLog;
};

const fetchFilterOptions = async () => {
    return await activityRepository.getFilterOptions();
};

module.exports = {
    logActivity,
    fetchActivityLogs,
    fetchActivityLogById,
    fetchFilterOptions
};
