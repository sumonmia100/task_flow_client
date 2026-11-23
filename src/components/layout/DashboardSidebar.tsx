"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Building2,
  CreditCard,
  User,
  Users,
  FileBarChart,
  LogOut,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: FileBarChart },
];

const managerNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/dashboard/organizations", icon: Building2 },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const memberNav = [
  { label: "My Tasks", href: "/member", icon: CheckSquare },
  { label: "All Tasks", href: "/member/tasks", icon: FolderKanban },
  { label: "Profile", href: "/member/profile", icon: User },
];

interface SidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const navItems =
    user?.role === "ADMIN"
      ? adminNav
      : user?.role === "MANAGER"
        ? managerNav
        : memberNav;

  return (
    <aside className="flex flex-col h-full bg-gray-900 text-gray-300 w-64">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">TF</span>
          </div>
          <span className="text-white font-bold">TaskFlow</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
