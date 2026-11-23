import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationContext";
import PageLoader from "../components/common/Loader";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import DashboardLayout from "../components/layout/DashboardLayout";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() =>import("../pages/Dashboard"));
const Reports = lazy(() => import("../pages/Reports"));
const Students = lazy(() => import("../pages/Students"));
const Courses = lazy(() => import("../pages/Courses"));
const Enrollments = lazy(() => import("../pages/Enrollments"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/auth/login"));
const Signup = lazy(() => import("../pages/auth/signup"));
const ActivityLog = lazy(() => import("../pages/ActivityLogs"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));

import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";

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
                    <Suspense fallback={<PageLoader/>}>
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
                    </Suspense>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
