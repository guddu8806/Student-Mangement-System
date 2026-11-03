import { useState, useEffect } from "react";
import { UserPlus, Search, RefreshCw } from "lucide-react";
import { createStudent, deleteStudent, getAllStudents, updateStudent } from "../services/api/student.api";
import StudentForm from "../features/students/StudentForm";
import StudentTable from "../features/students/StudentTable";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load students from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStudents()
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch((err) => setError(err?.response?.data?.message || "Failed to load students."))
      .finally(() => setLoading(false));
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
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete student.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();
    const fullName = `${student.first_name || student.firstName || ""} ${student.last_name || student.lastName || ""}`.toLowerCase();
    const email = (student.email || "").toLowerCase();
    const phone = (student.phone || "").toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="min-h-screen flex-1 bg-slate-50 px-8 py-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-30">
      {error && !isModalOpen && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">All Students</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {students.length} student{students.length === 1 ? "" : "s"} total
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 sm:flex-none"
              >
                <UserPlus size={17} />
                <span>Add Student</span>
              </button>

              <button
                onClick={fetchStudents}
                title="Refresh list"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
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
