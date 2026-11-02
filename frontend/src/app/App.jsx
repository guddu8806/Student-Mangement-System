import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Courses from "../pages/Courses";
import Enrollments from "../pages/Enrollments";
import NotFound from "../pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-gray-950 dark:text-slate-100">
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/enrollments" element={<Enrollments />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
