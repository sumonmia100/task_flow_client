import axiosInstance from "@/lib/axios";
import type { ApiResponse, Project, ProjectStatus } from "@/types";

export const projectService = {
  create: async (payload: {
    name: string;
    description?: string;
    deadline?: string;
    organizationId: string;
  }) => {
    const res = await axiosInstance.post<ApiResponse<Project>>(
      "/project",
      payload,
    );
    return res.data;
  },

  getAll: async (params?: {
    organizationId?: string;
    status?: ProjectStatus;
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<Project[]>>("/project", {
      params,
    });
    return res.data;
  },

  getSingle: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Project>>(
      `/project/${id}`,
    );
    return res.data;
  },

  update: async (
    id: string,
    payload: {
      name?: string;
      description?: string;
      deadline?: string;
    },
  ) => {
    const res = await axiosInstance.patch<ApiResponse<Project>>(
      `/project/${id}`,
      payload,
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/project/${id}`);
    return res.data;
  },

  changeStatus: async (id: string, status: ProjectStatus) => {
    const res = await axiosInstance.patch<ApiResponse<Project>>(
      `/project/${id}/status`,
      { status },
    );
    return res.data;
  },
};
