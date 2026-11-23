"use client";

import { useCallback, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { taskService } from "@/services/task.service";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDate } from "@/lib/utils";
import type { Task, TaskStatus, TaskPriority } from "@/types";

export default function TasksPage() {
  return (
    <Suspense>
      <TasksContent />
    </Suspense>
  );
}

function TasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
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
    queryKey: ["tasks", page, search, status, priority],
    queryFn: () => taskService.getAll({ page, limit: 10, status, priority }),
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.changeStatus(id, status),
    onSuccess: () => {
      toast.success("Task status updated");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Failed to update task"),
  });

  const tasks = data?.data ?? [];

  const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  const columns = [
    {
      key: "title",
      header: "Task",
      render: (task: Task) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{task.title}</p>
          {task.project?.name && (
            <p className="text-xs text-gray-500 mt-0.5">{task.project.name}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (task: Task) => (
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
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (task: Task) => <StatusBadge status={task.priority} />,
    },
    {
      key: "assignee",
      header: "Assignee",
      render: (task: Task) => (
        <span className="text-sm text-gray-600">{task.assignee?.name ?? "—"}</span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (task: Task) => (
        <span className="text-sm text-gray-500">
          {task.dueDate ? formatDate(task.dueDate) : "—"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and track all tasks</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search tasks..."
            defaultValue={search}
            onSearch={(val) => updateParams({ search: val, page: "1" })}
          />
        </div>
        <select
          value={status ?? ""}
          onChange={(e) => updateParams({ status: e.target.value, page: "1" })}
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
          onChange={(e) => updateParams({ priority: e.target.value, page: "1" })}
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
        ) : (
          <>
            <DataTable
              data={tasks}
              columns={columns}
              keyExtractor={(t) => t.id}
              emptyMessage="No tasks found"
              emptyIcon={<CheckSquare size={40} className="text-gray-200" />}
            />
            <Pagination
              page={page}
              totalPages={Math.ceil((data as { meta?: { total: number } })?.meta?.total ?? 0 / 10)}
              onPageChange={(p) => updateParams({ page: String(p) })}
            />
          </>
        )}
      </div>
    </div>
  );
}
