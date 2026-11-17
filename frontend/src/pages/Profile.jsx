import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Lock, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api/auth.api";
import { getAllEnrollments } from "../services/api/enrollment.api";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, token, login, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [enrollments, setEnrollments] = useState([]);

  const isAdmin = profile?.role === "admin";
  const roleLabel = isAdmin ? "Administrator" : "Student";

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [data, enrollmentsData] = await Promise.all([getProfile(), getAllEnrollments(),]);
        if (!active) return;
        setEnrollments(enrollmentsData);
        const user = data?.user || {};
        const phone = data?.student?.phone || "";
        setProfile({ ...user, phone });
        setFormData({ name: user?.name || "", phone });
      } catch {
        if (!active) return;
        setMessage("Failed to load profile.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [authUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = { name: formData.name.trim() };
      if (!isAdmin) {
        payload.phone = formData.phone.trim();
      }
      const res = await updateProfile(payload);
      const updatedUser = res?.user || {};
      const updatedPhone = res?.student?.phone ?? (isAdmin ? "" : formData.phone.trim());
      setProfile((prev) => ({ ...prev, ...updatedUser, phone: updatedPhone }));
      login(updatedUser, token);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
    setIsEditing(false);
  };

  const enrolledCoursesCount = enrollments.length;
  const totalCredits = enrollments.reduce((sum, item) => sum + Number(item.credits || 0), 0);

  const infoItems = [
    { label: "Full Name", val: profile?.name },
    { label: "Email Address", val: profile?.email },
    ...(!isAdmin ? [{ label: "Phone Number", val: profile?.phone }] : []),
    { label: "System Role", val: roleLabel },
    { label: "Member Since", val: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Active" },
  ];

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-500">Loading profile...</div>;
  }

  return (
    <main className="mx-auto w-10/12 space-y-6 py-4 text-slate-900 transition-colors  dark:text-slate-100 sm:px-6">
      {message.text && (
        <div
          role="alert"
          className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-medium ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
          <button type="button" onClick={() => setMessage({ type: "", text: "" })} className="p-1 hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header Profile Card */}
      <section className="overflow-hidden mt-2 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="px-6 py-16 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.name || "User"}</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">{profile?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                {roleLabel}
              </span>
              <button
                type="button"
                onClick={() => (isEditing ? cancelEditing() : setIsEditing(true))}
                disabled={saving}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                type="button"
                onClick={() => { logout(); navigate("/login"); }}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Account Information Section */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              {isEditing ? "Edit Account Details" : "Account Information"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? "Update your personal details below" : "Your registered account details and credentials"}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
                />
              </div>

              {!isAdmin && (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel" placeholder="+1 555-0199"  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500 dark:border-slate-700"
                  />
                </div>
              )}

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400"><Lock size={10} /> Locked</span>
                </div>
                <input  disabled type="email"  value={profile?.email || ""} className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"/>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Account Role</label>
                <input disabled value={roleLabel} className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400" />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !formData.name.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-violet-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infoItems.map(({ label, val }) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 dark:border-slate-800/60 dark:bg-slate-800/30">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-1.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {val || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Academic Information Section (Student Only) */}
      {!isAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6  shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Academic Information</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your enrolled courses and credit progress</p>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
            >
              Browse Courses &rarr;
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled Courses</p>
              <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
                {enrolledCoursesCount}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Credits</p>
              <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
                {totalCredits}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Enrolled Courses
            </h3>

            {enrollments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">You are not enrolled in any courses yet.</p>
                <Link
                  to="/courses"
                  className="mt-2 inline-block rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {enrollments.map((item) => (
                  <div
                    key={item.id ?? item.enrollment_id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 transition hover:border-violet-200 dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {item.course_code && (
                          <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:bg-violet-950/80 dark:text-violet-300">
                            {item.course_code}
                          </span>
                        )}
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {item.course_name}
                        </h4>
                      </div>
                    </div>

                    <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 shadow-2xs dark:bg-slate-900 dark:text-violet-300">
                      {item.credits} Credits
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default Profile;
