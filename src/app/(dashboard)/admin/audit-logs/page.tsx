"use client";

import { useCallback, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FileBarChart } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { DataTable } from "@/components/shared/DataTable";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDateTime } from "@/lib/utils";
import type { ActivityLog, ActivityAction } from "@/types";

const actionColors: Record<ActivityAction, string> = {
  CREATED: "bg-green-100 text-green-700",
  UPDATED: "bg-blue-100 text-blue-700",
  DELETED: "bg-red-100 text-red-700",
  STATUS_CHANGED: "bg-yellow-100 text-yellow-700",
  ASSIGNED: "bg-purple-100 text-purple-700",
  UNASSIGNED: "bg-gray-100 text-gray-600",
  COMMENTED: "bg-indigo-100 text-indigo-700",
  PAYMENT_MADE: "bg-emerald-100 text-emerald-700",
};

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} cols={4} />}>
      <AuditLogsContent />
    </Suspense>
  );
}

function AuditLogsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const action = searchParams.get("action") || "";

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
    queryKey: ["audit-logs", page, action],
    queryFn: () =>
      adminService.getAuditLogs({ page, limit: 15, action: action || undefined }),
  });

  const logs = data?.data ?? [];

  const columns = [
    {
      key: "user",
      header: "User",
      render: (log: ActivityLog) => (
        <span className="text-sm text-gray-700">{log.user?.name ?? "System"}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log: ActivityLog) => (
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${actionColors[log.action]}`}
        >
          {log.action.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "entityType",
      header: "Entity",
      render: (log: ActivityLog) => (
        <span className="text-sm text-gray-600">{log.entityType}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date & Time",
      render: (log: ActivityLog) => (
        <span className="text-sm text-gray-500">{formatDateTime(log.createdAt)}</span>
      ),
    },
  ];

  const actionOptions: ActivityAction[] = [
    "CREATED", "UPDATED", "DELETED", "STATUS_CHANGED",
    "ASSIGNED", "UNASSIGNED", "COMMENTED", "PAYMENT_MADE",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">Track all activity across the platform</p>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={action}
          onChange={(e) => updateParams({ action: e.target.value, page: "1" })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Actions</option>
          {actionOptions.map((a) => (
            <option key={a} value={a}>{a.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {isLoading ? (
          <TableSkeleton rows={10} cols={4} />
        ) : (
          <>
            <DataTable
              data={logs}
              columns={columns}
              keyExtractor={(l) => l.id}
              emptyMessage="No audit logs found"
              emptyIcon={<FileBarChart size={40} className="text-gray-200" />}
            />
            <Pagination
              page={page}
              totalPages={Math.ceil((data as { meta?: { total: number } })?.meta?.total ?? 0 / 15)}
              onPageChange={(p) => updateParams({ page: String(p) })}
            />
          </>
        )}
      </div>
    </div>
  );
}
