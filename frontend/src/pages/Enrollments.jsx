import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEnrollments, useCreateEnrollment, useDeleteEnrollment } from "../hooks/queries/useEnrollments";
import { useStudents } from "../hooks/queries/useStudents";
import { useCourses } from "../hooks/queries/useCourses";
import EnrollmentForm from "../features/enrollments/EnrollmentForm";
import EnrollmentTable from "../features/enrollments/EnrollmentTable";

function Enrollments() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: enrollments = [], isLoading: loading, error: queryError } = useEnrollments();
  const { data: courses = [] } = useCourses();
  const { data: students = [] } = useStudents(undefined, { enabled: !isStudent });

  const createMutation = useCreateEnrollment();
  const deleteMutation = useDeleteEnrollment();

  const saving = createMutation.isPending;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openModal = () => {
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    setError("");
    try {
      await createMutation.mutateAsync(formData);
      closeModal();
    } catch (err) {
      const resMsg = err?.response?.data?.message;
      const message =
        typeof resMsg === "object" && resMsg !== null
          ? Object.values(resMsg).join(", ")
          : resMsg || err?.message || "Failed to enroll.";
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    const confirmMsg = isStudent
      ? "Are you sure you want to drop this course? Note: Courses can only be dropped within 24 hours of enrollment."
      : "Are you sure you want to remove this enrollment record?";

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setError("");
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      const resMsg = err?.response?.data?.message;
      const message =
        typeof resMsg === "object" && resMsg !== null
          ? Object.values(resMsg).join(", ")
          : resMsg || err?.message || "Failed to drop enrollment.";
      setError(message);
    }
  };

  const query = debouncedSearch.trim().toLowerCase();
  const filteredEnrollments = enrollments.filter((item) => {
    const studentName = item.student_name || `${item.first_name || ""} ${item.last_name || ""}`;
    const courseName = item.course_name || "";
    const courseCode = item.course_code || "";
    const email = item.student_email || item.email || "";

    return (
      studentName.toLowerCase().includes(query) ||
      courseName.toLowerCase().includes(query) ||
      courseCode.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query)
    );
  });

  const displayError = error || (queryError ? "Failed to load enrollment records." : "");

  return (
    <div className="flex-1 bg-slate-50 px-4 py-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-4">
      <div className="mx-auto max-w-7xl">
        {displayError && !isModalOpen && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
          >
            {displayError}
          </p>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                {isStudent ? "My Enrollments" : "All Enrollments"}
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {isStudent
                  ? `You are enrolled in ${enrollments.length} course${enrollments.length === 1 ? "" : "s"} (24-hour drop policy applies)`
                  : `${enrollments.length} enrollment${enrollments.length === 1 ? "" : "s"} total across all students`}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isStudent ? "Search my courses..." : "Search by student, course, email..."}
                  className="w-full rounded-lg border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700"
                />
              </div>

              <button
                onClick={openModal}
                className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                <Plus size={16} />
                <span>{isStudent ? "Enroll in Course" : "Enroll Student"}</span>
              </button>
            </div>
          </div>

          <EnrollmentTable
            enrollments={filteredEnrollments}
            loading={loading}
            onDelete={handleDelete}
            isStudent={isStudent}
          />
        </section>
      </div>

      {isModalOpen && (
        <EnrollmentForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          students={students}
          courses={courses}
          saving={saving}
          error={isModalOpen ? error : ""}
          isStudent = {isStudent}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default Enrollments;