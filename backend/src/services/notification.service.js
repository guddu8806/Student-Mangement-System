const notificationRepo = require('../repositories/notification.repository');
const AppError = require('../utils/AppError');

const emitNotifications = (notifications) => {
    const io = global.io;
    if (io && Array.isArray(notifications)) {
        notifications.forEach((notif) => {
            io.to(`user:${notif.user_id}`).emit('notification:new', notif);
        });
    }
};

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
    if(!adminIds.length) return [];
    const notifications = await notificationRepo.createManyNotifications(
        adminIds,
        { title, message, type }
    );
    emitNotifications(notifications);
    return notifications;
};


// Send notification to students enrolled in a course
const notifyCourseStudents = async (courseId, { title, message, type }) => {
    const studentUserIds = await notificationRepo.findStudentUserIdsByCourseId(courseId);
    if(!studentUserIds.length) return [];
    const notifications = await notificationRepo.createManyNotifications(
        studentUserIds,
        { title, message, type }
    );
    emitNotifications(notifications);
    return notifications;
};


// Send notification to all students
const notifyAllStudents = async ({ title, message, type }) => {
    const studentUserIds = await notificationRepo.findAllStudentUserIds();
    if(!studentUserIds.length) return [];
    const notifications = await notificationRepo.createManyNotifications(
        studentUserIds,
        { title, message, type }
    );
    emitNotifications(notifications);
    return notifications;
};


// Get user notifications
const getUserNotifications = async (userId, { unreadOnly = false, page, limit } = {}) => {
    const unreadBool = unreadOnly === 'true' || unreadOnly === true;
    const notificationsResult = await notificationRepo.findByUserId(
        userId,
        { unreadOnly: unreadBool, page, limit }
    );
    const unreadCount = await notificationRepo.getUnreadCount(userId);

    if (notificationsResult && !Array.isArray(notificationsResult)) {
        return {
            ...notificationsResult,
            unreadCount
        };
    }

    return {
        notifications: notificationsResult,
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
