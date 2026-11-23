import axiosInstance from "@/lib/axios";
import type { ApiResponse, Task, TaskStatus, TaskPriority } from "@/types";

export const taskService = {
  create: async (payload: {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: string;
    projectId: string;
    assigneeId?: string;
  }) => {
    const res = await axiosInstance.post<ApiResponse<Task>>("/task", payload);
    return res.data;
  },

  getAll: async (params?: {
    projectId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<Task[]>>("/task", {
      params,
    });
    return res.data;
  },

  getMyTasks: async (params?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    page?: number;
    limit?: number;
  }) => {
    const res = await axiosInstance.get<ApiResponse<Task[]>>("/task/my-tasks", {
      params,
    });
    return res.data;
  },

  getSingle: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Task>>(`/task/${id}`);
    return res.data;
  },

  update: async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      priority?: TaskPriority;
      dueDate?: string;
    },
  ) => {
    const res = await axiosInstance.patch<ApiResponse<Task>>(
      `/task/${id}`,
      payload,
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/task/${id}`);
    return res.data;
  },

  changeStatus: async (id: string, status: TaskStatus) => {
    const res = await axiosInstance.patch<ApiResponse<Task>>(
      `/task/${id}/status`,
      { status },
    );
    return res.data;
  },

  assign: async (id: string, assigneeId: string) => {
    const res = await axiosInstance.patch<ApiResponse<Task>>(
      `/task/${id}/assign`,
      { assigneeId },
    );
    return res.data;
  },
};
