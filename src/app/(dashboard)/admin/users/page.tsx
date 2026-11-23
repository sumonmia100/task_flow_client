"use client";

import { useState, useCallback, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UserX, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatDate } from "@/lib/utils";
import type { User, UserStatus } from "@/types";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} cols={5} />}>
      <AdminUsersContent />
    </Suspense>
  );
}

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") as UserStatus) || undefined;

  const [localSearch, setLocalSearch] = useState(search);

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
    queryKey: ["admin-users", page, search, status],
    queryFn: () => adminService.getAllUsers({ page, limit: 10, search, status }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to update user status"),
  });

  const users = data?.data ?? [];

  const columns = [
    {
      key: "name",
      header: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user: User) => (
        <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user: User) => <StatusBadge status={user.status} />,
    },
    {
      key: "createdAt",
      header: "Joined",
      render: (user: User) => (
        <span className="text-gray-500 text-sm">{formatDate(user.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user: User) => (
        <button
          onClick={() =>
            updateStatusMutation.mutate({
              id: user.id,
              status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
            })
          }
          disabled={updateStatusMutation.isPending}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            user.status === "ACTIVE"
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          {user.status === "ACTIVE" ? (
            <><UserX size={13} /> Block</>
          ) : (
            <><UserCheck size={13} /> Unblock</>
          )}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all platform users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search by name or email..."
            defaultValue={localSearch}
            onSearch={(val) => {
              setLocalSearch(val);
              updateParams({ search: val, page: "1" });
            }}
          />
        </div>
        <select
          value={status ?? ""}
          onChange={(e) => updateParams({ status: e.target.value, page: "1" })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {isLoading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : (
          <>
            <DataTable
              data={users}
              columns={columns}
              keyExtractor={(u) => u.id}
              emptyMessage="No users found"
              emptyIcon={<Users size={40} className="text-gray-200" />}
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
