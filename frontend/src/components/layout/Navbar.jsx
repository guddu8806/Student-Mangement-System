import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { token, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isLoggedIn = Boolean(token);
    const isAdmin = isLoggedIn && user?.role === "admin";

    const navLinks = [
        ...(isLoggedIn ? []: [{ name: "Home", path: "/" },]),
        { name: "Dashboard", path: "/dashboard" },
        ...(isAdmin ? [{name:"Reports" , path:"/reports"},{ name: "Students", path: "/students" }] : []),
        { name: "Courses", path: "/courses" },
        { name: "Enrollments", path: "/enrollments" },
        ...(isLoggedIn
            ? [{ name: "Profile", path: "/profile" }]
            : [
                { name: "Get Started", path: "/signup" },
              ]),
    ];

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${
            isActive
                ? "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 font-semibold"
                : "text-gray-600 hover:bg-violet-50/50 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-violet-300"
        }`;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

                <div className="hidden items-center gap-1 lg:flex">
                    {navLinks.map((link) => {
                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={linkClasses}
                            >
                                {link.name}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    {isLoggedIn && <NotificationBell />}

                    <button
                        onClick={toggleTheme}
                        type="button"
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500/30 dark:hover:bg-gray-800 dark:hover:text-violet-400"
                    >
                        {theme === "light" ? (
                            <Moon size={19} />
                        ) : (
                            <Sun size={19} />
                        )}
                    </button>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        type="button"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        className="rounded-lg p-2 text-gray-700 hover:bg-violet-50 hover:text-violet-600 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
                    <div className="flex flex-col gap-1">
                        {navLinks.map((link) => {
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={linkClasses}
                                >
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
