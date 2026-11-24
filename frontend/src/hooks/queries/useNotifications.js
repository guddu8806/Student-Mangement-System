import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendAnnouncement,
} from "../../services/api/notification.api";

export const NOTIFICATION_KEYS = {
  all: ["notifications"],
  list: (params) => ["notifications", "list", params],
  unreadCount: ["notifications", "unreadCount"],
};

// Hook to fetch user notifications
export const useNotificationsQuery = (params = {}) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: async () => {
      const data = await getNotifications(params);
      return data;
    },
  });
};

// Hook to fetch unread notification count
export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: getUnreadCount,
  });
};

// Hook to mark a single notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// Hook to mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// Hook to delete a notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

// Hook to broadcast an announcement
export const useSendAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => sendAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["activityLogs"] });
    },
  });
};
