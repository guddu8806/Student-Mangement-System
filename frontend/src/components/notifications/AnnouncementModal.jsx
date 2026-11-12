import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { sendAnnouncement } from "../../services/api/notification.api";
import { getDashboardCourses } from "../../services/api/dashboard.api";

const AnnouncementModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]);
    const [sending, setSending] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ error: "", success: "" });

    useEffect(() => {
        if (isOpen) {
            getDashboardCourses()
                .then((data) => setCourses(data || []))
                .catch(() => {});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setStatusMsg({ error: "", success: "" });

        try {
            const res = await sendAnnouncement({
                title,
                message,
                courseId: courseId ? Number(courseId) : null,
            });
            setStatusMsg({ error: "", success: res.message || "Announcement broadcasted successfully!" });
            setTimeout(() => {
                setTitle("");
                setMessage("");
                setCourseId("");
                setStatusMsg({ error: "", success: "" });
                onClose();
            }, 1200);
        } catch (err) {
            setStatusMsg({ error: err.response?.data?.message || "Failed to broadcast announcement", success: "" });
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                        <Megaphone size={20} />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Broadcast Announcement</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {statusMsg.error && (
                    <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                        {statusMsg.error}
                    </div>
                )}
                {statusMsg.success && (
                    <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        {statusMsg.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Target Audience
                        </label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                            <option value="">All Registered Students</option>
                            {courses.map((c) => (
                                <option key={c.id || c.course_id} value={c.id || c.course_id}>
                                    Only students in: {c.course_name} ({c.course_code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Announcement Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Schedule Change or Exam Notice"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Message
                        </label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Write your announcement details here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
                        >
                            {sending ? "Broadcasting..." : "Broadcast"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnouncementModal;
