"use client";

import { useCallback, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { taskService } from "@/services/task.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDate } from "@/lib/utils";
import type { Task, TaskStatus, TaskPriority } from "@/types";

export default function MemberTasksPage() {
  return (
    <Suspense>
      <MemberTasksContent />
    </Suspense>
  );
}

function MemberTasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const status = (searchParams.get("status") as TaskStatus) || undefined;
  const priority = (searchParams.get("priority") as TaskPriority) || undefined;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["my-tasks", status, priority],
    queryFn: () => taskService.getMyTasks({ status, priority }),
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.changeStatus(id, status),
    onSuccess: () => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["my-tasks"] });
    },
    onError: () => toast.error("Failed to update task"),
  });

  const tasks = data?.data ?? [];
  const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">View and update your assigned tasks</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={status ?? ""}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>
        <select
          value={priority ?? ""}
          onChange={(e) => updateParams({ priority: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {isLoading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <CheckSquare size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="font-medium text-gray-500">No tasks found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <div
                key={task.id}
                className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span>{task.project?.name}</span>
                      {task.dueDate && <span>· Due {formatDate(task.dueDate)}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={task.priority} />
                    <select
                      value={task.status}
                      onChange={(e) =>
                        changeStatusMutation.mutate({ id: task.id, status: e.target.value as TaskStatus })
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
