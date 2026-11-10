import { useEffect, useState} from "react";
import { Plus, RefreshCw, Search } from "lucide-react";
import { createCourse, deleteCourse, getAllCourses, updateCourse } from "../services/api/course.api";
import CourseForm from "../features/courses/CourseForm";
import CourseTable from "../features/courses/CourseTable";
import {useAuth} from "../context/AuthContext";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const { user ,token } = useAuth();

  const isLoggedIn = Boolean(token);
  const isUser = isLoggedIn && user?.role === "admin";

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllCourses();
      setCourses(response);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to load courses from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (course = null) => {
    setEditingCourse(course);
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (courseData) => {
    setSaving(true);
    setError("");

    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse.id, courseData);
        setCourses((current) =>
          current.map((course) =>
            course.id === editingCourse.id ? { ...course, ...(updated || courseData) } : course
          )
        );
      } else {
        const created = await createCourse(courseData);
        setCourses((current) => [created, ...current]);
      }

      closeModal();
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to save course."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.course_name}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    try {
      await deleteCourse(course.id);
      setCourses((current) => current.filter((item) => item.id !== course.id));
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to delete course."
      );
    }
  };

  const query = search.trim().toLowerCase();
  const filteredCourses = courses.filter((course) =>
    [course.course_name, course.course_code, course.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query))
  );

  return (
    <main className="min-h-screen flex-1 bg-slate-50 px-8 py-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {error && !isModalOpen && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
          >
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">All Courses</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {courses.length} course{courses.length === 1 ? "" : "s"} total
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search courses..."
                  aria-label="Search courses"
                  className="w-full rounded-lg border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-2">
                {isUser && (
                  <button
                    onClick={() => openModal()}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 sm:flex-none"
                  >
                    <Plus size={17} />
                    <span>Add Course</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <CourseTable
            courses={filteredCourses}
            loading={loading}
            search={search}
            onEdit={openModal}
            onDelete={handleDelete}
            isUser={isUser}
          />
        </section>
      </div>

      {isModalOpen && (
        <CourseForm
          key={editingCourse?.id || "new"}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingCourse}
          saving={saving}
          error={isModalOpen ? error : ""}
        />
      )}
    </main>
  );
}

export default Courses;
