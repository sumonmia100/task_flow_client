"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-shrink-0">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <span className="ml-3 font-semibold text-gray-900">TaskFlow</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
