import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead, deleteNotification } from "../services/api/notification.api";
import { NOTIFICATION_KEYS } from "../hooks/queries/useNotifications";
import socket from "../config/socket";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const queryClient = useQueryClient();
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
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const data = await getNotifications();
                if (isMounted) {
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                }
            } catch (err) {
                if (isMounted) console.error("Error fetching notifications: ", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();

        socket.connect();
        const handleNewNotification = (newNotif) => {
            console.log("New notification received:", newNotif);
            setNotifications((prev) => [
                newNotif,
                ...prev.filter((item) => item.id !== newNotif.id)
            ]);
            setUnreadCount((prev) => prev + 1);
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        };
        socket.on("notification:new", handleNewNotification);
        return () => {
            isMounted = false;
            socket.off("notification:new", handleNewNotification);
            socket.disconnect();
        };
    }, [token, user, queryClient]);

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
        } catch (err) {
            console.error("Failed to mark as read: ", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
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
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
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