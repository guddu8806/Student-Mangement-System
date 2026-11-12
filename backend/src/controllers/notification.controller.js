const notificationService = require('../services/notification.service');

const getNotifications = async (req, res, next) => {
    try {
        const result = await notificationService.getUserNotifications(req.user.id, req.query);
        res.status(200).json({
            success: true,
            message: "Notifications retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getUnreadCount = async (req, res, next) => {
    try {
        const count = await notificationService.getUnreadCount(req.user.id);
        res.status(200).json({
            success: true,
            data: { unread_count: count }
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notification = await notificationService.markAsRead(id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.id);
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        await notificationService.deleteNotification(id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

const createAnnouncement = async (req, res, next) => {
    try {
        const result = await notificationService.broadcastAnnouncement(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: `Announcement sent successfully to ${result.count} students`,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createAnnouncement
};
