"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Loader2, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { organizationService } from "@/services/organization.service";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

export default function PaymentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => paymentService.getMyPayments(),
  });

  const { data: orgsData } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: () => organizationService.getMyOrganizations(),
  });

  const initiateMutation = useMutation({
    mutationFn: () =>
      paymentService.initiate({
        organizationId: selectedOrgId,
        plan: "PRO",
        amount: 999,
      }),
    onSuccess: (data) => {
      if (data.data?.bkashURL) {
        window.location.href = data.data.bkashURL;
      }
    },
    onError: () => toast.error("Failed to initiate payment"),
  });

  const payments = data?.data ?? [];
  const orgs = orgsData?.data ?? [];

  const columns = [
    {
      key: "plan",
      header: "Plan",
      render: (p: Payment) => (
        <span className="text-sm font-semibold text-gray-900 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
          {p.plan}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (p: Payment) => (
        <span className="text-sm font-semibold text-gray-900">{formatCurrency(p.amount)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: Payment) => <StatusBadge status={p.status} />,
    },
    {
      key: "org",
      header: "Organization",
      render: (p: Payment) => (
        <span className="text-sm text-gray-600">{p.organization?.name ?? "—"}</span>
      ),
    },
    {
      key: "trxId",
      header: "Transaction ID",
      render: (p: Payment) => (
        <span className="text-xs font-mono text-gray-500">{p.bkashTrxId ?? "—"}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (p: Payment) => (
        <span className="text-sm text-gray-500">{formatDate(p.createdAt)}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage subscriptions and billing</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <CreditCard size={16} /> Upgrade to Pro
        </button>
      </div>

      {/* PRO Plan Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">TaskFlow Pro</h3>
            <p className="text-blue-100 text-sm">Unlimited projects, members & advanced analytics</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">৳999</p>
            <p className="text-blue-200 text-sm">per month</p>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          {["Unlimited Organizations", "Advanced Analytics", "Priority Support", "Audit Logs"].map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-sm text-blue-100">
              <CheckCircle size={14} className="text-blue-300" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Payment History</h2>
        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : (
          <DataTable
            data={payments}
            columns={columns}
            keyExtractor={(p) => p.id}
            emptyMessage="No payments yet"
            emptyIcon={<CreditCard size={40} className="text-gray-200" />}
          />
        )}
      </div>

      {/* bKash Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Upgrade to Pro</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">Pro Plan</span>
                <span className="font-bold text-gray-900">৳999/month</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Organization *
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Choose organization</option>
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-gray-400 mb-5 text-center">
              You will be redirected to bKash to complete payment
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => initiateMutation.mutate()}
                disabled={!selectedOrgId || initiateMutation.isPending}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
              >
                {initiateMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Redirecting...</>
                ) : (
                  "Pay with bKash"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
