import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { useSendAnnouncement } from "../../hooks/queries/useNotifications";
import { useDashboardCourses } from "../../hooks/queries/useDashboard";

const TAGS = [
    { label: "General", prefix: "" },
    { label: "Urgent", prefix: "[URGENT] " },
    { label: "Exam Notice", prefix: "[EXAM] " },
    { label: "Academic", prefix: "[ACADEMIC] " }
];

const AnnouncementModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [courseId, setCourseId] = useState("");
    const [selectedTag, setSelectedTag] = useState("General");
    const [statusMsg, setStatusMsg] = useState({ error: "", success: "" });

    // TanStack Query Hooks
    const { data: courses = [] } = useDashboardCourses();
    const sendMutation = useSendAnnouncement();
    const sending = sendMutation.isPending;

    if (!isOpen) return null;

    const handleTagClick = (tag) => {
        setSelectedTag(tag.label);
        const clean = title.replace(/^\[(URGENT|EXAM|ACADEMIC)\]\s*/i, "");
        setTitle(tag.prefix ? `${tag.prefix}${clean}` : clean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMsg({ error: "", success: "" });

        try {
            const res = await sendMutation.mutateAsync({
                title: title.trim(),
                message: message.trim(),
                courseId: courseId ? Number(courseId) : null,
            });
            setStatusMsg({ error: "", success: res?.message || "Announcement broadcasted successfully!" });
            setTimeout(() => {
                setTitle("");
                setMessage("");
                setCourseId("");
                setSelectedTag("General");
                setStatusMsg({ error: "", success: "" });
                onClose();
            }, 1200);
        } catch (err) {
            setStatusMsg({ error: err.response?.data?.message || "Failed to broadcast announcement", success: "" });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 text-violet-600 dark:text-violet-400">
                        <Megaphone size={20} />
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Broadcast Announcement
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Send a live notification to students
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {statusMsg.error && (
                    <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
                        {statusMsg.error}
                    </div>
                )}
                {statusMsg.success && (
                    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {statusMsg.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Category Tag
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {TAGS.map((tag) => (
                                <button
                                    key={tag.label}
                                    type="button"
                                    onClick={() => handleTagClick(tag)}
                                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                                        selectedTag === tag.label
                                            ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Target Audience
                        </label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Announcement Title
                            </label>
                            <span className="text-[10px] text-slate-400">{title.length}/100</span>
                        </div>
                        <input
                            type="text"
                            required
                            maxLength={100}
                            placeholder="e.g. Schedule Change or Exam Notice"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Message Details
                            </label>
                            <span className="text-[10px] text-slate-400">{message.length}/500</span>
                        </div>
                        <textarea
                            required
                            rows={3}
                            maxLength={500}
                            placeholder="Write your announcement details here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {courseId ? "Target: Course Enrollees" : "Target: All Students"}
                        </span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={sending || !title.trim() || !message.trim()}
                                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-50 cursor-pointer transition"
                            >
                                {sending ? "Broadcasting..." : "Broadcast"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnouncementModal;
