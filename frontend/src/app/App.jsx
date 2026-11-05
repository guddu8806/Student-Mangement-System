import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Courses from "../pages/Courses";
import Enrollments from "../pages/Enrollments";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import Login from "../pages/auth/login";
import Signup from "../pages/auth/signup";

import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100">
                    <Navbar />

                    <Routes>
                        <Route path="/" element={<Home />} />

                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/enrollments" element={<Enrollments />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                            <Route path="/students" element={<Students />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                    </Routes>

                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
