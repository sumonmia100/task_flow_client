import axiosInstance from "@/lib/axios";
import type { ApiResponse, Organization, OrganizationMember } from "@/types";

export const organizationService = {
  create: async (payload: {
    name: string;
    description?: string;
    imageUrl?: string;
  }) => {
    const res = await axiosInstance.post<ApiResponse<Organization>>(
      "/organization/create",
      payload,
    );
    return res.data;
  },

  getMyOrganizations: async () => {
    const res =
      await axiosInstance.get<ApiResponse<Organization[]>>(
        "/organization/my-organizations",
      );
    return res.data;
  },

  getSingle: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Organization>>(
      `/organization/${id}`,
    );
    return res.data;
  },

  update: async (
    id: string,
    payload: { name?: string; description?: string },
  ) => {
    const res = await axiosInstance.patch<ApiResponse<Organization>>(
      `/organization/${id}`,
      payload,
    );
    return res.data;
  },

  delete: async (id: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(
      `/organization/${id}`,
    );
    return res.data;
  },

  addMember: async (orgId: string, payload: { email: string; role: string }) => {
    const res = await axiosInstance.post<ApiResponse<OrganizationMember>>(
      `/organization/${orgId}/members`,
      payload,
    );
    return res.data;
  },

  removeMember: async (orgId: string, memberId: string) => {
    const res = await axiosInstance.delete<ApiResponse<null>>(
      `/organization/${orgId}/members/${memberId}`,
    );
    return res.data;
  },

  getMembers: async (orgId: string) => {
    const res = await axiosInstance.get<ApiResponse<OrganizationMember[]>>(
      `/organization/${orgId}/members`,
    );
    return res.data;
  },
};
