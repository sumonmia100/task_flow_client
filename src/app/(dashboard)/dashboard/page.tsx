"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderKanban, CheckSquare, Building2, CreditCard } from "lucide-react";
import { organizationService } from "@/services/organization.service";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";
import { paymentService } from "@/services/payment.service";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function ManagerDashboardPage() {
  const { user } = useAuthStore();

  const { data: orgsData } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: () => organizationService.getMyOrganizations(),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll({ limit: 5 }),
  });

  const { data: tasksData } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskService.getMyTasks({ limit: 5 }),
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentService.getMyPayments(),
  });

  const orgs = orgsData?.data ?? [];
  const projects = projectsData?.data ?? [];
  const tasks = tasksData?.data ?? [];
  const payments = paymentsData?.data ?? [];

  const isLoading = !orgsData || !projectsData || !tasksData;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Organizations" value={orgs.length} icon={Building2} color="purple" />
            <StatCard title="Projects" value={projects.length} icon={FolderKanban} color="blue" />
            <StatCard title="My Tasks" value={tasks.length} icon={CheckSquare} color="green" />
            <StatCard title="Payments" value={payments.length} icon={CreditCard} color="orange" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderKanban size={36} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No projects yet</p>
              <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    {project.deadline && (
                      <p className="text-xs text-gray-500 mt-0.5">Due {formatDate(project.deadline)}</p>
                    )}
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">My Tasks</h2>
            <Link href="/dashboard/tasks" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare size={36} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{task.project?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
