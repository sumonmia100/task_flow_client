"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const demoAccounts = [
  {
    role: "Admin",
    icon: "👨‍💼",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@taskflow.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASS || "Admin@123",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    btnColor: "bg-purple-600 hover:bg-purple-700",
  },
  {
    role: "Manager",
    icon: "🛠️",
    email: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || "manager@taskflow.com",
    password: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASS || "Manager@123",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  {
    role: "Member",
    icon: "👤",
    email: process.env.NEXT_PUBLIC_DEMO_MEMBER_EMAIL || "member@taskflow.com",
    password: process.env.NEXT_PUBLIC_DEMO_MEMBER_PASS || "Member@123",
    color: "bg-green-50 border-green-200 text-green-700",
    btnColor: "bg-green-600 hover:bg-green-700",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoadingRole, setDemoLoadingRole] = useState<string | null>(null);
  const { login, isLoginLoading } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const handleDemoLogin = (account: (typeof demoAccounts)[0]) => {
    setDemoLoadingRole(account.role);
    setValue("email", account.email);
    setValue("password", account.password);
    login(
      { email: account.email, password: account.password },
    );
    setTimeout(() => setDemoLoadingRole(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">TaskFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
          <p className="text-gray-500 mt-1">Login to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoginLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Logging in...
                </>
              ) : (
                "🔐 Login"
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Demo Login */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-center text-sm font-semibold text-gray-700 mb-4">
            🚀 Quick Demo Login
          </p>
          <div className="grid grid-cols-1 gap-3">
            {demoAccounts.map((account) => (
              <div
                key={account.role}
                className={`border rounded-xl p-4 ${account.color}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">
                      {account.icon} {account.role}
                    </p>
                    <p className="text-xs opacity-70 mt-0.5">{account.email}</p>
                  </div>
                  <button
                    onClick={() => handleDemoLogin(account)}
                    disabled={isLoginLoading}
                    className={`${account.btnColor} text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1.5`}
                  >
                    {demoLoadingRole === account.role ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Loading...
                      </>
                    ) : (
                      "Demo Login"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
