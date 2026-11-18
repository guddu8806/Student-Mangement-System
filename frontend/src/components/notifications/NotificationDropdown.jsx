import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import {
    CheckCheck,
    Trash2,
    BookOpen,
    GraduationCap,
    AlertTriangle,
    CheckCircle2,
    Info,
    UserCheck,
    Megaphone
} from "lucide-react";

const NotificationDropdown = ({ onClose }) => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, loading } = useNotifications();
    const [filter, setFilter] = useState("all");
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();

    const announcementCount = notifications.filter((n) =>
        (n.type || "").toLowerCase().includes("announcement")
    ).length;

    const filtered = filter === "unread"
        ? notifications.filter((n) => !n.is_read)
        : filter === "announcements"
        ? notifications.filter((n) => (n.type || "").toLowerCase().includes("announcement"))
        : notifications;

    const getRoute = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("enrollment")) return "/enrollments";
        if (t.includes("course")) return "/courses";
        if (t.includes("welcome")) return "/courses";
        if (t.includes("user")) return user?.role === "admin" ? "/students" : "/profile";
        return "/dashboard";
    };

    const handleClick = async (notif) => {
        if (!notif.is_read) {
            await markAsRead(notif.id);
        }
        if ((notif.type || "").toLowerCase().includes("announcement")) {
            setExpandedId((prev) => (prev === notif.id ? null : notif.id));
            return;
        }
        navigate(getRoute(notif.type));
        onClose();
    };

    const getIcon = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("announcement")) {
            return <Megaphone size={17} className="text-violet-600 dark:text-violet-400" />;
        }
        if (t.includes("confirmed") || t === "enrollment") {
            return <CheckCircle2 size={17} className="text-emerald-500" />;
        }
        if (t.includes("dropped")) {
            return <AlertTriangle size={17} className="text-amber-500" />;
        }
        if (t.includes("course")) {
            return <BookOpen size={17} className="text-violet-500" />;
        }
        if (t.includes("welcome")) {
            return <GraduationCap size={17} className="text-indigo-500" />;
        }
        if (t.includes("user")) {
            return <UserCheck size={17} className="text-blue-500" />;
        }
        return <Info size={17} className="text-gray-500" />;
    };

    const formatTime = (ts) => {
        if (!ts) return "";
        const diff = Math.floor((new Date() - new Date(ts)) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="cursor-pointer flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <CheckCheck size={14} /> Mark all read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 px-4 pt-2 dark:border-gray-700 dark:bg-gray-800/50">
                <button
                    onClick={() => setFilter("all")}
                    className={`pb-2 text-xs font-medium border-b-2 mr-3 transition-colors cursor-pointer ${
                        filter === "all"
                            ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`pb-2 text-xs font-medium border-b-2 mr-3 transition-colors cursor-pointer ${
                        filter === "unread"
                            ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    }`}
                >
                    Unread ({unreadCount})
                </button>
                {announcementCount > 0 && (
                    <button
                        onClick={() => setFilter("announcements")}
                        className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1 ${
                            filter === "announcements"
                                ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                    >
                        <Megaphone size={11} /> Broadcasts ({announcementCount})
                    </button>
                )}
            </div>

            {/* Items List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60">
                {loading ? (
                    <div className="p-8 text-center text-xs text-gray-400">Loading notifications...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {filter === "unread" ? "You're all caught up!" : "You will receive notifications here."}
                        </p>
                    </div>
                ) : (
                    filtered.map((notif) => {
                        const isAnnouncement = (notif.type || "").toLowerCase().includes("announcement");
                        const isExpanded = expandedId === notif.id;

                        return (
                            <div
                                key={notif.id}
                                onClick={() => handleClick(notif)}
                                className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 ${
                                    !notif.is_read ? "bg-violet-50/30 dark:bg-violet-950/20" : ""
                                }`}
                            >
                                <div className={`mt-0.5 rounded-lg p-2 ${
                                    isAnnouncement
                                        ? "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
                                        : "bg-gray-100 dark:bg-gray-700"
                                }`}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1 pr-6">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className={`text-xs font-semibold ${!notif.is_read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                                            {notif.title}
                                        </h4>
                                        {isAnnouncement && (
                                            <span className="rounded bg-violet-100 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
                                                Broadcast
                                            </span>
                                        )}
                                        {!notif.is_read && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
                                        )}
                                    </div>
                                    <p className={`text-xs text-gray-600 dark:text-gray-300 mt-0.5 ${isExpanded ? "" : "line-clamp-2"}`}>
                                        {notif.message}
                                    </p>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                                        {formatTime(notif.created_at)}
                                    </span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(notif.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 absolute right-3 top-3 text-gray-400 hover:text-red-500 transition-opacity"
                                    title="Delete"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;