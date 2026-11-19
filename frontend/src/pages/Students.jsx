import { useState, useEffect } from "react";
import { UserPlus, Search, FileSpreadsheet } from "lucide-react";
import { createStudent, deleteStudent, getAllStudents, updateStudent, notEnrolledStudents as notEnrollApi } from "../services/api/student.api";
import StudentForm from "../features/students/StudentForm";
import StudentTable from "../features/students/StudentTable";
import { getAllCourses } from "../services/api/course.api";
import { getAllEnrollments } from "../services/api/enrollment.api";
import exportToCsv from "../config/exportoCsv";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notEnrolledStudents, setNotEnrolledStudent] = useState([]);
  const [enrollmentFilter, setEnrollmentFilter] = useState("all");
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [data, notEnrolledData, courseData, enrollmentData] = await Promise.all([getAllStudents(), notEnrollApi(), getAllCourses(), getAllEnrollments()]);
        console.log("Not Enrolled data", notEnrolledData);
        if (active) {
          setStudents(data);
          setNotEnrolledStudent(notEnrolledData);
          setCourses(courseData);
          setEnrollments(enrollmentData);
        }
      } catch (err) {
        if (active) setError(err?.response?.data?.message || "Failed to load students from backend.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const openModal = (student = null) => {
    setEditingStudent(student);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError("");

    try {
      if (editingStudent) {
        const updated = await updateStudent(editingStudent.id, formData);
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updated } : s))
        );
      } else {
        const created = await createStudent(formData);
        setStudents((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setNotEnrolledStudent((prev) => prev.filter((s) => (s.id ?? s.student_id) !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete student.");
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
    const query = search.toLowerCase();
    const fullName = `${student.first_name || student.firstName || ""} ${student.last_name || student.lastName || ""}`.toLowerCase();
    const email = (student.email || "").toLowerCase();
    const phone = (student.phone || "").toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="min-h-screen flex-1 bg-slate-50 px-4 py-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-4">
      {error && !isModalOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex w-1/2 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-lg border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700"
              />
            </div>

            <div className=" sm:w-auto">
              <select
                value={enrollmentFilter}
                onChange={(e) => setEnrollmentFilter(e.target.value)}
                className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <optgroup label="General Status" className="font-semibold text-slate-500">
                  <option value="all">All Students</option>
                  <option value="enrolled">Enrolled in Any Course</option>
                  <option value="not_enrolled">Not Enrolled in Any Course</option>
                </optgroup>
                {courses.length > 0 && (
                  <optgroup label="Enrolled In Course" className="font-semibold text-slate-500">
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                         {course.course_name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div className="flex items-center gap-2 mr-10">
              <button
                onClick={() => openModal()}
                className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 sm:flex-none"
              >
                <UserPlus size={17} />
                <span>Add Student</span>
              </button>
            </div>
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
