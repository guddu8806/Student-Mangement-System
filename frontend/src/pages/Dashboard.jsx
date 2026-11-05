import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import StudentDashboard from "../components/dashboard/StudentDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "student") {
    return <StudentDashboard />;
  }

  return <AdminDashboard />;
}

export default Dashboard;
