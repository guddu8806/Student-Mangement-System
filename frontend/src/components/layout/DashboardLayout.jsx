// frontend/src/components/layout/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}