import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/queries/useAuth";
import { useProfile, useUpdateProfile } from "../hooks/queries/useProfile";
import { useEnrollments } from "../hooks/queries/useEnrollments";
import ProfileHeader from "../features/profile/ProfileHeader";
import ProfileInfo from "../features/profile/ProfileInfo";
import ProfileEditForm from "../features/profile/ProfileEditForm";
import ProfileAcademicInfo from "../features/profile/ProfileAcademicInfo";
import Loader from "../components/common/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const logout = useLogout();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const { data: profileData, isLoading: loading, error: profileError } = useProfile();
  const { data: enrollments = [] } = useEnrollments();
  const updateMutation = useUpdateProfile();

  const user = profileData?.user || {};
  const student = profileData?.student || {};
  const profile = {
    ...user,
    phone: student.phone || user.phone || "",
  };

  const isAdmin = profile?.role === "admin";
  const roleLabel = isAdmin ? "Administrator" : "Student";

  const startEditing = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const payload = { name: formData.name.trim() };
      if (!isAdmin) {
        payload.phone = formData.phone.trim();
      }
      const res = await updateMutation.mutateAsync(payload);
      const updatedUser = res?.user || {};
      login(updatedUser, token);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || err?.message || "Failed to update profile.",
      });
    }
  };

  const infoItems = [
    { label: "Full Name", val: profile?.name },
    { label: "Email Address", val: profile?.email },
    ...(!isAdmin ? [{ label: "Phone Number", val: profile?.phone }] : []),
    { label: "System Role", val: roleLabel },
    { label: "Member Since", val: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Active" },
  ];

  if (loading) {
    return <Loader size="md" minHeight="min-h-[50vh]" text="Loading profile..." />;
  }

  if (profileError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-rose-500">
        Failed to load profile. Please try refreshing or logging in again.
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 px-4 py-4 text-slate-900 transition-colors dark:text-slate-100 sm:px-6 lg:px-4">
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
          <button
            type="button"
            onClick={() => setMessage({ type: "", text: "" })}
            className="p-1 hover:opacity-75"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <ProfileHeader
        profile={profile}
        roleLabel={roleLabel}
        isEditing={isEditing}
        saving={updateMutation.isPending}
        onEditToggle={() => (isEditing ? cancelEditing() : startEditing())}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

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
          <ProfileEditForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSave}
            onCancel={cancelEditing}
            saving={updateMutation.isPending}
            isAdmin={isAdmin}
            profile={profile}
            roleLabel={roleLabel}
          />
        ) : (
          <ProfileInfo infoItems={infoItems} />
        )}
      </section>

      {!isAdmin && (
        <ProfileAcademicInfo enrollments={enrollments} />
      )}
    </div>
  );
};

export default Profile;
