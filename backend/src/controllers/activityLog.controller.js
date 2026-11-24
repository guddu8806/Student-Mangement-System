const activityLogService = require('../services/activityLog.service');

const getAllLogs = async (req, res, next) => {
    try {
        const queryParams = { ...req.query };
        if (req.user && req.user.role === 'student') {
            queryParams.userId = req.user.id;
        } else if (req.user && req.user.role === 'admin') {
            // if (!queryParams.userId) {
            //     queryParams.userId = req.user.id;
            // } else if (queryParams.userId === 'all') {
            //     delete queryParams.userId;
            // }
            if(queryParams.userId === 'all' || !queryParams.userId){
                delete queryParams.userId;
            }
        }

        const result = await activityLogService.fetchActivityLogs(queryParams);
        res.status(200).json({
            success: true,
            message: "Activity logs retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getFilterOptions = async (req, res, next) => {
    try {
        const filters = await activityLogService.fetchFilterOptions();
        if (req.user && req.user.role === 'student') {
            filters.users = filters.users.filter(u => u.id === req.user.id);
        }

        res.status(200).json({
            success: true,
            message: "Filter options retrieved successfully",
            data: filters
        });
    } catch (error) {
        next(error);
    }
};

const getLogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const log = await activityLogService.fetchActivityLogById(id);
        if (req.user && req.user.role === 'student' && log && log.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You cannot view another user's activity log"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity log retrieved successfully",
            data: log
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllLogs,
    getFilterOptions,
    getLogById
};
