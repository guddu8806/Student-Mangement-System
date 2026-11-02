import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <NavLink to="/" className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-violet-600 p-2 text-white shadow-md shadow-violet-600/25">
                        <GraduationCap size={23} />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Edu<span className="text-violet-600 dark:text-violet-400">Core</span>
                        </h1>
                        <p className="text-[10px] font-medium tracking-wider text-gray-500 dark:text-gray-400">
                            STUDENT MANAGEMENT
                        </p>
                    </div>
                </NavLink>

                <div className="flex items-center gap-4">
                    <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <NavLink to="/" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                            Home
                        </NavLink>
                        <NavLink to="/dashboard" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                            Dashboard
                        </NavLink>
                        <NavLink to="/students" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                            Students
                        </NavLink>
                        <NavLink to="/courses" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                            Courses
                        </NavLink>
                        <NavLink to="/enrollments" className="transition hover:text-violet-600 dark:hover:text-violet-400">
                            Enrollments
                        </NavLink>
                    </nav>
                </div>
            </div>

            <div className="mx-auto mt-4 max-w-5xl border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 px-4">
                <p className="leading-6">
                    EduCore is a Student Management System designed to simplify
                    academic administration by managing student records, courses,
                    and enrollments through a centralized platform.
                </p>
                
            </div>

            <div className="mx-auto mt-4 flex w-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                <p>© 2026 Guddu. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
