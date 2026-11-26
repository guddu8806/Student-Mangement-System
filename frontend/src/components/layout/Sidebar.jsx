import { NavLink, useNavigate } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/queries/useAuth";

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
    }`;

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800 lg:hidden">
          <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <div className="rounded-xl bg-violet-600 p-2 text-white shadow-md shadow-violet-600/25">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Edu<span className="text-violet-600 dark:text-violet-400">Core</span>
              </h1>
              <p className="text-[9px] font-medium tracking-wider text-gray-400 dark:text-gray-500">
                STUDENT SYSTEM
              </p>
            </div>
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 px-4 py-5">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Main Menu
            </p>
            <div className="mt-2 space-y-1">
              <NavLink to="/dashboard" onClick={onClose} className={navItemClass}>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/courses" onClick={onClose} className={navItemClass}>
                <span>Courses</span>
              </NavLink>
              <NavLink to="/enrollments" onClick={onClose} className={navItemClass}>
                <span>Enrollments</span>
              </NavLink>

              <NavLink to="/activity-logs" onClick={onClose} className={navItemClass}>
                <span>Activity Logs</span>
              </NavLink>
            </div>
          </div>

          {isAdmin && (
            <div>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Administration
              </p>
              <div className="mt-2 space-y-1">
                <NavLink to="/students" onClick={onClose} className={navItemClass}>
                  <span>Students</span>
                </NavLink>
                <NavLink to="/reports" onClick={onClose} className={navItemClass}>
                  <span>Reports</span>
                </NavLink>
              </div>
            </div>
          )}

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Account
            </p>
            <div className="mt-2 space-y-1">
              <NavLink to="/profile" onClick={onClose} className={navItemClass}>
                <span>Profile</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="overflow-hidden">
            <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-[11px] text-gray-400 capitalize">
              {user?.role }
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}
      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-y-auto bg-white transition-transform duration-200 ease-in-out dark:bg-slate-900 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
      <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-16 lg:block">
        {navContent}
      </aside>
    </>
  );
}
