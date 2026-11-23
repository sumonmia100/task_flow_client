"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

const verifySchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type VerifyFormData = z.infer<typeof verifySchema>;

export default function RegisterPage() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [pendingEmail, setPendingEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isRegisterLoading, verifyEmail, isVerifyLoading } = useAuth();

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const verifyForm = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onRegister = (data: RegisterFormData) => {
    registerUser(data, {
      onSuccess: () => {
        setPendingEmail(data.email);
        setStep("verify");
      },
    });
  };

  const onVerify = (data: VerifyFormData) => {
    verifyEmail({ email: pendingEmail, code: data.code });
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

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "register" ? "bg-blue-600 text-white" : "bg-green-500 text-white"}`}>
                {step === "register" ? "1" : "✓"}
              </div>
              <span className="text-sm text-gray-600">Account Info</span>
            </div>
            <div className="w-8 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "verify" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                2
              </div>
              <span className="text-sm text-gray-600">Verify Email</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            {step === "register" ? "Create your account" : "Verify your email"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === "verify"
              ? `We sent a 6-digit code to ${pendingEmail}`
              : "Start managing your projects today"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === "register" ? (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  {...registerForm.register("name")}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  {...registerForm.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...registerForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isRegisterLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isRegisterLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Creating account...</>
                ) : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-5">
              <div className="flex justify-center mb-2">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">Verification Code</label>
                <input
                  {...verifyForm.register("code")}
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {verifyForm.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1 text-center">{verifyForm.formState.errors.code.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isVerifyLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isVerifyLoading ? (
                  <><Loader2 size={16} className="animate-spin" /> Verifying...</>
                ) : "Verify Email"}
              </button>
              <button type="button" onClick={() => setStep("register")} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Back to registration
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
