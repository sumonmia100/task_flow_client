"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Building2, FolderKanban, CheckSquare, TrendingUp, CreditCard } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { StatCard } from "@/components/shared/StatCard";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getDashboardStats(),
  });

  const stats = data?.data;

  const chartData = [
    { name: "Users", value: stats?.totalUsers ?? 0 },
    { name: "Orgs", value: stats?.totalOrganizations ?? 0 },
    { name: "Projects", value: stats?.totalProjects ?? 0 },
    { name: "Tasks", value: stats?.totalTasks ?? 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} color="blue" />
            <StatCard title="Organizations" value={stats?.totalOrganizations ?? 0} icon={Building2} color="purple" />
            <StatCard title="Projects" value={stats?.totalProjects ?? 0} icon={FolderKanban} color="green" />
            <StatCard title="Tasks" value={stats?.totalTasks ?? 0} icon={CheckSquare} color="orange" />
            <StatCard title="Revenue" value={formatCurrency(stats?.totalRevenue ?? 0)} icon={CreditCard} color="green" />
            <StatCard title="Subscriptions" value={stats?.activeSubscriptions ?? 0} icon={TrendingUp} color="blue" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Platform Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Payments</h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : stats?.recentPayments?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No payments yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider py-2 font-semibold">Invoice</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider py-2 font-semibold">Amount</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider py-2 font-semibold">Status</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider py-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentPayments?.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-2.5 text-gray-600 font-mono text-xs">{p.merchantInvoiceNumber ?? "—"}</td>
                    <td className="py-2.5 text-gray-700 font-medium">{formatCurrency(p.amount)}</td>
                    <td className="py-2.5"><StatusBadge status={p.status} /></td>
                    <td className="py-2.5 text-gray-500">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
