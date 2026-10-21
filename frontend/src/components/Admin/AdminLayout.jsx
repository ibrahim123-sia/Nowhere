import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 bg-ink px-4 py-3 text-white lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} aria-label="Open admin menu">
          <FiMenu className="h-6 w-6" />
        </button>
        <span className="font-display text-xl">Nowhere Admin</span>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-ink/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
