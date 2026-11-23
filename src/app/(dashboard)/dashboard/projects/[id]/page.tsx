"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, X, ArrowLeft, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { projectService } from "@/services/project.service";
import { taskService } from "@/services/task.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { TaskStatus, TaskPriority } from "@/types";

const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const kanbanColumns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "TODO", label: "To Do", color: "bg-gray-100" },
  { status: "IN_PROGRESS", label: "In Progress", color: "bg-yellow-50" },
  { status: "IN_REVIEW", label: "In Review", color: "bg-purple-50" },
  { status: "DONE", label: "Done", color: "bg-green-50" },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getSingle(id),
  });

  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["project-tasks", id],
    queryFn: () => taskService.getAll({ projectId: id }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { priority: "MEDIUM" as const },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskFormData) => taskService.create({ ...data, projectId: id }),
    onSuccess: () => {
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
      setShowModal(false);
      reset();
    },
    onError: () => toast.error("Failed to create task"),
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskService.changeStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", id] });
    },
  });

  const project = projectData?.data;
  const tasks = tasksData?.data ?? [];

  if (projectLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-48 mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft size={15} /> Back to Projects
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
            {project?.status && <StatusBadge status={project.status} />}
          </div>
          <p className="text-gray-500 text-sm">
            {project?.description}
            {project?.deadline && ` · Due ${formatDate(project.deadline)}`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Kanban Board */}
      {tasksLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className={`${col.color} rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                  <span className="text-xs bg-white text-gray-500 rounded-full px-2 py-0.5 font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-6">
                      <CheckSquare size={24} className="text-gray-200 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">No tasks</p>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-gray-900 mb-1.5">{task.title}</p>
                        <div className="flex items-center justify-between">
                          <StatusBadge status={task.priority as TaskPriority} />
                          {task.dueDate && (
                            <span className="text-xs text-gray-400">{formatDate(task.dueDate)}</span>
                          )}
                        </div>
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {kanbanColumns
                            .filter((c) => c.status !== task.status)
                            .map((c) => (
                              <button
                                key={c.status}
                                onClick={() => changeStatusMutation.mutate({ taskId: task.id, status: c.status })}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                → {c.label}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">New Task</h2>
              <button onClick={() => { setShowModal(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => createTaskMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  {...register("title")}
                  placeholder="Task title"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Task description..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select
                    {...register("priority")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); reset(); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={createTaskMutation.isPending}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {createTaskMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
