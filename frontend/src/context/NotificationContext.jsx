import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, deleteNotification } from "../services/api/notification.api";
import socket from "../config/socket";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error("Error fetching notifications: ", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token || !user) {
            return;
        }
        fetchNotifications();
        socket.connect();
        const handleNewNotification = (newNotif) => {
            console.log("New notification received:", newNotif);
            setNotifications((prev) => [
                newNotif,
                ...prev.filter((item) => item.id !== newNotif.id)
            ]);
            setUnreadCount((prev) => prev + 1);
        };
        socket.on("notification:new", handleNewNotification);
        return () => {
            socket.off("notification:new", handleNewNotification);
            socket.disconnect();
        };
    }, [token, user?.id]);

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read: ", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read: ", err);
        }
    };

    const removeNotification = async (id) => {
        try {
            await deleteNotification(id);
            const target = notifications.find((n) => n.id === id);
            if (target && !target.is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            console.error("Failed to delete notification: ", err);
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                markAsRead,
                markAllAsRead,
                removeNotification,
                fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
};