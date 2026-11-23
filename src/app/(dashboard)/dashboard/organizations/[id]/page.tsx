"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Trash2, Loader2, X, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { organizationService } from "@/services/organization.service";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email"),
  role: z.enum(["MEMBER", "MANAGER"]),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => organizationService.getSingle(id),
  });

  const { data: membersData } = useQuery({
    queryKey: ["org-members", id],
    queryFn: () => organizationService.getMembers(id),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { role: "MEMBER" },
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: AddMemberFormData) => organizationService.addMember(id, data),
    onSuccess: () => {
      toast.success("Member added!");
      queryClient.invalidateQueries({ queryKey: ["org-members", id] });
      setShowModal(false);
      reset();
    },
    onError: () => toast.error("Failed to add member"),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => organizationService.removeMember(id, memberId),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["org-members", id] });
    },
    onError: () => toast.error("Failed to remove member"),
  });

  const org = data?.data;
  const members = membersData?.data ?? [];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-48 mb-6" />
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="h-5 bg-gray-100 rounded w-32 mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-50 rounded mb-2" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard/organizations" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ArrowLeft size={15} /> Back to Organizations
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{org?.name}</h1>
          {org?.description && <p className="text-gray-500 text-sm mt-1">{org.description}</p>}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} /> Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <div className="text-center py-10">
            <Users size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No members yet. Add your first team member.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {member.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-xs text-gray-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {member.role}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(member.joinedAt)}</span>
                  <button
                    onClick={() => {
                      if (confirm("Remove this member?")) removeMemberMutation.mutate(member.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Add Member</h2>
              <button onClick={() => { setShowModal(false); reset(); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => addMemberMutation.mutate(d))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="member@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role *</label>
                <select
                  {...register("role")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="MEMBER">Member</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); reset(); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={addMemberMutation.isPending}
                  className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {addMemberMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Adding...</> : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
