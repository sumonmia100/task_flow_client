"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { taskService } from "@/services/task.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function MemberDashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["my-tasks"],
    queryFn: () => taskService.getMyTasks(),
  });

  const tasks = data?.data ?? [];
  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const inReviewCount = tasks.filter((t) => t.status === "IN_REVIEW").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here are your assigned tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">To Do</p>
                <Clock size={16} className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{todoCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">In Progress</p>
                <CheckSquare size={16} className="text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">In Review</p>
                <AlertCircle size={16} className="text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{inReviewCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 font-medium">Done</p>
                <CheckCircle2 size={16} className="text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{doneCount}</p>
            </div>
          </>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">My Tasks</h2>
          <Link href="/member/tasks" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10">
            <CheckSquare size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No tasks assigned to you yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 8).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.priority === "URGENT" ? "bg-red-500" :
                    task.priority === "HIGH" ? "bg-orange-500" :
                    task.priority === "MEDIUM" ? "bg-blue-500" : "bg-gray-300"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 truncate">{task.project?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {task.dueDate && (
                    <span className="text-xs text-gray-400 hidden sm:block">{formatDate(task.dueDate)}</span>
                  )}
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
