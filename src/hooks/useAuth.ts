"use client";

import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { LoginPayload, RegisterPayload } from "@/services/auth.service";

export function useAuth() {
  const { user, isAuthenticated, setUser, setAccessToken, logout } =
    useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      toast.success("Logged in successfully!");

      const role = data.data.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "MANAGER") router.push("/dashboard");
      else router.push("/member");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      toast.success("Registration successful! Please verify your email.");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (payload: { email: string; code: string }) =>
      authService.verifyEmail(payload),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      toast.success("Email verified! Welcome aboard.");

      const role = data.data.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "MANAGER") router.push("/dashboard");
      else router.push("/member");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Verification failed");
    },
  });

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegisterLoading: registerMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyLoading: verifyEmailMutation.isPending,
    logout: handleLogout,
  };
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    enabled: !!useAuthStore.getState().accessToken,
  });
}
