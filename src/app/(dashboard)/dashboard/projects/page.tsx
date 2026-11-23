"use client";

import { useState, useCallback, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, FolderKanban, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { projectService } from "@/services/project.service";
import { organizationService } from "@/services/organization.service";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { formatDate } from "@/lib/utils";
import type { ProjectStatus } from "@/types";
import Link from "next/link";

const projectSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  organizationId: z.string().min(1, "Select an organization"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  return (
    <Suspense>
      <ProjectsContent />
    </Suspense>
  );
}

function ProjectsContent() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const search = searchParams.get("search") || "";
  const status = (searchParams.get("status") as ProjectStatus) || undefined;

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
    queryKey: ["projects", search, status],
    queryFn: () => projectService.getAll({ search, status }),
  });

  const { data: orgsData } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: () => organizationService.getMyOrganizations(),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: ProjectFormData) => projectService.create(data),
    onSuccess: () => {
      toast.success("Project created!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowModal(false);
      reset();
    },
    onError: () => toast.error("Failed to create project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => toast.error("Failed to delete project"),
  });

  const projects = data?.data ?? [];
  const orgs = orgsData?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <SearchInput
            placeholder="Search projects..."
            defaultValue={search}
            onSearch={(val) => updateParams({ search: val })}
          />
        </div>
        <select
          value={status ?? ""}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-48 mb-4" />
              <div className="flex gap-2">
                <div className="h-5 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <FolderKanban size={48} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-1">No projects found</h3>
          <p className="text-gray-400 text-sm mb-4">Create your first project</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <StatusBadge status={project.status} />
                <button
                  onClick={() => {
                    if (confirm("Delete this project?")) deleteMutation.mutate(project.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Delete project"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{project.description}</p>
              )}
              <div className="text-xs text-gray-400 flex items-center justify-between pt-3 border-t border-gray-50">
                <span>{project.organization?.name}</span>
                {project.deadline && <span>Due {formatDate(project.deadline)}</span>}
              </div>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Tasks →
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
              <h2 className="text-lg font-semibold text-gray-900">New Project</h2>
              <button onClick={() => { setShowModal(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization *</label>
                <select
                  {...register("organizationId")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select organization</option>
                  {orgs.map((org) => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
                {errors.organizationId && <p className="text-red-500 text-xs mt-1">{errors.organizationId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name *</label>
                <input
                  {...register("name")}
                  placeholder="e.g. Website Redesign"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  placeholder="Brief description..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                <input
                  {...register("deadline")}
                  type="date"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
