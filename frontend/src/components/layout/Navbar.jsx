// frontend/src/components/layout/Navbar.jsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = ({ onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { token } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLoggedIn = Boolean(token);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
            <nav
                className={`flex h-full items-center justify-between ${
                    isLoggedIn
                        ? "w-full px-4 sm:px-6"
                        : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                }`}
            >
                <div className={`flex items-center gap-3 ${isLoggedIn ? "lg:w-60" : ""}`}>
                    {isLoggedIn && onToggleSidebar && (
                        <button
                            onClick={onToggleSidebar}
                            type="button"
                            aria-label="Toggle sidebar"
                            className="cursor-pointer rounded-lg p-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
                        >
                            <Menu size={22} />
                        </button>
                    )}

                    <NavLink to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5">
                        <div className="rounded-xl bg-violet-600 p-2 text-white shadow-md shadow-violet-600/25">
                            <GraduationCap size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                Edu<span className="text-violet-600 dark:text-violet-400">Core</span>
                            </h1>
                            <p className="text-[10px] font-medium tracking-wider text-gray-500 dark:text-gray-400">
                                STUDENT MANAGEMENT
                            </p>
                        </div>
                    </NavLink>
                </div>

                <div className="flex items-center gap-3">
                    {!isLoggedIn ? (
                        <div className="hidden sm:flex items-center gap-1">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `px-3 py-2 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "text-violet-600 dark:text-violet-400 font-semibold"
                                            : "text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-300"
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 dark:text-gray-200 dark:hover:text-violet-300 transition"
                            >
                                Reports
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 dark:text-gray-200 dark:hover:text-violet-300 transition"
                            >
                                Courses
                            </NavLink>
                            <NavLink
                                to="/login"
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 dark:text-gray-200 dark:hover:text-violet-300 transition"
                            >
                                Students
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="ml-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition"
                            >
                                Get Started
                            </NavLink>
                        </div>
                    ) : (
                        <NotificationBell />
                    )}

                    <button
                        onClick={toggleTheme}
                        type="button"
                        aria-label="Toggle theme"
                        className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-violet-400"
                    >
                        {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                    </button>

                    {!isLoggedIn && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="rounded-lg p-2 text-gray-700 hover:bg-violet-50 dark:text-gray-300 sm:hidden"
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    )}
                </div>
            </nav>

            {!isLoggedIn && isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:hidden">
                    <div className="flex flex-col gap-2">
                        <NavLink
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-violet-50 dark:text-gray-200"
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-violet-50 dark:text-gray-200"
                        >
                            Sign In
                        </NavLink>
                        <NavLink
                            to="/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="rounded-lg bg-violet-600 px-3 py-2 text-center text-sm font-semibold text-white"
                        >
                            Get Started
                        </NavLink>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
