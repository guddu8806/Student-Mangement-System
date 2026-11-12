const notificationRepo = require('../repositories/notification.repository');
const AppError = require('../utils/AppError');

const notifyUser = async (userId, { title, message, type }) => {
    const notification = await notificationRepo.createNotification({ user_id: userId, title, message, type });
    const io = global.io;
    if (io) {
        io.to(`user:${userId}`).emit('notification:new', notification);
    }
    return notification;
};


const notifyAdmins = async ({ title, message, type }) => {
    const adminIds = await notificationRepo.findAdminUserIds();
    const notifications = [];
    for (const adminId of adminIds) {
        const notification = await notifyUser(adminId, {
            title,
            message,
            type
        });
        notifications.push(notification);
    }
    return notifications;
};


// Send notification to students enrolled in a course
const notifyCourseStudents = async (courseId, { title, message, type }) => {
    const studentUserIds = await notificationRepo.findStudentUserIdsByCourseId(courseId);
    const notifications = [];
    for (const userId of studentUserIds) {
        const notification = await notifyUser(userId, {
            title,
            message,
            type
        });
        notifications.push(notification);
    }
    return notifications;
};


// Send notification to all students
const notifyAllStudents = async ({ title, message, type }) => {
    const studentUserIds = await notificationRepo.findAllStudentUserIds();
    const notifications = [];
    for (const userId of studentUserIds) {
        const notification = await notifyUser(userId, {
            title,
            message,
            type
        });

        notifications.push(notification);
    }
    return notifications;
};


// Get user notifications
const getUserNotifications = async (userId, { unreadOnly = false } = {}) => {
    const notifications = await notificationRepo.findByUserId(
        userId,
        { unreadOnly }
    );
    const unreadCount = await notificationRepo.getUnreadCount(userId);
    return {
        notifications,
        unreadCount
    };
};


// Get unread notification count
const getUnreadCount = async (userId) => {
    return await notificationRepo.getUnreadCount(userId);
};


// Mark notification as read
const markAsRead = async (id, userId) => {
    const notifId = Number(id);
    if (!Number.isInteger(notifId) || notifId <= 0) {
        throw new AppError('Invalid notification ID', 400);
    }
    const notification = await notificationRepo.markAsRead(notifId, userId);
    if (!notification) {
        throw new AppError('Notification not found', 404);
    }
    return notification;
};


// Mark all notifications as read
const markAllAsRead = async (userId) => {
    return await notificationRepo.markAllAsRead(userId);
};


// Delete notification
const deleteNotification = async (id, userId) => {
    const notifId = Number(id);
    if (!Number.isInteger(notifId) || notifId <= 0) {
        throw new AppError('Invalid notification ID', 400);
    }

    const notification = await notificationRepo.deleteById(notifId, userId);
    if (!notification) {
        throw new AppError('Notification not found', 404);
    }
    return notification;
};


// Broadcast announcement to all students or specific course
const broadcastAnnouncement = async (adminUserId, { title, message, courseId }) => {
    if (!title || !message) {
        throw new AppError("Title and message are required for announcements", 400);
    }
    let targetUserIds = [];
    if (courseId) {
        targetUserIds = await notificationRepo.findStudentUserIdsByCourseId(Number(courseId));
    } else {
        targetUserIds = await notificationRepo.findAllStudentUserIds();
    }
    if (!targetUserIds.length) {
        return { count: 0, message: "No students found to receive this announcement." };
    }
    const payload = {
        title,
        message,
        type: "announcement"
    };
    const saved = await notificationRepo.createAnnouncement(targetUserIds, payload);
    const io = global.io;
    if (io) {
        saved.forEach((notif) => {
            io.to(`user:${notif.user_id}`).emit("notification:new", notif);
        });
    }

    return { count: saved.length };
};


module.exports = {
    notifyUser,
    notifyAdmins,
    notifyCourseStudents,
    notifyAllStudents,
    broadcastAnnouncement,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
