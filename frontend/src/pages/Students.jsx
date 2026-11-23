import { useState, useEffect } from "react";
import { UserPlus, Search } from "lucide-react";
import {
  useStudents,
  useNotEnrolledStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "../hooks/queries/useStudents";
import { useCourses } from "../hooks/queries/useCourses";
import { useEnrollments } from "../hooks/queries/useEnrollments";
import StudentForm from "../features/students/StudentForm";
import StudentTable from "../features/students/StudentTable";

function Students() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");

  // TanStack Query Hooks
  const { data: students = [], isLoading: loading, error: queryError } = useStudents();
  const { data: notEnrolledStudents = [] } = useNotEnrolledStudents();
  const { data: courses = [] } = useCourses();
  const { data: enrollments = [] } = useEnrollments();

  // Mutation Hooks
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const saving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openModal = (student = null) => {
    setEditingStudent(student);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (formData) => {
    setError("");
    try {
      if (editingStudent) {
        await updateMutation.mutateAsync({ id: editingStudent.id, studentData: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save student.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setError("");
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete student.");
    }
  };

  const unenrolledIdSet = new Set(
    notEnrolledStudents.map((s) => s.id ?? s.student_id)
  );

  const studentsByStatus = (students || []).filter((student) => {
    if (enrollmentFilter === "all") return true;
    if (enrollmentFilter === "not_enrolled") return unenrolledIdSet.has(student.id);
    if (enrollmentFilter === "enrolled") return !unenrolledIdSet.has(student.id);
    return enrollments.some(
      (e) =>
        String(e.course_id) === String(enrollmentFilter) &&
        String(e.student_id) === String(student.id)
    );
  });

  const filteredStudents = studentsByStatus.filter((student) => {
    const query = debouncedSearch.toLowerCase();
    const fullName = `${student.first_name || student.firstName || ""} ${student.last_name || student.lastName || ""}`.toLowerCase();
    const email = (student.email || "").toLowerCase();
    const phone = (student.phone || "").toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  const displayError = error || (queryError ? "Failed to load students from backend." : "");

  return (
    <div className="min-h-screen flex-1 bg-slate-50 px-4 py-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-4">
      {displayError && !isModalOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {displayError}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between ">
          <div className="w-1/2">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {enrollmentFilter === "all"
                ? "All Students"
                : enrollmentFilter === "enrolled"
                  ? "Enrolled Students"
                  : "Not Enrolled Students"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredStudents.length} of {students.length} student{students.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3  sm:flex-row sm:items-center ml-12">
            <select
              value={enrollmentFilter}
              onChange={(e) => setEnrollmentFilter(e.target.value)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Students</option>
              <option value="enrolled">Enrolled Only</option>
              <option value="not_enrolled">Not Enrolled</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-50">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-lg border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700"
              />
            </div>

            <button
              onClick={() => openModal()}
              className="cursor-pointer flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              <UserPlus size={17} />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        <StudentTable
          students={filteredStudents}
          loading={loading}
          search={search}
          onEdit={openModal}
          onDelete={handleDelete}
        />
      </section>

      {isModalOpen && (
        <StudentForm
          key={editingStudent?.id || "new"}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingStudent}
          saving={saving}
          error={isModalOpen ? error : ""}
        />
      )}
    </div>
  );
}

export default Students;