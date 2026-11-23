import axiosInstance from "@/lib/axios";
import type { ActivityLog, AdminStats, ApiResponse, User, UserStatus } from "@/types";

export const adminService = {
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatus;
    role?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<User[]>>("/admin/users", {
      params,
    });
    return res.data;
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    const res = await axiosInstance.patch<ApiResponse<User>>(
      `/admin/users/${id}/status`,
      { status },
    );
    return res.data;
  },

  getDashboardStats: async () => {
    const res =
      await axiosInstance.get<ApiResponse<AdminStats>>("/admin/stats");
    return res.data;
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    userId?: string;
    from?: string;
    to?: string;
  }) => {
    const res = await axiosInstance.get<ApiResponse<ActivityLog[]>>(
      "/admin/audit-logs",
      { params },
    );
    return res.data;
  },
};
