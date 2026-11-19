import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DashboardLayout from "../components/layout/DashboardLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Reports";
import Students from "../pages/Students";
import Courses from "../pages/Courses";
import Enrollments from "../pages/Enrollments";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";
import ActivityLog from "../pages/ActivityLogs";

import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";
import Unauthorized from "../pages/Unauthorized";

function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100">
            <Navbar />
            <div className="flex-1 pt-16">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />

                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                            </Route>

                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/courses" element={<Courses />} />
                                <Route path="/enrollments" element={<Enrollments />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/activity-logs" element={<ActivityLog />} />

                                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                                    <Route path="/students" element={<Students />} />
                                    <Route path="/reports" element={<Reports />} />
                                </Route>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
