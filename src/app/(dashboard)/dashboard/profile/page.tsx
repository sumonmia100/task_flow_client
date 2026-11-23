"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse, User } from "@/types";
import { formatDate } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse<User>>("/user/me");
      return res.data;
    },
  });

  const profile = data?.data ?? user;

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.name ?? "" },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const res = await axiosInstance.patch<ApiResponse<User>>("/user/me", data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await axiosInstance.patch<ApiResponse<User>>("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.data);
      toast.success("Profile image updated!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="max-w-xl">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {profile?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Loader2 size={18} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <Camera size={15} />
                {uploading ? "Uploading..." : "Change Photo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <p className="text-xs text-gray-400 mt-1.5">JPG, PNG up to 2MB</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                value={profile?.email ?? ""}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg disabled:opacity-60 transition-colors"
            >
              {updateMutation.isPending ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={14} /> Save Changes</>
              )}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Role</span>
              <span className="font-medium text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs">{profile?.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Auth Provider</span>
              <span className="font-medium text-gray-900">{profile?.authProvider}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email Verified</span>
              <span className={`font-medium text-sm ${profile?.isEmailVerified ? "text-green-600" : "text-red-500"}`}>
                {profile?.isEmailVerified ? "✓ Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Member Since</span>
              <span className="text-gray-700">{profile?.createdAt ? formatDate(profile.createdAt) : "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
