import apiClient from "./apiClient";

export const getNotifications = async(params={}) =>{
    const response = await apiClient.get("/notifications" , {params});
    return response.data.data;
};

export const getUnreadCount = async() =>{
    const resp = await apiClient.get("/notifications/unread-count");
    return resp.data.data.unread_count;
};

export const markNotificationAsRead = async(id) =>{
    const resp = await apiClient.patch(`/notifications/${id}/read`);
    return resp.data.data;
};

export const markAllNotificationsAsRead = async() =>{
    const resp = await apiClient.patch("/notifications/read-all");
    return resp.data.data;
};


export const deleteNotification = async(id) =>{
    const resp = await apiClient.delete(`/notifications/${id}`);
    return resp.data;
};

export const sendAnnouncement = async (data) => {
    const response = await apiClient.post("/notifications/announcement", data);
    return response.data;
};