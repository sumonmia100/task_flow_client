import axiosInstance from "@/lib/axios";
import type { ApiResponse, Payment } from "@/types";

export const paymentService = {
  initiate: async (payload: {
    organizationId: string;
    plan: "PRO";
    amount: number;
  }) => {
    const res = await axiosInstance.post<
      ApiResponse<{ bkashURL: string; paymentID: string }>
    >("/payment/initiate", payload);
    return res.data;
  },

  getMyPayments: async () => {
    const res =
      await axiosInstance.get<ApiResponse<Payment[]>>("/payment/my-payments");
    return res.data;
  },

  getSingle: async (id: string) => {
    const res = await axiosInstance.get<ApiResponse<Payment>>(
      `/payment/${id}`,
    );
    return res.data;
  },
};
