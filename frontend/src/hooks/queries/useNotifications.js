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

export const useNotificationsQuery = (params = {}) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: async () => {
      const data = await getNotifications(params);
      return data;
    },
  });
};

export const useUnreadCountQuery = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount,
    queryFn: getUnreadCount,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
};

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
