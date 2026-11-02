import { useState } from "react";
import { NavLink } from "react-router-dom";
import {GraduationCap, LayoutDashboard, Users, BookOpen,ClipboardList, Sun, Moon, Menu, X} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "Home", path: "/", icon: GraduationCap },
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Students", path: "/students", icon: Users },
        { name: "Courses", path: "/courses", icon: BookOpen },
        { name: "Enrollments", path: "/enrollments", icon: ClipboardList }
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
                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={linkClasses}
                            >
                                <Icon size={17} />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        type="button"
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500/30 dark:hover:bg-gray-800 dark:hover:text-violet-400"
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
                            const Icon = link.icon;

                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={linkClasses}
                                >
                                    <Icon size={18} />
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
