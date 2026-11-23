"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Building2, Users, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { organizationService } from "@/services/organization.service";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const orgSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type OrgFormData = z.infer<typeof orgSchema>;

export default function OrganizationsPage() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: () => organizationService.getMyOrganizations(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: OrgFormData) => organizationService.create(data),
    onSuccess: () => {
      toast.success("Organization created!");
      queryClient.invalidateQueries({ queryKey: ["my-organizations"] });
      setShowModal(false);
      reset();
    },
    onError: () => toast.error("Failed to create organization"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => organizationService.delete(id),
    onSuccess: () => {
      toast.success("Organization deleted");
      queryClient.invalidateQueries({ queryKey: ["my-organizations"] });
    },
    onError: () => toast.error("Failed to delete organization"),
  });

  const orgs = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your organizations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> New Organization
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-48 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : orgs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-1">No organizations yet</h3>
          <p className="text-gray-400 text-sm mb-4">Create your first organization to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgs.map((org) => (
            <div key={org.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <button
                  onClick={() => {
                    if (confirm("Delete this organization?")) {
                      deleteMutation.mutate(org.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Delete organization"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{org.name}</h3>
              {org.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{org.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {org.members?.length ?? 0} members
                </span>
                <span>{formatDate(org.createdAt)}</span>
              </div>
              <Link
                href={`/dashboard/organizations/${org.id}`}
                className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Manage →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">New Organization</h2>
              <button onClick={() => { setShowModal(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input
                  {...register("name")}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); reset(); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {createMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
